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
 function CGraphicObjects(document, drawingDocument, api, documentContent) {
    this.api = api;
    this.document = document;
    this.drawingDocument = drawingDocument;
    this.graphicPages = [];
    this.startTrackPos = {
        x: null,
        y: null,
        pageIndex: null
    };
    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];
    this.majorGraphicObject = null;
    this.curState = new NullState(this);
    this.selectionInfo = {
        selectionArray: []
    };
    this.currentPresetGeom = null;
    this.maximalGraphicObjectZIndex = 1024;
    this.spline = null;
    this.polyline = null;
    this.drawingOjects = [];
    this.objectsMap = {};
    this.firstPage = null;
    this.evenPage = null;
    this.oddPage = null;
    this.urlMap = [];
    this.recalcMap = {};
    this.arrForCalculateAfterOpen = [];
    this.Id = g_oIdCounter.Get_NewId();
    this.Lock = new CLock();
    g_oTableId.Add(this, this.Id);
}
CGraphicObjects.prototype = {
    calculateAfterOpen: function (bAddHistory) {
        if (this.arrForCalculateAfterOpen) {
            for (var i = 0; i < this.arrForCalculateAfterOpen.length; ++i) {
                var para_drawing = this.arrForCalculateAfterOpen[i];
                var obj = para_drawing.GraphicObj;
                if (isRealObject(obj)) {
                    obj.parent = para_drawing;
                    obj.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
                    obj.calculateAfterOpen10();
                    obj.recalculate();
                    var bounds = para_drawing.getBounds();
                    para_drawing.W = bounds.r - bounds.l;
                    para_drawing.H = bounds.b - bounds.t;
                    if (isRealObject(para_drawing.wrappingPolygon) && para_drawing.wrappingPolygon.edited === true) {
                        var kw = para_drawing.GraphicObj.absExtX / 0.6;
                        var kh = para_drawing.GraphicObj.absExtY / 0.6;
                        var rel_points = para_drawing.wrappingPolygon.relativeArrPoints;
                        for (var j = 0; j < rel_points.length; ++j) {
                            rel_points[j].x *= kw;
                            rel_points[j].y *= kh;
                        }
                    }
                    if (bAddHistory) {
                        if (obj instanceof WordShape || obj instanceof WordImage || obj instanceof WordGroupShapes) {
                            History.Add(obj, {
                                Type: historyitem_CalculateAfterCopyInGroup
                            });
                        }
                        if (typeof CChartAsGroup != "undefined" && obj instanceof CChartAsGroup) {
                            History.Add(obj, {
                                Type: historyitem_AutoShapes_RecalculateAfterResize
                            });
                        }
                    }
                }
            }
            this.arrForCalculateAfterOpen = [];
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    AddHeaderOrFooter: function (Type, PageType) {
        var data = {
            Type: historyitem_AddHdrFtrGrObjects,
            oldFirst: this.firstPage,
            oldEven: this.evenPage,
            oldOdd: this.oddPage
        };
        var new_hd_ftr_gr_objects;
        switch (PageType) {
        case hdrftr_Default:
            if (this.oddPage != null) {
                switch (Type) {
                case hdrftr_Header:
                    this.oddPage.addHeader();
                    break;
                case hdrftr_Footer:
                    this.oddPage.addFooter();
                }
            } else {
                new_hd_ftr_gr_objects = new HeaderFooterGraphicObjects();
                switch (Type) {
                case hdrftr_Header:
                    new_hd_ftr_gr_objects.addHeader();
                    break;
                case hdrftr_Footer:
                    new_hd_ftr_gr_objects.addFooter();
                }
                this.oddPage = new_hd_ftr_gr_objects;
            }
            if (null === this.firstPage) {
                this.firstPage = this.oddPage;
            }
            if (null === this.evenPage) {
                this.evenPage = this.oddPage;
            }
            this.oddPage = this.oddPage;
            break;
        case hdrftr_Even:
            if (null === this.evenPage || (this.evenPage != null && (this.evenPage === this.firstPage || this.evenPage === this.oddPage))) {
                new_hd_ftr_gr_objects = new HeaderFooterGraphicObjects();
                switch (Type) {
                case hdrftr_Header:
                    new_hd_ftr_gr_objects.addHeader();
                    break;
                case hdrftr_Footer:
                    new_hd_ftr_gr_objects.addFooter();
                }
                this.evenPage = new_hd_ftr_gr_objects;
            } else {
                switch (Type) {
                case hdrftr_Header:
                    this.evenPage.addHeader();
                    break;
                case hdrftr_Footer:
                    this.evenPage.addFooter();
                }
            }
            break;
        case hdrftr_First:
            if (null === this.firstPage || (this.firstPage != null && (this.firstPage === this.evenPage || this.firstPage === this.oddPage))) {
                new_hd_ftr_gr_objects = new HeaderFooterGraphicObjects();
                switch (Type) {
                case hdrftr_Header:
                    new_hd_ftr_gr_objects.addHeader();
                    break;
                case hdrftr_Footer:
                    new_hd_ftr_gr_objects.addFooter();
                }
                this.firstPage = new_hd_ftr_gr_objects;
            } else {
                switch (Type) {
                case hdrftr_Header:
                    this.firstPage.addHeader();
                    break;
                case hdrftr_Footer:
                    this.firstPage.addFooter();
                }
            }
            break;
        }
        data.newFirst = this.firstPage;
        data.newEven = this.evenPage;
        data.newOdd = this.oddPage;
        History.Add(this, data);
    },
    RemoveHeaderOrFooter: function (Type, PageType) {
        switch (PageType) {
        case hdrftr_Default:
            var HdrFtr = this.oddPage;
            if (HdrFtr === this.firstPage) {
                this.firstPage = null;
            }
            if (HdrFtr === this.evenPage) {
                this.evenPage = null;
            }
            this.oddPage = null;
            break;
        case hdrftr_Even:
            if (this.oddPage != this.evenPage) {
                this.evenPage = this.oddPage;
            }
            break;
        case hdrftr_First:
            if (this.oddPage != this.firstPage) {
                this.firstPage = this.oddPage;
            }
            break;
        }
    },
    updateCursorType: function (pageIndex, x, y, e, bTextFlag) {
        return this.curState.updateCursorType(pageIndex, x, y, e, bTextFlag);
    },
    getProps: function () {
        var chart_props, shape_props, image_props;
        switch (this.curState.id) {
        case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            var s_array = this.curState.group.selectionInfo.selectionArray;
            for (var i = 0; i < s_array.length; ++i) {
                var c_obj = s_array[i];
                if (c_obj.isImage() && c_obj.chart == null) {
                    if (!isRealObject(image_props)) {
                        image_props = {
                            fromGroup: true
                        };
                        image_props.Width = c_obj.absExtX;
                        image_props.Height = c_obj.absExtY;
                        image_props.ImageUrl = c_obj.getImageUrl();
                    } else {
                        if (image_props.Width != null) {
                            if (image_props.Width != c_obj.absExtX || image_props.Height != c_obj.absExtY) {
                                image_props.Width = null;
                                image_props.Height = null;
                            }
                        }
                        if (image_props.ImageUrl != null && c_obj.getImageUrl() !== image_props.ImageUrl) {
                            image_props.ImageUrl = null;
                        }
                    }
                }
                if (c_obj.isImage() && isRealObject(c_obj.chart)) {
                    if (!isRealObject(chart_props)) {
                        chart_props = {
                            fromGroup: true
                        };
                        g_oTableId.m_bTurnOff = true;
                        chart_props.ChartProperties = new asc_CChart(c_obj.chart);
                        g_oTableId.m_bTurnOff = false;
                    } else {
                        chart_props.chart = null;
                        chart_props.severalCharts = true;
                        if (chart_props.severalChartTypes !== true) {
                            if (! (chart_props.ChartProperties.type === c_obj.chart.type && chart_props.ChartProperties.subType === c_obj.chart.subType)) {
                                chart_props.severalChartTypes = true;
                            }
                        }
                        if (chart_props.severalChartStyles !== true) {
                            if (chart_props.ChartProperties.styleId !== c_obj.chart.styleId) {
                                chart_props.severalChartStyles = true;
                            }
                        }
                    }
                }
                if (c_obj.isShape()) {
                    if (!isRealObject(shape_props)) {
                        shape_props = {
                            fromGroup: true
                        };
                        shape_props.Width = c_obj.absExtX;
                        shape_props.Height = c_obj.absExtY;
                        shape_props.ShapeProperties = {
                            type: c_obj.getPresetGeom(),
                            fill: c_obj.getFill(),
                            stroke: c_obj.getStroke(),
                            canChangeArrows: c_obj.canChangeArrows(),
                            canFill: c_obj.canFill()
                        };
                        shape_props.verticalTextAlign = c_obj.bodyPr.anchor;
                    } else {
                        if (shape_props.Width != null) {
                            if (shape_props.Width != c_obj.absExtX || shape_props.Height != c_obj.absExtY) {
                                shape_props.Width = null;
                                shape_props.Height = null;
                            }
                        }
                        var ShapeProperties = {
                            type: c_obj.getPresetGeom(),
                            fill: c_obj.getFill(),
                            stroke: c_obj.getStroke(),
                            canChangeArrows: c_obj.canChangeArrows(),
                            canFill: c_obj.canFill()
                        };
                        shape_props.ShapeProperties = CompareShapeProperties(ShapeProperties, shape_props.ShapeProperties);
                        shape_props.verticalTextAlign = undefined;
                    }
                }
                if (c_obj.chart) {
                    if (!isRealObject(chart_props)) {
                        chart_props = {
                            fromGroup: true
                        };
                        chart_props.Width = c_obj.absExtX;
                        chart_props.Height = c_obj.absExtY;
                        g_oTableId.m_bTurnOff = true;
                        chart_props.ChartProperties = new asc_CChart(c_obj.chart);
                        g_oTableId.m_bTurnOff = false;
                    } else {
                        if (chart_props.Width != null) {
                            if (chart_props.Width != c_obj.absExtX || chart_props.Height != c_obj.absExtY) {
                                chart_props.Width = null;
                                chart_props.Height = null;
                            }
                        }
                        chart_props.severalCharts = true;
                        if (chart_props.severalChartTypes !== true) {
                            if (! (chart_props.ChartProperties.type === c_obj.chart.type && chart_props.ChartProperties.subType === c_obj.chart.subType)) {
                                chart_props.severalChartTypes = true;
                            }
                        }
                        if (chart_props.severalChartStyles !== true) {
                            if (chart_props.ChartProperties.styleId !== c_obj.chart.styleId) {
                                chart_props.severalChartStyles = true;
                            }
                        }
                    }
                }
            }
            break;
        default:
            var s_arr = this.selectionInfo.selectionArray;
            for (i = 0; i < s_arr.length; ++i) {
                c_obj = s_arr[i].GraphicObj;
                if (isRealObject(c_obj)) {
                    if (c_obj.isShape()) {
                        if (!isRealObject(shape_props)) {
                            shape_props = {};
                            shape_props = s_arr[i].Get_Props(null);
                            shape_props.ShapeProperties = {
                                type: c_obj.getPresetGeom(),
                                fill: c_obj.getFill(),
                                stroke: c_obj.getStroke(),
                                canChangeArrows: c_obj.canChangeArrows(),
                                paddings: c_obj.getPaddings(),
                                canFill: c_obj.canFill()
                            };
                            shape_props.verticalTextAlign = c_obj.bodyPr.anchor;
                        } else {
                            ShapeProperties = {
                                type: c_obj.getPresetGeom(),
                                fill: c_obj.getFill(),
                                stroke: c_obj.getStroke(),
                                canChangeArrows: c_obj.canChangeArrows(),
                                paddings: c_obj.getPaddings(),
                                canFill: c_obj.canFill()
                            };
                            shape_props = s_arr[i].Get_Props(shape_props);
                            shape_props.ShapeProperties = CompareShapeProperties(ShapeProperties, shape_props.ShapeProperties);
                            shape_props.verticalTextAlign = undefined;
                        }
                    }
                    if (c_obj.isImage()) {
                        if (!isRealObject(image_props)) {
                            image_props = {};
                            image_props = s_arr[i].Get_Props(null);
                            image_props.ImageUrl = c_obj.getImageUrl();
                        } else {
                            image_props = s_arr[i].Get_Props(image_props);
                            if (image_props.ImageUrl != null && c_obj.getImageUrl() !== image_props.ImageUrl) {
                                image_props.ImageUrl = null;
                            }
                        }
                    }
                    if (c_obj.chart) {
                        if (!isRealObject(chart_props)) {
                            chart_props = {};
                            chart_props = s_arr[i].Get_Props(null);
                            g_oTableId.m_bTurnOff = true;
                            chart_props.ChartProperties = new asc_CChart(c_obj.chart);
                            g_oTableId.m_bTurnOff = false;
                        } else {
                            chart_props = s_arr[i].Get_Props(chart_props);
                            chart_props.severalCharts = true;
                            if (chart_props.severalChartTypes !== true) {
                                if (! (chart_props.ChartProperties.type === c_obj.chart.type && chart_props.ChartProperties.subType === c_obj.chart.subType)) {
                                    chart_props.severalChartTypes = true;
                                }
                            }
                            if (chart_props.severalChartStyles !== true) {
                                if (chart_props.ChartProperties.styleId !== c_obj.chart.styleId) {
                                    chart_props.severalChartStyles = true;
                                }
                            }
                        }
                    }
                    if (c_obj.isGroup()) {
                        var shape_props2 = c_obj.getShapeProps();
                        var image_props2 = c_obj.getImageProps2();
                        var chart_props2 = c_obj.getChartProps();
                        if (isRealObject(shape_props2)) {
                            if (!isRealObject(shape_props)) {
                                shape_props = {};
                                shape_props = s_arr[i].Get_Props(null);
                                shape_props.ShapeProperties = shape_props2.ShapeProperties;
                            } else {
                                shape_props = s_arr[i].Get_Props(shape_props);
                                shape_props.ShapeProperties = CompareShapeProperties(shape_props2.ShapeProperties, shape_props.ShapeProperties);
                            }
                        }
                        if (isRealObject(image_props2)) {
                            if (!isRealObject(image_props)) {
                                image_props = {};
                                image_props = s_arr[i].Get_Props(null);
                                image_props.ImageUrl = image_props2.ImageUrl;
                            } else {
                                image_props = s_arr[i].Get_Props(image_props);
                                if (image_props.ImageUrl != null && image_props2.ImageUrl !== image_props.ImageUrl) {
                                    image_props.ImageUrl = null;
                                }
                            }
                        }
                        if (isRealObject(chart_props2)) {
                            if (!isRealObject(chart_props)) {
                                chart_props = {};
                                chart_props = s_arr[i].Get_Props(null);
                                chart_props.ChartProperties = chart_props2.ChartProperties;
                                chart_props.severalCharts = chart_props2.severalCharts;
                                chart_props.severalChartTypes = chart_props2.severalChartTypes;
                                chart_props.severalChartStyles = chart_props2.severalChartStyles;
                            } else {
                                chart_props = s_arr[i].Get_Props(chart_props);
                                chart_props.severalCharts = true;
                                if (chart_props.severalChartTypes !== true) {
                                    if (chart_props2.severalChartTypes === true) {
                                        chart_props.severalChartTypes = true;
                                    } else {
                                        if (! (chart_props.ChartProperties.type === chart_props2.ChartProperties.type && chart_props.ChartProperties.subType === chart_props2.ChartProperties.subType)) {
                                            chart_props.severalChartTypes = true;
                                        }
                                        if (chart_props.ChartProperties.subType !== chart_props2.ChartProperties.subType) {
                                            chart_props.severalChartStyles = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            break;
        }
        var ret = [];
        if (isRealObject(shape_props)) {
            if (shape_props.ShapeProperties) {
                var pr = shape_props.ShapeProperties;
                if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == FILL_TYPE_BLIP) {
                    this.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
                } else {
                    this.drawingDocument.DrawImageTextureFillShape(null);
                }
                shape_props.ShapeProperties = CreateAscShapePropFromProp(shape_props.ShapeProperties);
            } else {
                this.drawingDocument.DrawImageTextureFillShape(null);
            }
            if (shape_props.ChartProperties) {
                shape_props.ChartProperties = shape_props.ChartProperties.serializeChart();
            }
            ret.push(shape_props);
        }
        if (isRealObject(image_props)) {
            if (image_props.ShapeProperties) {
                image_props.ShapeProperties = CreateAscShapePropFromProp(image_props.ShapeProperties);
            }
            if (image_props.ChartProperties) {
                image_props.ChartProperties = image_props.ChartProperties.serializeChart();
            }
            ret.push(image_props);
        }
        if (isRealObject(chart_props)) {
            if (chart_props.ShapeProperties) {
                chart_props.ShapeProperties = CreateAscShapePropFromProp(chart_props.ShapeProperties);
            }
            ret.push(chart_props);
        }
        return ret;
    },
    Document_Is_SelectionLocked: function (CheckType) {
        if (CheckType === changestype_ColorScheme) {
            this.Lock.Check(this.Get_Id());
        }
    },
    Get_Props: function () {
        return this.getProps();
    },
    setProps: function (props) {
        if (typeof props.Group === "number" && (props.Group === 1 || props.Group === -1)) {
            if (props.Group === 1) {
                this.groupSelectedObjects();
            } else {
                if (props.Group === -1) {
                    this.unGroupSelectedObjects();
                }
            }
        } else {
            if (this.curState.id !== STATES_ID_GROUP && this.curState.id !== STATES_ID_TEXT_ADD_IN_GROUP) {
                var sel_arr = this.selectionInfo.selectionArray;
                for (var index = 0; index < sel_arr.length; ++index) {
                    sel_arr[index].Set_Props(props);
                }
            }
            if (typeof props.ChangeLevel === "number") {
                switch (props.ChangeLevel) {
                case 0:
                    this.bringToFront();
                    break;
                case 1:
                    this.bringForward();
                    break;
                case 2:
                    this.sendToBack();
                    break;
                case 3:
                    this.bringBackward();
                }
            }
            this.shapeApply(props, props);
        }
        this.document.Recalculate();
        if (typeof this.curState.updateAnchorPos === "function") {
            this.curState.updateAnchorPos();
        }
    },
    getFloatDrawingArrays: function () {
        var graphic_pages = this.graphicPages;
        var behind_doc = [];
        for (var i = 0; i < graphic_pages.length; ++i) {
            if (isRealObject(graphic_pages[i])) {
                behind_doc = behind_doc.concat(graphic_pages[i].behindDocObjects);
            }
        }
        behind_doc.sort(ComparisonByZIndexSimple);
        var wrap = [];
        for (i = 0; i < graphic_pages.length; ++i) {
            if (isRealObject(graphic_pages[i])) {
                wrap = wrap.concat(graphic_pages[i].wrappingObjects);
            }
        }
        wrap.sort(ComparisonByZIndexSimple);
        var before = [];
        for (i = 0; i < graphic_pages.length; ++i) {
            if (isRealObject(graphic_pages[i])) {
                before = before.concat(graphic_pages[i].beforeTextObjects);
            }
        }
        before.sort(ComparisonByZIndexSimple);
        return [behind_doc, wrap, before];
    },
    bringToFront: function () {
        if (this.document.CurPos.Type === docpostype_DrawingObjects) {
            switch (this.curState.id) {
            case STATES_ID_GROUP:
                var group = this.curState.group;
                group.bringToFront();
                this.drawingDocument.OnRecalculatePage(group.pageIndex, this.document.Pages[group.pageIndex]);
                this.drawingDocument.OnEndRecalculate(true, false);
                break;
            default:
                if (this.selectionInfo.selectionArray.length > 0) {
                    var drawing_arrays = this.getFloatDrawingArrays();
                    var selected_objects;
                    var page_indexes = [];
                    for (var i = 0; i < 3; ++i) {
                        var drawing_array = drawing_arrays[i];
                        if (drawing_array.length > 0) {
                            selected_objects = [];
                            for (var j = drawing_array.length - 1; j > -1; --j) {
                                if (drawing_array[j].selected) {
                                    selected_objects.push(drawing_array.splice(j, 1)[0]);
                                }
                            }
                            if (selected_objects.length > 0 && drawing_array.length > 0) {
                                selected_objects.reverse();
                                for (var k = 0; k < selected_objects.length; ++k) {
                                    for (var t = 0; t < page_indexes.length; ++t) {
                                        if (page_indexes[t] === selected_objects[k].pageIndex) {
                                            break;
                                        }
                                    }
                                    if (page_indexes.length === t) {
                                        page_indexes.push(selected_objects[k].pageIndex);
                                    }
                                    selected_objects[k].setZIndex();
                                }
                            }
                        }
                    }
                    page_indexes.sort(function (a, b) {
                        return a - b;
                    });
                    for (i = 0; i < page_indexes.length; ++i) {
                        var page_index = page_indexes[i];
                        var graphic_page = this.graphicPages[page_index];
                        graphic_page.behindDocObjects.sort(ComparisonByZIndexSimple);
                        graphic_page.wrappingObjects.sort(ComparisonByZIndexSimple);
                        graphic_page.beforeTextObjects.sort(ComparisonByZIndexSimple);
                        this.drawingDocument.OnRecalculatePage(page_index, this.document.Pages[page_index]);
                    }
                    this.drawingDocument.OnEndRecalculate();
                }
                break;
            }
        } else {
            if (this.document.CurPos.Type === docpostype_HdrFtr) {
                var cur_state = this.curState;
                if (isRealObject(cur_state.group) && isRealObject(cur_state.group.selectionInfo)) {
                    var gr_sel_array = cur_state.group.selectionInfo.selectionArray;
                    var arr_groups = [];
                    for (i = 0; i < gr_sel_array.length; ++i) {
                        var parent_group = gr_sel_array[i].group;
                        for (j = 0; j < arr_groups.length; ++j) {
                            if (arr_groups[j] === parent_group) {
                                break;
                            }
                        }
                        if (j === arr_groups.length) {
                            arr_groups.push(parent_group);
                        }
                    }
                    for (i = 0; i < arr_groups.length; ++i) {
                        var cur_group = arr_groups[i];
                        var arr_gr_objects = cur_group.arrGraphicObjects;
                        var selected_shapes = [];
                        for (j = 0; j < arr_gr_objects.length; ++j) {
                            if (arr_gr_objects[j].selected) {
                                selected_objects.push(arr_gr_objects.splice(j, 1)[0]);
                            }
                        }
                    }
                }
            }
        }
    },
    bringForward: function () {
        if (this.document.CurPos.Type === docpostype_DrawingObjects) {
            switch (this.curState.id) {
            case STATES_ID_GROUP:
                var group = this.curState.group;
                group.bringForward();
                this.drawingDocument.OnRecalculatePage(group.pageIndex, this.document.Pages[group.pageIndex]);
                this.drawingDocument.OnEndRecalculate(true, false);
                break;
            default:
                if (this.selectionInfo.selectionArray.length > 0) {
                    var drawing_arrays = this.getFloatDrawingArrays();
                    var selected_objects;
                    var page_indexes = [];
                    for (var i = 0; i < 3; ++i) {
                        var drawing_array = drawing_arrays[i];
                        if (drawing_array.length > 0) {
                            selected_objects = [];
                            for (var j = drawing_array.length - 1; j > -1; --j) {
                                if (drawing_array[j].selected && j < drawing_array.length - 1 && !drawing_array[j + 1].selected) {
                                    var z_index1 = drawing_array[j].RelativeHeight;
                                    var z_index2 = drawing_array[j + 1].RelativeHeight;
                                    var page_index1 = drawing_array[j].pageIndex;
                                    var page_index2 = drawing_array[j + 1].pageIndex;
                                    drawing_array[j].setZIndex2(z_index2);
                                    drawing_array[j + 1].setZIndex2(z_index1);
                                    for (var k = 0; k < page_indexes.length; ++k) {
                                        if (page_indexes[k] === page_index1) {
                                            break;
                                        }
                                    }
                                    if (k === page_indexes.length) {
                                        page_indexes.push(page_index1);
                                    }
                                    for (k = 0; k < page_indexes.length; ++k) {
                                        if (page_indexes[k] === page_index2) {
                                            break;
                                        }
                                    }
                                    if (k === page_indexes.length) {
                                        page_indexes.push(page_index2);
                                    }
                                }
                            }
                        }
                    }
                    page_indexes.sort(function (a, b) {
                        return a - b;
                    });
                    for (i = 0; i < page_indexes.length; ++i) {
                        var page_index = page_indexes[i];
                        var graphic_page = this.graphicPages[page_index];
                        graphic_page.behindDocObjects.sort(ComparisonByZIndexSimple);
                        graphic_page.wrappingObjects.sort(ComparisonByZIndexSimple);
                        graphic_page.beforeTextObjects.sort(ComparisonByZIndexSimple);
                        this.drawingDocument.OnRecalculatePage(page_index, this.document.Pages[page_index]);
                    }
                    this.drawingDocument.OnEndRecalculate();
                }
                break;
            }
        }
    },
    sendToBack: function () {
        if (this.document.CurPos.Type === docpostype_DrawingObjects) {
            switch (this.curState.id) {
            case STATES_ID_GROUP:
                this.curState.group.sendToBack();
                this.drawingDocument.OnRecalculatePage(this.curState.group.pageIndex, this.document.Pages[this.curState.group.pageIndex]);
                this.drawingDocument.OnEndRecalculate(true, false);
                break;
            default:
                if (this.selectionInfo.selectionArray.length > 0) {
                    var drawing_arrays = this.getFloatDrawingArrays();
                    var selected_objects;
                    var page_indexes = [];
                    for (var i = 0; i < 3; ++i) {
                        var drawing_array = drawing_arrays[i];
                        if (drawing_array.length > 0) {
                            selected_objects = [];
                            for (var j = drawing_array.length - 1; j > -1; --j) {
                                if (!drawing_array[j].selected) {
                                    selected_objects.push(drawing_array.splice(j, 1)[0]);
                                }
                            }
                            if (selected_objects.length > 0 && drawing_array.length > 0) {
                                selected_objects.reverse();
                                for (var k = 0; k < selected_objects.length; ++k) {
                                    for (var t = 0; t < page_indexes.length; ++t) {
                                        if (page_indexes[t] === selected_objects[k].pageIndex) {
                                            break;
                                        }
                                    }
                                    if (page_indexes.length === t) {
                                        page_indexes.push(selected_objects[k].pageIndex);
                                    }
                                    selected_objects[k].setZIndex();
                                }
                            }
                        }
                    }
                    page_indexes.sort(function (a, b) {
                        return a - b;
                    });
                    for (i = 0; i < page_indexes.length; ++i) {
                        var page_index = page_indexes[i];
                        var graphic_page = this.graphicPages[page_index];
                        graphic_page.behindDocObjects.sort(ComparisonByZIndexSimple);
                        graphic_page.wrappingObjects.sort(ComparisonByZIndexSimple);
                        graphic_page.beforeTextObjects.sort(ComparisonByZIndexSimple);
                        this.drawingDocument.OnRecalculatePage(page_index, this.document.Pages[page_index]);
                    }
                    this.drawingDocument.OnEndRecalculate();
                }
                break;
            }
        }
    },
    bringBackward: function () {
        if (this.document.CurPos.Type === docpostype_DrawingObjects) {
            switch (this.curState.id) {
            case STATES_ID_GROUP:
                this.curState.group.bringBackward();
                this.drawingDocument.OnRecalculatePage(this.curState.group.pageIndex, this.document.Pages[this.curState.group.pageIndex]);
                this.drawingDocument.OnEndRecalculate(true, false);
                break;
            default:
                if (this.selectionInfo.selectionArray.length > 0) {
                    var drawing_arrays = this.getFloatDrawingArrays();
                    var selected_objects;
                    var page_indexes = [];
                    for (var i = 0; i < 3; ++i) {
                        var drawing_array = drawing_arrays[i];
                        if (drawing_array.length > 0) {
                            selected_objects = [];
                            for (var j = 0; j < drawing_array.length; ++j) {
                                if (drawing_array[j].selected && j > 0 && !drawing_array[j - 1].selected) {
                                    var z_index1 = drawing_array[j].RelativeHeight;
                                    var z_index2 = drawing_array[j - 1].RelativeHeight;
                                    var page_index1 = drawing_array[j].pageIndex;
                                    var page_index2 = drawing_array[j - 1].pageIndex;
                                    drawing_array[j].setZIndex2(z_index2);
                                    drawing_array[j - 1].setZIndex2(z_index1);
                                    for (var k = 0; k < page_indexes.length; ++k) {
                                        if (page_indexes[k] === page_index1) {
                                            break;
                                        }
                                    }
                                    if (k === page_indexes.length) {
                                        page_indexes.push(page_index1);
                                    }
                                    for (k = 0; k < page_indexes.length; ++k) {
                                        if (page_indexes[k] === page_index2) {
                                            break;
                                        }
                                    }
                                    if (k === page_indexes.length) {
                                        page_indexes.push(page_index2);
                                    }
                                }
                            }
                        }
                    }
                    page_indexes.sort(function (a, b) {
                        return a - b;
                    });
                    for (i = 0; i < page_indexes.length; ++i) {
                        var page_index = page_indexes[i];
                        var graphic_page = this.graphicPages[page_index];
                        graphic_page.behindDocObjects.sort(ComparisonByZIndexSimple);
                        graphic_page.wrappingObjects.sort(ComparisonByZIndexSimple);
                        graphic_page.beforeTextObjects.sort(ComparisonByZIndexSimple);
                        this.drawingDocument.OnRecalculatePage(page_index, this.document.Pages[page_index]);
                    }
                    this.drawingDocument.OnEndRecalculate();
                }
                break;
            }
        }
    },
    editChart: function (chart) {
        var gr_objects = this.selectionInfo.selectionArray;
        if (this.curState.id !== STATES_ID_GROUP) {
            for (var i = 0; i < gr_objects.length; ++i) {
                if (gr_objects[i].GraphicObj.chart != null) {
                    var para_drawing = gr_objects[i];
                    para_drawing.GraphicObj.chartModify(chart);
                    para_drawing.GraphicObj.setPageIndex(para_drawing.PageNum);
                    if (para_drawing.Is_Inline()) {
                        para_drawing.OnEnd_ResizeInline(para_drawing.GraphicObj.absExtX, para_drawing.GraphicObj.absExtY);
                    } else {
                        var bounds = para_drawing.getBounds();
                        para_drawing.OnEnd_ChangeFlow(para_drawing.GraphicObj.absOffsetX, para_drawing.GraphicObj.absOffsetY, para_drawing.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, this.document.Get_NearestPos(para_drawing.pageIndex, bounds.l, bounds.t, true, para_drawing), true, true);
                    }
                    return;
                }
            }
        } else {
            var group = this.curState.group;
            var sel_arr = group.selectionInfo.selectionArray;
            if (sel_arr.length === 1) {
                if (sel_arr[0].chart != null) {
                    var diagramm = chart;
                    sel_arr[0].setAbsoluteTransform(null, null, sel_arr[0].drawingDocument.GetMMPerDot(diagramm.width), sel_arr[0].drawingDocument.GetMMPerDot(diagramm.height), null, false, false);
                    sel_arr[0].setXfrm(null, null, sel_arr[0].drawingDocument.GetMMPerDot(diagramm.width), sel_arr[0].drawingDocument.GetMMPerDot(diagramm.height), null, false, false);
                    sel_arr[0].calculateAfterResize(null, true);
                    sel_arr[0].chartModify(diagramm);
                    this.curState.group.updateSizes();
                    this.curState.group.recalculate();
                    var bounds = this.curState.group.parent.getBounds();
                    if (!this.curState.group.parent.Is_Inline()) {
                        this.curState.group.parent.OnEnd_ChangeFlow(this.curState.group.absOffsetX, this.curState.group.absOffsetY, this.curState.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, true);
                    } else {
                        this.curState.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                    }
                }
            }
        }
    },
    getChartObject: function () {
        var selected_arr = this.selectionInfo.selectionArray;
        for (var i = 0; i < selected_arr.length; ++i) {
            if (selected_arr[i].GraphicObj.chart != null) {
                return selected_arr[i].GraphicObj;
            }
        }
        var ret = new CChartAsGroup();
        g_oTableId.m_bTurnOff = true;
        ret.setAscChart(new asc_CChart());
        g_oTableId.m_bTurnOff = false;
        ret.chart.initDefault();
        ret.setChart(ret.chart);
        ret.spPr.xfrm.offX = 0;
        ret.spPr.xfrm.offY = 0;
        ret.spPr.xfrm.extX = this.drawingDocument.GetMMPerDot(c_oAscChartDefines.defaultChartWidth);
        ret.spPr.xfrm.extY = this.drawingDocument.GetMMPerDot(c_oAscChartDefines.defaultChartHeight);
        return ret;
    },
    updateCharts: function () {
        if (this.urlMap.length > 0) {
            editor.SyncLoadImages(this.urlMap);
            this.urlMap = [];
        }
    },
    addFloatTable: function (table) {
        if (!table.Table.Parent.Is_HdrFtr()) {
            this.graphicPages[table.PageNum + table.PageController].addFloatTable(table);
        } else {
            var page_index = table.PageNum;
            var hdr_ftr = null;
            if (page_index === 0) {
                hdr_ftr = this.firstPage;
            } else {
                if (page_index % 2 === 1) {
                    hdr_ftr = this.evenPage;
                } else {
                    hdr_ftr = this.oddPage;
                }
            }
            if (isRealObject(hdr_ftr)) {
                hdr_ftr.floatTables.push(table);
            }
        }
    },
    removeFloatTableById: function (pageIndex, id) {
        var table = g_oTableId.Get_ById(id);
        if (!table.Parent.Is_HdrFtr()) {
            this.graphicPages[pageIndex].removeFloatTableById(id);
        } else {
            var hdr_ftr;
            if (pageIndex === 0) {
                hdr_ftr = this.firstPage;
            } else {
                if (pageIndex % 2 === 1) {
                    hdr_ftr = this.evenPage;
                } else {
                    hdr_ftr = this.oddPage;
                }
            }
            if (isRealObject(hdr_ftr)) {
                var tables = hdr_ftr.floatTables;
                for (var i = 0; i < tables.length; ++i) {
                    if (tables[i].Id === id) {
                        tables.splice(i, 1);
                        break;
                    }
                }
            }
        }
    },
    selectionIsTableBorder: function () {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            return this.curState.textObject.Selection_Is_TableBorderMove();
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.Selection_Is_TableBorderMove === "function") {
                return this.curState.textObject.Selection_Is_TableBorderMove();
            }
            break;
        }
        return false;
    },
    drawPageSelect: function (pageIndex) {
        if (this.document.CurPos.Type !== docpostype_HdrFtr) {} else {}
    },
    getTableByXY: function (x, y, pageIndex, documentContent) {
        if (!documentContent.Is_HdrFtr()) {
            return this.graphicPages[pageIndex].getTableByXY(x, y, documentContent);
        }
        var hdr_ftr;
        if (pageIndex === 0) {
            hdr_ftr = this.firstPage;
        } else {
            if (pageIndex % 2 === 1) {
                hdr_ftr = this.evenPage;
            } else {
                hdr_ftr = this.oddPage;
            }
        }
        if (isRealObject(hdr_ftr)) {
            var tables = hdr_ftr.floatTables;
            for (var i = 0; i < tables.length; ++i) {
                if (tables[i].IsPointIn(x, y) && tables[i].Table.Parent === documentContent) {
                    return tables[i];
                }
            }
        }
        return null;
    },
    OnMouseDown: function (e, x, y, pageIndex) {
        this.curState.OnMouseDown(e, x, y, pageIndex);
    },
    OnMouseMove: function (e, x, y, pageIndex) {
        this.curState.OnMouseMove(e, x, y, pageIndex);
    },
    OnMouseUp: function (e, x, y, pageIndex) {
        this.curState.OnMouseUp(e, x, y, pageIndex);
    },
    draw: function (pageIndex, graphics) {
        this.graphicPages[pageIndex].draw(graphics);
    },
    selectionDraw: function () {
        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
    },
    isPolylineAddition: function () {
        return this.curState.polylineFlag === true;
    },
    shapeApply: function (props, para_props) {
        var properties;
        if (props instanceof CImgProperty) {
            properties = props.ShapeProperties;
        } else {
            properties = props;
        }
        if (isRealObject(properties) || isRealObject(props)) {
            var arr_pages = [];
            if (isRealObject(props) && typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign)) {
                if (this.curState.id === STATES_ID_TEXT_ADD) {
                    if (typeof this.curState.textObject.GraphicObj.setTextVerticalAlign === "function") {
                        this.curState.textObject.GraphicObj.setTextVerticalAlign(props.verticalTextAlign);
                    }
                }
                if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                    if (typeof this.curState.textObject.setTextVerticalAlign === "function") {
                        this.curState.textObject.setTextVerticalAlign(props.verticalTextAlign);
                    }
                }
            }
            if (isRealObject(props.paddings)) {
                if (this.curState.id === STATES_ID_TEXT_ADD) {
                    if (typeof this.curState.textObject.GraphicObj.setPaddings === "function") {
                        this.curState.textObject.GraphicObj.setPaddings(props.paddings);
                    }
                }
                if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                    if (typeof this.curState.textObject.setPaddings === "function") {
                        this.curState.textObject.setPaddings(props.paddings);
                    }
                }
            }
            if (! (this.curState.id === STATES_ID_GROUP || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) && isRealObject(properties)) {
                var ArrGlyph = this.selectionInfo.selectionArray;
                for (var i = 0; i < ArrGlyph.length; ++i) {
                    var cur_page_index = ArrGlyph[i].pageIndex;
                    for (var j = 0; j < arr_pages.length; ++j) {
                        if (arr_pages[j] === cur_page_index) {
                            break;
                        }
                    }
                    if (j === arr_pages.length) {
                        arr_pages.push(cur_page_index);
                    }
                    if (((ArrGlyph[i].GraphicObj.isShape()) || (ArrGlyph[i].GraphicObj.isGroup()))) {
                        if (properties.type != undefined && properties.type != -1) {
                            ArrGlyph[i].GraphicObj.changePresetGeometry(properties.type);
                        }
                        if (properties.fill) {
                            ArrGlyph[i].GraphicObj.changeFill(properties.fill);
                        }
                        if (properties.stroke) {
                            ArrGlyph[i].GraphicObj.changeLine(properties.stroke);
                        }
                        if (isRealObject(properties.paddings)) {
                            ArrGlyph[i].GraphicObj.setPaddings(properties.paddings);
                        }
                    }
                    if (typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign) && typeof ArrGlyph[i].GraphicObj.setTextVerticalAlign === "function") {
                        ArrGlyph[i].GraphicObj.setTextVerticalAlign(props.verticalTextAlign);
                    }
                }
                arr_pages.sort(function (a, b) {
                    return a - b;
                });
                for (i = 0; i < arr_pages.length; ++i) {
                    this.drawingDocument.OnRecalculatePage(arr_pages[i], this.document.Pages[arr_pages[i]]);
                }
                this.drawingDocument.OnEndRecalculate(false, false);
            } else {
                if (this.curState.id === STATES_ID_GROUP || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                    if (undefined != props.PositionH) {
                        this.curState.group.parent.Set_PositionH(props.PositionH.RelativeFrom, props.PositionH.UseAlign, (true === props.PositionH.UseAlign ? props.PositionH.Align : props.PositionH.Value));
                    }
                    if (undefined != props.PositionV) {
                        this.curState.group.parent.Set_PositionV(props.PositionV.RelativeFrom, props.PositionV.UseAlign, (true === props.PositionV.UseAlign ? props.PositionV.Align : props.PositionV.Value));
                    }
                    ArrGlyph = this.curState.group.selectionInfo.selectionArray;
                    var b_change_diagram = false;
                    for (i = 0; i < ArrGlyph.length; ++i) {
                        if (ArrGlyph[i].isShape() && isRealObject(properties)) {
                            if (properties.type != undefined && properties.type != -1) {
                                ArrGlyph[i].changePresetGeometry(properties.type);
                            }
                            if (properties.fill) {
                                ArrGlyph[i].changeFill(properties.fill);
                            }
                            if (properties.stroke) {
                                ArrGlyph[i].changeLine(properties.stroke);
                            }
                            if (isRealObject(properties.paddings)) {
                                ArrGlyph[i].setPaddings(properties.paddings);
                            }
                            if (isRealNumber(props.Width) && isRealNumber(props.Height)) {
                                ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                if (ArrGlyph[i].spPr.geometry) {
                                    ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                }
                                b_change_diagram = true;
                            }
                        } else {
                            if (isRealObject(props) && typeof props.ImageUrl === "string" && ArrGlyph[i].isImage() && ArrGlyph[i].chart == null) {
                                ArrGlyph[i].setRasterImage2(props.ImageUrl);
                                if (isRealNumber(props.Width) && isRealNumber(props.Height)) {
                                    ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                    ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                    if (ArrGlyph[i].spPr.geometry) {
                                        ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                    }
                                    b_change_diagram = true;
                                }
                            } else {
                                if (isRealObject(props) && isRealNumber(props.Width) && isRealNumber(props.Height) && ArrGlyph[i].isImage() && ArrGlyph[i].chart == null) {
                                    if (isRealNumber(props.Width) && isRealNumber(props.Height)) {
                                        ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                        ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                        if (ArrGlyph[i].spPr.geometry) {
                                            ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                        }
                                        b_change_diagram = true;
                                    }
                                } else {
                                    if (ArrGlyph[i].chart != null && isRealObject(props) && isRealObject(props.ChartProperties)) {
                                        b_change_diagram = true;
                                        ArrGlyph[i].setDiagram(props.ChartProperties);
                                        if (isRealNumber(props.Width) && isRealNumber(props.Height)) {
                                            ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                            ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                            if (ArrGlyph[i].spPr.geometry) {
                                                ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                            }
                                            b_change_diagram = true;
                                        }
                                    } else {
                                        if (ArrGlyph[i].chart != null && isRealObject(props) && isRealNumber(props.Width) && isRealNumber(props.Height)) {
                                            b_change_diagram = true;
                                            if (isRealNumber(props.Width) && isRealNumber(props.Height)) {
                                                ArrGlyph[i].setXfrm(null, null, props.Width, props.Height, null, null, null);
                                                ArrGlyph[i].setAbsoluteTransform(null, null, props.Width, props.Height, null, null, null);
                                                if (ArrGlyph[i].spPr.geometry) {
                                                    ArrGlyph[i].spPr.geometry.Recalculate(props.Width, props.Height);
                                                }
                                                b_change_diagram = true;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (typeof props.verticalTextAlign === "number" && !isNaN(props.verticalTextAlign) && typeof ArrGlyph[i].setTextVerticalAlign === "function") {
                            ArrGlyph[i].setTextVerticalAlign(props.verticalTextAlign);
                        }
                    }
                    if (b_change_diagram) {
                        this.curState.group.updateSizes();
                        this.curState.group.recalculate();
                        var bounds = this.curState.group.parent.getBounds();
                        if (!this.curState.group.parent.Is_Inline()) {
                            this.curState.group.parent.OnEnd_ChangeFlow(this.curState.group.absOffsetX, this.curState.group.absOffsetY, this.curState.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, true);
                        } else {
                            this.curState.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                        }
                    }
                }
            }
        }
        editor.SyncLoadImages(this.urlMap);
        this.urlMap = [];
    },
    redrawCharts: function () {
        for (var i = 0; i < this.graphicPages.length; ++i) {
            if (isRealObject(this.graphicPages[i])) {
                this.graphicPages[i].redrawCharts();
            }
        }
        this.updateCharts();
    },
    drawOnOverlay: function (overlay) {
        var _track_objects = this.arrTrackObjects;
        var _object_index;
        var _object_count = _track_objects.length;
        for (_object_index = 0; _object_index < _object_count; ++_object_index) {
            _track_objects[_object_index].draw(overlay);
        }
        if (this.curState.group !== null && typeof this.curState.group === "object" && typeof this.curState.group.drawOnOverlay === "function") {
            this.curState.group.drawOnOverlay();
        }
        if (this.curState.id === STATES_ID_MOVE_INLINE_OBJECT) {
            this.drawingDocument.AutoShapesTrack.SetCurrentPage(this.curState.InlinePos.Page);
            this.drawingDocument.AutoShapesTrack.DrawInlineMoveCursor(this.curState.InlinePos.X, this.curState.InlinePos.Y, this.curState.InlinePos.Height, this.curState.InlinePos.transform);
        }
        if (isRealObject(this.curState.anchorPos) && this.curState.anchorPos.Page != -1) {
            this.updateAnchorPos();
            if (isRealObject(this.curState.anchorPos)) {
                this.drawingDocument.AutoShapesTrack.SetCurrentPage(this.curState.anchorPos.Page);
                this.drawingDocument.AutoShapesTrack.drawFlowAnchor(this.curState.anchorPos.X, this.curState.anchorPos.Y);
            }
        }
        if (this.spline !== null) {
            overlay.SetCurrentPage(this.spline.pageIndex);
            this.spline.Draw(overlay);
        }
        if (this.polyline !== null) {
            overlay.SetCurrentPage(this.polyline.pageIndex);
            this.polyline.Draw(overlay);
        }
    },
    addFlowImage: function (w, h, imageId, pageIndex) {},
    getAllFloatObjectsOnPage: function (pageIndex, docContent) {
        var ret = [];
        var page = this.graphicPages[pageIndex];
        var a;
        if (!docContent.Is_HdrFtr()) {
            if (!page) {
                return ret;
            }
            a = [page.behindDocObjects, page.wrappingObjects, page.beforeTextObjects];
        } else {
            var hdr_ftr_objects;
            if (pageIndex === 0) {
                hdr_ftr_objects = this.firstPage;
            } else {
                if (pageIndex % 2 === 1) {
                    hdr_ftr_objects = this.evenPage;
                } else {
                    hdr_ftr_objects = this.oddPage;
                }
            }
            if (hdr_ftr_objects != null) {
                a = [hdr_ftr_objects.behindDocArray, hdr_ftr_objects.wrappingArray, hdr_ftr_objects.beforeTextArray];
            }
        }
        if (isRealObject(a)) {
            for (var i = 0; i < 3; ++i) {
                var arr = a[i];
                for (var j = 0; j < arr.length; ++j) {
                    var o = arr[j];
                    if (isRealObject(o) && isRealObject(o.Parent) && isRealObject(o.Parent.Parent) && o.Parent.Parent === docContent) {
                        ret.push(o);
                    }
                }
            }
        }
        return ret;
    },
    getAllFloatTablesOnPage: function (pageIndex) {
        if (this.document.CurPos.Type !== docpostype_HdrFtr) {
            return this.graphicPages[pageIndex] ? this.graphicPages[pageIndex].flowTables : [];
        }
        var hdr_ftr;
        if (pageIndex === 0) {
            hdr_ftr = this.firstPage;
        } else {
            if (pageIndex % 2 === 1) {
                hdr_ftr = this.evenPage;
            } else {
                hdr_ftr = this.oddPage;
            }
        }
        if (isRealObject(hdr_ftr)) {
            return hdr_ftr.floatTables;
        }
        return [];
    },
    addInlineImage: function (W, H, Img, Chart, bFlow) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.addInlineImage(W, H, Img, Chart, bFlow);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.addInlineImage === "function") {
                this.curState.textObject.addInlineImage(W, H, Img, Chart, bFlow);
            }
            break;
        case STATES_ID_GROUP:
            var g = this.curState.group;
            g.resetSelection();
            this.resetSelection();
            g.parent.GoTo_Text();
            this.document.Add_InlineImage(W, H, Img, Chart, bFlow);
            break;
        default:
            var sel_arr = this.selectionInfo.selectionArray;
            if (sel_arr.length > 0) {
                var top_obj = sel_arr[0];
                for (var i = 1; i < sel_arr.length; ++i) {
                    var cur_obj = sel_arr[i];
                    var par = cur_obj.Parent;
                    if (cur_obj.pageIndex < top_obj.pageIndex) {
                        top_obj = cur_obj;
                    } else {
                        if (cur_obj.pageIndex === top_obj.pageIndex) {
                            if (cur_obj.Parent.Y < top_obj.Parent.Y) {
                                top_obj = cur_obj;
                            }
                        }
                    }
                }
                this.resetSelection();
                top_obj.GoTo_Text();
                this.document.Add_InlineImage(W, H, Img, Chart, bFlow);
            }
            break;
        }
    },
    addInlineTable: function (Cols, Rows) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.addInlineTable(Cols, Rows);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.addInlineTable === "function") {
                this.curState.textObject.addInlineTable(Cols, Rows);
            }
            break;
        case STATES_ID_GROUP:
            var g = this.curState.group;
            g.resetSelection();
            this.resetSelection();
            g.parent.GoTo_Text();
            this.document.Add_InlineTable(Cols, Rows);
            break;
        default:
            var sel_arr = this.selectionInfo.selectionArray;
            var top_obj = sel_arr[0];
            for (var i = 1; i < sel_arr.length; ++i) {
                var cur_obj = sel_arr[i];
                var par = cur_obj.Parent;
                if (cur_obj.pageIndex < top_obj.pageIndex) {
                    top_obj = cur_obj;
                } else {
                    if (cur_obj.pageIndex === top_obj.pageIndex) {
                        if (cur_obj.Parent.Y < top_obj.Parent.Y) {
                            top_obj = cur_obj;
                        }
                    }
                }
            }
            this.resetSelection();
            top_obj.GoTo_Text();
            this.document.Add_InlineTable(Cols, Rows);
            break;
        }
    },
    canAddComment: function () {
        return false;
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.canAddComment();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.canAddComment === "function") {
                return this.curState.textObject.canAddComment();
            }
        }
        return false;
    },
    addComment: function (commentData) {
        return;
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.addComment(commentData);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.addComment === "function") {
                this.curState.textObject.addComment(commentData);
            }
        }
    },
    documentIsSelectionLocked: function (CheckType) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.GraphicObj.textBoxContent.Document_Is_SelectionLocked(CheckType);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            this.curState.textObject.textBoxContent.Document_Is_SelectionLocked(CheckType);
        }
        switch (CheckType) {
        case changestype_Drawing_Props:
            case changestype_Image_Properties:
            case changestype_Delete:
            case changestype_Remove:
            case changestype_Paragraph_Content:
            case changestype_Document_Content_Add:
            var selection_array = this.selectionInfo.selectionArray;
            for (var i = 0; i < selection_array.length; ++i) {
                var par = selection_array[0].Parent;
                par.Lock.Check(par.Get_Id());
            }
            break;
        }
    },
    hyperlinkCheck: function (bCheckEnd) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.hyperlinkCheck(bCheckEnd);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.hyperlinkCheck === "function") {
                return this.curState.textObject.hyperlinkCheck(bCheckEnd);
            }
        }
        return null;
    },
    hyperlinkCanAdd: function (bCheckInHyperlink) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.hyperlinkCanAdd(bCheckInHyperlink);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.hyperlinkCanAdd === "function") {
                return this.curState.textObject.hyperlinkCanAdd(bCheckInHyperlink);
            }
        }
        return false;
    },
    hyperlinkRemove: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.hyperlinkRemove();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.hyperlinkRemove === "function") {
                return this.curState.textObject.hyperlinkRemove();
            }
        }
        return false;
    },
    hyperlinkModify: function (HyperProps) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.hyperlinkModify(HyperProps);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.hyperlinkModify === "function") {
                return this.curState.textObject.hyperlinkModify(HyperProps);
            }
        }
    },
    hyperlinkAdd: function (HyperProps) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.hyperlinkAdd(HyperProps);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.hyperlinkAdd === "function") {
                return this.curState.textObject.hyperlinkAdd(HyperProps);
            }
        }
    },
    isCurrentElementParagraph: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.isCurrentElementParagraph();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.isCurrentElementParagraph === "function") {
                return this.curState.textObject.isCurrentElementParagraph();
            }
        }
        return false;
    },
    isCurrentElementTable: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.isCurrentElementTable();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.isCurrentElementTable === "function") {
                return this.curState.textObject.isCurrentElementTable();
            }
        }
        return false;
    },
    getCurrentPageAbsolute: function () {
        if (isRealObject(this.majorGraphicObject)) {
            return this.majorGraphicObject.PageNum;
        }
        var selection_arr = this.selectionInfo.selectionArray;
        if (selection_arr[0].length > 0) {
            return selection_arr[0].PageNum;
        }
        return 0;
    },
    createGraphicPage: function (pageIndex) {
        if (!isRealObject(this.graphicPages[pageIndex])) {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
    },
    resetDrawingArrays: function (pageIndex, docContent) {
        if (isRealObject(this.graphicPages[pageIndex])) {
            this.graphicPages[pageIndex].resetDrawingArrays(docContent);
        }
    },
    onEndRecalculateDocument: function (pagesCount) {
        for (var i = 0; i < pagesCount; ++i) {
            if (!isRealObject(this.graphicPages[i])) {
                this.graphicPages[i] = new CGraphicPage(i, this);
            }
        }
        if (this.graphicPages.length > pagesCount) {
            for (i = pagesCount; i < this.graphicPages.length; ++i) {
                delete this.graphicPages[i];
            }
        }
    },
    documentStatistics: function (CurPage, Statistics) {
        this.graphicPages[CurPage].documentStatistics(Statistics);
    },
    setSelectionState: function (state, stateIndex) {
        var selection_state = state[stateIndex];
        this.arrPreTrackObjects.length = 0;
        this.arrTrackObjects.length = 0;
        if (this.curState.id === STATES_ID_GROUP) {
            var gr_sel_arr = this.curState.group.selectionInfo.selectionArray;
            for (var i = 0; i < gr_sel_arr.length; ++i) {
                gr_sel_arr[i].deselect();
            }
            gr_sel_arr.length = 0;
        }
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            if (isRealObject(this.curState.textObject) && isRealObject(this.curState.textObject.GraphicObj) && isRealObject(this.curState.textObject.GraphicObj.textBoxContent)) {
                this.curState.textObject.GraphicObj.textBoxContent.Selection_Remove();
            }
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (isRealObject(this.curState.textObject) && isRealObject(this.curState.textObject.textBoxContent)) {
                this.curState.textObject.textBoxContent.Selection_Remove();
            }
        }
        switch (selection_state.stateId) {
        case STATES_ID_TEXT_ADD:
            this.curState = new TextAddState(this, selection_state.textObject);
            var selection_arr = this.selectionInfo.selectionArray;
            for (var i = 0; i < selection_arr.length; ++i) {
                selection_arr[i].deselect();
            }
            selection_state.textObject.select();
            selection_arr.length = 0;
            selection_arr.push(selection_state.textObject);
            selection_state.textObject.GraphicObj.textBoxContent.Set_SelectionState(selection_state.textSelectionState, selection_state.textSelectionState.length - 1);
            selection_state.textObject.GraphicObj.select(selection_state.selectStartPage);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            this.curState = new TextAddInGroup(this, selection_state.textObject, selection_state.group);
            var selection_arr = this.selectionInfo.selectionArray;
            for (var i = 0; i < selection_arr.length; ++i) {
                selection_arr[i].deselect();
            }
            selection_arr.length = 0;
            selection_state.group.select(selection_state.groupSelectStartPage);
            selection_arr.push(selection_state.group.parent);
            selection_arr = selection_state.group.selectionInfo.selectionArray;
            for (i = 0; i < selection_arr.length; ++i) {
                selection_arr[i].deselect();
            }
            selection_state.textObject.select(selection_state.selectStartPage);
            selection_arr.length = 0;
            selection_arr.push(selection_state.textObject);
            selection_state.textObject.textBoxContent.Set_SelectionState(selection_state.textSelectionState, selection_state.textSelectionState.length - 1);
            break;
        case STATES_ID_GROUP:
            this.curState = new GroupState(this, selection_state.group.parent);
            var selection_arr = this.selectionInfo.selectionArray;
            for (var i = 0; i < selection_arr.length; ++i) {
                selection_arr[i].deselect();
            }
            selection_arr.length = 0;
            selection_state.group.select(selection_state.groupSelectStartPage);
            selection_arr.push(selection_state.group.parent);
            selection_arr = selection_state.group.selectionInfo.selectionArray;
            for (i = 0; i < selection_arr.length; ++i) {
                selection_arr[i].deselect();
            }
            selection_arr.length = 0;
            for (var j = 0; j < selection_state.selectionArray.length; ++j) {
                selection_state.selectionArray[j].select(selection_state.selectStartPages[j]);
                selection_arr.push(selection_state.selectionArray[j]);
            }
            break;
        case STATES_ID_START_CHANGE_WRAP:
            var selection_arr = this.selectionInfo.selectionArray;
            for (var i = 0; i < selection_arr.length; ++i) {
                selection_arr[i].deselect();
            }
            selection_arr.length = 0;
            for (j = 0; j < selection_state.selectionArray.length; ++j) {
                selection_state.selectionArray[j].select(selection_state.selectStartPages[j]);
                selection_arr.push(selection_state.selectionArray[j]);
            }
            this.changeCurrentState(new StartChangeWrapContourState(this, selection_arr[0]));
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            var selection_arr = this.selectionInfo.selectionArray;
            selection_arr.push(selection_state.chart);
            selection_state.chart.select(selection_state.selectStartPage);
            selection_state.title.select(selection_state.selectStartPage);
            this.changeCurrentState(new TextAddInChartTitle(this, selection_state.chart, selection_state.title));
            selection_state.title.txBody.content.Set_SelectionState(selection_state.textSelectionState, selection_state.textSelectionState.length - 1);
            break;
        case STATES_ID_CHART:
            var selection_arr = this.selectionInfo.selectionArray;
            selection_arr.push(selection_state.chart);
            selection_state.chart.select(selection_state.selectStartPage);
            if (isRealObject(selection_state.selectedTitle)) {
                selection_state.selectedTitle.select(selection_state.selectStartPage);
            }
            this.changeCurrentState(new ChartState(this, selection_state.chart));
            break;
        case STATES_ID_CHART_GROUP:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            selection_state.group.select(selection_state.selectStartPage);
            selection_state.chart.select(selection_state.selectStartPage);
            this.selectionInfo.selectionArray.push(selection_state.group);
            selection_state.group.GraphicObj.selectionInfo.selectionArray.length = 0;
            selection_state.group.GraphicObj.selectionInfo.selectionArray.push(selection_state.chart);
            selection_state.chart.select(selection_state.selectStartPage);
            if (selection_state.selectedTitle) {
                selection_state.selectedTitle.select(selection_state.selectStartPage);
            }
            if (selection_state.stateId === STATES_ID_CHART_TITLE_TEXT_GROUP) {
                selection_state.selectedTitle.txBody.content.Set_SelectionState(selection_state.textSelectionState, selection_state.textSelectionState.length - 1);
                this.changeCurrentState(new TextAddInChartTitleGroup(this, selection_state.group, selection_state.chart, selection_state.selectedTitle));
            } else {
                this.changeCurrentState(new ChartGroupState(this, selection_state.group, selection_state.chart));
            }
            break;
        default:
            var selection_arr = this.selectionInfo.selectionArray;
            for (var i = 0; i < selection_arr.length; ++i) {
                selection_arr[i].deselect();
            }
            selection_arr.length = 0;
            for (j = 0; j < selection_state.selectionArray.length; ++j) {
                selection_state.selectionArray[j].select(selection_state.selectStartPages[j]);
                selection_arr.push(selection_state.selectionArray[j]);
            }
            this.changeCurrentState(new NullState(this));
            break;
        }
    },
    getSelectionState: function () {
        var selection_state = {};
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            selection_state.stateId = STATES_ID_TEXT_ADD;
            selection_state.textObject = this.curState.textObject;
            selection_state.textSelectionState = this.curState.textObject.GraphicObj.textBoxContent.Get_SelectionState();
            selection_state.selectStartPage = this.curState.textObject.GraphicObj.selectStartPage;
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            selection_state.stateId = STATES_ID_TEXT_ADD_IN_GROUP;
            selection_state.group = this.curState.group;
            selection_state.groupSelectStartPage = this.curState.group.selectStartPage;
            selection_state.textObject = this.curState.textObject;
            selection_state.textSelectionState = this.curState.textObject.textBoxContent.Get_SelectionState();
            selection_state.selectStartPage = this.curState.textObject.selectStartPage;
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            selection_state.stateId = STATES_ID_CHART_TITLE_TEXT;
            selection_state.chart = this.curState.chart;
            selection_state.title = this.curState.title;
            selection_state.textSelectionState = this.curState.title.txBody.content.Get_SelectionState();
            selection_state.selectStartPage = this.curState.chart.GraphicObj.selectStartPage;
            break;
        case STATES_ID_GROUP:
            selection_state.stateId = STATES_ID_GROUP;
            selection_state.group = this.curState.group;
            selection_state.groupSelectStartPage = this.curState.group.selectStartPage;
            selection_state.selectionArray = [];
            selection_state.selectStartPages = [];
            var cur_selection_array = this.curState.group.selectionInfo.selectionArray;
            for (var i = 0; i < cur_selection_array.length; ++i) {
                selection_state.selectionArray.push(cur_selection_array[i]);
                selection_state.selectStartPages.push(cur_selection_array[i].selectStartPage);
            }
            break;
        default:
            if (isRealObject(this.curState.chart) && !isRealObject(this.curState.group)) {
                selection_state.stateId = STATES_ID_CHART;
                selection_state.chart = this.curState.chart;
                selection_state.selectStartPage = this.curState.chart.GraphicObj.selectStartPage;
                var selected_title;
                if (this.curState.chart.GraphicObj && this.curState.chart.GraphicObj.chartTitle && this.curState.chart.GraphicObj.chartTitle.selected) {
                    selected_title = this.curState.chart.GraphicObj.chartTitle;
                } else {
                    if (this.curState.chart.GraphicObj && this.curState.chart.GraphicObj.hAxisTitle && this.curState.chart.GraphicObj.hAxisTitle.selected) {
                        selected_title = this.curState.chart.GraphicObj.hAxisTitle;
                    } else {
                        if (this.curState.chart.GraphicObj && this.curState.chart.GraphicObj.vAxisTitle && this.curState.chart.GraphicObj.vAxisTitle.selected) {
                            selected_title = this.curState.chart.GraphicObj.vAxisTitle;
                        }
                    }
                }
                selection_state.selectedTitle = selected_title;
                break;
            } else {
                if (isRealObject(this.curState.group) && !isRealObject(this.curState.chart)) {
                    selection_state.stateId = STATES_ID_GROUP;
                    selection_state.group = this.curState.group;
                    selection_state.groupSelectStartPage = this.curState.group.selectStartPage;
                    selection_state.selectionArray = [];
                    selection_state.selectStartPages = [];
                    var cur_selection_array = this.curState.group.selectionInfo.selectionArray;
                    for (var i = 0; i < cur_selection_array.length; ++i) {
                        selection_state.selectionArray.push(cur_selection_array[i]);
                        selection_state.selectStartPages.push(cur_selection_array[i].selectStartPage);
                    }
                } else {
                    if (isRealObject(this.curState.chart) && isRealObject(this.curState.group)) {
                        selection_state.stateId = this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP ? STATES_ID_CHART_TITLE_TEXT_GROUP : STATES_ID_CHART_GROUP;
                        selection_state.chart = this.curState.chart;
                        selection_state.group = this.curState.group;
                        selection_state.selectStartPage = this.curState.group.selectStartPage;
                        selection_state.selectedTitle = this.curState.chart.getSelectedTitle();
                        if (this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP) {
                            selection_state.textSelectionState = this.curState.textObject.txBody.content.Get_SelectionState();
                        }
                    } else {
                        if (this.curState.wordGraphicObject) {
                            selection_state.stateId = STATES_ID_START_CHANGE_WRAP;
                        } else {
                            selection_state.stateId = STATES_ID_NULL;
                        }
                        selection_state.selectionArray = [];
                        selection_state.selectStartPages = [];
                        cur_selection_array = this.selectionInfo.selectionArray;
                        for (i = 0; i < cur_selection_array.length; ++i) {
                            selection_state.selectionArray.push(cur_selection_array[i]);
                            selection_state.selectStartPages.push(cur_selection_array[i].GraphicObj.selectStartPage);
                        }
                        break;
                    }
                }
            }
        }
        return [selection_state];
    },
    documentUpdateSelectionState: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            this.curState.textObject.updateSelectionState();
        } else {
            if (this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP || this.curState.id === STATES_ID_CHART_TITLE_TEXT) {
                this.curState.title.updateSelectionState();
            } else {
                this.drawingDocument.SelectClear();
                this.drawingDocument.TargetEnd();
            }
        }
        this.updateSelectionState();
    },
    getMajorParaDrawing: function () {
        return this.selectionInfo.selectionArray.length > 0 ? this.selectionInfo.selectionArray[0] : null;
    },
    documentUpdateRulersState: function () {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.GraphicObj.documentUpdateRulersState();
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            this.curState.textObject.documentUpdateRulersState();
            break;
        case STATES_ID_GROUP:
            var group = this.curState.group;
            if (group.selectionInfo.selectionArray.length === 1 && group.selectionInfo.selectionArray[0] instanceof WordShape) {
                group.selectionInfo.selectionArray[0].documentUpdateRulersState();
            }
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            break;
        default:
            if (this.selectionInfo.selectionArray.length === 1 && this.selectionInfo.selectionArray[0].GraphicObj instanceof WordShape) {
                this.selectionInfo.selectionArray[0].GraphicObj.documentUpdateRulersState();
            }
        }
    },
    documentUpdateInterfaceState: function () {
        var flag = false;
        if (this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP || this.curState.id === STATES_ID_CHART_TITLE_TEXT) {
            flag = true;
        } else {
            if (this.curState.id != STATES_ID_GROUP) {
                var s_arr2 = this.selectionInfo.selectionArray;
                if (s_arr2.length === 1 && s_arr2[0].GraphicObj instanceof WordShape && !isRealObject(s_arr2[0].GraphicObj.textBoxContent)) {
                    flag = true;
                }
                for (var i = 0; i < this.selectionInfo.selectionArray.length; ++i) {
                    if (this.selectionInfo.selectionArray[i].GraphicObj.isShape() && this.selectionInfo.selectionArray[i].GraphicObj.textBoxContent) {
                        flag = true;
                        break;
                    }
                }
            } else {
                var gr_sel_array = this.curState.group.selectionInfo.selectionArray;
                for (var i = 0; i < gr_sel_array.length; ++i) {
                    if (gr_sel_array[i].isShape() && gr_sel_array[i].textBoxContent) {
                        flag = true;
                        break;
                    }
                }
            }
        }
        if (flag) {
            var cur_state = this.curState;
            switch (this.curState.id) {
            case STATES_ID_TEXT_ADD:
                var text_object = cur_state.textObject;
                if (text_object != null && text_object.GraphicObj != null && text_object.GraphicObj.textBoxContent != null) {
                    text_object.GraphicObj.textBoxContent.Document_UpdateInterfaceState();
                }
                break;
            case STATES_ID_TEXT_ADD_IN_GROUP:
                text_object = cur_state.textObject;
                if (text_object != null && text_object.textBoxContent != null) {
                    text_object.textBoxContent.Document_UpdateInterfaceState();
                }
                break;
            default:
                var para_pr = this.getParagraphParaPr();
                if (this.selectionInfo.selectionArray.length === 1 && this.selectionInfo.selectionArray[0].GraphicObj instanceof WordShape && !isRealObject(this.selectionInfo.selectionArray[0].GraphicObj.textBoxContent)) {
                    if (isRealObject(this.selectionInfo.selectionArray[0].Parent) && typeof this.selectionInfo.selectionArray[0].Parent.Get_CompiledPr2 === "function") {
                        var para_pr2 = this.selectionInfo.selectionArray[0].Parent.Get_CompiledPr2(false).ParaPr;
                        if (isRealObject(para_pr2) && isRealObject(para_pr2.Ind)) {
                            para_pr.Ind = para_pr2.Ind;
                        }
                    }
                }
                editor.UpdateParagraphProp(para_pr);
                editor.UpdateTextPr(this.getParagraphTextPr());
                break;
            }
        }
    },
    isNeedUpdateRulers: function () {
        if (this.selectionInfo.selectionArray.length === 1 && isRealObject(this.selectionInfo.selectionArray[0]) && isRealObject(this.selectionInfo.selectionArray[0].GraphicObj) && isRealObject(this.selectionInfo.selectionArray[0].GraphicObj.textBoxContent)) {
            return true;
        }
        return false;
    },
    documentCreateFontCharMap: function (FontCharMap) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.documentCreateFontCharMap(FontCharMap);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.documentCreateFontCharMap === "function") {
                return this.curState.textObject.documentCreateFontCharMap(FontCharMap);
            }
        }
    },
    documentCreateFontMap: function (FontCharMap) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.documentCreateFontMap(FontCharMap);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.documentCreateFontMap === "function") {
                return this.curState.textObject.documentCreateFontMap(FontCharMap);
            }
        }
    },
    tableCheckSplit: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableCheckSplit();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableCheckSplit === "function") {
                return this.curState.textObject.tableCheckSplit();
            }
        }
        return false;
    },
    tableCheckMerge: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableCheckMerge();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableCheckMerge === "function") {
                return this.curState.textObject.tableCheckMerge();
            }
        }
        return false;
    },
    tableSelect: function (Type) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableSelect(Type);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableSelect === "function") {
                return this.curState.textObject.tableSelect(Type);
            }
        }
    },
    tableRemoveTable: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableRemoveTable();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableRemoveTable === "function") {
                return this.curState.textObject.tableRemoveTable();
            }
        }
    },
    tableSplitCell: function (Cols, Rows) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableSplitCell(Cols, Rows);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableSplitCell === "function") {
                return this.curState.textObject.tableSplitCell(Cols, Rows);
            }
        }
    },
    tableMergeCells: function (Cols, Rows) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableMergeCells(Cols, Rows);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableMergeCells === "function") {
                return this.curState.textObject.tableMergeCells(Cols, Rows);
            }
        }
    },
    tableRemoveCol: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableRemoveCol();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableRemoveCol === "function") {
                return this.curState.textObject.tableRemoveCol();
            }
        }
    },
    tableAddCol: function (bBefore) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableAddCol(bBefore);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableAddCol === "function") {
                return this.curState.textObject.tableAddCol(bBefore);
            }
        }
    },
    tableRemoveRow: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableRemoveRow();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableRemoveRow === "function") {
                return this.curState.textObject.tableRemoveRow();
            }
        }
    },
    tableAddRow: function (bBefore) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.tableAddRow(bBefore);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.tableAddRow === "function") {
                return this.curState.textObject.tableAddRow(bBefore);
            }
        }
    },
    documentSearch: function (CurPage, String, search_Common) {
        this.graphicPages[CurPage].documentSearch(String, search_Common);
    },
    getSelectedElementsInfo: function (Info) {
        if (this.selectionInfo.selectionArray.length === 0) {
            Info.Set_Drawing(-1);
        } else {
            switch (this.curState.id) {
            case STATES_ID_TEXT_ADD:
                Info.Set_Drawing(selected_DrawingObjectText);
                this.curState.textObject.GraphicObj.textBoxContent.Get_SelectedElementsInfo(Info);
                break;
            case STATES_ID_TEXT_ADD_IN_GROUP:
                Info.Set_Drawing(selected_DrawingObjectText);
                this.curState.textObject.textBoxContent.Get_SelectedElementsInfo(Info);
                break;
            default:
                Info.Set_Drawing(selected_DrawingObject);
                break;
            }
        }
        return Info;
    },
    selectNextObject: function (direction) {
        var selection_array = this.selectionInfo.selectionArray;
        if (selection_array.length > 0) {
            if (direction > 0) {
                if (this.curState.id === STATES_ID_GROUP) {
                    var group = this.curState.group;
                    var group_selection_array = group.selectionInfo.selectionArray;
                    if (group_selection_array.length > 0) {
                        var last_selected_object = group_selection_array[group_selection_array.length - 1];
                        var group_sp_tree = group.spTree;
                        for (var sp_index = 0; sp_index < group_sp_tree.length; ++sp_index) {
                            if (last_selected_object === group_sp_tree[sp_index]) {
                                break;
                            }
                        }
                        if (sp_index < group_sp_tree.length - 1) {
                            for (var i = 0; i < group_selection_array.length; ++i) {
                                group_selection_array[i].deselect();
                            }
                            group_selection_array.length = 0;
                            group_selection_array.push(group_sp_tree[sp_index + 1]);
                            group_sp_tree[sp_index + 1].select();
                            this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                            return;
                        } else {
                            for (i = 0; i < group_selection_array.length; ++i) {
                                group_selection_array[i].deselect();
                            }
                            group_selection_array.length = 0;
                            var group_array_type = this.curState.groupWordGO.getDrawingArrayType();
                            this.curState.group.deselect();
                            var graphic_page = this.graphicPages[this.curState.groupWordGO.getPageIndex()];
                            var graphic_arrays = [graphic_page.behindDocObjects, graphic_page.wrappingObjects, graphic_page.inlineObjects, graphic_page.beforeTextObjects];
                            var start_array_index;
                            switch (group_array_type) {
                            case DRAWING_ARRAY_TYPE_BEFORE:
                                start_array_index = 3;
                                break;
                            case DRAWING_ARRAY_TYPE_INLINE:
                                start_array_index = 2;
                                break;
                            case DRAWING_ARRAY_TYPE_WRAPPING:
                                start_array_index = 1;
                                break;
                            case DRAWING_ARRAY_TYPE_BEHIND:
                                start_array_index = 0;
                                break;
                            }
                            var start_array = graphic_arrays[start_array_index];
                            for (var j = 0; j < start_array.length; ++j) {
                                if (start_array[j] === this.curState.groupWordGO) {
                                    break;
                                }
                            }
                            if (j < start_array.length - 1) {
                                for (i = 0; i < selection_array.length; ++i) {
                                    selection_array[i].deselect();
                                }
                                selection_array.length = 0;
                                start_array[j + 1].select();
                                selection_array.push(start_array[j + 1]);
                                this.changeCurrentState(new NullState(this));
                                this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                                return;
                            } else {
                                for (var t = 1; t < 5; ++t) {
                                    var index = (start_array_index + t) % 4;
                                    var cur_array = graphic_arrays[index];
                                    if (cur_array.length > 0) {
                                        for (i = 0; i < selection_array.length; ++i) {
                                            selection_array[i].deselect();
                                        }
                                        selection_array.length = 0;
                                        cur_array[0].select();
                                        selection_array.push(cur_array[0]);
                                        this.changeCurrentState(new NullState(this));
                                        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    last_selected_object = selection_array[selection_array.length - 1];
                    if (!last_selected_object.isGroup()) {
                        var array_type = last_selected_object.getDrawingArrayType();
                        last_selected_object.deselect();
                        graphic_page = this.graphicPages[last_selected_object.getPageIndex()];
                        graphic_arrays = [graphic_page.behindDocObjects, graphic_page.wrappingObjects, graphic_page.inlineObjects, graphic_page.beforeTextObjects];
                        switch (array_type) {
                        case DRAWING_ARRAY_TYPE_BEFORE:
                            start_array_index = 3;
                            break;
                        case DRAWING_ARRAY_TYPE_INLINE:
                            start_array_index = 2;
                            break;
                        case DRAWING_ARRAY_TYPE_WRAPPING:
                            start_array_index = 1;
                            break;
                        case DRAWING_ARRAY_TYPE_BEHIND:
                            start_array_index = 0;
                            break;
                        }
                        start_array = graphic_arrays[start_array_index];
                        for (j = 0; j < start_array.length; ++j) {
                            if (start_array[j] === last_selected_object) {
                                break;
                            }
                        }
                        if (j < start_array.length - 1) {
                            for (i = 0; i < selection_array.length; ++i) {
                                selection_array[i].deselect();
                            }
                            selection_array.length = 0;
                            start_array[j + 1].select();
                            selection_array.push(start_array[j + 1]);
                            this.changeCurrentState(new NullState(this));
                            this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                            return;
                        } else {
                            for (t = 1; t < 5; ++t) {
                                index = (start_array_index + t) % 4;
                                cur_array = graphic_arrays[index];
                                if (cur_array.length > 0) {
                                    for (i = 0; i < selection_array.length; ++i) {
                                        selection_array[i].deselect();
                                    }
                                    selection_array.length = 0;
                                    cur_array[0].select();
                                    selection_array.push(cur_array[0]);
                                    this.changeCurrentState(new NullState(this));
                                    this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                                    return;
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < selection_array.length; ++i) {
                            selection_array[i].deselect();
                        }
                        selection_array.length = 0;
                        last_selected_object.select();
                        selection_array.push(last_selected_object);
                        var gr_sel_arr = last_selected_object.GraphicObj.selectionInfo.selectionArray;
                        for (i = 0; i < gr_sel_arr.length; ++i) {
                            gr_sel_arr[i].deselect();
                        }
                        gr_sel_arr.length = 0;
                        this.changeCurrentState(new GroupState(this, last_selected_object));
                        last_selected_object.GraphicObj.spTree[0].select();
                        gr_sel_arr.push(last_selected_object.GraphicObj.spTree[0]);
                        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                        return;
                    }
                }
            } else {
                if (this.curState.id === STATES_ID_GROUP) {
                    var group = this.curState.group;
                    var group_selection_array = group.selectionInfo.selectionArray;
                    if (group_selection_array.length > 0) {
                        var last_selected_object = group_selection_array[0];
                        var group_sp_tree = group.spTree;
                        for (var sp_index = 0; sp_index < group_sp_tree.length; ++sp_index) {
                            if (last_selected_object === group_sp_tree[sp_index]) {
                                break;
                            }
                        }
                        if (sp_index > 0) {
                            for (var i = 0; i < group_selection_array.length; ++i) {
                                group_selection_array[i].deselect();
                            }
                            group_selection_array.length = 0;
                            group_selection_array.push(group_sp_tree[sp_index - 1]);
                            group_sp_tree[sp_index - 1].select();
                            this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                            return;
                        } else {
                            for (i = 0; i < group_selection_array.length; ++i) {
                                group_selection_array[i].deselect();
                            }
                            group_selection_array.length = 0;
                            var group_array_type = this.curState.groupWordGO.getDrawingArrayType();
                            this.curState.group.deselect();
                            var graphic_page = this.graphicPages[this.curState.groupWordGO.getPageIndex()];
                            var graphic_arrays = [graphic_page.behindDocObjects, graphic_page.wrappingObjects, graphic_page.inlineObjects, graphic_page.beforeTextObjects];
                            var start_array_index;
                            switch (group_array_type) {
                            case DRAWING_ARRAY_TYPE_BEFORE:
                                start_array_index = 3;
                                break;
                            case DRAWING_ARRAY_TYPE_INLINE:
                                start_array_index = 2;
                                break;
                            case DRAWING_ARRAY_TYPE_WRAPPING:
                                start_array_index = 1;
                                break;
                            case DRAWING_ARRAY_TYPE_BEHIND:
                                start_array_index = 0;
                                break;
                            }
                            var start_array = graphic_arrays[start_array_index];
                            for (var j = 0; j < start_array.length; ++j) {
                                if (start_array[j] === this.curState.groupWordGO) {
                                    break;
                                }
                            }
                            if (j > 0) {
                                for (i = 0; i < selection_array.length; ++i) {
                                    selection_array[i].deselect();
                                }
                                selection_array.length = 0;
                                start_array[j - 1].select();
                                selection_array.push(start_array[j - 1]);
                                this.changeCurrentState(new NullState(this));
                                this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                                return;
                            } else {
                                for (var t = 1; t < 5; ++t) {
                                    var index = (start_array_index - t + 12) % 4;
                                    var cur_array = graphic_arrays[index];
                                    if (cur_array.length > 0) {
                                        for (i = 0; i < selection_array.length; ++i) {
                                            selection_array[i].deselect();
                                        }
                                        selection_array.length = 0;
                                        cur_array[cur_array.length - 1].select();
                                        selection_array.push(cur_array[cur_array.length - 1]);
                                        this.changeCurrentState(new NullState(this));
                                        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                                        return;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    last_selected_object = selection_array[0];
                    if (!last_selected_object.isGroup()) {
                        var array_type = last_selected_object.getDrawingArrayType();
                        last_selected_object.deselect();
                        graphic_page = this.graphicPages[last_selected_object.getPageIndex()];
                        graphic_arrays = [graphic_page.behindDocObjects, graphic_page.wrappingObjects, graphic_page.inlineObjects, graphic_page.beforeTextObjects];
                        switch (array_type) {
                        case DRAWING_ARRAY_TYPE_BEFORE:
                            start_array_index = 3;
                            break;
                        case DRAWING_ARRAY_TYPE_INLINE:
                            start_array_index = 2;
                            break;
                        case DRAWING_ARRAY_TYPE_WRAPPING:
                            start_array_index = 1;
                            break;
                        case DRAWING_ARRAY_TYPE_BEHIND:
                            start_array_index = 0;
                            break;
                        }
                        start_array = graphic_arrays[start_array_index];
                        for (j = 0; j < start_array.length; ++j) {
                            if (start_array[j] === last_selected_object) {
                                break;
                            }
                        }
                        if (j > 0) {
                            for (i = 0; i < selection_array.length; ++i) {
                                selection_array[i].deselect();
                            }
                            selection_array.length = 0;
                            start_array[j - 1].select();
                            selection_array.push(start_array[j - 1]);
                            this.changeCurrentState(new NullState(this));
                            this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                            return;
                        } else {
                            for (t = 1; t < 5; ++t) {
                                index = (start_array_index - t + 12) % 4;
                                cur_array = graphic_arrays[index];
                                if (cur_array.length > 0) {
                                    for (i = 0; i < selection_array.length; ++i) {
                                        selection_array[i].deselect();
                                    }
                                    selection_array.length = 0;
                                    cur_array[cur_array.length - 1].select();
                                    selection_array.push(cur_array[cur_array.length - 1]);
                                    this.changeCurrentState(new NullState(this));
                                    this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                                    return;
                                }
                            }
                        }
                    } else {
                        for (i = 0; i < selection_array.length; ++i) {
                            selection_array[i].deselect();
                        }
                        selection_array.length = 0;
                        last_selected_object.select();
                        selection_array.push(last_selected_object);
                        var gr_sel_arr = last_selected_object.GraphicObj.selectionInfo.selectionArray;
                        for (i = 0; i < gr_sel_arr.length; ++i) {
                            gr_sel_arr[i].deselect();
                        }
                        gr_sel_arr.length = 0;
                        this.changeCurrentState(new GroupState(this, last_selected_object));
                        last_selected_object.GraphicObj.spTree[last_selected_object.GraphicObj.spTree.length - 1].select();
                        gr_sel_arr.push(last_selected_object.GraphicObj.spTree[last_selected_object.GraphicObj.spTree.length - 1]);
                        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
                        return;
                    }
                }
            }
        }
    },
    getCurrentParagraph: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.getCurrentParagraph();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.getCurrentParagraph === "function") {
                return this.curState.textObject.getCurrentParagraph();
            }
        }
        return null;
    },
    getSelectedText: function (bClearText) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.getSelectedText(bClearText);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.getSelectedText === "function") {
                return this.curState.textObject.getSelectedText(bClearText);
            }
        }
        return "";
    },
    getCurPosXY: function () {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            return this.curState.textObject.getCurPosXY();
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.getCurPosXY === "function") {
                return this.curState.textObject.getCurPosXY();
            }
            return {
                X: 0,
                Y: 0
            };
        default:
            if (this.selectionInfo.selectionArray.length === 1) {
                return {
                    X: this.selectionInfo.selectionArray[0].X,
                    Y: this.selectionInfo.selectionArray[0].Y
                };
            }
            return {
                X: 0,
                Y: 0
            };
        }
    },
    isTextSelectionUse: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.isTextSelectionUse();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.isTextSelectionUse === "function") {
                return this.curState.textObject.isTextSelectionUse();
            }
        }
        return false;
    },
    isTextAdd: function () {},
    isSelectionUse: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            return this.isTextSelectionUse();
        }
        return this.selectionInfo.selectionArray.length > 0;
    },
    paragraphFormatPaste: function (CopyTextPr, CopyParaPr, Bool) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.paragraphFormatPaste(CopyTextPr, CopyParaPr, Bool);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.paragraphFormatPaste === "function") {
                return this.curState.textObject.paragraphFormatPaste(CopyTextPr, CopyParaPr, Bool);
            }
        }
    },
    getHdrFtrObjectsByPageIndex: function (pageIndex) {
        if (pageIndex === 0) {
            return this.firstPage;
        }
        if (pageIndex % 2 === 1) {
            return this.evenPage;
        }
        return this.oddPage;
    },
    getNearestPos: function (x, y, pageIndex, drawing) {
        if (isRealObject(drawing) && isRealObject(drawing.GraphicObj) && (drawing.GraphicObj.isShape() || drawing.GraphicObj.isGroup())) {
            return null;
        }
        var cur_array;
        var hit_in_text, b_hit_text;
        var object_arrays;
        if (this.document.CurPos.Type !== docpostype_HdrFtr) {
            var page = this.graphicPages[pageIndex];
            object_arrays = [page.beforeTextObjects, page.inlineObjects, page.wrappingObjects, page.behindDocObjects];
        } else {
            var hdr_ftr_gr_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
            if (isRealObject(hdr_ftr_gr_objects)) {
                object_arrays = [hdr_ftr_gr_objects.beforeTextArray, hdr_ftr_gr_objects.inlineArray, hdr_ftr_gr_objects.wrappingArray, hdr_ftr_gr_objects.behindDocArray];
            }
        }
        if (isRealObject(object_arrays)) {
            for (var j = 0; j < 4; ++j) {
                cur_array = object_arrays[j];
                for (var i = cur_array.length - 1; i > -1; --i) {
                    var cur_object = cur_array[i];
                    hit_in_text = cur_array[i].hitToTextRect(x, y, pageIndex);
                    if (cur_object.isGroup()) {
                        b_hit_text = hit_in_text.hit;
                    } else {
                        b_hit_text = hit_in_text;
                    }
                    if (b_hit_text) {
                        return cur_object.getNearestPos(x, y, pageIndex);
                    }
                }
            }
        }
        return null;
    },
    selectionCheck: function (X, Y, Page_Abs) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            var textObject = this.curState.textObject;
            if (isRealObject(textObject) && isRealObject(textObject.GraphicObj) && typeof textObject.GraphicObj.selectionCheck === "function") {
                return textObject.GraphicObj.selectionCheck(X, Y, Page_Abs);
            }
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            textObject = this.curState.textObject;
            if (isRealObject(textObject) && typeof textObject.selectionCheck === "function") {
                return textObject.selectionCheck(X, Y, Page_Abs);
            }
            break;
        }
        return false;
    },
    getParagraphParaPrCopy: function () {
        return this.getParagraphParaPr();
    },
    getParagraphTextPrCopy: function () {
        return this.getParagraphTextPr();
    },
    getParagraphParaPr: function () {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            var pr = this.curState.textObject.getParagraphParaPr();
            if (pr != null) {
                return pr;
            } else {
                return new CParaPr();
            }
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.getParagraphParaPr === "function") {
                pr = this.curState.textObject.getParagraphParaPr();
                if (pr != null) {
                    return pr;
                }
                return new CParaPr();
            }
            return new CParaPr();
        case STATES_ID_CHART_TITLE_TEXT:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            var parapr = this.curState.title.getParagraphParaPr();
            return parapr ? parapr : new CParaPr();
        default:
            var result = null;
            var selection_array = this.selectionInfo.selectionArray;
            for (var i = 0; i < selection_array.length; ++i) {
                var cur_pr = selection_array[i].getAllParagraphParaPr();
                if (cur_pr != null) {
                    if (result == null) {
                        result = cur_pr;
                    } else {
                        result = result.Compare(cur_pr);
                    }
                }
            }
            if (result != null) {
                return result;
            }
            return new CParaPr();
        }
        return new CParaPr();
    },
    getParagraphTextPr: function () {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            var pr = this.curState.textObject.getParagraphTextPr();
            if (pr != null) {
                return pr;
            }
            return new CTextPr();
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.getParagraphTextPr === "function") {
                pr = this.curState.textObject.getParagraphTextPr();
                if (pr != null) {
                    return pr;
                }
                return new CTextPr();
            }
            return new CTextPr();
        case STATES_ID_CHART_TITLE_TEXT:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            var parapr = this.curState.title.getParagraphTextPr();
            return parapr ? parapr : new CTextPr();
        default:
            var result = null;
            var selection_array = this.selectionInfo.selectionArray;
            for (var i = 0; i < selection_array.length; ++i) {
                var cur_pr = selection_array[i].getAllParagraphTextPr();
                if (cur_pr != null) {
                    if (result == null) {
                        result = cur_pr;
                    } else {
                        result = result.Compare(cur_pr);
                    }
                }
            }
            if (result != null) {
                return result;
            }
            return new CTextPr();
        }
        return new CTextPr();
    },
    isSelectedText: function () {
        return this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP || this.curState.id === STATES_ID_CHART_TITLE_TEXT || this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP;
    },
    selectAll: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.GraphicObj.textBoxContent.Select_All();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            this.curState.textObject.textBoxContent.Select_All();
        }
        if (this.curState.id === STATES_ID_CHART_TITLE_TEXT || this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP) {
            this.curState.title.txBody.content.Select_All();
        }
    },
    drawSelect: function (pageIndex) {
        var b_no_hdr_ftr_state = this.document.CurPos.Type !== docpostype_HdrFtr;
        switch (this.curState.id) {
        case STATES_ID_GROUP:
            case STATES_ID_PRE_CHANGE_ADJ_GROUPED:
            case STATES_ID_CHANGE_ADJ_GROUPED:
            case STATES_ID_MOVE_IN_GROUP:
            case STATES_ID_PRE_MOVE_IN_GROUP:
            case STATES_ID_PRE_ROTATE_IN_GROUP:
            case STATES_ID_ROTATE_IN_GROUP:
            case STATES_ID_PRE_RESIZE_GROUPED:
            case STATES_ID_RESIZE_GROUPED:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            case STATES_ID_PRE_RESIZE_IN_GROUP:
            case STATES_ID_RESIZE_IN_GROUP:
            case STATES_ID_CH_ADJ_IN_GROUP:
            case STATES_ID_PRE_CH_ADJ_IN_GROUP:
            case STATES_ID_PRE_ROTATE_IN_GROUP2:
            case STATES_ID_ROTATE_IN_GROUP2:
            var group = this.curState.group;
            if ((b_no_hdr_ftr_state && group.pageIndex === pageIndex) || (!b_no_hdr_ftr_state && group.selectStartPage === pageIndex)) {
                this.drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, group.getTransformMatrix(), 0, 0, group.absExtX, group.absExtY, false, group.canRotate());
                var selected_arr = group.selectionInfo.selectionArray;
                for (var i = 0; i < selected_arr.length; ++i) {
                    var cur_drawing = selected_arr[i];
                    this.drawingDocument.DrawTrack(this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP ? TYPE_TRACK_TEXT : TYPE_TRACK_SHAPE, cur_drawing.getTransformMatrix(), 0, 0, cur_drawing.absExtX, cur_drawing.absExtY, CheckLinePreset(cur_drawing.getPresetGeom()), cur_drawing.canRotate());
                }
                if (selected_arr.length === 1 && typeof selected_arr[0].drawAdjustments === "function") {
                    selected_arr[0].drawAdjustments();
                }
            }
            break;
        case STATES_ID_START_CHANGE_WRAP:
            case STATES_ID_PRE_CHANGE_WRAP:
            case STATES_ID_PRE_CHANGE_WRAP_ADD:
            case STATES_ID_PRE_CHANGE_WRAP_CONTOUR:
            if ((b_no_hdr_ftr_state && this.curState.wordGraphicObject.pageIndex === pageIndex) || (!b_no_hdr_ftr_state && this.curState.wordGraphicObject.GraphicObj.selectStartPage === pageIndex)) {
                this.drawingDocument.AutoShapesTrack.DrawEditWrapPointsPolygon(this.curState.wordGraphicObject.wrappingPolygon.arrPoints, new CMatrix());
            }
            break;
        case STATES_ID_TEXT_ADD:
            cur_drawing = this.curState.textObject;
            if (isRealObject(cur_drawing) && isRealObject(cur_drawing.GraphicObj) && ((b_no_hdr_ftr_state && cur_drawing.pageIndex === pageIndex) || (!b_no_hdr_ftr_state && cur_drawing.GraphicObj.selectStartPage === pageIndex))) {
                this.drawingDocument.DrawTrack(TYPE_TRACK_TEXT, cur_drawing.GraphicObj.getTransformMatrix(), 0, 0, cur_drawing.absExtX, cur_drawing.absExtY, CheckLinePreset(cur_drawing.GraphicObj.getPresetGeom()), cur_drawing.canRotate());
            }
            selected_arr = this.selectionInfo.selectionArray;
            if (selected_arr.length === 1 && typeof selected_arr[0].drawAdjustments === "function" && ((b_no_hdr_ftr_state && selected_arr[0].pageIndex === pageIndex) || (!b_no_hdr_ftr_state && isRealObject(selected_arr[0].GraphicObj) && selected_arr[0].GraphicObj.selectStartPage === pageIndex))) {
                selected_arr[0].drawAdjustments();
            }
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            var chart = this.curState.chart.GraphicObj;
            var title = this.curState.title;
            this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, chart.getTransformMatrix(), 0, 0, chart.absExtX, chart.absExtY, false, false);
            this.drawingDocument.DrawTrack(TYPE_TRACK_TEXT, title.transform, 0, 0, title.extX, title.extY, false, false);
            break;
        case STATES_ID_CHART:
            case STATES_ID_PRE_MOVE_CHART_TITLE:
            case STATES_ID_MOVE_CHART_TITLE:
            var chart = this.curState.chart.GraphicObj;
            var title = null;
            if (chart.chartTitle && chart.chartTitle.selected) {
                title = chart.chartTitle;
            } else {
                if (chart.hAxisTitle && chart.hAxisTitle.selected) {
                    title = chart.hAxisTitle;
                } else {
                    if (chart.vAxisTitle && chart.vAxisTitle.selected) {
                        title = chart.vAxisTitle;
                    }
                }
            }
            this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, chart.getTransformMatrix(), 0, 0, chart.absExtX, chart.absExtY, false, false);
            if (title) {
                this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, title.transform, 0, 0, title.extX, title.extY, false, false);
            }
            break;
        case STATES_ID_CHART_GROUP:
            case STATES_ID_PRE_MOVE_CHART_TITLE_GROUP:
            case STATES_ID_MOVE_CHART_TITLE_GROUP:
            this.drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.curState.group.GraphicObj.transform, 0, 0, this.curState.group.GraphicObj.absExtX, this.curState.group.GraphicObj.absExtY, false, this.curState.group.GraphicObj.canRotate());
            this.drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.curState.chart.transform, 0, 0, this.curState.chart.absExtX, this.curState.chart.absExtY, false, this.curState.chart.canRotate());
            var selected_title = this.curState.chart.getSelectedTitle();
            if (selected_title) {
                this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, selected_title.transform, 0, 0, selected_title.extX, selected_title.extY, false, false);
            }
            break;
        case STATES_ID_CHART_TITLE_TEXT_GROUP:
            this.drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.curState.group.GraphicObj.transform, 0, 0, this.curState.group.GraphicObj.absExtX, this.curState.group.GraphicObj.absExtY, false, this.curState.group.GraphicObj.canRotate());
            this.drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.curState.chart.transform, 0, 0, this.curState.chart.absExtX, this.curState.chart.absExtY, false, this.curState.chart.canRotate());
            this.drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.curState.title.transform, 0, 0, this.curState.title.extX, this.curState.title.extY, false, false);
            break;
        default:
            selected_arr = this.selectionInfo.selectionArray;
            for (i = 0; i < selected_arr.length; ++i) {
                cur_drawing = selected_arr[i].GraphicObj;
                if (isRealObject(cur_drawing) && ((b_no_hdr_ftr_state && cur_drawing.pageIndex === pageIndex) || (!b_no_hdr_ftr_state && cur_drawing.selectStartPage === pageIndex))) {
                    this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, cur_drawing.getTransformMatrix(), 0, 0, cur_drawing.absExtX, cur_drawing.absExtY, CheckLinePreset(cur_drawing.getPresetGeom()), cur_drawing.canRotate());
                }
            }
            if (selected_arr.length === 1 && typeof selected_arr[0].drawAdjustments === "function" && ((b_no_hdr_ftr_state && selected_arr[0].pageIndex === pageIndex) || (!b_no_hdr_ftr_state && isRealObject(selected_arr[0].GraphicObj) && selected_arr[0].GraphicObj.selectStartPage === pageIndex))) {
                selected_arr[0].drawAdjustments();
            }
            break;
        }
    },
    drawBehindDoc: function (pageIndex, graphics) {
        this.graphicPages[pageIndex].drawBehindDoc(graphics);
    },
    drawWrappingObjects: function (pageIndex, graphics) {
        this.graphicPages[pageIndex].drawWrappingObjects(graphics);
    },
    drawBeforeObjects: function (pageIndex, graphics) {
        this.graphicPages[pageIndex].drawBeforeObjects(graphics);
    },
    drawBehindDocHdrFtr: function (pageIndex, graphics) {
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if (hdr_footer_objects != null) {
            var behind_doc = hdr_footer_objects.behindDocArray;
            for (var i = 0; i < behind_doc.length; ++i) {
                behind_doc[i].draw(graphics, pageIndex);
            }
        }
    },
    drawWrappingObjectsHdrFtr: function (pageIndex, graphics) {
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if (hdr_footer_objects != null) {
            var wrap_arr = hdr_footer_objects.wrappingArray;
            for (var i = 0; i < wrap_arr.length; ++i) {
                wrap_arr[i].draw(graphics, pageIndex);
            }
        }
    },
    drawBeforeObjectsHdrFtr: function (pageIndex, graphics) {
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if (hdr_footer_objects != null) {
            var bef_arr = hdr_footer_objects.beforeTextArray;
            for (var i = 0; i < bef_arr.length; ++i) {
                bef_arr[i].draw(graphics, pageIndex);
            }
        }
    },
    setStartTrackPos: function (x, y, pageIndex) {
        this.startTrackPos.x = x;
        this.startTrackPos.y = y;
        this.startTrackPos.pageIndex = pageIndex;
    },
    sortSelectionArray: function () {
        this.selectionInfo.selectionArray.sort(ComparisonByZIndex);
    },
    needUpdateOverlay: function () {
        return this.arrTrackObjects.length > 0 || this.spline !== null || this.polyline !== null || (this.curState.id === STATES_ID_MOVE_INLINE_OBJECT && typeof this.curState.InlinePos.Page === "number") || isRealObject(this.curState.anchorPos) || isRealObject(this.curState.wordGraphicObject);
    },
    changeCurrentState: function (state) {
        this.curState = state;
    },
    canGroup: function () {
        var selection_array = this.selectionInfo.selectionArray;
        if (selection_array.length < 2) {
            return false;
        }
        if (!selection_array[0].canGroup()) {
            return false;
        }
        var first_page_index = selection_array[0].getPageIndex();
        for (var index = 1; index < selection_array.length; ++index) {
            if (!selection_array[index].canGroup()) {
                return false;
            }
            if (first_page_index !== selection_array[index].getPageIndex()) {
                return false;
            }
        }
        return true;
    },
    canUnGroup: function () {
        var _arr_selected_objects = this.selectionInfo.selectionArray;
        for (var _index = 0; _index < _arr_selected_objects.length; ++_index) {
            if (_arr_selected_objects[_index].isGroup() && !_arr_selected_objects[_index].Is_Inline()) {
                return true;
            }
        }
        return false;
    },
    addObjectOnPage: function (pageIndex, object) {
        if (!object.DocumentContent.Is_HdrFtr()) {
            if (!this.graphicPages[pageIndex]) {
                this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
                for (var z = 0; z < pageIndex; ++z) {
                    if (this.graphicPages[z]) {
                        this.graphicPages[z] = new CGraphicPage(z, this);
                    }
                }
            }
            var page = this.graphicPages[pageIndex];
            var array_type = object.getDrawingArrayType();
            switch (array_type) {
            case DRAWING_ARRAY_TYPE_INLINE:
                page.inlineObjects.push(object);
                break;
            case DRAWING_ARRAY_TYPE_BEHIND:
                page.behindDocObjects.push(object);
                page.behindDocObjects.sort(ComparisonByZIndexSimple);
                break;
            case DRAWING_ARRAY_TYPE_BEFORE:
                page.beforeTextObjects.push(object);
                page.beforeTextObjects.sort(ComparisonByZIndexSimple);
                break;
            case DRAWING_ARRAY_TYPE_WRAPPING:
                page.wrappingObjects.push(object);
                page.wrappingObjects.sort(ComparisonByZIndexSimple);
                break;
            }
        } else {
            if (isRealObject(object.Parent) && isRealObject(object.Parent.Parent) && isRealObject(object.Parent.Parent.Parent)) {
                var hdr_or_ftr = object.DocumentContent.Is_HdrFtr(true);
                var hdr_ftr_controller_content = this.document.HdrFtr.Content[0];
                var headers, footers;
                headers = hdr_ftr_controller_content.Header;
                footers = hdr_ftr_controller_content.Footer;
                var hdr_footer_objects;
                if (headers.First === hdr_or_ftr || footers.First === hdr_or_ftr) {
                    hdr_footer_objects = this.firstPage;
                }
                if (headers.Even === hdr_or_ftr || footers.Even === hdr_or_ftr) {
                    hdr_footer_objects = this.evenPage;
                }
                if (headers.Odd === hdr_or_ftr || footers.Odd === hdr_or_ftr) {
                    hdr_footer_objects = this.oddPage;
                }
                if (hdr_footer_objects != null) {
                    array_type = object.getDrawingArrayType();
                    switch (array_type) {
                    case DRAWING_ARRAY_TYPE_INLINE:
                        hdr_footer_objects.inlineArray.push(object);
                        break;
                    case DRAWING_ARRAY_TYPE_BEHIND:
                        hdr_footer_objects.behindDocArray.push(object);
                        hdr_footer_objects.behindDocArray.sort(ComparisonByZIndexSimple);
                        break;
                    case DRAWING_ARRAY_TYPE_BEFORE:
                        hdr_footer_objects.beforeTextArray.push(object);
                        hdr_footer_objects.beforeTextArray.sort(ComparisonByZIndexSimple);
                        break;
                    case DRAWING_ARRAY_TYPE_WRAPPING:
                        hdr_footer_objects.wrappingArray.push(object);
                        hdr_footer_objects.wrappingArray.sort(ComparisonByZIndexSimple);
                        break;
                    }
                }
            }
        }
    },
    cursorGetPos: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.cursorGetPos();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.cursorGetPos === "function") {
                return this.curState.textObject.cursorGetPos();
            }
        }
        return {
            X: 0,
            Y: 0
        };
    },
    getNewGroupPos: function () {
        var arrGraphicObjects = this.selectionInfo.selectionArray;
        var x_min, x_max, y_min, y_max;
        var cur_x_min, cur_x_max, cur_y_max, cur_y_min;
        for (var object_index = 0; object_index < arrGraphicObjects.length; object_index++) {
            arrGraphicObjects[object_index].deselect();
            var cur_graphic_object = arrGraphicObjects[object_index].GraphicObj;
            if (cur_graphic_object.isGroup()) {
                var cur_sp_tree = cur_graphic_object.spTree;
                for (var sp_index = 0; sp_index < cur_sp_tree.length; ++sp_index) {
                    var cur_sp = cur_sp_tree[sp_index];
                    var full_rot = cur_sp.absRot + cur_graphic_object.absRot;
                    var hc, vc;
                    var xc, yc;
                    hc = cur_sp.absExtX * 0.5;
                    vc = cur_sp.absExtY * 0.5;
                    xc = cur_sp.transform.TransformPointX(hc, vc);
                    yc = cur_sp.transform.TransformPointY(hc, vc);
                    if ((full_rot >= 0 && full_rot < Math.PI * 0.25) || (full_rot > 3 * Math.PI * 0.25 && full_rot < 5 * Math.PI * 0.25) || (full_rot > 7 * Math.PI * 0.25 && full_rot < 2 * Math.PI)) {
                        cur_x_min = xc - hc;
                        cur_x_max = xc + hc;
                        cur_y_min = yc - vc;
                        cur_y_max = yc + vc;
                    } else {
                        cur_x_min = xc - vc;
                        cur_x_max = xc + vc;
                        cur_y_min = yc - hc;
                        cur_y_max = yc + hc;
                    }
                    if (object_index === 0 && sp_index === 0) {
                        x_max = cur_x_max;
                        x_min = cur_x_min;
                        y_max = cur_y_max;
                        y_min = cur_y_min;
                    } else {
                        if (cur_x_max > x_max) {
                            x_max = cur_x_max;
                        }
                        if (cur_x_min < x_min) {
                            x_min = cur_x_min;
                        }
                        if (cur_y_max > y_max) {
                            y_max = cur_y_max;
                        }
                        if (cur_y_min < y_min) {
                            y_min = cur_y_min;
                        }
                    }
                }
            } else {
                full_rot = cur_graphic_object.absRot;
                hc = cur_graphic_object.absExtX * 0.5;
                vc = cur_graphic_object.absExtY * 0.5;
                xc = cur_graphic_object.transform.TransformPointX(hc, vc);
                yc = cur_graphic_object.transform.TransformPointY(hc, vc);
                if ((full_rot >= 0 && full_rot < Math.PI * 0.25) || (full_rot > 3 * Math.PI * 0.25 && full_rot < 5 * Math.PI * 0.25) || (full_rot > 7 * Math.PI * 0.25 && full_rot < 2 * Math.PI)) {
                    cur_x_min = xc - hc;
                    cur_x_max = xc + hc;
                    cur_y_min = yc - vc;
                    cur_y_max = yc + vc;
                } else {
                    cur_x_min = xc - vc;
                    cur_x_max = xc + vc;
                    cur_y_min = yc - hc;
                    cur_y_max = yc + hc;
                }
                if (object_index === 0) {
                    x_max = cur_x_max;
                    x_min = cur_x_min;
                    y_max = cur_y_max;
                    y_min = cur_y_min;
                } else {
                    if (cur_x_max > x_max) {
                        x_max = cur_x_max;
                    }
                    if (cur_x_min < x_min) {
                        x_min = cur_x_min;
                    }
                    if (cur_y_max > y_max) {
                        y_max = cur_y_max;
                    }
                    if (cur_y_min < y_min) {
                        y_min = cur_y_min;
                    }
                }
            }
        }
        return {
            x: x_min,
            y: y_min
        };
    },
    groupSelectedObjects: function () {
        if (this.selectionInfo.selectionArray.length > 0) {
            var page_num = this.selectionInfo.selectionArray[0].pageIndex;
            if (isRealObject(this.selectionInfo.selectionArray[0]) && isRealObject(this.selectionInfo.selectionArray[0].Parent) && isRealObject(this.selectionInfo.selectionArray[0].Parent.Parent) && typeof this.selectionInfo.selectionArray[0].Parent.Parent.Is_HdrFtr === "function" && this.selectionInfo.selectionArray[0].Parent.Parent.Is_HdrFtr() === true && isRealObject(this.selectionInfo.selectionArray[0].GraphicObj) && typeof this.selectionInfo.selectionArray[0].GraphicObj.selectStartPage === "number" && this.selectionInfo.selectionArray[0].GraphicObj.selectStartPage !== -1) {
                page_num = this.selectionInfo.selectionArray[0].GraphicObj.selectStartPage;
            }
            var gr_pos = this.getNewGroupPos();
            var near_pos = this.document.Get_NearestPos(this.selectionInfo.selectionArray[0].PageNum, gr_pos.x, gr_pos.y, true, null);
            History.Create_NewPoint();
            var _selection_objects = this.selectionInfo.selectionArray;
            var _objects_array = [];
            _selection_objects.sort(function (obj1, obj2) {
                return obj1.RelativeHeight - obj2.RelativeHeight;
            });
            for (var _gr_obj_index = _selection_objects.length - 1; _gr_obj_index > -1; --_gr_obj_index) {
                _objects_array.push(_selection_objects[_gr_obj_index]);
                _selection_objects[_gr_obj_index].Remove_FromDocument(false);
            }
            _objects_array.sort(ComparisonByZIndex);
            _selection_objects.length = 0;
            var _page_index = _objects_array[0].pageIndex;
            var result_wrap_type = _objects_array[0].wrappingType;
            for (var i = 1; i < _objects_array.length; ++i) {
                if (_objects_array[i].wrappingType != result_wrap_type) {
                    result_wrap_type = WRAPPING_TYPE_NONE;
                    break;
                }
            }
            var _new_word_graphic_object = new ParaDrawing(null, null, null, this.drawingDocument, null, null, this.document, this, _page_index);
            var _new_group = new WordGroupShapes(_new_word_graphic_object, this.document, this.drawingDocument, null);
            _new_word_graphic_object.Set_GraphicObject(_new_group);
            _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
            _new_word_graphic_object.Set_WrappingType(result_wrap_type);
            _new_group.setPageIndex(_page_index);
            _new_word_graphic_object.setZIndex();
            _new_group.fromArrayGraphicObjects(_objects_array);
            _new_word_graphic_object.select(page_num);
            _new_word_graphic_object.recalculateWrapPolygon();
            _selection_objects.push(_new_word_graphic_object);
            var bounds = _new_word_graphic_object.getBounds();
            var nearest_pos = this.document.Get_NearestPos(_page_index, _new_group.absOffsetX, _new_group.absOffsetY, true, _new_word_graphic_object);
            _new_word_graphic_object.Set_XYForAdd(_new_group.absOffsetX, _new_group.absOffsetY, nearest_pos, _page_index);
            _new_word_graphic_object.Add_ToDocument(nearest_pos, true);
            editor.asc_fireCallback("asc_canGroup", this.canGroup());
            editor.asc_fireCallback("asc_canUnGroup", this.canUnGroup());
            return _page_index;
        }
        return 0;
    },
    unGroupSelectedObjects: function () {
        History.Create_NewPoint();
        var selection_array = this.selectionInfo.selectionArray;
        var selection_group_array = [];
        for (var selection_index = 0; selection_index < selection_array.length; ++selection_index) {
            if (selection_array[selection_index].isGroup() && !selection_array[selection_index].Is_Inline()) {
                selection_group_array.push(selection_array.splice(selection_index, 1)[0]);
            }
        }
        this.resetSelection();
        for (selection_index = 0; selection_index < selection_group_array.length; ++selection_index) {
            var cur_group_word_graphic_obj = selection_group_array[selection_index];
            var cur_group = cur_group_word_graphic_obj.GraphicObj;
            var cur_arr_gr_objects = cur_group.arrGraphicObjects;
            var page_index = cur_group.pageIndex;
            var paragraph = cur_group_word_graphic_obj.Parent;
            var nearest_pos = this.document.Get_NearestPos(cur_group_word_graphic_obj.PageNum, cur_group_word_graphic_obj.absOffsetX, cur_group_word_graphic_obj.absOffsetY, !cur_group_word_graphic_obj.Is_Inline(), cur_group_word_graphic_obj);
            cur_group_word_graphic_obj.Remove_FromDocument(false);
            for (var object_index = 0; object_index < cur_arr_gr_objects.length; ++object_index) {
                var cur_child_graphic_object = cur_arr_gr_objects[object_index];
                if (!isRealObject(cur_child_graphic_object.parent)) {
                    var p_d = new ParaDrawing(0, 0, null, this.drawingDocument, null, null);
                    p_d.Set_GraphicObject(cur_child_graphic_object);
                }
                cur_child_graphic_object.parent.Set_WrappingType(cur_group_word_graphic_obj.wrappingType);
                if (!cur_child_graphic_object.isGroup()) {
                    var new_offset_x, new_offset_y, new_rot, new_flip_h, new_flip_v;
                    var hc, vc;
                    var xc, yc;
                    hc = cur_child_graphic_object.absExtX * 0.5;
                    vc = cur_child_graphic_object.absExtY * 0.5;
                    xc = cur_child_graphic_object.transform.TransformPointX(hc, vc);
                    yc = cur_child_graphic_object.transform.TransformPointY(hc, vc);
                    new_offset_x = xc - hc;
                    new_offset_y = yc - vc;
                    var xfrm_flip_h = cur_child_graphic_object.spPr.xfrm.flipH == null ? false : cur_child_graphic_object.spPr.xfrm.flipH;
                    var xfrm_flip_v = cur_child_graphic_object.spPr.xfrm.flipV == null ? false : cur_child_graphic_object.spPr.xfrm.flipV;
                    new_flip_h = cur_group.absFlipH ? !xfrm_flip_h : xfrm_flip_h;
                    new_flip_v = cur_group.absFlipV ? !xfrm_flip_v : xfrm_flip_v;
                    var xfrm_rot = cur_child_graphic_object.spPr.xfrm.rot == null ? 0 : cur_child_graphic_object.spPr.xfrm.rot;
                    new_rot = xfrm_rot + cur_group.absRot;
                    while (new_rot >= Math.PI * 2) {
                        new_rot -= Math.PI * 2;
                    }
                    while (new_rot < 0) {
                        new_rot += Math.PI * 2;
                    }
                    cur_child_graphic_object.setAbsoluteTransform(new_offset_x, new_offset_y, cur_child_graphic_object.spPr.xfrm.extX, cur_child_graphic_object.spPr.xfrm.extY, new_rot, new_flip_h, new_flip_v);
                    cur_child_graphic_object.setXfrm(0, 0, null, null, new_rot, new_flip_h, new_flip_v);
                    cur_child_graphic_object.setGroup(null);
                    cur_child_graphic_object.setMainGroup(null);
                    var bounds = cur_child_graphic_object.parent.getBounds();
                    cur_child_graphic_object.parent.Set_DrawingType(drawing_Anchor);
                    cur_child_graphic_object.parent.Update_Size(bounds.r - bounds.l, bounds.b - bounds.t);
                    cur_child_graphic_object.parent.Measure();
                    cur_child_graphic_object.parent.updatePosition(new_offset_x, new_offset_y);
                    cur_child_graphic_object.parent.calculateOffset();
                    cur_child_graphic_object.parent.Set_XYForAdd(new_offset_x, new_offset_y, nearest_pos, cur_group_word_graphic_obj.PageNum);
                    cur_child_graphic_object.parent.Add_ToDocument2(paragraph);
                    cur_child_graphic_object.parent.calculateSnapArrays();
                } else {
                    hc = cur_child_graphic_object.spPr.xfrm.extX * 0.5;
                    vc = cur_child_graphic_object.spPr.xfrm.extY * 0.5;
                    xc = cur_child_graphic_object.transform.TransformPointX(hc, vc);
                    yc = cur_child_graphic_object.transform.TransformPointY(hc, vc);
                    new_offset_x = xc - hc;
                    new_offset_y = yc - vc;
                    xfrm_rot = cur_child_graphic_object.spPr.xfrm.rot == null ? 0 : cur_child_graphic_object.spPr.xfrm.rot;
                    new_rot = xfrm_rot + cur_group.absRot;
                    while (new_rot >= Math.PI * 2) {
                        new_rot -= Math.PI * 2;
                    }
                    while (new_rot < 0) {
                        new_rot += Math.PI * 2;
                    }
                    xfrm_flip_h = cur_child_graphic_object.spPr.xfrm.flipH == null ? false : cur_child_graphic_object.spPr.xfrm.flipH;
                    xfrm_flip_v = cur_child_graphic_object.spPr.xfrm.flipV == null ? false : cur_child_graphic_object.spPr.xfrm.flipV;
                    new_flip_h = cur_group.absFlipH ? !xfrm_flip_h : xfrm_flip_h;
                    new_flip_v = cur_group.absFlipV ? !xfrm_flip_v : xfrm_flip_v;
                    cur_child_graphic_object.setAbsoluteTransform(new_offset_x, new_offset_y, cur_child_graphic_object.spPr.xfrm.extX, cur_child_graphic_object.spPr.xfrm.extY, new_rot, new_flip_h, new_flip_v);
                    cur_child_graphic_object.setXfrm(null, null, null, null, new_rot, new_flip_h, new_flip_v);
                    cur_child_graphic_object.setGroup(null);
                    cur_child_graphic_object.setMainGroup(null);
                    var child_sp_tree = cur_child_graphic_object.spTree;
                    var cur_group_invert_transform = global_MatrixTransformer.Invert(cur_child_graphic_object.transform);
                    for (var sp_index = 0; sp_index < child_sp_tree.length; ++sp_index) {
                        var cur_sp = child_sp_tree[sp_index];
                        xfrm_rot = cur_child_graphic_object.spPr.xfrm.rot == null ? 0 : cur_child_graphic_object.spPr.xfrm.rot;
                        new_rot = cur_sp.absRot + cur_group.absRot - xfrm_rot;
                        while (new_rot >= Math.PI * 2) {
                            new_rot -= Math.PI * 2;
                        }
                        while (new_rot < 0) {
                            new_rot += Math.PI;
                        }
                        hc = cur_sp.absExtX * 0.5;
                        vc = cur_sp.absExtY * 0.5;
                        xc = cur_sp.transform.TransformPointX(hc, vc);
                        yc = cur_sp.transform.TransformPointY(hc, vc);
                        var rel_xc, rel_yc;
                        rel_xc = cur_group_invert_transform.TransformPointX(xc, yc);
                        rel_yc = cur_group_invert_transform.TransformPointY(xc, yc);
                        var rel_rot = new_rot;
                        var new_offset_x2 = rel_xc - hc;
                        var new_offset_y2 = rel_yc - vc;
                        var rel_x0, rel_y0, rel_x4, rel_y4;
                        var abs_x0, abs_y0, abs_x4, abs_y4;
                        abs_x0 = cur_sp.transform.TransformPointX(0, 0);
                        abs_y0 = cur_sp.transform.TransformPointY(0, 0);
                        rel_x0 = cur_group_invert_transform.TransformPointX(abs_x0, abs_y0);
                        rel_y0 = cur_group_invert_transform.TransformPointY(abs_x0, abs_y0);
                        abs_x4 = cur_sp.transform.TransformPointX(cur_sp.absExtX, cur_sp.absExtY);
                        abs_y4 = cur_sp.transform.TransformPointY(cur_sp.absExtX, cur_sp.absExtY);
                        rel_x4 = cur_group_invert_transform.TransformPointX(abs_x4, abs_y4);
                        rel_y4 = cur_group_invert_transform.TransformPointY(abs_x4, abs_y4);
                        var rotated_matrix = new CMatrix();
                        rotated_matrix.RotateAt(cur_group.spPr.xfrm.rot == null ? 0 : cur_group.spPr.xfrm.rot, 0, 0, MATRIX_ORDER_APPEND);
                        var rot_x0, rot_y0, rot_x4, rot_y4;
                        rot_x0 = rotated_matrix.TransformPointX(rel_x0, rel_y0);
                        rot_y0 = rotated_matrix.TransformPointY(rel_x0, rel_y0);
                        rot_x4 = rotated_matrix.TransformPointX(rel_x4, rel_y4);
                        rot_y4 = rotated_matrix.TransformPointY(rel_x4, rel_y4);
                        var new_flip_h2 = rot_x0 > rot_x4;
                        var new_flip_v2 = rot_y0 > rot_y4;
                        cur_sp.setAbsoluteTransform(new_offset_x2, new_offset_y2, cur_sp.absExtX, cur_sp.absExtY, rel_rot, new_flip_h2, new_flip_v2);
                        cur_sp.setMainGroup(cur_child_graphic_object);
                    }
                    cur_child_graphic_object.setMainGroup(null);
                    cur_child_graphic_object.setGroup(null);
                    var bounds = cur_child_graphic_object.parent.getBounds();
                    cur_child_graphic_object.parent.Set_DrawingType(drawing_Anchor);
                    cur_child_graphic_object.parent.Update_Size(bounds.r - bounds.l, bounds.b - bounds.t);
                    cur_child_graphic_object.parent.Measure();
                    cur_child_graphic_object.parent.updatePosition(new_offset_x, new_offset_y);
                    cur_child_graphic_object.parent.calculateOffset();
                    cur_child_graphic_object.parent.Set_XYForAdd(new_offset_x, new_offset_y, nearest_pos, cur_group_word_graphic_obj.PageNum);
                    cur_child_graphic_object.parent.Add_ToDocument2(paragraph);
                    cur_child_graphic_object.parent.calculateSnapArrays();
                }
                cur_child_graphic_object.parent.select();
                this.selectionInfo.selectionArray.push(cur_child_graphic_object.parent);
            }
        }
        this.document.Recalculate();
        editor.asc_fireCallback("asc_canGroup", this.canGroup());
        editor.asc_fireCallback("asc_canUnGroup", this.canUnGroup());
    },
    unGroupSelectionObjects2: function () {
        History.Create_NewPoint();
        var selection_objects = this.selectionInfo.selectionArray();
        var selected_groups = [];
        for (var i = 0; i < selection_objects.length; ++i) {
            if (selection_objects[i].isGroup() && !selection_objects[i].Is_Inline()) {
                selected_groups.push(selection_objects[i]);
            }
        }
        for (i = 0; i < selected_groups.length; ++i) {
            selected_groups[i].Remove_FromDocument(false);
            var cur_group = selected_groups[i].GraphicObj;
            var child_objects = cur_group.arrGraphicObjects;
            for (var j = 0; j < child_objects.length; ++j) {
                var cur_child = child_objects[j];
                if (!cur_child.isGroup()) {}
            }
        }
    },
    setTableProps: function (Props) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.GraphicObj.textBoxContent.Set_TableProps(Props);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            this.curState.textObject.textBoxContent.Set_TableProps(Props);
            break;
        }
    },
    cursorMoveLeft: function (AddToSelect, Word) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.cursorMoveLeft(AddToSelect, Word);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.cursorMoveLeft === "function") {
                this.curState.textObject.cursorMoveLeft(AddToSelect, Word);
            }
            break;
        case STATES_ID_GROUP:
            break;
        case STATES_ID_NULL:
            case STATES_ID_NULL_HF:
            var sel_arr = this.selectionInfo.selectionArray;
            var b_recalc = false;
            if (!AddToSelect && false === editor.isViewMode) {
                History.Create_NewPoint();
                for (var i = 0; i < sel_arr.length; ++i) {
                    var drawing = sel_arr[i];
                    if (!drawing.Is_Inline()) {
                        if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                            Type: changestype_2_Element_and_Type,
                            Element: drawing.Parent,
                            CheckType: changestype_Paragraph_Content
                        })) {
                            var nearest_pos = this.document.Get_NearestPos(drawing.pageIndex, drawing.absOffsetX, drawing.absOffsetY, true, drawing.parent);
                            var dist = this.drawingDocument.GetMMPerDot(5);
                            drawing.setAbsoluteTransform(drawing.absOffsetX - dist, drawing.absOffsetY, null, null, null, null, null);
                            if (isRealObject(drawing.GraphicObj)) {
                                drawing.GraphicObj.recalculate();
                            }
                            var bounds = drawing.getBounds();
                            drawing.OnEnd_ChangeFlow(drawing.absOffsetX, drawing.absOffsetY, drawing.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, nearest_pos, true, false);
                            b_recalc = true;
                        }
                    }
                }
            }
            if (b_recalc) {
                this.document.Recalculate();
            }
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            if (typeof this.curState.title.cursorMoveLeft === "function") {
                this.curState.title.cursorMoveLeft(AddToSelect, Word);
            }
            break;
        }
    },
    cursorMoveRight: function (AddToSelect, Word) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.cursorMoveRight(AddToSelect, Word);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.cursorMoveRight === "function") {
                this.curState.textObject.cursorMoveRight(AddToSelect, Word);
            }
            break;
        case STATES_ID_GROUP:
            break;
        case STATES_ID_NULL:
            case STATES_ID_NULL_HF:
            var sel_arr = this.selectionInfo.selectionArray;
            var b_recalc = false;
            if (!AddToSelect && false === editor.isViewMode) {
                History.Create_NewPoint();
                for (var i = 0; i < sel_arr.length; ++i) {
                    var drawing = sel_arr[i];
                    if (!drawing.Is_Inline()) {
                        if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                            Type: changestype_2_Element_and_Type,
                            Element: drawing.Parent,
                            CheckType: changestype_Paragraph_Content
                        })) {
                            var nearest_pos = this.document.Get_NearestPos(drawing.pageIndex, drawing.absOffsetX, drawing.absOffsetY, true, drawing.parent);
                            var dist = this.drawingDocument.GetMMPerDot(5);
                            drawing.setAbsoluteTransform(drawing.absOffsetX + dist, drawing.absOffsetY, null, null, null, null, null);
                            if (isRealObject(drawing.GraphicObj)) {
                                drawing.GraphicObj.recalculate();
                            }
                            var bounds = drawing.getBounds();
                            drawing.OnEnd_ChangeFlow(drawing.absOffsetX, drawing.absOffsetY, drawing.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, nearest_pos, true, false);
                            b_recalc = true;
                        }
                    }
                }
            }
            if (b_recalc) {
                this.document.Recalculate();
            }
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            if (typeof this.curState.title.cursorMoveRight === "function") {
                this.curState.title.cursorMoveRight(AddToSelect, Word);
            }
            break;
        }
    },
    cursorMoveUp: function (AddToSelect) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.cursorMoveUp(AddToSelect);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.cursorMoveUp === "function") {
                this.curState.textObject.cursorMoveUp(AddToSelect);
            }
            break;
        case STATES_ID_GROUP:
            break;
        case STATES_ID_NULL:
            case STATES_ID_NULL_HF:
            var sel_arr = this.selectionInfo.selectionArray;
            var b_recalc = false;
            if (!AddToSelect && false === editor.isViewMode) {
                History.Create_NewPoint();
                for (var i = 0; i < sel_arr.length; ++i) {
                    var drawing = sel_arr[i];
                    if (!drawing.Is_Inline()) {
                        if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                            Type: changestype_2_Element_and_Type,
                            Element: drawing.Parent,
                            CheckType: changestype_Paragraph_Content
                        })) {
                            var nearest_pos = this.document.Get_NearestPos(drawing.pageIndex, drawing.absOffsetX, drawing.absOffsetY, true, drawing.parent);
                            var dist = this.drawingDocument.GetMMPerDot(5);
                            drawing.setAbsoluteTransform(drawing.absOffsetX, drawing.absOffsetY - dist, null, null, null, null, null);
                            if (isRealObject(drawing.GraphicObj)) {
                                drawing.GraphicObj.recalculate();
                            }
                            var bounds = drawing.getBounds();
                            drawing.OnEnd_ChangeFlow(drawing.absOffsetX, drawing.absOffsetY, drawing.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, nearest_pos, true, false);
                            b_recalc = true;
                        }
                    }
                }
            }
            if (b_recalc) {
                this.document.Recalculate();
            }
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            if (typeof this.curState.title.cursorMoveUp === "function") {
                this.curState.title.cursorMoveUp(AddToSelect);
            }
            break;
        }
    },
    cursorMoveDown: function (AddToSelect) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.cursorMoveDown(AddToSelect);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.cursorMoveDown === "function") {
                this.curState.textObject.cursorMoveDown(AddToSelect);
            }
            break;
        case STATES_ID_GROUP:
            break;
        case STATES_ID_NULL:
            case STATES_ID_NULL_HF:
            var sel_arr = this.selectionInfo.selectionArray;
            var b_recalc = false;
            if (!AddToSelect && false === editor.isViewMode) {
                History.Create_NewPoint();
                for (var i = 0; i < sel_arr.length; ++i) {
                    var drawing = sel_arr[i];
                    if (!drawing.Is_Inline()) {
                        if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                            Type: changestype_2_Element_and_Type,
                            Element: drawing.Parent,
                            CheckType: changestype_Paragraph_Content
                        })) {
                            var nearest_pos = this.document.Get_NearestPos(drawing.pageIndex, drawing.absOffsetX, drawing.absOffsetY, true, drawing.parent);
                            var dist = this.drawingDocument.GetMMPerDot(5);
                            drawing.setAbsoluteTransform(drawing.absOffsetX, drawing.absOffsetY + dist, null, null, null, null, null);
                            if (isRealObject(drawing.GraphicObj)) {
                                drawing.GraphicObj.recalculate();
                            }
                            var bounds = drawing.getBounds();
                            drawing.OnEnd_ChangeFlow(drawing.absOffsetX, drawing.absOffsetY, drawing.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, nearest_pos, true, false);
                            b_recalc = true;
                        }
                    }
                }
            }
            if (b_recalc) {
                this.document.Recalculate();
            }
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            if (typeof this.curState.title.cursorMoveDown === "function") {
                this.curState.title.cursorMoveDown(AddToSelect);
            }
            break;
        }
    },
    cursorMoveEndOfLine: function (AddToSelect) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.cursorMoveEndOfLine(AddToSelect);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.cursorMoveEndOfLine === "function") {
                this.curState.textObject.cursorMoveEndOfLine(AddToSelect);
            }
            break;
        case STATES_ID_GROUP:
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            if (typeof this.curState.title.cursorMoveEndOfLine === "function") {
                this.curState.title.cursorMoveEndOfLine(AddToSelect);
            }
            break;
        default:
            break;
        }
    },
    selectionIsEmpty: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.selectionIsEmpty();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.selectionIsEmpty === "function") {
                return this.curState.textObject.selectionIsEmpty();
            }
        }
        return false;
    },
    cursorMoveStartOfLine: function (AddToSelect) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.cursorMoveStartOfLine(AddToSelect);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.cursorMoveStartOfLine === "function") {
                this.curState.textObject.cursorMoveStartOfLine(AddToSelect);
            }
            break;
        }
    },
    cursorMoveAt: function (X, Y, AddToSelect) {},
    cursorMoveToCell: function (bNext) {},
    updateAnchorPos: function () {
        if (typeof this.curState.updateAnchorPos === "function") {
            this.curState.updateAnchorPos();
        }
    },
    resetSelection: function () {
        if (isRealObject(this.curState.group)) {
            var group = this.curState.group;
            if (! (group instanceof WordGroupShapes)) {
                group = group.parent;
            }
            if (isRealObject(group) && isRealObject(group.selectionInfo) && Array.isArray(group.selectionInfo.selectionArray)) {
                for (var i = 0; i < group.selectionInfo.selectionArray.length; ++i) {
                    group.selectionInfo.selectionArray[i].deselect();
                }
                group.selectionInfo.selectionArray.length = 0;
            }
        }
        if (this.curState.id === STATES_ID_CHART_TITLE_TEXT) {
            if (this.curState.chart.GraphicObj) {
                this.curState.chart.GraphicObj.recalculate();
                this.updateCharts();
            }
        }
        for (var _sel_obj_index = 0; _sel_obj_index < this.selectionInfo.selectionArray.length; ++_sel_obj_index) {
            this.selectionInfo.selectionArray[_sel_obj_index].deselect();
        }
        this.selectionInfo.selectionArray.length = 0;
        this.arrPreTrackObjects.length = 0;
        this.arrTrackObjects.length = 0;
        this.spline = null;
        this.polyline = null;
        this.drawingDocument.UpdateTargetTransform(new CMatrix());
        this.changeCurrentState(new NullState(this));
    },
    resetSelection2: function () {
        var sel_arr = this.selectionInfo.selectionArray;
        if (sel_arr.length > 0) {
            var top_obj = sel_arr[0];
            for (var i = 1; i < sel_arr.length; ++i) {
                var cur_obj = sel_arr[i];
                var par = cur_obj.Parent;
                if (cur_obj.pageIndex < top_obj.pageIndex) {
                    top_obj = cur_obj;
                } else {
                    if (cur_obj.pageIndex === top_obj.pageIndex) {
                        if (cur_obj.Parent.Y < top_obj.Parent.Y) {
                            top_obj = cur_obj;
                        }
                    }
                }
            }
            this.resetSelection();
            top_obj.GoTo_Text();
        }
    },
    recalculateCurPos: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.recalculateCurPos();
        } else {
            if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                if (typeof this.curState.textObject.recalculateCurPos === "function") {
                    this.curState.textObject.recalculateCurPos();
                }
            } else {
                if (this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP || this.curState.id === STATES_ID_CHART_TITLE_TEXT) {
                    this.curState.title.recalculateCurPos();
                }
            }
        }
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.remove === "function") {
                this.curState.textObject.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
            }
            break;
        case STATES_ID_GROUP:
            var group = this.curState.group;
            History.Add(group, {
                Type: historyitem_GroupRecalculate
            });
            var sel_arr = group.selectionInfo.selectionArray;
            var arr_groups = [];
            var b_main_group = false;
            var para_drawing2 = this.curState.groupWordGO;
            for (var i = 0; i < sel_arr.length; ++i) {
                var cur_sp = sel_arr[i];
                var parent_group = cur_sp.group;
                for (var j = 0; j < arr_groups.length; ++j) {
                    if (parent_group === arr_groups[j]) {
                        break;
                    }
                }
                if (j === arr_groups.length) {
                    arr_groups.push(parent_group);
                    if (parent_group == group) {
                        b_main_group = true;
                    }
                }
                parent_group.removeObjectFromArrGraphicObjects(cur_sp.Get_Id());
            }
            arr_groups.sort(CompareGroups);
            if (!b_main_group) {
                arr_groups.push(group);
            }
            var b_remove_main_group = false;
            for (i = 0; i < arr_groups.length; ++i) {
                var cur_group = arr_groups[i];
                if (cur_group.arrGraphicObjects.length === 0) {
                    if (cur_group != group) {
                        cur_group.group.removeObjectFromArrGraphicObjects(cur_group.Get_Id());
                        arr_groups.splice(i, 1);
                        --i;
                    } else {
                        b_remove_main_group = true;
                    }
                }
            }
            if (b_remove_main_group) {
                group.parent.Remove_FromDocument(false);
                this.resetSelection();
                group.parent.GoTo_Text();
            } else {
                var b_del_group = false;
                for (i = 0; i < arr_groups.length; ++i) {
                    cur_group = arr_groups[i];
                    if (cur_group != group) {
                        if (cur_group.arrGraphicObjects.length === 1) {
                            var sp = cur_group.arrGraphicObjects[0];
                            var inv = global_MatrixTransformer.Invert(cur_group.group.transform);
                            var hc = sp.spPr.xfrm.extX * 0.5;
                            var vc = sp.spPr.xfrm.extY * 0.5;
                            var xc = sp.transform.TransformPointX(hc, vc);
                            var yc = sp.transform.TransformPointY(hc, vc);
                            var rel_xc, rel_yc;
                            rel_xc = inv.TransformPointX(xc, yc);
                            rel_yc = inv.TransformPointY(xc, yc);
                            var new_off_x = rel_xc - hc;
                            var new_off_y = rel_yc - vc;
                            var new_rot = (sp.spPr.xfrm.rot == null ? 0 : sp.spPr.xfrm.rot) + (cur_group.spPr.xfrm.rot == null ? 0 : cur_group.spPr.xfrm.rot);
                            while (new_rot >= Math.PI * 2) {
                                new_rot -= Math.PI * 2;
                            }
                            while (new_rot < 0) {
                                new_rot += Math.PI * 2;
                            }
                            var new_flip_h, new_flip_v;
                            if (cur_group.spPr.xfrm.flipH == null ? false : cur_group.spPr.xfrm.flipH) {
                                new_flip_h = !(sp.spPr.xfrm.flipH == null ? false : sp.spPr.xfrm.flipH);
                            } else {
                                new_flip_h = (sp.spPr.xfrm.flipH == null ? false : sp.spPr.xfrm.flipH);
                            }
                            if (cur_group.spPr.xfrm.flipV == null ? false : cur_group.spPr.xfrm.flipV) {
                                new_flip_v = !(sp.spPr.xfrm.flipV == null ? false : sp.spPr.xfrm.flipV);
                            } else {
                                new_flip_v = (sp.spPr.xfrm.flipV == null ? false : sp.spPr.xfrm.flipV);
                            }
                            if (isRealObject(cur_group.parent)) {
                                cur_group.parent.Set_GraphicObject(sp);
                            }
                            cur_group.group.swapGraphicObject(cur_group.Get_Id(), sp.Get_Id());
                            sp.setXfrm(new_off_x, new_off_y, null, null, new_rot, new_flip_h, new_flip_v);
                            sp.setAbsoluteTransform(new_off_x, new_off_y, null, null, new_rot, new_flip_h, new_flip_v);
                            sp.setGroup(cur_group.group);
                        }
                    } else {
                        if (cur_group.arrGraphicObjects.length === 1) {
                            b_del_group = true;
                            sp = cur_group.arrGraphicObjects[0];
                            var para_drawing = group.parent;
                            para_drawing.Set_GraphicObject(sp);
                            hc = sp.spPr.xfrm.extX * 0.5;
                            vc = sp.spPr.xfrm.extY * 0.5;
                            xc = sp.transform.TransformPointX(hc, vc);
                            yc = sp.transform.TransformPointY(hc, vc);
                            new_off_x = xc - hc;
                            new_off_y = yc - vc;
                            new_rot = (sp.spPr.xfrm.rot == null ? 0 : sp.spPr.xfrm.rot) + (cur_group.spPr.xfrm.rot == null ? 0 : cur_group.spPr.xfrm.rot);
                            while (new_rot >= Math.PI * 2) {
                                new_rot -= Math.PI * 2;
                            }
                            while (new_rot < 0) {
                                new_rot += Math.PI * 2;
                            }
                            if (cur_group.spPr.xfrm.flipH == null ? false : cur_group.spPr.xfrm.flipH) {
                                new_flip_h = !(sp.spPr.xfrm.flipH == null ? false : sp.spPr.xfrm.flipH);
                            } else {
                                new_flip_h = (sp.spPr.xfrm.flipH == null ? false : sp.spPr.xfrm.flipH);
                            }
                            if (cur_group.spPr.xfrm.flipV == null ? false : cur_group.spPr.xfrm.flipV) {
                                new_flip_v = !(sp.spPr.xfrm.flipV == null ? false : sp.spPr.xfrm.flipV);
                            } else {
                                new_flip_v = (sp.spPr.xfrm.flipV == null ? false : sp.spPr.xfrm.flipV);
                            }
                            sp.setXfrm(0, 0, null, null, new_rot, new_flip_h, new_flip_v);
                            sp.setAbsoluteTransform(new_off_x, new_off_y, sp.absExtX, sp.absExtY, new_rot, new_flip_h, new_flip_v);
                            sp.setGroup(null);
                            if (sp.isGroup()) {
                                sp.updateSizes();
                            }
                        }
                    }
                }
                if (!b_del_group) {
                    group.updateSizes();
                }
                for (var s = 0; s < group.selectionInfo.selectionArray.length; ++s) {
                    group.selectionInfo.selectionArray[s].deselect();
                }
                group.selectionInfo.selectionArray.length = 0;
                this.changeCurrentState(new NullState(this));
                para_drawing2.GraphicObj.recalculate();
                var bounds = para_drawing2.getBounds();
                if (para_drawing2.Is_Inline()) {
                    para_drawing2.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                } else {
                    para_drawing2.OnEnd_ChangeFlow(para_drawing2.GraphicObj.absOffsetX, para_drawing2.GraphicObj.absOffsetY, para_drawing2.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, false);
                }
            }
            this.document.Recalculate();
            break;
        case STATES_ID_CHART_TITLE_TEXT:
            case STATES_ID_CHART_TITLE_TEXT_GROUP:
            this.curState.title.remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
            break;
        case STATES_ID_CHART:
            var chart = this.curState.chart.GraphicObj;
            if (chart.chartTitle && chart.chartTitle.selected) {
                History.Add(chart, {
                    Type: historyitem_AutoShapes_RecalculateChartUndo
                });
                chart.addTitle(null);
                g_oTableId.m_bTurnOff = true;
                var copy_asc_chart = new asc_CChart(chart.chart);
                g_oTableId.m_bTurnOff = false;
                copy_asc_chart.header.asc_setTitle("");
                chart.setAscChart(copy_asc_chart);
                History.Add(chart, {
                    Type: historyitem_AutoShapes_RecalculateChartRedo
                });
            } else {
                if (chart.hAxisTitle && chart.hAxisTitle.selected) {
                    History.Add(chart, {
                        Type: historyitem_AutoShapes_RecalculateChartUndo
                    });
                    chart.addXAxis(null);
                    g_oTableId.m_bTurnOff = true;
                    var copy_asc_chart = new asc_CChart(chart.chart);
                    g_oTableId.m_bTurnOff = false;
                    copy_asc_chart.xAxis.asc_setTitle("");
                    chart.setAscChart(copy_asc_chart);
                    History.Add(chart, {
                        Type: historyitem_AutoShapes_RecalculateChartRedo
                    });
                } else {
                    if (chart.vAxisTitle && chart.vAxisTitle.selected) {
                        History.Add(chart, {
                            Type: historyitem_AutoShapes_RecalculateChartUndo
                        });
                        chart.addYAxis(null);
                        g_oTableId.m_bTurnOff = true;
                        var copy_asc_chart = new asc_CChart(chart.chart);
                        g_oTableId.m_bTurnOff = false;
                        copy_asc_chart.yAxis.asc_setTitle("");
                        chart.setAscChart(copy_asc_chart);
                        History.Add(chart, {
                            Type: historyitem_AutoShapes_RecalculateChartRedo
                        });
                    }
                }
            }
            chart.recalculate();
            this.document.Recalculate();
            break;
        case STATES_ID_CHART_GROUP:
            var chart = this.curState.chart;
            if (chart.chartTitle && chart.chartTitle.selected) {
                History.Add(chart, {
                    Type: historyitem_AutoShapes_RecalculateChartUndo
                });
                chart.addTitle(null);
                g_oTableId.m_bTurnOff = true;
                var copy_asc_chart = new asc_CChart(chart.chart);
                g_oTableId.m_bTurnOff = false;
                copy_asc_chart.header.asc_setTitle("");
                chart.setAscChart(copy_asc_chart);
                History.Add(chart, {
                    Type: historyitem_AutoShapes_RecalculateChartRedo
                });
            } else {
                if (chart.hAxisTitle && chart.hAxisTitle.selected) {
                    History.Add(chart, {
                        Type: historyitem_AutoShapes_RecalculateChartUndo
                    });
                    chart.addXAxis(null);
                    g_oTableId.m_bTurnOff = true;
                    var copy_asc_chart = new asc_CChart(chart.chart);
                    g_oTableId.m_bTurnOff = false;
                    copy_asc_chart.xAxis.asc_setTitle("");
                    chart.setAscChart(copy_asc_chart);
                    History.Add(chart, {
                        Type: historyitem_AutoShapes_RecalculateChartRedo
                    });
                } else {
                    if (chart.vAxisTitle && chart.vAxisTitle.selected) {
                        History.Add(chart, {
                            Type: historyitem_AutoShapes_RecalculateChartUndo
                        });
                        chart.addYAxis("");
                        g_oTableId.m_bTurnOff = true;
                        var copy_asc_chart = new asc_CChart(chart.chart);
                        g_oTableId.m_bTurnOff = false;
                        copy_asc_chart.yAxis.asc_setTitle(null);
                        chart.setAscChart(copy_asc_chart);
                        History.Add(chart, {
                            Type: historyitem_AutoShapes_RecalculateChartRedo
                        });
                    }
                }
            }
            chart.recalculate();
            this.document.Recalculate();
            break;
        default:
            var selected_objects = this.selectionInfo.selectionArray;
            var rem_arr = [];
            for (var t = 0; t < selected_objects.length; ++t) {
                rem_arr.push(selected_objects[t]);
            }
            this.resetSelection();
            if (rem_arr.length > 0) {
                rem_arr[0].GoTo_Text();
            }
            var last_index = selected_objects.length - 1;
            var b_go_to_text = false;
            for (i = 0; i < rem_arr.length; ++i) {
                b_go_to_text = true;
                rem_arr[i].Remove_FromDocument(false);
                rem_arr.splice(i, 1);
                --i;
            }
            this.document.Recalculate();
            if (typeof this.curState.updateAnchorPos === "function") {
                this.curState.updateAnchorPos();
                this.selectionDraw();
            }
        }
    },
    addGraphicObject: function (paraDrawing) {
        this.drawingOjects.push(paraDrawing);
        this.objectsMap["_" + paraDrawing.Get_Id()] = paraDrawing;
    },
    isPointInDrawingObjects: function (x, y, pageIndex, documentContent) {
        if (isRealObject(this.curState.wordGraphicObject)) {
            var hit_to_wrap_polygon = this.curState.wordGraphicObject.hitToWrapPolygonPoint(x, y);
            if (hit_to_wrap_polygon.hit === true) {
                return DRAWING_ARRAY_TYPE_BEFORE;
            }
        }
        if (this.curState.polylineFlag === true) {
            return DRAWING_ARRAY_TYPE_BEFORE;
        }
        if ((this.curState.group)) {
            var group = this.curState.group instanceof WordGroupShapes ? this.curState.group : this.curState.group.GraphicObj;
            var cur_sel_arr = group.selectionInfo.selectionArray;
            if (cur_sel_arr.length > 0) {
                var group_invert_transform = global_MatrixTransformer.Invert(group.transform);
                tr_x = group_invert_transform.TransformPointX(x, y);
                tr_y = group_invert_transform.TransformPointY(x, y);
                var g_x, g_y;
                if (pageIndex === group.pageIndex) {
                    g_x = x;
                    g_y = y;
                } else {
                    var t_p = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, group.pageIndex);
                    g_x = t_p.X;
                    g_y = t_p.Y;
                }
                if (cur_sel_arr.length === 1) {
                    if (cur_sel_arr[0].hitToAdj) {
                        if (cur_sel_arr[0].hitToAdj(g_x, g_y).hit) {
                            return DRAWING_ARRAY_TYPE_BEFORE;
                        }
                    }
                }
                for (var i = cur_sel_arr.length - 1; i > -1; --i) {
                    var h_h = cur_sel_arr[i].hitToHandle(x, y);
                    if (h_h && h_h.hit) {
                        return DRAWING_ARRAY_TYPE_BEFORE;
                    }
                }
            }
        }
        if (this.document.CurPos.Type != docpostype_HdrFtr) {
            if (!isRealObject(this.curState.wordGraphicObject)) {
                var selected_arr = this.selectionInfo.selectionArray;
                var sel_count = selected_arr.length;
                if (sel_count === 1) {
                    var tr_x, tr_y;
                    var object_page_index = selected_arr[0].getPageIndex();
                    if (pageIndex === object_page_index) {
                        tr_x = x;
                        tr_y = y;
                    } else {
                        var tr_point = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, object_page_index);
                        tr_x = tr_point.X;
                        tr_y = tr_point.Y;
                    }
                    if (selected_arr[0].hitToAdj(tr_x, tr_y).hit === true) {
                        return DRAWING_ARRAY_TYPE_BEFORE;
                    }
                }
                for (var index = 0; index < sel_count; ++index) {
                    var cur_selected_object = selected_arr[index];
                    if (true) {
                        object_page_index = cur_selected_object.getPageIndex();
                        if (pageIndex === object_page_index) {
                            tr_x = x;
                            tr_y = y;
                        } else {
                            tr_point = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, object_page_index);
                            tr_x = tr_point.X;
                            tr_y = tr_point.Y;
                        }
                        if (cur_selected_object.hitToHandle(tr_x, tr_y).hit === true) {
                            return DRAWING_ARRAY_TYPE_BEFORE;
                        }
                    }
                }
            }
            var cur_page_array = this.graphicPages[pageIndex].beforeTextObjects;
            for (index = 0; index < cur_page_array.length; ++index) {
                if (!cur_page_array[index].isShapeChild()) {
                    var b_hit_to_text_rect;
                    if (cur_page_array[index].GraphicObj.isGroup()) {
                        b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y).hit;
                    } else {
                        b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y);
                    }
                    if ((cur_page_array[index].hit(x, y) || b_hit_to_text_rect)) {
                        return DRAWING_ARRAY_TYPE_BEFORE;
                    }
                }
            }
            cur_page_array = this.graphicPages[pageIndex].inlineObjects;
            for (index = 0; index < cur_page_array.length; ++index) {
                if (!cur_page_array[index].isShapeChild()) {
                    var b_hit_to_text_rect;
                    if (cur_page_array[index].GraphicObj.isGroup()) {
                        b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y).hit;
                    } else {
                        b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y);
                    }
                    if ((cur_page_array[index].hit(x, y) || b_hit_to_text_rect)) {
                        return DRAWING_ARRAY_TYPE_INLINE;
                    }
                }
            }
            cur_page_array = this.graphicPages[pageIndex].wrappingObjects;
            for (index = 0; index < cur_page_array.length; ++index) {
                if (!cur_page_array[index].isShapeChild()) {
                    var b_hit_to_text_rect;
                    if (cur_page_array[index].GraphicObj.isGroup()) {
                        b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y).hit;
                    } else {
                        b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y);
                    }
                    if (cur_page_array[index].hit(x, y) || b_hit_to_text_rect) {
                        return DRAWING_ARRAY_TYPE_WRAPPING;
                    }
                }
            }
            cur_page_array = this.graphicPages[pageIndex].behindDocObjects;
            for (index = 0; index < cur_page_array.length; ++index) {
                if (!cur_page_array[index].isShapeChild()) {
                    var b_hit_to_text_rect;
                    if (cur_page_array[index].GraphicObj.isGroup()) {
                        b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y).hit;
                    } else {
                        b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y);
                    }
                    if ((cur_page_array[index].hit(x, y) || b_hit_to_text_rect)) {
                        return DRAWING_ARRAY_TYPE_BEHIND;
                    }
                }
            }
        } else {
            if (!isRealObject(this.curState.wordGraphicObject)) {
                var selected_arr = this.selectionInfo.selectionArray;
                var sel_count = selected_arr.length;
                if (sel_count === 1) {
                    if (selected_arr[0].hitToAdj(x, y).hit === true) {
                        return DRAWING_ARRAY_TYPE_BEFORE;
                    }
                }
                for (var index = 0; index < sel_count; ++index) {
                    var cur_selected_object = selected_arr[index];
                    if (cur_selected_object.hitToHandle(x, y).hit === true) {
                        return DRAWING_ARRAY_TYPE_BEFORE;
                    }
                }
            }
            var hdr_footer_objects;
            var bFirst = (0 === pageIndex ? true : false);
            var bEven = (pageIndex % 2 === 1 ? true : false);
            if (bFirst) {
                hdr_footer_objects = this.firstPage;
            } else {
                if (bEven) {
                    hdr_footer_objects = this.evenPage;
                } else {
                    hdr_footer_objects = this.oddPage;
                }
            }
            if (hdr_footer_objects != null) {
                cur_page_array = hdr_footer_objects.beforeTextArray;
                for (index = 0; index < cur_page_array.length; ++index) {
                    if (!cur_page_array[index].isShapeChild()) {
                        if (cur_page_array[index].GraphicObj.isGroup()) {
                            b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y).hit;
                        } else {
                            b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y);
                        }
                        if ((cur_page_array[index].hit(x, y) || b_hit_to_text_rect)) {
                            return DRAWING_ARRAY_TYPE_BEFORE;
                        }
                    }
                }
                cur_page_array = hdr_footer_objects.inlineArray;
                for (index = 0; index < cur_page_array.length; ++index) {
                    if (!cur_page_array[index].isShapeChild()) {
                        if (cur_page_array[index].GraphicObj.isGroup()) {
                            b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y).hit;
                        } else {
                            b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y);
                        }
                        if ((cur_page_array[index].hit(x, y) || b_hit_to_text_rect)) {
                            return DRAWING_ARRAY_TYPE_INLINE;
                        }
                    }
                }
                cur_page_array = hdr_footer_objects.wrappingArray;
                for (index = 0; index < cur_page_array.length; ++index) {
                    if (!cur_page_array[index].isShapeChild()) {
                        if (cur_page_array[index].GraphicObj.isGroup()) {
                            b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y).hit;
                        } else {
                            b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y);
                        }
                        if ((cur_page_array[index].hit(x, y) || b_hit_to_text_rect)) {
                            return DRAWING_ARRAY_TYPE_WRAPPING;
                        }
                    }
                }
                cur_page_array = hdr_footer_objects.behindDocArray;
                for (index = 0; index < cur_page_array.length; ++index) {
                    if (!cur_page_array[index].isShapeChild()) {
                        if (cur_page_array[index].GraphicObj.isGroup()) {
                            b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y).hit;
                        } else {
                            b_hit_to_text_rect = cur_page_array[index].hitToTextRect(x, y);
                        }
                        if ((cur_page_array[index].hit(x, y) || b_hit_to_text_rect)) {
                            return DRAWING_ARRAY_TYPE_BEHIND;
                        }
                    }
                }
            }
        }
        return -1;
    },
    isPointInDrawingObjects2: function (x, y, pageIndex, epsilon) {
        switch (this.curState.id) {
        case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            var group = this.curState.group;
            var group_sel_arr = group.selectionInfo.selectionArray;
            var group_page_index = group.pageIndex;
            var group_page_x, group_page_y;
            if (group_page_index === pageIndex) {
                group_page_x = x;
                group_page_y = y;
            } else {
                var group_page_coords = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, group_page_index);
                group_page_x = group_page_coords.X;
                group_page_y = group_page_coords.Y;
            }
            var group_x, group_y;
            group_x = group_page_x;
            group_y = group_page_y;
            if (group_sel_arr.length === 1) {
                if (typeof group_sel_arr[0].hitToAdj === "function") {
                    if (group_sel_arr[0].hitToAdj(group_x, group_y, epsilon).hit === true) {
                        return true;
                    }
                }
            }
            for (var i = group_sel_arr.length - 1; i > -1; --i) {
                if (typeof group_sel_arr[i].hitToHandle === "function") {
                    if (group_sel_arr[i].hitToHandle(group_x, group_y, epsilon).hit === true) {
                        return true;
                    }
                }
            }
            for (i = group_sel_arr.length - 1; i > -1; --i) {
                if (typeof group_sel_arr[i].hit === "function") {
                    if (group_sel_arr[i].hit(group_x, group_y) === true && !group_sel_arr[i].hitToTextRect(group_page_x, group_page_y)) {
                        return true;
                    }
                }
            }
            if (group.hitToHandle(group_page_x, group_page_y, epsilon).hit === true && !group.hitToTextRect(group_page_x, group_page_y).hit) {
                return true;
            }
            break;
        default:
            var sel_arr = this.selectionInfo.selectionArray;
            var object_x, object_y;
            if (sel_arr.length === 1) {
                if (isRealObject(sel_arr[0].GraphicObj) && typeof sel_arr[0].GraphicObj.hitToAdj === "function") {
                    if (pageIndex === sel_arr[0].pageIndex) {
                        object_x = x;
                        object_y = y;
                    } else {
                        var object_coords = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, sel_arr[0].pageIndex);
                        object_x = object_coords.X;
                        object_y = object_coords.Y;
                    }
                    if (sel_arr[0].GraphicObj.hitToAdj(object_x, object_y).hit === true) {
                        return true;
                    }
                }
            }
            for (i = sel_arr.length - 1; i > -1; --i) {
                if (isRealObject(sel_arr[i].GraphicObj) && typeof sel_arr[i].GraphicObj.hitToHandle === "function") {
                    if (pageIndex === sel_arr[i].pageIndex) {
                        object_x = x;
                        object_y = y;
                    } else {
                        object_coords = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, sel_arr[i].pageIndex);
                        object_x = object_coords.X;
                        object_y = object_coords.Y;
                    }
                    if (sel_arr[i].GraphicObj.hitToHandle(object_x, object_y).hit === true) {
                        return true;
                    }
                }
            }
            for (i = sel_arr.length - 1; i > -1; --i) {
                if (isRealObject(sel_arr[i].GraphicObj) && typeof sel_arr[i].GraphicObj.hit === "function") {
                    if (pageIndex === sel_arr[i].pageIndex) {
                        object_x = x;
                        object_y = y;
                    } else {
                        object_coords = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, sel_arr[i].pageIndex);
                        object_x = object_coords.X;
                        object_y = object_coords.Y;
                    }
                    var hit_to_text = sel_arr[i].hitToTextRect(object_x, object_y);
                    if (sel_arr[i].GraphicObj instanceof WordGroupShapes) {
                        hit_to_text = hit_to_text.hit;
                    }
                    if (sel_arr[i].GraphicObj.hit(object_x, object_y) === true && !hit_to_text) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    pointInObjInDocContent: function (docContent, X, Y, pageIndex) {
        var x = X,
        y = Y;
        var page_index;
        switch (this.curState.id) {
        case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            var group = this.curState.group;
            var sel_objects = group.selectionInfo.selectionArray;
            var group_page_index;
            if (isRealObject(group.parent) && isRealObject(group.parent.Parent) && isRealObject(group.parent.Parent.Parent) && group.parent.Parent.Parent.Is_HdrFtr()) {
                if (typeof group.selectStartPage === "number" && group.selectStartPage > -1) {
                    group_page_index = group.selectStartPage;
                } else {
                    group_page_index = group.pageIndex;
                }
            } else {
                group_page_index = group.pageIndex;
            }
            if (! (isRealObject(group.parent) && isRealObject(group.parent.Parent) && isRealObject(group.parent.Parent.Parent) && typeof group.parent.Parent.Parent.Is_TopDocument === "function" && group.parent.Parent.Parent.Is_TopDocument(true) === docContent)) {
                break;
            }
            var tx, ty;
            if (pageIndex === group_page_index) {
                tx = x;
                ty = y;
            } else {
                var tp = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, group_page_index);
                tx = tp.X;
                ty = tp.Y;
            }
            if (sel_objects.length > 0) {
                if (sel_objects.length === 1) {
                    if (typeof sel_objects[0].hitToAdj === "function") {
                        if (sel_objects[0].hitToAdj(tx, ty).hit) {
                            return true;
                        }
                    }
                }
                for (var i = sel_objects.length - 1; i > -1; --i) {
                    if (typeof sel_objects[i].hitToHandle === "function") {
                        if (sel_objects[i].hitToHandle(tx, ty).hit) {
                            return true;
                        }
                    }
                    if (typeof sel_objects[i].hitInBox === "function") {
                        if (sel_objects[i].hitInBox(tx, ty)) {
                            return true;
                        }
                    }
                }
                if (group.hitToHandle(tx, ty).hit || group.hitInBox(tx, ty)) {
                    return true;
                }
            }
            break;
        case STATES_ID_START_CHANGE_WRAP:
            var para_drawing = this.curState.wordGraphicObject;
            if (isRealObject(para_drawing) && isRealObject(para_drawing.Parent) && isRealObject(para_drawing.Parent.Parent) && para_drawing.Parent.Parent.Is_HdrFtr() && isRealObject(para_drawing.GraphicObj) && typeof para_drawing.GraphicObj.selectStartPage === "number" && para_drawing.GraphicObj.selectStartPage > -1) {
                page_index = para_drawing.GraphicObj.selectStartPage;
            } else {
                page_index = para_drawing.pageIndex;
            }
            if (! (isRealObject(para_drawing) && isRealObject(para_drawing.Parent) && isRealObject(para_drawing.Parent.Parent) && typeof para_drawing.Parent.Parent.Is_TopDocument === "function" && para_drawing.Parent.Parent.Is_TopDocument(true) === docContent)) {
                break;
            }
            if (page_index === pageIndex) {
                tx = x;
                ty = y;
            } else {
                tp = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, page_index);
                tx = tp.X;
                ty = tp.Y;
            }
            if (para_drawing.hitToWrapPolygonPoint(tx, ty).hit) {
                return true;
            }
            break;
        default:
            sel_objects = this.selectionInfo.selectionArray;
            for (i = sel_objects.length - 1; i > -1; --i) {
                para_drawing = sel_objects[i];
                if (! (isRealObject(para_drawing) && isRealObject(para_drawing.Parent) && isRealObject(para_drawing.Parent.Parent) && typeof para_drawing.Parent.Parent.Is_TopDocument === "function" && para_drawing.Parent.Parent.Is_TopDocument(true) === docContent)) {
                    continue;
                }
                if (isRealObject(para_drawing) && isRealObject(para_drawing.Parent) && isRealObject(para_drawing.Parent.Parent) && para_drawing.Parent.Parent.Is_HdrFtr() && isRealObject(para_drawing.GraphicObj) && typeof para_drawing.GraphicObj.selectStartPage === "number" && para_drawing.GraphicObj.selectStartPage > -1) {
                    page_index = para_drawing.GraphicObj.selectStartPage;
                } else {
                    page_index = para_drawing.pageIndex;
                }
                if (page_index === pageIndex) {
                    tx = x;
                    ty = y;
                } else {
                    tp = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, page_index);
                    tx = tp.X;
                    ty = tp.Y;
                }
                if (sel_objects.length === 1 && isRealObject(sel_objects[0]) && typeof sel_objects[0].hitToAdj === "function") {
                    var hit_to_adj = sel_objects[0].hitToAdj(tx, ty);
                    if (isRealObject(hit_to_adj) && hit_to_adj.hit === true) {
                        return true;
                    }
                }
                if (para_drawing.hitToHandle(tx, ty).hit || (isRealObject(para_drawing.GraphicObj) && typeof para_drawing.GraphicObj.hitInBox === "function" && para_drawing.GraphicObj.hitInBox(tx, ty))) {
                    return true;
                }
            }
        }
        var hdr_ftr = docContent.Is_HdrFtr(true);
        var arr, tables;
        if (isRealObject(hdr_ftr)) {
            var parent = docContent.Parent;
            var hdr_ftr_content = hdr_ftr.Content.Content[0];
            var hdr_footer_objects = null;
            if (pageIndex === 0) {
                hdr_footer_objects = this.firstPage;
            } else {
                if (pageIndex % 2 === 1) {
                    hdr_footer_objects = this.evenPage;
                } else {
                    hdr_footer_objects = this.oddPage;
                }
            }
            if (hdr_footer_objects) {
                arr = [hdr_footer_objects.beforeTextArray, hdr_footer_objects.wrappingArray, hdr_footer_objects.inlineArray, hdr_footer_objects.behindDocArray];
                tables = hdr_footer_objects.floatTables;
            }
            if (Array.isArray(arr)) {
                for (i = 0; i < arr.length; ++i) {
                    var g_arr = arr[i];
                    for (var j = g_arr.length - 1; j > -1; --j) {
                        var o = g_arr[j];
                        if (isRealObject(o) && isRealObject(o.Parent) && isRealObject(o.Parent.Parent) && o.Parent.Parent.Is_HdrFtr(true) === hdr_ftr && typeof o.Parent.Parent.Is_TopDocument === "function" && o.Parent.Parent.Is_TopDocument(true) === docContent) {
                            var b_hit_text;
                            var hit_to_text = o.hitToTextRect(X, Y);
                            if (isRealObject(o.GraphicObj)) {
                                if (o.GraphicObj.isGroup()) {
                                    b_hit_text = hit_to_text.hit;
                                } else {
                                    b_hit_text = hit_to_text;
                                }
                            } else {
                                b_hit_text = hit_to_text;
                            }
                            if (o.hit(X, Y) || o.hitToPath(X, Y) || b_hit_text) {
                                return true;
                            }
                        }
                    }
                }
            }
            if (Array.isArray(tables)) {
                for (i = tables.length - 1; i > -1; --i) {
                    var t = tables[i];
                    if (isRealObject(t) && isRealObject(t.Table) && t.Table.Parent.Is_HdrFtr(true) === hdr_ftr && typeof t.Table.Parent.Is_TopDocument === "function" && t.Table.Parent.Is_TopDocument(true) === docContent) {
                        if (t.IsPointIn(X, Y)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    },
    pointInSelectedObject: function (x, y, pageIndex) {
        switch (this.curState.id) {
        case STATES_ID_GROUP:
            var doc_content;
            var page_num;
            if (isRealObject(this.curState.group) && isRealObject(this.curState.group.parent) && isRealObject(this.curState.group.parent.Parent) && isRealObject(this.curState.group.parent.Parent.Parent) && typeof this.curState.group.parent.Parent.Parent.Is_HdrFtr === "function") {
                if (!this.curState.group.parent.Parent.Parent.Is_HdrFtr()) {
                    page_num = this.curState.group.selectStartPage;
                } else {
                    page_num = this.curState.group.parent.PageNum;
                }
                var tx, ty;
                if (page_num === pageIndex) {
                    tx = x;
                    ty = y;
                } else {
                    var tp = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, page_num);
                    tx = tp.X;
                    ty = tp.Y;
                }
                var group_sel_arr = this.curState.group.selectionInfo.selectionArray;
                if (group_sel_arr.length === 1) {
                    if (isRealObject(group_sel_arr[0]) && typeof group_sel_arr[0].hitToAdj === "function") {
                        var hit_to_adj = group_sel_arr[0].hitToAdj(tx, ty);
                        if (isRealObject(hit_to_adj) && hit_to_adj.hit === true) {
                            return true;
                        }
                    }
                }
                for (var i = group_sel_arr.length - 1; i > -1; --i) {
                    if (isRealObject(group_sel_arr[i]) && typeof group_sel_arr[i].hitToHandle === "function") {
                        var hit_to_handle = group_sel_arr[i].hitToHandle(tx, ty);
                        if (isRealObject(hit_to_handle) && hit_to_handle.hit === true) {
                            return true;
                        }
                    }
                }
                if (page_num === pageIndex) {
                    var hit_to_text_rect_obj = this.curState.group.hitToTextRect(tx, ty);
                    var hit_to_text_rect = isRealObject(hit_to_text_rect_obj) && hit_to_text_rect_obj.hit === true;
                    if (hit_to_text_rect || this.curState.group.hit(tx, ty) === true) {
                        return true;
                    }
                }
            }
            break;
        default:
            if (this.curState.id === STATES_ID_START_CHANGE_WRAP) {
                var page_num;
                if (isRealObject(this.curState.wordGraphicObject) && isRealObject(this.curState.group) && isRealObject(this.curState.wordGraphicObject.Parent) && isRealObject(this.curState.wordGraphicObject.Parent.Parent) && typeof this.curState.wordGraphicObject.Parent.Parent.Is_HdrFtr === "function" && typeof this.curState.wordGraphicObject.hitToWrapPolygonPoint === "function") {
                    if (!this.curState.wordGraphicObject.Parent.Parent.Is_HdrFtr()) {
                        page_num = this.curState.wordGraphicObject.PageNum;
                    } else {
                        if (isRealObject(this.curState.wordGraphicObject.GraphicObj)) {
                            page_num = this.curState.wordGraphicObject.GraphicObj.selectStartPage;
                        } else {
                            page_num = this.curState.wordGraphicObject.PageNum;
                        }
                    }
                    if (page_num === pageIndex) {
                        var hit_to_wrap_polygon_obj = this.curState.wordGraphicObject.hitToWrapPolygonPoint(x, y);
                        if (isRealObject(hit_to_wrap_polygon_obj) && hit_to_wrap_polygon_obj.hit === true) {
                            return true;
                        }
                    }
                }
            }
            var page_num;
            var sel_arr = this.selectionInfo.selectionArray;
            if (sel_arr.length === 1) {
                if (isRealObject(sel_arr[0]) && isRealObject(sel_arr[0].Parent) && isRealObject(sel_arr[0].Parent.Parent) && typeof sel_arr[0].Parent.Parent.Is_HdrFtr === "function") {
                    if (!sel_arr[0].Parent.Parent.Is_HdrFtr()) {
                        page_num = sel_arr[0].PageNum;
                    } else {
                        if (isRealObject(sel_arr[0].GraphicObj)) {
                            page_num = sel_arr[0].GraphicObj.selectStartPage;
                        } else {
                            page_num = sel_arr[0].PageNum;
                        }
                    }
                    var tx, ty;
                    if (page_num === pageIndex) {
                        tx = x;
                        ty = y;
                    } else {
                        var tp = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, page_num);
                        tx = tp.X;
                        ty = tp.Y;
                    }
                    if (sel_arr[0].hitToAdj(tx, ty).hit) {
                        return true;
                    }
                }
            }
            for (var i = sel_arr.length - 1; i > -1; --i) {
                if (isRealObject(sel_arr[i]) && isRealObject(sel_arr[i].Parent) && isRealObject(sel_arr[i].Parent.Parent) && typeof sel_arr[i].Parent.Parent.Is_HdrFtr === "function") {
                    if (!sel_arr[i].Parent.Parent.Is_HdrFtr()) {
                        page_num = sel_arr[i].PageNum;
                    } else {
                        if (isRealObject(sel_arr[i].GraphicObj)) {
                            page_num = sel_arr[i].GraphicObj.selectStartPage;
                        } else {
                            page_num = sel_arr[i].PageNum;
                        }
                    }
                    var tx, ty;
                    if (page_num === pageIndex) {
                        tx = x;
                        ty = y;
                    } else {
                        var tp = this.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, page_num);
                        tx = tp.X;
                        ty = tp.Y;
                    }
                    if (sel_arr[i].hitToHandle(tx, ty).hit) {
                        return true;
                    }
                    if (page_num === pageIndex) {
                        var b_hit_to_text = false;
                        if (isRealObject(sel_arr[i].GraphicObj)) {
                            if (sel_arr[i].GraphicObj.isGroup()) {
                                b_hit_to_text = sel_arr[i].GraphicObj.hitToTextRect(tx, ty).hit;
                            } else {
                                b_hit_to_text = sel_arr[i].GraphicObj.hitToTextRect(tx, ty);
                            }
                        } else {
                            b_hit_to_text = false;
                        }
                        if (b_hit_to_text || sel_arr[i].hit(tx, ty)) {
                            return true;
                        }
                    }
                }
            }
            break;
        }
        return false;
    },
    canChangeWrapPolygon: function () {
        if (this.curState.id === STATES_ID_NULL || this.curState.id === STATES_ID_NULL_HF) {
            if (this.selectionInfo.selectionArray.length === 1) {
                return this.selectionInfo.selectionArray[0].canChangeWrapPolygon();
            }
        }
        return false;
    },
    startChangeWrapPolygon: function () {
        if (this.canChangeWrapPolygon()) {
            this.selectionInfo.selectionArray[0].recalculateWrapPolygon();
            this.changeCurrentState(new StartChangeWrapContourState(this, this.selectionInfo.selectionArray[0]));
            this.drawingDocument.m_oWordControl.OnUpdateOverlay();
        }
    },
    getObjectByXY: function (x, y, pageIndex) {
        return this.graphicPages[pageIndex].getObjectByXY(x, y);
    },
    resetAllPagesDrawingArrays: function () {
        var pages = this.graphicPages;
        var pages_count = pages.length;
        if (this.firstPage != null) {
            this.firstPage.behindDocArray = [];
            this.firstPage.wrappingArray = [];
            this.firstPage.inlineArray = [];
            this.firstPage.beforeTextArray = [];
        }
        if (this.oddPage != null) {
            this.oddPage.behindDocArray = [];
            this.oddPage.wrappingArray = [];
            this.oddPage.inlineArray = [];
            this.oddPage.beforeTextArray = [];
        }
        if (this.evenPage != null) {
            this.evenPage.behindDocArray = [];
            this.evenPage.wrappingArray = [];
            this.evenPage.inlineArray = [];
            this.evenPage.beforeTextArray = [];
        }
        for (var page_index = 0; page_index < pages_count; ++page_index) {
            pages[page_index].resetDrawingArrays();
        }
    },
    getObjectById: function (id) {
        if (isRealObject(this.objectsMap["_" + id])) {
            return this.objectsMap["_" + id];
        }
        return null;
    },
    removeById: function (pageIndex, id) {
        var object = this.getObjectById(id);
        if (isRealObject(object)) {
            var hdr_ftr = object.DocumentContent.Is_HdrFtr(true);
            if (hdr_ftr != null) {
                var hdr_footer_objects = this.firstPage;
                if (hdr_footer_objects) {
                    var array;
                    array = hdr_footer_objects.inlineArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.behindDocArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.beforeTextArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.wrappingArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
                hdr_footer_objects = this.oddPage;
                if (hdr_footer_objects) {
                    var array;
                    array = hdr_footer_objects.inlineArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.behindDocArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.beforeTextArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.wrappingArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
                hdr_footer_objects = this.evenPage;
                if (hdr_footer_objects) {
                    var array;
                    array = hdr_footer_objects.inlineArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.behindDocArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.beforeTextArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                    array = hdr_footer_objects.wrappingArray;
                    if (array) {
                        for (var i = 0; i < array.length; ++i) {
                            if (array[i] == object) {
                                array.splice(i, 1);
                                return;
                            }
                        }
                    }
                }
            } else {
                var page = this.graphicPages[object.pageIndex];
                if (isRealObject(page)) {
                    var array_type = object.getDrawingArrayType();
                    page.delObjectById(id, array_type);
                }
            }
        }
    },
    Remove_ById: function () {},
    selectById: function (id, pageIndex) {
        this.resetSelection();
        var object = this.getObjectById(id);
        if (object.selected === false) {
            this.selectionInfo.selectionArray.push(object);
            object.select(pageIndex);
        }
    },
    calculateAfterChangeTheme: function () {
        for (var i = 0; i < this.drawingOjects.length; ++i) {
            this.drawingOjects[i].calculateAfterChangeTheme();
        }
        editor.SyncLoadImages(this.urlMap);
        this.urlMap = [];
    },
    isElementOnPage: function (id, pageIndex) {
        return isRealObject(this.graphicPages[pageIndex].objectsMap["_" + id]);
    },
    updateSelectionState: function () {
        return;
        if (this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            this.curState.textObject.updateSelectionState();
        } else {
            if (this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP || this.curState.id === STATES_ID_CHART_TITLE_TEXT) {
                this.curState.title.updateSelectionState();
            } else {
                this.drawingDocument.SelectClear();
                this.drawingDocument.TargetEnd();
            }
        }
    },
    drawSelectionPage: function (pageIndex) {
        if (this.document.CurPos.Type !== docpostype_HdrFtr) {
            if (this.curState.id === STATES_ID_TEXT_ADD) {
                if (this.curState.textObject.PageNum === pageIndex) {
                    this.curState.textObject.GraphicObj.textBoxContent.Selection_Draw_Page(pageIndex);
                }
            } else {
                if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                    if (this.curState.textObject.pageIndex === pageIndex) {
                        this.curState.textObject.textBoxContent.Selection_Draw_Page(pageIndex);
                    }
                } else {
                    if (this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP || this.curState.id === STATES_ID_CHART_TITLE_TEXT) {
                        if (this.curState.chart.pageIndex === pageIndex) {
                            this.curState.title.txBody.content.Selection_Draw_Page(pageIndex);
                        }
                    }
                }
            }
        } else {
            if (this.curState.id === STATES_ID_TEXT_ADD) {
                if (this.curState.textObject.GraphicObj.selectStartPage === pageIndex) {
                    this.curState.textObject.GraphicObj.textBoxContent.Selection_Draw_Page(pageIndex);
                }
            } else {
                if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                    if (this.curState.textObject.selectStartPage === pageIndex) {
                        this.curState.textObject.textBoxContent.Selection_Draw_Page(pageIndex);
                    }
                } else {
                    if (this.curState.id === STATES_ID_CHART_TITLE_TEXT_GROUP || this.curState.id === STATES_ID_CHART_TITLE_TEXT) {
                        if (this.curState.chart.pageIndex === pageIndex) {
                            this.curState.title.txBody.content.Selection_Draw_Page(pageIndex);
                        }
                    }
                }
            }
        }
    },
    getAllRasterImagesOnPage: function (pageIndex) {
        var ret = [];
        var graphic_page = this.graphicPages[pageIndex];
        var graphic_arrays = [graphic_page.beforeTextObjects, graphic_page.inlineObjects, graphic_page.wrappingObjects, graphic_page.behindDocObjects];
        var hdr_ftr = null;
        if (pageIndex === 0) {
            hdr_ftr = this.firstPage;
        } else {
            if (pageIndex % 2 === 1) {
                hdr_ftr = this.evenPage;
            } else {
                hdr_ftr = this.oddPage;
            }
        }
        if (isRealObject(hdr_ftr)) {
            graphic_arrays.push(hdr_ftr.beforeTextArray);
            graphic_arrays.push(hdr_ftr.inlineArray);
            graphic_arrays.push(hdr_ftr.wrappingArray);
            graphic_arrays.push(hdr_ftr.behindDocArray);
        }
        for (var k = 0; k < graphic_arrays.length; ++k) {
            var cur_drawing_array = graphic_arrays[k];
            for (var i = 0; i < cur_drawing_array.length; ++i) {
                var cur_obj = cur_drawing_array[i];
                if (isRealObject(cur_obj.GraphicObj)) {
                    if (cur_obj.GraphicObj.isImage() && isRealObject(cur_obj.GraphicObj.blipFill)) {
                        ret.push(cur_obj.GraphicObj.blipFill.RasterImageId);
                    }
                    if (cur_obj.GraphicObj.isShape() || cur_obj.GraphicObj.chart) {
                        var sp = cur_obj.GraphicObj;
                        if (isRealObject(sp) && isRealObject(sp.brush) && isRealObject(sp.brush.fill) && sp.brush.fill.type === FILL_TYPE_BLIP && typeof sp.brush.fill.RasterImageId === "string") {
                            ret.push(sp.brush.fill.RasterImageId);
                        }
                    }
                    if (cur_obj.GraphicObj.isGroup()) {
                        var sp_tree = cur_obj.GraphicObj.spTree;
                        for (var j = 0; j < sp_tree.length; ++j) {
                            if (sp_tree[j].isImage()) {
                                ret.push(sp_tree[j].blipFill.RasterImageId);
                            }
                            if (sp_tree[j].isShape()) {
                                sp = sp_tree[j];
                                if (isRealObject(sp) && isRealObject(sp.brush) && isRealObject(sp.brush.fill) && sp.brush.fill.type === FILL_TYPE_BLIP && typeof sp.brush.fill.RasterImageId === "string") {
                                    ret.push(sp.brush.fill.RasterImageId);
                                }
                            }
                        }
                    }
                }
            }
        }
        return ret;
    },
    addNewParagraph: function (bRecalculate) {
        if (this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            this.curState.textObject.addNewParagraph(bRecalculate);
            this.drawingDocument.OnRecalculatePage(this.curState.textObject.pageIndex, this.document.Pages[this.curState.textObject.pageIndex]);
            this.drawingDocument.OnEndRecalculate(false, false);
        }
    },
    paragraphClearFormatting: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            this.curState.textObject.paragraphClearFormatting();
            this.drawingDocument.OnRecalculatePage(this.curState.textObject.pageIndex, this.document.Pages[this.curState.textObject.pageIndex]);
            this.drawingDocument.OnEndRecalculate(false, false);
        }
    },
    setParagraphSpacing: function (Spacing) {
        if (this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            this.curState.textObject.setParagraphSpacing(Spacing);
        } else {
            if (this.curState.id === STATES_ID_GROUP) {
                var gr_sel_array = this.curState.group.selectionInfo.selectionArray;
                if (gr_sel_array.length === 1) {
                    if (isRealObject(gr_sel_array[0].textBoxContent)) {
                        gr_sel_array[0].textBoxContent.Set_ApplyToAll(true);
                        gr_sel_array[0].textBoxContent.Set_ParagraphSpacing(Spacing);
                        gr_sel_array[0].textBoxContent.Set_ApplyToAll(false);
                    }
                }
            } else {
                var sel_arr = this.selectionInfo.selectionArray;
                if (sel_arr.length === 1) {
                    if (isRealObject(sel_arr[0].GraphicObj) && isRealObject(sel_arr[0].GraphicObj.textBoxContent)) {
                        sel_arr[0].GraphicObj.textBoxContent.Set_ApplyToAll(true);
                        sel_arr[0].GraphicObj.textBoxContent.Set_ParagraphSpacing(Spacing);
                        sel_arr[0].GraphicObj.textBoxContent.Set_ApplyToAll(false);
                    }
                }
            }
        }
        this.document.Recalculate();
    },
    setParagraphTabs: function (Tabs) {
        if (this.curState.id === STATES_ID_TEXT_ADD || this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            this.curState.textObject.setParagraphTabs(Tabs);
        }
        this.document.Recalculate();
    },
    setParagraphNumbering: function (NumInfo) {
        var cur_state = this.curState;
        if (cur_state.id === STATES_ID_TEXT_ADD || cur_state.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            cur_state.textObject.setParagraphNumbering(NumInfo);
        } else {
            if (cur_state.id === STATES_ID_NULL) {
                var selected_array = this.selectionInfo.selectionArray;
                if (selected_array.length === 1 && typeof selected_array[0].GraphicObj.setParagraphNumbering === "function" && isRealObject(selected_array[0].GraphicObj.textBoxContent)) {
                    this.changeCurrentState(new TextAddState(this, selected_array[0]));
                    selected_array[0].setAllParagraphNumbering(NumInfo);
                }
            }
        }
        this.document.Recalculate();
    },
    setParagraphShd: function (Shd) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.setParagraphShd(Shd);
            var page_index = this.curState.textObject.pageIndex;
            this.drawingDocument.OnRecalculatePage(page_index, this.document.Pages[page_index]);
            this.drawingDocument.OnEndRecalculate(true, false);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.setParagraphShd === "function") {
                this.curState.textObject.setParagraphShd(Shd);
                page_index = this.curState.textObject.pageIndex;
                this.drawingDocument.OnRecalculatePage(page_index, this.document.Pages[page_index]);
                this.drawingDocument.OnEndRecalculate(true, false);
            }
            break;
        case STATES_ID_GROUP:
            var sel_array = this.curState.group.selectionInfo.selectionArray;
            var b_redraw = false;
            for (var i = 0; i < sel_array.length; ++i) {
                if (typeof sel_array[i].setAllParagraphsShd === "function") {
                    sel_array[i].setAllParagraphsShd(Shd);
                    b_redraw = true;
                }
            }
            page_index = this.curState.group.pageIndex;
            if (b_redraw) {
                this.drawingDocument.OnRecalculatePage(page_index, this.document.Pages[page_index]);
                this.drawingDocument.OnEndRecalculate(true, false);
            }
            break;
        default:
            b_redraw = false;
            sel_array = this.selectionInfo.selectionArray;
            var arr_pages = [];
            for (i = 0; i < sel_array.length; ++i) {
                if (isRealObject(sel_array[i].GraphicObj) && typeof sel_array[i].GraphicObj.setAllParagraphsShd === "function") {
                    sel_array[i].GraphicObj.setAllParagraphsShd(Shd);
                    b_redraw = true;
                    page_index = sel_array[i].pageIndex;
                    for (var j = 0; j < arr_pages.length; ++j) {
                        if (arr_pages[j] === page_index) {
                            break;
                        }
                    }
                    if (j === arr_pages.length) {
                        arr_pages.push(page_index);
                    }
                }
            }
            if (b_redraw) {
                arr_pages.sort();
            }
            break;
        }
        this.document.Recalculate();
    },
    setParagraphStyle: function (Style) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.setParagraphStyle(Style);
        } else {
            if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                if (typeof this.curState.textObject.setParagraphStyle === "function") {
                    this.curState.textObject.setParagraphStyle(Style);
                }
            } else {
                if (this.curState.id === STATES_ID_GROUP) {
                    var gr_sel_array = this.curState.group.selectionInfo.selectionArray;
                    if (gr_sel_array.length === 1) {
                        if (isRealObject(gr_sel_array[0].textBoxContent)) {
                            gr_sel_array[0].textBoxContent.Set_ApplyToAll(true);
                            gr_sel_array[0].textBoxContent.Set_ParagraphStyle(Style);
                            gr_sel_array[0].textBoxContent.Set_ApplyToAll(false);
                        }
                    }
                } else {
                    var sel_arr = this.selectionInfo.selectionArray;
                    if (sel_arr.length === 1) {
                        if (isRealObject(sel_arr[0].GraphicObj) && isRealObject(sel_arr[0].GraphicObj.textBoxContent)) {
                            sel_arr[0].GraphicObj.textBoxContent.Set_ApplyToAll(true);
                            sel_arr[0].GraphicObj.textBoxContent.Set_ParagraphStyle(Style);
                            sel_arr[0].GraphicObj.textBoxContent.Set_ApplyToAll(false);
                        }
                    }
                }
            }
        }
        this.document.Recalculate();
    },
    setParagraphContextualSpacing: function (Value) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.setParagraphContextualSpacing(Value);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.setParagraphContextualSpacing === "function") {
                this.curState.textObject.setParagraphContextualSpacing(Value);
            }
        }
        this.document.Recalculate();
    },
    setParagraphPageBreakBefore: function (Value) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.setParagraphPageBreakBefore(Value);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.setParagraphPageBreakBefore === "function") {
                this.curState.textObject.setParagraphPageBreakBefore(Value);
            }
        }
        this.document.Recalculate();
    },
    setParagraphKeepLines: function (Value) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.setParagraphKeepLines(Value);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.setParagraphKeepLines === "function") {
                this.curState.textObject.setParagraphKeepLines(Value);
            }
        }
        this.document.Recalculate();
    },
    setParagraphKeepNext: function (Value) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.setParagraphKeepNext(Value);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.setParagraphKeepNext === "function") {
                this.curState.textObject.setParagraphKeepNext(Value);
            }
        }
        this.document.Recalculate();
    },
    setParagraphWidowControl: function (Value) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.setParagraphWidowControl(Value);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.setParagraphWidowControl === "function") {
                this.curState.textObject.setParagraphWidowControl(Value);
            }
        }
        this.document.Recalculate();
    },
    setParagraphBorders: function (Value) {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            this.curState.textObject.setParagraphBorders(Value);
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.setParagraphBorders === "function") {
                this.curState.textObject.setParagraphBorders(Value);
            }
        }
        this.document.Recalculate();
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        var selected_array = this.selectionInfo.selectionArray;
        var cur_state = this.curState;
        if (cur_state.id === STATES_ID_TEXT_ADD || cur_state.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            var parent;
            if (cur_state.textObject instanceof ParaDrawing) {
                parent = cur_state.textObject;
            } else {
                var cur_group;
                if (cur_state.textObject.group != null) {
                    var cur_group = cur_state.textObject.group;
                    while (isRealObject(cur_group.group)) {
                        cur_group = cur_group.group;
                    }
                    if (isRealObject(cur_group.parent) && cur_group.parent instanceof ParaDrawing) {
                        parent = cur_group.parent;
                    }
                }
            }
            if (isRealObject(parent) && isRealObject(parent.Parent)) {
                cur_state.textObject.paragraphAdd(paraItem, bRecalculate);
            }
        } else {
            if (cur_state.id === STATES_ID_NULL || cur_state.id === STATES_ID_NULL_HF) {
                var selected_array = this.selectionInfo.selectionArray;
                if (paraItem.Type === para_TextPr) {
                    for (var sel_index = 0; sel_index < selected_array.length; ++sel_index) {
                        selected_array[sel_index].applyTextPr(paraItem, bRecalculate);
                    }
                } else {
                    if (selected_array.length === 1 && typeof selected_array[0].GraphicObj.isShape === "function" && selected_array[0].GraphicObj.isShape() && !CheckLinePreset(selected_array[0].GraphicObj.getPresetGeom())) {
                        this.changeCurrentState(new TextAddState(this, selected_array[0]));
                        selected_array[0].paragraphAdd(paraItem, bRecalculate);
                    } else {
                        if (selected_array.length > 0) {
                            selected_array[0].GoTo_Text();
                            this.resetSelection();
                        }
                    }
                }
            } else {
                if (cur_state.id === STATES_ID_GROUP) {
                    selected_array = cur_state.group.selectionInfo.selectionArray;
                    if (paraItem.Type === para_TextPr) {
                        for (sel_index = 0; sel_index < selected_array.length; ++sel_index) {
                            if (typeof selected_array[sel_index].applyTextPr === "function") {
                                selected_array[sel_index].applyTextPr(paraItem, bRecalculate);
                            }
                        }
                        this.drawingDocument.OnRecalculatePage(cur_state.group.pageIndex, this.document.Pages[cur_state.group.pageIndex]);
                        this.drawingDocument.OnEndRecalculate(false, false);
                    } else {
                        if (selected_array.length === 1 && typeof selected_array[0].paragraphAdd === "function" && selected_array[0].isShape() && !CheckLinePreset(selected_array[0].getPresetGeom())) {
                            if (selected_array[0].group != null) {
                                cur_group = selected_array[0].group;
                                while (isRealObject(cur_group.group)) {
                                    cur_group = cur_group.group;
                                }
                                if (isRealObject(cur_group.parent) && cur_group.parent instanceof ParaDrawing) {
                                    parent = cur_group.parent;
                                }
                            }
                            if (isRealObject(parent) && isRealObject(parent.Parent)) {
                                this.changeCurrentState(new TextAddInGroup(this, selected_array[0], cur_state.group));
                                selected_array[0].paragraphAdd(paraItem, bRecalculate);
                            }
                        } else {
                            this.curState.groupWordGO.GoTo_Text();
                            this.resetSelection();
                        }
                    }
                } else {
                    if (cur_state.id === STATES_ID_CHART_TITLE_TEXT) {
                        var parent = cur_state.chart;
                        if (isRealObject(parent) && isRealObject(parent.Parent)) {
                            cur_state.title.paragraphAdd(paraItem, bRecalculate);
                            this.drawingDocument.OnRecalculatePage(cur_state.chart.pageIndex, this.document.Pages[cur_state.chart.pageIndex]);
                            this.drawingDocument.OnEndRecalculate(false, false);
                        }
                    } else {
                        if (cur_state.id === STATES_ID_CHART) {
                            var selected_title = this.curState.chart.GraphicObj.getSelectedTitle();
                            if (selected_title) {
                                if (paraItem.Type === para_TextPr) {
                                    selected_title.applyTextPr(paraItem, bRecalculate);
                                } else {
                                    this.changeCurrentState(new TextAddInChartTitle(this, selected_array[0], selected_title));
                                    this.paragraphAdd(paraItem, bRecalculate);
                                }
                            }
                            this.drawingDocument.OnRecalculatePage(cur_state.chart.pageIndex, this.document.Pages[cur_state.chart.pageIndex]);
                            this.drawingDocument.OnEndRecalculate(false, false);
                        } else {
                            if (cur_state.id === STATES_ID_CHART_GROUP) {
                                var selected_title = this.curState.chart.getSelectedTitle();
                                if (selected_title) {
                                    if (paraItem.Type === para_TextPr) {
                                        selected_title.applyTextPr(paraItem, bRecalculate);
                                    } else {
                                        this.changeCurrentState(new TextAddInChartTitleGroup(this, cur_state.group, cur_state.chart, selected_title));
                                        this.paragraphAdd(paraItem, bRecalculate);
                                    }
                                }
                                this.drawingDocument.OnRecalculatePage(cur_state.chart.pageIndex, this.document.Pages[cur_state.chart.pageIndex]);
                                this.drawingDocument.OnEndRecalculate(false, false);
                            } else {
                                if (cur_state.id === STATES_ID_CHART_TITLE_TEXT_GROUP) {
                                    cur_state.title.paragraphAdd(paraItem, bRecalculate);
                                    this.drawingDocument.OnRecalculatePage(cur_state.chart.pageIndex, this.document.Pages[cur_state.chart.pageIndex]);
                                    this.drawingDocument.OnEndRecalculate(false, false);
                                }
                            }
                        }
                    }
                }
            }
        }
        this.document.Recalculate();
    },
    paragraphIncDecFontSize: function (bIncrease) {
        switch (this.curState.id) {
        case STATES_ID_NULL:
            var selection_array = this.selectionInfo.selectionArray;
            if (selection_array.length === 1) {
                selection_array[0].allIncreaseDecFontSize(bIncrease);
                this.drawingDocument.OnRecalculatePage(selection_array[0].pageIndex, this.document.Pages[selection_array[0].pageIndex]);
                this.drawingDocument.OnEndRecalculate(false, false);
                return;
            }
            break;
        case STATES_ID_GROUP:
            selection_array = this.curState.group.selectionInfo.selectionArray;
            if (selection_array.length === 1) {
                if (typeof selection_array[0].allIncreaseDecFontSize === "function") {
                    selection_array[0].allIncreaseDecFontSize(bIncrease);
                    this.drawingDocument.OnRecalculatePage(this.curState.group.pageIndex, this.document.Pages[this.curState.group.pageIndex]);
                    this.drawingDocument.OnEndRecalculate(false, false);
                }
            }
            break;
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.paragraphIncreaseDecFontSize === "function") {
                this.curState.textObject.paragraphIncreaseDecFontSize(bIncrease);
                this.drawingDocument.OnRecalculatePage(this.curState.textObject.pageIndex, this.document.Pages[this.curState.textObject.pageIndex]);
                this.drawingDocument.OnEndRecalculate(false, false);
            }
            break;
        }
        this.document.Recalculate();
    },
    paragraphIncDecIndent: function (bIncrease) {
        switch (this.curState.id) {
        case STATES_ID_NULL:
            var selection_array = this.selectionInfo.selectionArray;
            if (selection_array.length === 1) {
                selection_array[0].allIncreaseDecIndent(bIncrease);
                return;
            }
            break;
        case STATES_ID_GROUP:
            selection_array = this.curState.group.selectionInfo.selectionArray;
            if (selection_array.length === 1) {
                if (typeof selection_array[0].paragraphIncreaseDecIndent === "function") {
                    selection_array[0].paragraphIncreaseDecIndent(bIncrease);
                    this.drawingDocument.OnRecalculatePage(this.curState.group.pageIndex, this.document.Pages[this.curState.group.pageIndex]);
                    this.drawingDocument.OnEndRecalculate(false, false);
                }
            }
            break;
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.paragraphIncreaseDecIndent === "function") {
                this.curState.textObject.paragraphIncreaseDecIndent(bIncrease);
                this.drawingDocument.OnRecalculatePage(this.curState.textObject.pageIndex, this.document.Pages[this.curState.textObject.pageIndex]);
                this.drawingDocument.OnEndRecalculate(false, false);
            }
            break;
        }
        this.document.Recalculate();
    },
    setParagraphAlign: function (align) {
        switch (this.curState.id) {
        case STATES_ID_NULL:
            var selection_array = this.selectionInfo.selectionArray;
            if (selection_array.length === 1) {
                selection_array[0].allSetParagraphAlign(align);
                return;
            }
            break;
        case STATES_ID_GROUP:
            selection_array = this.curState.group.selectionInfo.selectionArray;
            if (selection_array.length === 1) {
                if (typeof selection_array[0].setParagraphAlign === "function") {
                    selection_array[0].setParagraphAlign(align);
                }
            }
            break;
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (typeof this.curState.textObject.setParagraphAlign === "function") {
                this.curState.textObject.setParagraphAlign(align);
            }
            break;
        }
        this.document.Recalculate();
    },
    setParagraphIndent: function (indent) {
        switch (this.curState.id) {
        case STATES_ID_TEXT_ADD:
            this.curState.textObject.GraphicObj.textBoxContent.Set_ParagraphIndent(indent);
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            this.curState.textObject.textBoxContent.Set_ParagraphIndent(indent);
            break;
        default:
            if (this.selectionInfo.selectionArray.length === 1) {
                if (isRealObject(this.selectionInfo.selectionArray[0]) && this.selectionInfo.selectionArray[0].GraphicObj instanceof WordShape && isRealObject(this.selectionInfo.selectionArray[0].GraphicObj.textBoxContent)) {
                    this.selectionInfo.selectionArray[0].GraphicObj.textBoxContent.Set_ApplyToAll(true);
                    this.selectionInfo.selectionArray[0].GraphicObj.textBoxContent.Set_ParagraphIndent(indent);
                    this.selectionInfo.selectionArray[0].GraphicObj.textBoxContent.Set_ApplyToAll(false);
                } else {
                    if (isRealObject(this.selectionInfo.selectionArray[0]) && isRealObject(this.selectionInfo.selectionArray[0].Parent) && typeof this.selectionInfo.selectionArray[0].Parent.Set_Ind === "function") {
                        this.selectionInfo.selectionArray[0].Parent.Set_Ind(indent, false);
                    }
                }
            }
            break;
        }
        this.document.Recalculate();
    },
    CheckRange: function (X0, Y0, X1, Y1, Y0Sp, Y1Sp, LeftField, RightField, PageNum, HdrFtrRanges, docContent) {
        if (isRealObject(this.graphicPages[PageNum])) {
            var Ranges = this.graphicPages[PageNum].CheckRange(X0, Y0, X1, Y1, Y0Sp, Y1Sp, LeftField, RightField, HdrFtrRanges, docContent);
            var ResultRanges = new Array();
            var Count = Ranges.length;
            for (var Index = 0; Index < Count; Index++) {
                var Range = Ranges[Index];
                if (Range.X1 > X0 && Range.X0 < X1) {
                    Range.X0 = Math.max(X0, Range.X0);
                    Range.X1 = Math.min(X1, Range.X1);
                    ResultRanges.push(Range);
                }
            }
            return ResultRanges;
        }
        return HdrFtrRanges;
    },
    getTableProps: function () {
        if (this.curState.id === STATES_ID_TEXT_ADD) {
            return this.curState.textObject.getTableProps();
        }
        if (this.curState.id === STATES_ID_TEXT_ADD_IN_GROUP) {
            if (typeof this.curState.textObject.getTableProps === "function") {
                return this.curState.textObject.getTableProps();
            }
        }
        return null;
    },
    startAddShape: function (preset) {
        switch (preset) {
        case "spline":
            this.changeCurrentState(new SplineBezierState(this));
            break;
        case "polyline1":
            this.changeCurrentState(new PolyLineAddState(this));
            break;
        case "polyline2":
            this.changeCurrentState(new AddPolyLine2State(this));
            break;
        case "lineWithArrow":
            this.currentPresetGeom = "line";
            this.changeCurrentState(new StartAddNewArrow(this, false, true));
            break;
        case "lineWithTwoArrows":
            this.currentPresetGeom = "line";
            this.changeCurrentState(new StartAddNewArrow(this, true, true));
            break;
        case "bentConnector5WithArrow":
            this.currentPresetGeom = "bentConnector5";
            this.changeCurrentState(new StartAddNewArrow(this, false, true));
            break;
        case "bentConnector5WithTwoArrows":
            this.currentPresetGeom = "bentConnector5";
            this.changeCurrentState(new StartAddNewArrow(this, true, true));
            break;
        case "curvedConnector3WithArrow":
            this.currentPresetGeom = "curvedConnector3";
            this.changeCurrentState(new StartAddNewArrow(this, false, true));
            break;
        case "curvedConnector3WithTwoArrows":
            this.currentPresetGeom = "curvedConnector3";
            this.changeCurrentState(new StartAddNewArrow(this, true, true));
            break;
        case "textRect":
            this.changeCurrentState(new StartAddTextRect(this));
            break;
        default:
            this.currentPresetGeom = preset;
            this.changeCurrentState(new StartAddNewShape(this));
            break;
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_AddHdrFtrGrObjects:
            this.firstPage = data.oldFirst;
            this.evenPage = data.oldEven;
            this.oddPage = data.oldOdd;
            break;
        case historyitem_ChangeColorScheme:
            this.document.theme.themeElements.clrScheme = data.oldScheme;
            editor.WordControl.m_oDrawingDocument.CheckGuiControlColors();
            this.calculateAfterChangeTheme();
            editor.WordControl.m_oDrawingDocument.CheckGuiControlColors();
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_AddHdrFtrGrObjects:
            this.firstPage = data.newFirst;
            this.evenPage = data.newEven;
            this.oddPage = data.newOdd;
            break;
        case historyitem_ChangeColorScheme:
            this.document.theme.themeElements.clrScheme = data.newScheme;
            editor.WordControl.m_oDrawingDocument.CheckGuiControlColors();
            editor.asc_fireCallback("asc_onUpdateChartStyles");
            this.calculateAfterChangeTheme();
            editor.WordControl.m_oDrawingDocument.CheckGuiControlColors();
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_GrObjects);
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_AddHdrFtrGrObjects:
            w.WriteBool(isRealObject(data.newFirst));
            if (isRealObject(data.newFirst)) {
                w.WriteString2(data.newFirst.Get_Id());
            }
            w.WriteBool(isRealObject(data.newEven));
            if (isRealObject(data.newEven)) {
                w.WriteString2(data.newEven.Get_Id());
            }
            w.WriteBool(isRealObject(data.newOdd));
            if (isRealObject(data.newOdd)) {
                w.WriteString2(data.newOdd.Get_Id());
            }
            break;
        case historyitem_ChangeColorScheme:
            data.newScheme.Write_ToBinary2(w);
            break;
        }
    },
    Load_Changes: function (r) {
        var class_type = r.GetLong();
        if (class_type != historyitem_type_GrObjects) {
            return;
        }
        var type = r.GetLong();
        switch (type) {
        case historyitem_AddHdrFtrGrObjects:
            if (r.GetBool()) {
                this.firstPage = g_oTableId.Get_ById(r.GetString2());
            } else {
                this.firstPage = null;
            }
            if (r.GetBool()) {
                this.evenPage = g_oTableId.Get_ById(r.GetString2());
            } else {
                this.evenPage = null;
            }
            if (r.GetBool()) {
                this.oddPage = g_oTableId.Get_ById(r.GetString2());
            } else {
                this.oddPage = null;
            }
            break;
        case historyitem_ChangeColorScheme:
            var clr_scheme = new ClrScheme();
            clr_scheme.Read_FromBinary2(r);
            this.document.theme.themeElements.clrScheme = clr_scheme;
            editor.WordControl.m_oDrawingDocument.CheckGuiControlColors();
            editor.asc_fireCallback("asc_onUpdateChartStyles");
            this.calculateAfterChangeTheme();
            editor.WordControl.m_oDrawingDocument.CheckGuiControlColors();
            break;
        }
    },
    Refresh_RecalcData: function (data) {}
};
function ComparisonByZIndexSimple(obj1, obj2) {
    return obj1.RelativeHeight - obj2.RelativeHeight;
}
function ComparisonByZIndex(obj1, obj2) {
    var array_type1 = obj1.getDrawingArrayType();
    var array_type2 = obj2.getDrawingArrayType();
    if (array_type1 === array_type2) {
        return ComparisonByZIndexSimple(obj1, obj2);
    } else {
        return array_type1 - array_type2;
    }
}
function HeaderFooterGraphicObjects() {
    this.behindDocArray = [];
    this.wrappingArray = [];
    this.inlineArray = [];
    this.beforeTextArray = [];
    this.floatTables = [];
    this.bHeader = false;
    this.bFooter = false;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
HeaderFooterGraphicObjects.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    addHeader: function () {
        this.bHeader = true;
        History.Add(this, {
            Type: historyitem_AddHdr
        });
    },
    addFooter: function () {
        this.bFooter = true;
        History.Add(this, {
            Type: historyitem_AddFtr
        });
    },
    removeHeader: function () {
        this.bHeader = false;
        History.Add(this, {
            Type: historyitem_RemoveHdr
        });
    },
    removeFooter: function () {
        this.bFooter = false;
        History.Add(this, {
            Type: historyitem_RemoveFtr
        });
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_HdrFtrGrObjects);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
        g_oTableId.Add(this, this.Id);
    },
    Refresh_RecalcData: function () {},
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_AddHdr:
            this.bHeader = false;
            break;
        case historyitem_AddFtr:
            this.bFooter = false;
            break;
        case historyitem_RemoveHdr:
            this.bHeader = true;
            break;
        case historyitem_RemoveFtr:
            this.bFooter = true;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_AddHdr:
            this.bHeader = true;
            break;
        case historyitem_AddFtr:
            this.bFooter = true;
            break;
        case historyitem_RemoveHdr:
            this.bHeader = false;
            break;
        case historyitem_RemoveFtr:
            this.bFooter = false;
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_HdrFtrGrObjects);
        w.WriteLong(data.Type);
    },
    Load_Changes: function (r) {
        if (r.GetLong() !== historyitem_type_HdrFtrGrObjects) {
            return;
        }
        switch (r.GetLong()) {
        case historyitem_AddHdr:
            this.bHeader = true;
            break;
        case historyitem_AddFtr:
            this.bFooter = true;
            break;
        case historyitem_RemoveHdr:
            this.bHeader = false;
            break;
        case historyitem_RemoveFtr:
            this.bFooter = false;
            break;
        }
    }
};
function CreateGraphicObjectFromBinary(bin) {}
function CreateImageFromBinary(bin, nW, nH) {
    var w, h;
    if (nW === undefined || nH === undefined) {
        var _image = editor.ImageLoader.map_image_index[bin];
        if (_image != undefined && _image.Image != null && _image.Status == ImageLoadStatus.Complete) {
            var _w = Math.max(1, Page_Width - (X_Left_Margin + X_Right_Margin));
            var _h = Math.max(1, Page_Height - (Y_Top_Margin + Y_Bottom_Margin));
            var bIsCorrect = false;
            if (_image.Image != null) {
                var __w = Math.max(parseInt(_image.Image.width * g_dKoef_pix_to_mm), 1);
                var __h = Math.max(parseInt(_image.Image.height * g_dKoef_pix_to_mm), 1);
                var dKoef = Math.max(__w / _w, __h / _h);
                if (dKoef > 1) {
                    _w = Math.max(5, __w / dKoef);
                    _h = Math.max(5, __h / dKoef);
                    bIsCorrect = true;
                } else {
                    _w = __w;
                    _h = __h;
                }
            }
            w = __w;
            h = __h;
        } else {
            w = 50;
            h = 50;
        }
    } else {
        w = nW;
        h = nH;
    }
    var para_drawing = new ParaDrawing(w, h, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    var word_image = new WordImage(para_drawing, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, null);
    word_image.init(bin, w, h, null, null);
    para_drawing.Set_GraphicObject(word_image);
    return para_drawing;
}
function CreateImageFromBinary2(bin, w, h) {
    var para_drawing = new ParaDrawing(w, h, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    var word_image = new WordImage(para_drawing, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, null);
    word_image.init(bin, w, h, null, null);
    para_drawing.Set_GraphicObject(word_image);
    return para_drawing;
}
function CreateParaDrawingFromBinary(reader, bNoRecalc) {
    var para_drawing = new ParaDrawing(null, null, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    para_drawing.readFromBinaryForCopyPaste(reader, bNoRecalc);
    return para_drawing;
}
function CompareGroups(a, b) {
    if (a.group == null && b.group == null) {
        return 0;
    }
    if (a.group == null) {
        return 1;
    }
    if (b.group == null) {
        return -1;
    }
    var count1 = 0;
    var cur_group = a.group;
    while (cur_group != null) {
        ++count1;
        cur_group = cur_group.group;
    }
    var count2 = 0;
    cur_group = b.group;
    while (cur_group != null) {
        ++count2;
        cur_group = cur_group.group;
    }
    return count1 - count2;
}