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
    this.zIndexManager = new ZIndexManager(this);
    this.curState = new NullState(this);
    this.selectionInfo = {
        selectionArray: []
    };
    this.currentPresetGeom = null;
    this.maximalGraphicObjectZIndex = 1024;
    this.spline = null;
    this.polyline = null;
    this.drawingObjects = [];
    this.objectsMap = {};
    this.urlMap = [];
    this.recalcMap = {};
    this.recalculateMap = {};
    this.selectedObjects = [];
    this.selection = {
        groupSelection: null,
        chartSelection: null,
        textSelection: null,
        wrapPolygonSelection: null
    };
    this.selectedObjects = [];
    this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
    this.nullState = new NullState(this);
    this.bNoCheckChartTextSelection = false;
    this.Id = g_oIdCounter.Get_NewId();
    this.Lock = new CLock();
    g_oTableId.Add(this, this.Id);
}
CGraphicObjects.prototype = {
    handleAdjustmentHit: DrawingObjectsController.prototype.handleAdjustmentHit,
    handleHandleHit: DrawingObjectsController.prototype.handleHandleHit,
    handleMoveHit: DrawingObjectsController.prototype.handleMoveHit,
    rotateTrackObjects: DrawingObjectsController.prototype.rotateTrackObjects,
    handleRotateTrack: DrawingObjectsController.prototype.handleRotateTrack,
    trackResizeObjects: DrawingObjectsController.prototype.trackResizeObjects,
    resetInternalSelection: DrawingObjectsController.prototype.resetInternalSelection,
    handleTextHit: DrawingObjectsController.prototype.handleTextHit,
    Get_Id: function () {
        return this.Id;
    },
    TurnOffCheckChartSelection: function () {
        this.bNoCheckChartTextSelection = true;
    },
    TurnOnCheckChartSelection: function () {
        this.bNoCheckChartTextSelection = false;
    },
    sortDrawingArrays: function () {
        for (var i = 0; i < this.graphicPages.length; ++i) {
            if (this.graphicPages[i]) {
                this.graphicPages[i].sortDrawingArrays();
            }
        }
    },
    getSelectedObjects: function () {
        return this.selectedObjects;
    },
    getTheme: function () {
        return this.document.theme;
    },
    getColorMapOverride: function () {
        return null;
    },
    getDocumentUrl: DrawingObjectsController.prototype.getDocumentUrl,
    isViewMode: function () {
        return editor.isViewMode;
    },
    convertPixToMM: function (v) {
        return this.document.DrawingDocument.GetMMPerDot(v);
    },
    getGraphicInfoUnderCursor: function (pageIndex, x, y) {
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        var ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex, false);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if (ret && ret.cursorType === "text") {
            if ((this.selection.chartSelection && this.selection.chartSelection.selection.textSelection) || (this.selection.groupSelection && this.selection.groupSelection.selection.chartSelection && this.selection.groupSelection.selection.chartSelection.selection.textSelection)) {
                ret = {};
            }
        }
        return ret || {};
    },
    updateCursorType: function (pageIndex, x, y, e, bTextFlag) {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex, bTextFlag);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if (ret) {
            if (ret.cursorType !== "text") {
                this.drawingDocument.SetCursorType(ret.cursorType);
            }
            return true;
        }
        return false;
    },
    createImage: DrawingObjectsController.prototype.createImage,
    getChartObject: DrawingObjectsController.prototype.getChartObject,
    getChartSpace2: DrawingObjectsController.prototype.getChartSpace2,
    clearPreTrackObjects: function () {
        this.arrPreTrackObjects.length = 0;
    },
    addPreTrackObject: function (preTrackObject) {
        this.arrPreTrackObjects.push(preTrackObject);
    },
    clearTrackObjects: function () {
        this.arrTrackObjects.length = 0;
    },
    addTrackObject: function (trackObject) {
        this.arrTrackObjects.push(trackObject);
    },
    swapTrackObjects: function () {
        this.clearTrackObjects();
        for (var i = 0; i < this.arrPreTrackObjects.length; ++i) {
            this.addTrackObject(this.arrPreTrackObjects[i]);
        }
        this.clearPreTrackObjects();
    },
    addToRecalculate: function (object) {
        if (typeof object.Get_Id === "function" && typeof object.recalculate === "function") {
            History.RecalcData_Add({
                Type: historyrecalctype_Drawing,
                Object: object
            });
        }
        return;
    },
    recalculate_: function (data) {
        if (data.All) {
            for (var i = 0; i < this.drawingObjects.length; ++i) {
                if (this.drawingObjects[i].GraphicObj) {
                    if (this.drawingObjects[i].GraphicObj.recalcText) {
                        this.drawingObjects[i].GraphicObj.recalcText();
                    }
                    this.drawingObjects[i].GraphicObj.recalculate();
                }
            }
            for (var i = 0; i < this.drawingObjects.length; ++i) {
                if (this.drawingObjects[i].GraphicObj && this.drawingObjects[i].GraphicObj.recalculateText) {
                    this.drawingObjects[i].GraphicObj.recalculateText();
                }
            }
            this.zIndexManager.startRefreshIndex = 0;
            this.zIndexManager.recalculate();
        } else {
            var map = data.Map;
            for (var key in map) {
                if (map.hasOwnProperty(key)) {
                    map[key].recalculate();
                }
            }
        }
    },
    recalculateText_: function (data) {
        if (data.All) {} else {
            var map = data.Map;
            for (var key in map) {
                if (map.hasOwnProperty(key) && map[key].recalculateText) {
                    map[key].recalculateText();
                }
            }
        }
    },
    recalculate: function () {
        var b_update = false;
        for (var key in this.recalculateMap) {
            if (this.recalculateMap.hasOwnProperty(key)) {
                this.recalculateMap[key].recalculate();
            }
        }
        this.recalculateMap = {};
    },
    addToZIndexManagerAfterOpen: function () {
        this.drawingObjects.sort(ComparisonByZIndexSimple);
        this.zIndexManager.bTurnOff = false;
        for (var i = 0; i < this.drawingObjects.length; ++i) {
            this.zIndexManager.addItem(null, this.drawingObjects[i]);
        }
    },
    selectObject: DrawingObjectsController.prototype.selectObject,
    checkSelectedObjectsForMove: DrawingObjectsController.prototype.checkSelectedObjectsForMove,
    getDrawingPropsFromArray: DrawingObjectsController.prototype.getDrawingPropsFromArray,
    getPropsFromChart: DrawingObjectsController.prototype.getPropsFromChart,
    getSelectedObjectsByTypes: DrawingObjectsController.prototype.getSelectedObjectsByTypes,
    getPageSizesByDrawingObjects: function () {
        var aW = [],
        aH = [];
        var aBPages = [];
        var page_limits;
        if (this.selectedObjects.length > 0) {
            for (var i = 0; i < this.selectedObjects.length; ++i) {
                if (!aBPages[this.selectedObjects[i].selectStartPage]) {
                    page_limits = this.document.Get_PageLimits(this.selectedObjects[i].selectStartPage);
                    aW.push(page_limits.XLimit);
                    aH.push(page_limits.YLimit);
                    aBPages[this.selectedObjects[i].selectStartPage] = true;
                }
            }
            return {
                W: Math.min.apply(Math, aW),
                H: Math.min.apply(Math, aH)
            };
        }
        page_limits = this.document.Get_PageLimits(0);
        return {
            W: page_limits.XLimit,
            H: page_limits.YLimit
        };
    },
    Get_Props: function () {
        var props_by_types = DrawingObjectsController.prototype.getDrawingProps.call(this);
        var para_drawing_props = null;
        for (var i = 0; i < this.selectedObjects.length; ++i) {
            para_drawing_props = this.selectedObjects[i].parent.Get_Props(para_drawing_props);
        }
        var chart_props, shape_props, image_props;
        if (para_drawing_props) {
            if (props_by_types.shapeProps) {
                shape_props = new CImgProperty(para_drawing_props);
                shape_props.ShapeProperties = CreateAscShapePropFromProp(props_by_types.shapeProps);
                shape_props.verticalTextAlign = props_by_types.shapeProps.verticalTextAlign;
                shape_props.Width = props_by_types.shapeProps.w;
                shape_props.Height = props_by_types.shapeProps.h;
            }
            if (props_by_types.imageProps) {
                image_props = new CImgProperty(para_drawing_props);
                image_props.ImageUrl = props_by_types.imageProps.imageUrl;
                image_props.Width = props_by_types.imageProps.w;
                image_props.Height = props_by_types.imageProps.h;
            }
            if (props_by_types.chartProps && !(props_by_types.chartProps.severalCharts === true)) {
                chart_props = new CImgProperty(para_drawing_props);
                chart_props.ChartProperties = props_by_types.chartProps.chartProps;
                chart_props.severalCharts = props_by_types.chartProps.severalCharts;
                chart_props.severalChartStyles = props_by_types.chartProps.severalChartStyles;
                chart_props.severalChartTypes = props_by_types.chartProps.severalChartTypes;
            }
        }
        if (props_by_types.shapeProps) {
            var pr = props_by_types.shapeProps;
            if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == FILL_TYPE_BLIP) {
                this.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
            } else {
                this.drawingDocument.DrawImageTextureFillShape(null);
            }
        } else {
            this.drawingDocument.DrawImageTextureFillShape(null);
        }
        var ret = [];
        if (isRealObject(shape_props)) {
            ret.push(shape_props);
        }
        if (isRealObject(image_props)) {
            ret.push(image_props);
        }
        if (isRealObject(chart_props)) {
            ret.push(chart_props);
        }
        return ret;
    },
    setProps: function (props) {
        var apply_props;
        if (props.Group === 1) {
            this.groupSelectedObjects();
        } else {
            if (props.Group === -1) {
                this.unGroupSelectedObjects();
            } else {
                if (isRealNumber(props.ChangeLevel)) {
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
                } else {
                    var i;
                    for (i = 0; i < this.selectedObjects.length; ++i) {
                        this.selectedObjects[i].parent.Set_Props(props);
                    }
                    if (isRealNumber(props.Width) && isRealNumber(props.Height)) {
                        apply_props = props;
                    } else {
                        apply_props = props.ShapeProperties ? props.ShapeProperties : props;
                    }
                    var objects_by_types = this.applyDrawingProps(apply_props);
                    if (isRealNumber(apply_props.Width) && isRealNumber(apply_props.Height) || apply_props.ChartProperties) {
                        for (i = 0; i < objects_by_types.shapes.length; ++i) {
                            objects_by_types.shapes[i].recalculate();
                            objects_by_types.shapes[i].recalculateText();
                        }
                        for (i = 0; i < objects_by_types.images.length; ++i) {
                            objects_by_types.images[i].recalculate();
                        }
                        for (i = 0; i < objects_by_types.charts.length; ++i) {
                            objects_by_types.charts[i].recalculate();
                        }
                        for (i = 0; i < objects_by_types.groups.length; ++i) {
                            objects_by_types.groups[i].recalculate();
                        }
                        if (! (this.selectedObjects.length === 1 && this.selectedObjects[0].parent.Is_Inline())) {
                            var a_objects = [],
                            nearest_pos;
                            for (i = 0; i < this.selectedObjects.length; ++i) {
                                nearest_pos = this.document.Get_NearestPos(this.selectedObjects[i].parent.PageNum, this.selectedObjects[i].posX, this.selectedObjects[i].posY, true, this.selectedObjects[i].parent);
                                a_objects.push({
                                    nearestPos: nearest_pos,
                                    pageNum: this.selectedObjects[i].parent.PageNum,
                                    drawing: this.selectedObjects[i].parent,
                                    par: this.selectedObjects[i].parent.Get_ParentParagraph()
                                });
                            }
                            for (i = 0; i < this.selectedObjects.length; ++i) {
                                a_objects[i].nearestPos.Paragraph.Check_NearestPos(a_objects[i].nearestPos);
                                this.selectedObjects[i].parent.Remove_FromDocument(false);
                                this.selectedObjects[i].parent.Set_XYForAdd(this.selectedObjects[i].posX, this.selectedObjects[i].posY, a_objects[i].nearestPos, a_objects[i].pageNum);
                            }
                            for (i = 0; i < a_objects.length; ++i) {
                                a_objects[i].drawing.Add_ToDocument2(a_objects[i].par);
                            }
                        } else {
                            this.selectedObjects[0].parent.OnEnd_ResizeInline(this.selectedObjects[0].bounds.w, this.selectedObjects[0].bounds.h);
                        }
                    }
                }
            }
        }
        this.document.Recalculate();
        apply_props && isRealNumber(apply_props.verticalTextAlign) && this.document.Document_UpdateSelectionState();
    },
    applyDrawingProps: DrawingObjectsController.prototype.applyDrawingProps,
    bringToFront: function () {
        if (this.selection.groupSelection) {
            if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: [this.selection.groupSelection.parent.Get_ParentParagraph()],
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint(historydescription_Document_GrObjectsBringToFront);
                this.selection.groupSelection.bringToFront();
            }
        } else {
            this.zIndexManager.bringToFront(this.getArrZIndexSelectedObjects());
        }
        this.document.Recalculate();
    },
    bringForward: function () {
        if (this.selection.groupSelection) {
            if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: [this.selection.groupSelection.parent.Get_ParentParagraph()],
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint(historydescription_Document_GrObjectsBringForward);
                this.selection.groupSelection.bringForward();
            }
        } else {
            this.zIndexManager.bringForward(this.getArrZIndexSelectedObjects());
        }
        this.document.Recalculate();
    },
    sendToBack: function () {
        if (this.selection.groupSelection) {
            if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: [this.selection.groupSelection.parent.Get_ParentParagraph()],
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint(historydescription_Document_GrObjectsSendToBack);
                this.selection.groupSelection.sendToBack();
            }
        } else {
            this.zIndexManager.sendToBack(this.getArrZIndexSelectedObjects());
        }
        this.document.Recalculate();
    },
    bringBackward: function () {
        if (this.selection.groupSelection) {
            if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: [this.selection.groupSelection.parent.Get_ParentParagraph()],
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint(historydescription_Document_GrObjectsBringBackward);
                this.selection.groupSelection.bringBackward();
            }
        } else {
            this.zIndexManager.bringBackward(this.getArrZIndexSelectedObjects());
        }
        this.document.Recalculate();
    },
    getArrZIndexSelectedObjects: function () {
        var ret = [];
        for (var i = 0; i < this.selectedObjects.length; ++i) {
            ret.push(this.selectedObjects[i].parent.RelativeHeight - 1000);
        }
        return ret;
    },
    editChart: function (chart) {
        var bin_object = {
            "binary": chart
        };
        var chart_space = this.getChartSpace2(bin_object, null),
        select_start_page,
        parent_paragraph,
        nearest_pos;
        var by_types;
        by_types = getObjectsByTypesFromArr(this.selectedObjects, true);
        if (by_types.charts.length === 1) {
            if (by_types.charts[0].group) {
                var parent_group = by_types.charts[0].group;
                var major_group = by_types.charts[0].getMainGroup();
                for (var i = parent_group.spTree.length - 1; i > -1; --i) {
                    if (parent_group.spTree[i] === by_types.charts[0]) {
                        parent_group.removeFromSpTreeByPos(i);
                        chart_space.setGroup(parent_group);
                        chart_space.spPr.xfrm.setOffX(by_types.charts[0].spPr.xfrm.offX);
                        chart_space.spPr.xfrm.setOffY(by_types.charts[0].spPr.xfrm.offY);
                        parent_group.addToSpTree(i, chart_space);
                        parent_group.updateCoordinatesAfterInternalResize();
                        major_group.recalculate();
                        if (major_group.spPr && major_group.spPr.xfrm) {}
                        if (major_group.parent.Is_Inline()) {
                            major_group.parent.OnEnd_ResizeInline(major_group.bounds.w, major_group.bounds.h);
                        } else {
                            parent_paragraph = major_group.parent.Get_ParentParagraph();
                            nearest_pos = this.document.Get_NearestPos(major_group.selectStartPage, major_group.posX + major_group.bounds.x, major_group.posY + major_group.bounds.y, true, major_group.parent);
                            nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
                            major_group.parent.Remove_FromDocument(false);
                            major_group.parent.Set_XYForAdd(major_group.posX, major_group.posY, nearest_pos, major_group.selectStartPage);
                            major_group.parent.Add_ToDocument2(parent_paragraph);
                        }
                        if (this.selection.groupSelection) {
                            select_start_page = this.selection.groupSelection.selectedObjects[0].selectStartPage;
                            this.selection.groupSelection.resetSelection();
                            this.selection.groupSelection.selectObject(chart_space, select_start_page);
                        }
                        this.document.Recalculate();
                        this.document.Document_UpdateInterfaceState();
                        return;
                    }
                }
            } else {
                chart_space.spPr.xfrm.setOffX(0);
                chart_space.spPr.xfrm.setOffY(0);
                select_start_page = by_types.charts[0].selectStartPage;
                chart_space.setParent(by_types.charts[0].parent);
                if (by_types.charts[0].parent.Is_Inline()) {
                    by_types.charts[0].parent.Set_GraphicObject(chart_space);
                    this.resetSelection();
                    this.selectObject(chart_space, select_start_page);
                    by_types.charts[0].parent.OnEnd_ResizeInline(chart_space.spPr.xfrm.extX, chart_space.spPr.xfrm.extY);
                } else {
                    parent_paragraph = by_types.charts[0].parent.Get_ParentParagraph();
                    nearest_pos = this.document.Get_NearestPos(by_types.charts[0].selectStartPage, by_types.charts[0].posX, by_types.charts[0].posY, true, by_types.charts[0].parent);
                    nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
                    by_types.charts[0].parent.Remove_FromDocument(false);
                    by_types.charts[0].parent.Set_GraphicObject(chart_space);
                    by_types.charts[0].parent.Set_XYForAdd(by_types.charts[0].posX, by_types.charts[0].posY, nearest_pos, by_types.charts[0].selectStartPage);
                    by_types.charts[0].parent.Add_ToDocument2(parent_paragraph);
                    this.resetSelection();
                    this.selectObject(chart_space, select_start_page);
                    this.document.Recalculate();
                }
                this.document.Document_UpdateInterfaceState();
            }
        }
    },
    mergeDrawings: function (pageIndex, HeaderDrawings, HeaderTables, FooterDrawings, FooterTables) {
        if (!this.graphicPages[pageIndex]) {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        var drawings = [],
        tables = [],
        i,
        hdr_ftr_page = this.graphicPages[pageIndex].hdrFtrPage;
        if (HeaderDrawings) {
            drawings = drawings.concat(HeaderDrawings);
        }
        if (FooterDrawings) {
            drawings = drawings.concat(FooterDrawings);
        }
        var getFloatObjects = function (arrObjects) {
            var ret = [];
            for (var i = 0; i < arrObjects.length; ++i) {
                if (arrObjects[i].GetType() === type_Paragraph) {
                    var calc_frame = arrObjects[i].CalculatedFrame;
                    var FramePr = arrObjects[i].Get_FramePr();
                    var FrameDx = (undefined === FramePr.HSpace ? 0 : FramePr.HSpace);
                    var FrameDy = (undefined === FramePr.VSpace ? 0 : FramePr.VSpace);
                    ret.push(new CFlowParagraph(arrObjects[i], calc_frame.L2, calc_frame.T2, calc_frame.W2, calc_frame.H2, FrameDx, FrameDy, 0, 0, FramePr.Wrap));
                } else {
                    if (arrObjects[i].GetType() === type_Table) {
                        ret.push(new CFlowTable(arrObjects[i], 0));
                    }
                }
            }
            return ret;
        };
        if (HeaderTables) {
            tables = tables.concat(getFloatObjects(HeaderTables));
        }
        if (FooterTables) {
            tables = tables.concat(getFloatObjects(FooterTables));
        }
        hdr_ftr_page.clear();
        for (i = 0; i < drawings.length; ++i) {
            var array_type = drawings[i].getDrawingArrayType();
            if (!drawings[i].bNoNeedToAdd) {
                var drawing_array = null;
                switch (array_type) {
                case DRAWING_ARRAY_TYPE_INLINE:
                    drawing_array = hdr_ftr_page.inlineObjects;
                    break;
                case DRAWING_ARRAY_TYPE_BEHIND:
                    drawing_array = hdr_ftr_page.behindDocObjects;
                    break;
                case DRAWING_ARRAY_TYPE_BEFORE:
                    drawing_array = hdr_ftr_page.beforeTextObjects;
                    break;
                case DRAWING_ARRAY_TYPE_WRAPPING:
                    drawing_array = hdr_ftr_page.wrappingObjects;
                    break;
                }
                if (Array.isArray(drawing_array)) {
                    drawing_array.push(drawings[i].GraphicObj);
                }
            }
        }
        for (i = 0; i < tables.length; ++i) {
            hdr_ftr_page.flowTables.push(tables[i]);
        }
        hdr_ftr_page.behindDocObjects.sort(ComparisonByZIndexSimpleParent);
        hdr_ftr_page.wrappingObjects.sort(ComparisonByZIndexSimpleParent);
        hdr_ftr_page.beforeTextObjects.sort(ComparisonByZIndexSimpleParent);
    },
    addFloatTable: function (table) {
        var hdr_ftr = table.Table.Parent.Is_HdrFtr(true);
        if (!this.graphicPages[table.PageNum + table.PageController]) {
            this.graphicPages[table.PageNum + table.PageController] = new CGraphicPage(table.PageNum + table.PageController, this);
        }
        if (!hdr_ftr) {
            this.graphicPages[table.PageNum + table.PageController].addFloatTable(table);
        } else {}
    },
    removeFloatTableById: function (pageIndex, id) {
        if (!this.graphicPages[pageIndex]) {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        var table = g_oTableId.Get_ById(id);
        if (table) {
            var hdr_ftr = table.Parent.Is_HdrFtr(true);
            if (!hdr_ftr) {
                this.graphicPages[pageIndex].removeFloatTableById(id);
            }
        }
    },
    selectionIsTableBorder: function () {
        var content = this.getTargetDocContent();
        if (content) {
            return content.Selection_Is_TableBorderMove();
        }
        return false;
    },
    getTableByXY: function (x, y, pageIndex, documentContent) {
        if (!this.graphicPages[pageIndex]) {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        if (!documentContent.Is_HdrFtr()) {
            return this.graphicPages[pageIndex].getTableByXY(x, y, documentContent);
        } else {
            return this.graphicPages[pageIndex].hdrFtrPage.getTableByXY(x, y, documentContent);
        }
        return null;
    },
    OnMouseDown: function (e, x, y, pageIndex) {
        this.curState.onMouseDown(e, x, y, pageIndex);
    },
    OnMouseMove: function (e, x, y, pageIndex) {
        this.curState.onMouseMove(e, x, y, pageIndex);
    },
    OnMouseUp: function (e, x, y, pageIndex) {
        this.curState.onMouseUp(e, x, y, pageIndex);
    },
    draw: function (pageIndex, graphics) {
        this.graphicPages[pageIndex].draw(graphics);
    },
    selectionDraw: function () {
        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
    },
    updateOverlay: function () {
        this.drawingDocument.m_oWordControl.OnUpdateOverlay();
    },
    isPolylineAddition: function () {
        return this.curState.polylineFlag === true;
    },
    shapeApply: function (props) {
        this.applyDrawingProps(props);
    },
    addShapeOnPage: function (sPreset, nPageIndex, dX, dY, dExtX, dExtY) {
        if (docpostype_HdrFtr !== this.document.CurPos.Type || null !== this.document.HdrFtr.CurHdrFtr) {
            if (docpostype_HdrFtr !== this.document.CurPos.Type) {
                this.document.CurPos.Type = docpostype_DrawingObjects;
                this.document.Selection.Use = true;
                this.document.Selection.Start = true;
            } else {
                this.document.Selection.Use = true;
                this.document.Selection.Start = true;
                var CurHdrFtr = this.document.HdrFtr.CurHdrFtr;
                var DocContent = CurHdrFtr.Content;
                DocContent.CurPos.Type = docpostype_DrawingObjects;
                DocContent.Selection.Use = true;
                DocContent.Selection.Start = true;
            }
            this.changeCurrentState(new StartAddNewShape(this, sPreset));
            this.OnMouseDown({},
            dX, dY, nPageIndex);
            if (isRealNumber(dExtX) && isRealNumber(dExtY)) {
                this.OnMouseMove({
                    IsLocked: true
                },
                dX + dExtX, dY + dExtY, nPageIndex);
            }
            this.OnMouseUp({},
            dX, dY, nPageIndex);
            this.document.Document_UpdateInterfaceState();
            this.document.Document_UpdateRulersState();
            this.document.Document_UpdateSelectionState();
        }
    },
    drawOnOverlay: function (overlay) {
        var _track_objects = this.arrTrackObjects;
        var _object_index;
        var _object_count = _track_objects.length;
        for (_object_index = 0; _object_index < _object_count; ++_object_index) {
            _track_objects[_object_index].draw(overlay);
        }
        if (this.curState.InlinePos) {
            this.drawingDocument.AutoShapesTrack.SetCurrentPage(this.curState.InlinePos.Page);
            this.drawingDocument.AutoShapesTrack.DrawInlineMoveCursor(this.curState.InlinePos.X, this.curState.InlinePos.Y, this.curState.InlinePos.Height, this.curState.InlinePos.transform);
        }
        return;
    },
    getAllFloatObjectsOnPage: function (pageIndex, docContent) {
        if (!this.graphicPages[pageIndex]) {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        var arr, page, i, ret = [];
        if (!docContent.Is_HdrFtr()) {
            page = this.graphicPages[pageIndex];
        } else {
            page = this.graphicPages[pageIndex].hdrFtrPage;
        }
        arr = page.wrappingObjects.concat(page.behindDocObjects.concat(page.beforeTextObjects));
        for (i = 0; i < arr.length; ++i) {
            if (arr[i].parent && arr[i].parent.DocumentContent === docContent) {
                ret.push(arr[i].parent);
            }
        }
        return ret;
    },
    getAllFloatTablesOnPage: function (pageIndex, docContent) {
        if (!this.graphicPages[pageIndex]) {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        if (!docContent) {
            docContent = this.document;
        }
        var tables, page;
        if (!docContent.Is_HdrFtr()) {
            page = this.graphicPages[pageIndex];
        } else {
            page = this.graphicPages[pageIndex].hdrFtrPage;
        }
        tables = page.flowTables;
        var ret = [];
        for (var i = 0; i < tables.length; ++i) {
            if (flowobject_Table === tables[i].Type && tables[i].Table.Parent === docContent) {
                ret.push(tables[i]);
            }
        }
        return ret;
    },
    getTargetDocContent: DrawingObjectsController.prototype.getTargetDocContent,
    handleChartDoubleClick: function (drawing, chart, e, x, y, pageIndex) {
        if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: drawing.Get_ParentParagraph(),
            CheckType: changestype_Paragraph_Content
        })) {
            editor.asc_doubleClickOnChart(this.getChartObject());
        }
        this.changeCurrentState(new NullState(this));
        this.document.OnMouseUp(e, x, y, pageIndex);
    },
    addInlineImage: function (W, H, Img, Chart, bFlow) {
        var content = this.getTargetDocContent();
        if (content) {
            content.Add_InlineImage(W, H, Img, Chart, bFlow);
        } else {
            if (this.selectedObjects[0] && this.selectedObjects[0].parent && this.selectedObjects[0].parent.Is_Inline()) {
                this.resetInternalSelection();
                this.document.Remove(1, true);
                this.document.Add_InlineImage(W, H, Img, Chart, bFlow);
            } else {
                if (this.selectedObjects.length > 0) {
                    this.resetSelection2();
                    this.document.Add_InlineImage(W, H, Img, Chart, bFlow);
                }
            }
        }
    },
    addInlineTable: function (Cols, Rows) {
        var content = this.getTargetDocContent();
        if (content) {
            content.Add_InlineTable(Cols, Rows);
        }
    },
    canAddComment: function () {
        var content = this.getTargetDocContent();
        return content && content.CanAdd_Comment();
    },
    addComment: function (commentData) {
        var content = this.getTargetDocContent();
        return content && content.Add_Comment(commentData, true, true);
    },
    hyperlinkCheck: DrawingObjectsController.prototype.hyperlinkCheck,
    hyperlinkCanAdd: DrawingObjectsController.prototype.hyperlinkCanAdd,
    hyperlinkRemove: DrawingObjectsController.prototype.hyperlinkRemove,
    hyperlinkModify: DrawingObjectsController.prototype.hyperlinkModify,
    hyperlinkAdd: DrawingObjectsController.prototype.hyperlinkAdd,
    isCurrentElementParagraph: function () {
        var content = this.getTargetDocContent();
        return content && content.Is_CurrentElementParagraph();
    },
    isCurrentElementTable: function () {
        var content = this.getTargetDocContent();
        return content && content.Is_CurrentElementTable();
    },
    Get_SelectedContent: function (SelectedContent) {
        var content = this.getTargetDocContent();
        if (content) {
            content.Get_SelectedContent(SelectedContent);
        } else {
            var para = new Paragraph(this.document.DrawingDocument, this.document, 0, 0, 0, 0, 0);
            var selectedObjects, run, drawing, i;
            if (this.selection.groupSelection) {
                selectedObjects = this.selection.groupSelection.selectedObjects;
                var groupParaDrawing = this.selection.groupSelection.parent;
                for (i = 0; i < selectedObjects.length; ++i) {
                    run = new ParaRun(para, false);
                    selectedObjects[i].recalculate();
                    drawing = new ParaDrawing(0, 0, selectedObjects[i].copy(), this.document.DrawingDocument, this.document, null);
                    drawing.Set_DrawingType(groupParaDrawing.DrawingType);
                    drawing.GraphicObj.setParent(drawing);
                    if (drawing.GraphicObj.spPr && drawing.GraphicObj.spPr.xfrm && isRealNumber(drawing.GraphicObj.spPr.xfrm.offX) && isRealNumber(drawing.GraphicObj.spPr.xfrm.offY)) {
                        drawing.GraphicObj.spPr.xfrm.setOffX(0);
                        drawing.GraphicObj.spPr.xfrm.setOffY(0);
                    }
                    drawing.Update_Size(selectedObjects[i].bounds.w, selectedObjects[i].bounds.h);
                    if (groupParaDrawing.DrawingType === drawing_Anchor) {
                        drawing.Set_Distance(groupParaDrawing.Distance.L, groupParaDrawing.Distance.T, groupParaDrawing.Distance.R, groupParaDrawing.Distance.B);
                        drawing.Set_WrappingType(groupParaDrawing.wrappingType);
                        drawing.Set_BehindDoc(groupParaDrawing.behindDoc);
                        drawing.Set_PositionH(groupParaDrawing.PositionH.RelativeFrom, groupParaDrawing.PositionH.Align, groupParaDrawing.PositionH.Value + selectedObjects[i].bounds.x);
                        drawing.Set_PositionV(groupParaDrawing.PositionV.RelativeFrom, groupParaDrawing.PositionV.Align, groupParaDrawing.PositionV.Value + selectedObjects[i].bounds.y);
                    }
                    run.Add_ToContent(run.State.ContentPos, drawing, true, false);
                    para.Internal_Content_Add(para.CurPos.ContentPos, run, true);
                }
            } else {
                selectedObjects = this.selectedObjects;
                for (i = 0; i < selectedObjects.length; ++i) {
                    run = new ParaRun(para, false);
                    selectedObjects[i].recalculate();
                    drawing = new ParaDrawing(0, 0, selectedObjects[i].copy(), this.document.DrawingDocument, this.document, null);
                    drawing.Set_DrawingType(selectedObjects[i].parent.DrawingType);
                    drawing.GraphicObj.setParent(drawing);
                    drawing.Update_Size(selectedObjects[i].bounds.w, selectedObjects[i].bounds.h);
                    if (selectedObjects[i].parent.Extent) {
                        drawing.setExtent(selectedObjects[i].parent.Extent.W, selectedObjects[i].parent.Extent.H);
                    }
                    if (selectedObjects[i].parent.DrawingType === drawing_Anchor) {
                        drawing.Set_Distance(selectedObjects[i].parent.Distance.L, selectedObjects[i].parent.Distance.T, selectedObjects[i].parent.Distance.R, selectedObjects[i].parent.Distance.B);
                        drawing.Set_WrappingType(selectedObjects[i].parent.wrappingType);
                        if (selectedObjects[i].parent.wrappingPolygon && drawing.wrappingPolygon) {
                            drawing.wrappingPolygon.fromOther(selectedObjects[i].parent.wrappingPolygon);
                        }
                        drawing.Set_BehindDoc(selectedObjects[i].parent.behindDoc);
                        drawing.Set_PositionH(selectedObjects[i].parent.PositionH.RelativeFrom, selectedObjects[i].parent.PositionH.Align, selectedObjects[i].parent.PositionH.Value + selectedObjects[i].bounds.x);
                        drawing.Set_PositionV(selectedObjects[i].parent.PositionV.RelativeFrom, selectedObjects[i].parent.PositionV.Align, selectedObjects[i].parent.PositionV.Value + selectedObjects[i].bounds.y);
                    }
                    run.Add_ToContent(run.State.ContentPos, drawing, true, false);
                    para.Internal_Content_Add(para.CurPos.ContentPos, run, true);
                }
            }
            SelectedContent.Add(new CSelectedElement(para, true));
        }
    },
    getCurrentPageAbsolute: function () {
        if (this.curState.majorObject) {
            return this.curState.majorObject.selectStartPage;
        }
        var selection_arr = this.selectedObjects;
        if (selection_arr[0].length > 0) {
            return selection_arr[0].selectStartPage;
        }
        return 0;
    },
    createGraphicPage: function (pageIndex) {
        if (!isRealObject(this.graphicPages[pageIndex])) {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
    },
    resetDrawingArrays: function (pageIndex, docContent) {
        var hdr_ftr = docContent.Is_HdrFtr(true);
        if (!hdr_ftr) {
            if (isRealObject(this.graphicPages[pageIndex])) {
                this.graphicPages[pageIndex].resetDrawingArrays(docContent);
            }
        }
    },
    mergeHdrFtrPages: function (page1, page2, pageIndex) {
        if (!isRealObject(this.graphicPages[pageIndex])) {
            this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
        }
        this.graphicPages[pageIndex].hdrFtrPage.clear();
        this.graphicPages[pageIndex].hdrFtrPage.mergePages(page1, page2);
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
    setSelectionState: DrawingObjectsController.prototype.setSelectionState,
    getSelectionState: DrawingObjectsController.prototype.getSelectionState,
    applyPropsToChartSpace: DrawingObjectsController.prototype.applyPropsToChartSpace,
    documentUpdateSelectionState: function () {
        if (this.selection.textSelection) {
            this.selection.textSelection.updateSelectionState();
        } else {
            if (this.selection.groupSelection) {
                this.selection.groupSelection.documentUpdateSelectionState();
            } else {
                if (this.selection.chartSelection) {
                    this.selection.chartSelection.documentUpdateSelectionState();
                } else {
                    this.drawingDocument.SelectClear();
                    this.drawingDocument.TargetEnd();
                }
            }
        }
    },
    getMajorParaDrawing: function () {
        return this.selectedObjects.length > 0 ? this.selectedObjects[0].parent : null;
    },
    documentUpdateRulersState: function () {
        var content = this.getTargetDocContent();
        if (content && content.Parent && content.Parent.getObjectType && content.Parent.getObjectType() === historyitem_type_Shape) {
            content.Parent.documentUpdateRulersState();
        }
    },
    documentUpdateInterfaceState: function () {
        if (this.selection.textSelection) {
            this.selection.textSelection.getDocContent().Document_UpdateInterfaceState();
        } else {
            if (this.selection.groupSelection) {
                this.selection.groupSelection.documentUpdateInterfaceState();
            } else {
                var para_pr = DrawingObjectsController.prototype.getParagraphParaPr.call(this);
                if (!para_pr) {}
                if (para_pr) {
                    var TextPr = this.getParagraphTextPr();
                    var theme = this.document.Get_Theme();
                    if (theme && theme.themeElements && theme.themeElements.fontScheme) {
                        if (TextPr.FontFamily) {
                            TextPr.FontFamily.Name = theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
                        }
                        if (TextPr.RFonts) {
                            if (TextPr.RFonts.Ascii) {
                                TextPr.RFonts.Ascii.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
                            }
                            if (TextPr.RFonts.EastAsia) {
                                TextPr.RFonts.EastAsia.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
                            }
                            if (TextPr.RFonts.HAnsi) {
                                TextPr.RFonts.HAnsi.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
                            }
                            if (TextPr.RFonts.CS) {
                                TextPr.RFonts.CS.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
                            }
                        }
                    }
                    editor.UpdateParagraphProp(para_pr);
                    editor.UpdateTextPr(TextPr);
                }
            }
        }
    },
    isNeedUpdateRulers: function () {
        if (this.selectedObjects.length === 1 && this.selectedObjects[0].getDocContent && this.selectedObjects[0].getDocContent()) {
            return true;
        }
        return false;
    },
    documentCreateFontCharMap: function (FontCharMap) {
        return;
    },
    documentCreateFontMap: function (FontCharMap) {
        return;
    },
    tableCheckSplit: function () {
        var content = this.getTargetDocContent();
        return content && content.Table_CheckSplit();
    },
    tableCheckMerge: function () {
        var content = this.getTargetDocContent();
        return content && content.Table_CheckMerge();
    },
    tableSelect: function (Type) {
        var content = this.getTargetDocContent();
        return content && content.Table_Select(Type);
    },
    tableRemoveTable: function () {
        var content = this.getTargetDocContent();
        return content && content.Table_RemoveTable();
    },
    tableSplitCell: function (Cols, Rows) {
        var content = this.getTargetDocContent();
        return content && content.Table_SplitCell(Cols, Rows);
    },
    tableMergeCells: function () {
        var content = this.getTargetDocContent();
        return content && content.Table_MergeCells();
    },
    tableRemoveCol: function () {
        var content = this.getTargetDocContent();
        return content && content.Table_RemoveCol();
    },
    tableAddCol: function (bBefore) {
        var content = this.getTargetDocContent();
        return content && content.Table_AddCol(bBefore);
    },
    tableRemoveRow: function () {
        var content = this.getTargetDocContent();
        return content && content.Table_RemoveRow();
    },
    tableAddRow: function (bBefore) {
        var content = this.getTargetDocContent();
        return content && content.Table_AddRow(bBefore);
    },
    documentSearch: function (CurPage, String, search_Common) {
        this.graphicPages[CurPage].documentSearch(String, search_Common);
        CGraphicPage.prototype.documentSearch.call(this.getHdrFtrObjectsByPageIndex(CurPage), String, search_Common);
    },
    getSelectedElementsInfo: function (Info) {
        if (this.selectedObjects.length === 0) {
            Info.Set_Drawing(-1);
        }
        var content = this.getTargetDocContent();
        if (content) {
            Info.Set_Drawing(selected_DrawingObjectText);
            content.Get_SelectedElementsInfo(Info);
        } else {
            Info.Set_Drawing(selected_DrawingObject);
        }
        return Info;
    },
    getAllObjectsOnPage: function (pageIndex, bHdrFtr) {
        var graphic_page;
        if (bHdrFtr) {
            graphic_page = this.getHdrFtrObjectsByPageIndex(pageIndex);
        } else {
            graphic_page = this.graphicPages[pageIndex];
        }
        return graphic_page.behindDocObjects.concat(graphic_page.wrappingObjects.concat(graphic_page.inlineObjects.concat(graphic_page.beforeTextObjects)));
    },
    selectNextObject: DrawingObjectsController.prototype.selectNextObject,
    getCurrentParagraph: function () {
        var content = this.getTargetDocContent();
        if (content) {
            return content.Get_CurrentParagraph();
        } else {
            return null;
        }
    },
    getSelectedText: function (bClearText) {
        var content = this.getTargetDocContent();
        if (content) {
            return content.Get_SelectedText(bClearText);
        } else {
            return "";
        }
    },
    getCurPosXY: function () {
        var content = this.getTargetDocContent();
        if (content) {
            return content.Get_CurPosXY();
        } else {
            if (this.selectedObjects.length === 1) {
                return {
                    X: this.selectedObjects[0].parent.X,
                    Y: this.selectedObjects[0].parent.Y
                };
            }
            return {
                X: 0,
                Y: 0
            };
        }
    },
    isTextSelectionUse: function () {
        var content = this.getTargetDocContent();
        if (content) {
            return content.Is_TextSelectionUse();
        } else {
            return false;
        }
    },
    isSelectionUse: function () {
        var content = this.getTargetDocContent();
        if (content) {
            return content.Is_TextSelectionUse();
        } else {
            return this.selectedObjects.length > 0;
        }
    },
    paragraphFormatPaste: function (CopyTextPr, CopyParaPr, Bool) {
        var content = this.getTargetDocContent();
        content && content.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool);
    },
    getHdrFtrObjectsByPageIndex: function (pageIndex) {
        if (this.graphicPages[pageIndex]) {
            return this.graphicPages[pageIndex].hdrFtrPage;
        }
        return null;
    },
    getNearestPos: function (x, y, pageIndex, drawing) {
        if (drawing && drawing.GraphicObj) {
            if (drawing.GraphicObj.getObjectType() !== historyitem_type_ImageShape && drawing.GraphicObj.getObjectType() !== historyitem_type_ChartSpace) {
                return null;
            }
        }
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        var cursor_type = this.nullState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        var object;
        if (cursor_type) {
            object = g_oTableId.Get_ById(cursor_type.objectId);
            if (object) {
                if (cursor_type.cursorType === "text") {
                    if (object.getNearestPos) {
                        return object.getNearestPos(x, y, pageIndex);
                    }
                } else {
                    if (object.getObjectType() === historyitem_type_ImageShape && object.parent) {
                        var oShape = object.parent.isShapeChild(true);
                        if (oShape) {
                            return oShape.getNearestPos(x, y, pageIndex);
                        }
                    }
                }
            }
        }
        return null;
    },
    selectionCheck: function (X, Y, Page_Abs, NearPos) {
        var text_object = getTargetTextObject(this);
        if (text_object) {
            return text_object.selectionCheck(X, Y, Page_Abs, NearPos);
        }
        return false;
    },
    checkTextObject: function (x, y, pageIndex) {
        var text_object = getTargetTextObject(this);
        if (text_object && text_object.hitInTextRect) {
            if (text_object.selectStartPage === pageIndex) {
                if (text_object.hitInTextRect(x, y)) {
                    return true;
                }
            }
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
        var ret = DrawingObjectsController.prototype.getParagraphParaPr.call(this);
        if (ret && ret.Shd && ret.Shd.Unifill) {
            ret.Shd.Unifill.check(this.document.theme, this.document.Get_ColorMap());
        }
        return ret ? ret : new CParaPr();
    },
    getParagraphTextPr: function () {
        var ret = DrawingObjectsController.prototype.getParagraphTextPr.call(this);
        if (ret) {
            var ret_;
            if (ret.Unifill && ret.Unifill.canConvertPPTXModsToWord()) {
                ret_ = ret.Copy();
                ret_.Unifill.convertToWordMods();
            } else {
                ret_ = ret;
            }
            if (ret_.Unifill) {
                ret_.Unifill.check(this.document.theme, this.document.Get_ColorMap());
            }
            return ret_;
        } else {
            return new CTextPr();
        }
    },
    isSelectedText: function () {
        return isRealObject(this.getTargetDocContent());
    },
    selectAll: DrawingObjectsController.prototype.selectAll,
    drawSelect: function (pageIndex) {
        DrawingObjectsController.prototype.drawSelect.call(this, pageIndex, this.drawingDocument);
    },
    drawBehindDoc: function (pageIndex, graphics) {
        graphics.shapePageIndex = pageIndex;
        this.graphicPages[pageIndex].drawBehindDoc(graphics);
        graphics.shapePageIndex = null;
    },
    drawWrappingObjects: function (pageIndex, graphics) {
        graphics.shapePageIndex = pageIndex;
        this.graphicPages[pageIndex].drawWrappingObjects(graphics);
        graphics.shapePageIndex = null;
    },
    drawWrappingObjectsInContent: function (pageIndex, graphics, content) {
        var page;
        if (content.Is_HdrFtr()) {
            page = this.getHdrFtrObjectsByPageIndex(pageIndex);
        } else {
            page = this.graphicPages[pageIndex];
        }
        page && page.drawWrappingObjectsByContent(graphics, content);
    },
    endTrackShape: function () {},
    drawBeforeObjects: function (pageIndex, graphics) {
        graphics.shapePageIndex = pageIndex;
        this.graphicPages[pageIndex].drawBeforeObjects(graphics);
        graphics.shapePageIndex = null;
    },
    drawBehindDocHdrFtr: function (pageIndex, graphics) {
        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if (hdr_footer_objects != null) {
            var behind_doc = hdr_footer_objects.behindDocObjects;
            for (var i = 0; i < behind_doc.length; ++i) {
                behind_doc[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },
    drawWrappingObjectsHdrFtr: function (pageIndex, graphics) {
        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if (hdr_footer_objects != null) {
            var wrap_arr = hdr_footer_objects.wrappingObjects;
            for (var i = 0; i < wrap_arr.length; ++i) {
                wrap_arr[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },
    drawBeforeObjectsHdrFtr: function (pageIndex, graphics) {
        graphics.shapePageIndex = pageIndex;
        var hdr_footer_objects = this.getHdrFtrObjectsByPageIndex(pageIndex);
        if (hdr_footer_objects != null) {
            var bef_arr = hdr_footer_objects.beforeTextObjects;
            for (var i = 0; i < bef_arr.length; ++i) {
                bef_arr[i].draw(graphics);
            }
        }
        graphics.shapePageIndex = null;
    },
    setStartTrackPos: function (x, y, pageIndex) {
        this.startTrackPos.x = x;
        this.startTrackPos.y = y;
        this.startTrackPos.pageIndex = pageIndex;
    },
    needUpdateOverlay: function () {
        return this.arrTrackObjects.length > 0 || this.curState.InlinePos;
    },
    changeCurrentState: function (state) {
        this.curState = state;
    },
    canGroup: function (bGetArray) {
        var selection_array = this.selectedObjects;
        if (selection_array.length < 2) {
            return bGetArray ? [] : false;
        }
        if (!selection_array[0].canGroup()) {
            return bGetArray ? [] : false;
        }
        var first_page_index = selection_array[0].parent.pageIndex;
        for (var index = 1; index < selection_array.length; ++index) {
            if (!selection_array[index].canGroup()) {
                return bGetArray ? [] : false;
            }
            if (first_page_index !== selection_array[index].parent.pageIndex) {
                return bGetArray ? [] : false;
            }
        }
        if (bGetArray) {
            var ret = selection_array.concat([]);
            ret.sort(ComparisonByZIndexSimpleParent);
            return ret;
        }
        return true;
    },
    canUnGroup: DrawingObjectsController.prototype.canUnGroup,
    getBoundsForGroup: DrawingObjectsController.prototype.getBoundsForGroup,
    getArrayForGrouping: function () {
        return this.canGroup(true);
    },
    getGroup: DrawingObjectsController.prototype.getGroup,
    addObjectOnPage: function (pageIndex, object) {
        var hdr_ftr = object.parent.DocumentContent.Is_HdrFtr(true);
        if (!hdr_ftr) {
            if (!this.graphicPages[pageIndex]) {
                this.graphicPages[pageIndex] = new CGraphicPage(pageIndex, this);
                for (var z = 0; z < pageIndex; ++z) {
                    if (!this.graphicPages[z]) {
                        this.graphicPages[z] = new CGraphicPage(z, this);
                    }
                }
            }
            this.graphicPages[pageIndex].addObject(object);
        } else {}
    },
    cursorGetPos: function () {
        var text_object;
        if (this.selection.textObject) {
            text_object = this.selection.textObject;
        } else {
            if (this.selection.groupSelection && this.selection.groupSelection.textObject) {
                text_object = this.selection.groupSelection.textObject;
            }
        }
        if (text_object) {
            return text_object.cursorGetPos();
        }
        return {
            X: 0,
            Y: 0
        };
    },
    Get_SelectionBounds: function () {
        var oTargetDocContent = this.getTargetDocContent(false, true);
        if (isRealObject(oTargetDocContent)) {
            return oTargetDocContent.Get_SelectionBounds();
        }
        return null;
    },
    checkCommonBounds: function (arrDrawings) {
        var l, t, r, b;
        var x_arr_min = [],
        y_arr_min = [];
        var x_arr_max = [],
        y_arr_max = [];
        for (var i = 0; i < arrDrawings.length; ++i) {
            var rot = normalizeRotate(isRealNumber(arrDrawings[i].rot) ? arrDrawings[i].rot : 0);
            if (checkNormalRotate(rot)) {
                l = arrDrawings[i].posX;
                r = arrDrawings[i].extX + arrDrawings[i].posX;
                t = arrDrawings[i].posY;
                b = arrDrawings[i].extY + arrDrawings[i].posY;
            } else {
                l = arrDrawings[i].posX + arrDrawings[i].extX / 2 - arrDrawings[i].extY / 2;
                r = arrDrawings[i].posX + arrDrawings[i].extX / 2 + arrDrawings[i].extY / 2;
                t = arrDrawings[i].posY + arrDrawings[i].extY / 2 - arrDrawings[i].extX / 2;
                b = arrDrawings[i].extY + arrDrawings[i].extY / 2 + arrDrawings[i].extX / 2;
            }
            x_arr_max.push(r);
            x_arr_min.push(l);
            y_arr_max.push(b);
            y_arr_min.push(t);
        }
        return {
            minX: Math.min.apply(Math, x_arr_min),
            maxX: Math.max.apply(Math, x_arr_max),
            minY: Math.min.apply(Math, y_arr_min),
            maxY: Math.max.apply(Math, y_arr_max)
        };
    },
    groupSelectedObjects: function () {
        var objects_for_grouping = this.canGroup(true);
        if (objects_for_grouping.length < 2) {
            return;
        }
        var i;
        var common_bounds = this.checkCommonBounds(objects_for_grouping);
        History.Create_NewPoint(historydescription_Document_GrObjectsGroup);
        var para_drawing = new ParaDrawing(common_bounds.maxX - common_bounds.minX, common_bounds.maxY - common_bounds.minY, null, this.drawingDocument, null, null);
        para_drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
        para_drawing.Set_DrawingType(drawing_Anchor);
        var group = this.getGroup(objects_for_grouping);
        group.spPr.xfrm.setOffX(0);
        group.spPr.xfrm.setOffY(0);
        group.setParent(para_drawing);
        para_drawing.Set_GraphicObject(group);
        var page_index = objects_for_grouping[0].parent.pageIndex;
        var first_paragraph = objects_for_grouping[0].parent.Get_ParentParagraph();
        var nearest_pos = this.document.Get_NearestPos(objects_for_grouping[0].parent.pageIndex, common_bounds.minX, common_bounds.minY, true, para_drawing);
        nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
        for (i = 0; i < objects_for_grouping.length; ++i) {
            objects_for_grouping[i].parent.Remove_FromDocument(false);
        }
        para_drawing.Set_XYForAdd(common_bounds.minX, common_bounds.minY, nearest_pos, objects_for_grouping[0].parent.pageIndex);
        para_drawing.Set_Props(new CImgProperty({
            PositionH: {
                RelativeFrom: c_oAscRelativeFromH.Page,
                UseAlign: false,
                Align: undefined,
                Value: common_bounds.minX
            },
            PositionV: {
                RelativeFrom: c_oAscRelativeFromV.Page,
                UseAlign: false,
                Align: undefined,
                Value: common_bounds.minY
            }
        }));
        para_drawing.Add_ToDocument2(first_paragraph);
        this.addGraphicObject(para_drawing);
        this.resetSelection();
        this.selectObject(group, page_index);
        this.document.Recalculate();
    },
    getParentParagraphsFromArr: function (drawings) {
        var ret = [];
        var i, j;
        for (i = 0; i < drawings.length; ++i) {
            var paragraph = drawings[i].parent.Get_ParentParagraph();
            for (j = 0; j < ret.length; ++j) {
                if (ret[j] === paragraph) {
                    break;
                }
            }
            if (j === ret.length) {
                ret.push(paragraph);
            }
        }
        return ret;
    },
    unGroupSelectedObjects: function () {
        if (! (editor.isViewMode === false)) {
            return;
        }
        var ungroup_arr = this.canUnGroup(true);
        if (ungroup_arr.length > 0) {
            var check_paragraphs = this.getParentParagraphsFromArr(ungroup_arr);
            History.Create_NewPoint(historydescription_Document_GrObjectsUnGroup);
            this.resetSelection();
            var i, j, cur_page_index, nearest_pos, cur_group, sp_tree, sp, parent_paragraph, page_num;
            var a_objects = [];
            for (i = 0; i < ungroup_arr.length; ++i) {
                cur_group = ungroup_arr[i];
                parent_paragraph = cur_group.parent.Get_ParentParagraph();
                page_num = cur_group.selectStartPage;
                sp_tree = cur_group.spTree;
                for (j = 0; j < sp_tree.length; ++j) {
                    sp = sp_tree[j];
                    var drawing = new ParaDrawing(0, 0, sp_tree[j], this.drawingDocument, null, null);
                    drawing.Set_GraphicObject(sp);
                    sp.setParent(drawing);
                    drawing.Set_DrawingType(drawing_Anchor);
                    drawing.Set_WrappingType(cur_group.parent.wrappingType);
                    drawing.Update_Size(sp.extX, sp.extY);
                    sp.spPr.xfrm.setRot(normalizeRotate(sp.rot + cur_group.rot));
                    sp.spPr.xfrm.setOffX(0);
                    sp.spPr.xfrm.setOffY(0);
                    sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                    sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                    sp.setGroup(null);
                    nearest_pos = this.document.Get_NearestPos(page_num, sp.bounds.x + sp.posX, sp.bounds.y + sp.posY, true, drawing);
                    nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
                    var posX, posY, xc, yc, hc = sp.extX / 2,
                    vc = sp.extY / 2;
                    xc = sp.transform.TransformPointX(hc, vc);
                    yc = sp.transform.TransformPointY(hc, vc);
                    drawing.Set_XYForAdd(xc - hc, yc - vc, nearest_pos, page_num);
                    a_objects.push({
                        drawing: drawing,
                        par: parent_paragraph,
                        posX: xc - hc,
                        posY: yc - vc
                    });
                    this.selectObject(sp, page_num);
                }
                cur_group.parent.Remove_FromDocument(false);
            }
            for (i = 0; i < a_objects.length; ++i) {
                a_objects[i].drawing.Set_Props(new CImgProperty({
                    PositionH: {
                        RelativeFrom: c_oAscRelativeFromH.Page,
                        UseAlign: false,
                        Align: undefined,
                        Value: a_objects[i].posX
                    },
                    PositionV: {
                        RelativeFrom: c_oAscRelativeFromV.Page,
                        UseAlign: false,
                        Align: undefined,
                        Value: a_objects[i].posY
                    }
                }));
                a_objects[i].drawing.Add_ToDocument2(a_objects[i].par);
            }
        }
    },
    setTableProps: function (Props) {
        var content = this.getTargetDocContent();
        if (content) {
            content.Set_TableProps(Props);
        }
    },
    selectionIsEmpty: function (bCheckHidden) {
        var content = this.getTargetDocContent();
        if (content) {
            content.Selection_IsEmpty(bCheckHidden);
        }
        return false;
    },
    isViewMod: function () {
        return editor.isViewMode;
    },
    moveSelectedObjects: DrawingObjectsController.prototype.moveSelectedObjects,
    cursorMoveLeft: DrawingObjectsController.prototype.cursorMoveLeft,
    cursorMoveRight: DrawingObjectsController.prototype.cursorMoveRight,
    cursorMoveUp: DrawingObjectsController.prototype.cursorMoveUp,
    cursorMoveDown: DrawingObjectsController.prototype.cursorMoveDown,
    cursorMoveEndOfLine: DrawingObjectsController.prototype.cursorMoveEndOfLine,
    cursorMoveStartOfLine: DrawingObjectsController.prototype.cursorMoveStartOfLine,
    cursorMoveAt: DrawingObjectsController.prototype.cursorMoveAt,
    cursorMoveToCell: function (bNext) {
        var content = this.getTargetDocContent();
        if (content) {
            content.Cursor_MoveToCell(bNext);
        }
    },
    updateAnchorPos: function () {},
    resetSelection: DrawingObjectsController.prototype.resetSelection,
    resetSelection2: function () {
        var sel_arr = this.selectedObjects;
        if (sel_arr.length > 0) {
            var top_obj = sel_arr[0];
            for (var i = 1; i < sel_arr.length; ++i) {
                var cur_obj = sel_arr[i];
                if (cur_obj.selectStartPage < top_obj.selectStartPage) {
                    top_obj = cur_obj;
                } else {
                    if (cur_obj.selectStartPage === top_obj.selectStartPage) {
                        if (cur_obj.parent.Get_ParentParagraph().Y < top_obj.parent.Get_ParentParagraph().Y) {
                            top_obj = cur_obj;
                        }
                    }
                }
            }
            this.resetSelection();
            top_obj.parent.GoTo_Text();
        }
    },
    recalculateCurPos: DrawingObjectsController.prototype.recalculateCurPos,
    remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        var content = this.getTargetDocContent(true);
        if (content) {
            content.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
            this.document.Recalculate();
        } else {
            if (this.selectedObjects.length > 0) {
                if (this.selection.groupSelection) {
                    if (this.selection.groupSelection.selection.chartSelection) {
                        if (this.selection.groupSelection.selection.chartSelection.selection.title) {
                            if (this.selection.groupSelection.selection.chartSelection.selection.title.parent) {
                                this.selection.groupSelection.selection.chartSelection.selection.title.parent.setTitle(null);
                                this.selection.groupSelection.selection.chartSelection.resetSelection();
                            }
                            this.document.Recalculate();
                        }
                    } else {
                        var group_map = {},
                        group_arr = [],
                        i,
                        cur_group,
                        sp,
                        xc,
                        yc,
                        hc,
                        vc,
                        rel_xc,
                        rel_yc,
                        j;
                        for (i = 0; i < this.selection.groupSelection.selectedObjects.length; ++i) {
                            this.selection.groupSelection.selectedObjects[i].group.removeFromSpTree(this.selection.groupSelection.selectedObjects[i].Get_Id());
                            group_map[this.selection.groupSelection.selectedObjects[i].group.Get_Id() + ""] = this.selection.groupSelection.selectedObjects[i].group;
                        }
                        group_map[this.selection.groupSelection.Get_Id()] = this.selection.groupSelection;
                        for (var key in group_map) {
                            if (group_map.hasOwnProperty(key)) {
                                group_arr.push(group_map[key]);
                            }
                        }
                        group_arr.sort(CompareGroups);
                        var a_objects = [];
                        for (i = 0; i < group_arr.length; ++i) {
                            cur_group = group_arr[i];
                            if (isRealObject(cur_group.group)) {
                                if (cur_group.spTree.length === 0) {
                                    cur_group.group.removeFromSpTree(cur_group.Get_Id());
                                } else {
                                    if (cur_group.spTree.length == 1) {
                                        sp = cur_group.spTree[0];
                                        hc = sp.spPr.xfrm.extX / 2;
                                        vc = sp.spPr.xfrm.extY / 2;
                                        xc = sp.transform.TransformPointX(hc, vc);
                                        yc = sp.transform.TransformPointY(hc, vc);
                                        rel_xc = cur_group.group.invertTransform.TransformPointX(xc, yc);
                                        rel_yc = cur_group.group.invertTransform.TransformPointY(xc, yc);
                                        sp.spPr.xfrm.setOffX(rel_xc - hc);
                                        sp.spPr.xfrm.setOffY(rel_yc - vc);
                                        sp.spPr.xfrm.setRot(normalizeRotate(cur_group.rot + sp.rot));
                                        sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                        sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                        sp.setGroup(cur_group.group);
                                        for (j = 0; j < cur_group.group.spTree.length; ++j) {
                                            if (cur_group.group.spTree[j] === cur_group) {
                                                cur_group.group.addToSpTree(j, sp);
                                                cur_group.group.removeFromSpTree(cur_group.Get_Id());
                                            }
                                        }
                                    }
                                }
                            } else {
                                var para_drawing = cur_group.parent,
                                para_drawing2 = null;
                                var paragraph = cur_group.parent.Get_ParentParagraph();
                                if (cur_group.spTree.length === 0) {
                                    this.resetInternalSelection();
                                    this.remove();
                                    return;
                                } else {
                                    if (cur_group.spTree.length === 1) {
                                        sp = cur_group.spTree[0];
                                        sp.spPr.xfrm.setOffX(0);
                                        sp.spPr.xfrm.setOffY(0);
                                        sp.spPr.xfrm.setRot(normalizeRotate(cur_group.rot + sp.rot));
                                        sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                        sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                        sp.setGroup(null);
                                        para_drawing.Set_GraphicObject(sp);
                                        sp.setParent(para_drawing);
                                        this.resetSelection();
                                        this.selectObject(sp, cur_group.selectStartPage);
                                        if (para_drawing.Is_Inline()) {
                                            para_drawing.OnEnd_ResizeInline(sp.bounds.w, sp.bounds.h);
                                            return;
                                        } else {
                                            var new_x, new_y;
                                            var deltaX, deltaY;
                                            deltaX = 0;
                                            deltaY = 0;
                                            new_x = sp.transform.tx - deltaX;
                                            new_y = sp.transform.ty - deltaY;
                                            sp.recalcBounds();
                                            var nearest_pos = this.document.Get_NearestPos(cur_group.selectStartPage, new_x, new_y, true, para_drawing);
                                            nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
                                            para_drawing.Remove_FromDocument(false);
                                            para_drawing.Set_XYForAdd(new_x, new_y, nearest_pos, cur_group.selectStartPage);
                                            para_drawing.Add_ToDocument2(para_drawing.Get_ParentParagraph());
                                            this.document.Recalculate();
                                            break;
                                        }
                                    } else {
                                        this.resetInternalSelection();
                                        var new_x, new_y;
                                        cur_group.updateCoordinatesAfterInternalResize();
                                        new_x = cur_group.x + cur_group.spPr.xfrm.offX;
                                        new_y = cur_group.y + cur_group.spPr.xfrm.offY;
                                        cur_group.spPr.xfrm.setOffX(0);
                                        cur_group.spPr.xfrm.setOffY(0);
                                        var nearest_pos = this.document.Get_NearestPos(cur_group.selectStartPage, new_x, new_y, true, para_drawing);
                                        nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
                                        para_drawing.Remove_FromDocument(false);
                                        para_drawing.Set_XYForAdd(new_x, new_y, nearest_pos, cur_group.selectStartPage);
                                        para_drawing.Add_ToDocument2(para_drawing.Get_ParentParagraph());
                                        this.document.Recalculate();
                                        break;
                                    }
                                }
                                var d;
                                if (para_drawing2) {
                                    d = para_drawing2;
                                } else {
                                    d = para_drawing;
                                }
                                var nearest_pos = this.document.Get_NearestPos(cur_group.selectStartPage, cur_group.posX + d.GraphicObj.bounds.x, cur_group.posY + d.GraphicObj.bounds.y, true, d);
                                nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
                                para_drawing.Remove_FromDocument(false);
                                d.Set_XYForAdd(cur_group.posX + d.GraphicObj.bounds.x, cur_group.posX + d.GraphicObj.bounds.y, nearest_pos, cur_group.selectStartPage);
                                d.Add_ToDocument2(paragraph);
                                this.document.Recalculate();
                                return;
                            }
                        }
                    }
                } else {
                    if (this.selection.chartSelection) {
                        if (this.selection.chartSelection.selection.title) {
                            if (this.selection.chartSelection.selection.title.parent) {
                                this.selection.chartSelection.selection.title.parent.setTitle(null);
                                this.selection.chartSelection.resetSelection();
                            }
                            this.document.Recalculate();
                        }
                    } else {
                        var first_selected = this.selectedObjects[0];
                        var arr_drawings_ = [];
                        for (var i = 0; i < this.selectedObjects.length; ++i) {
                            this.selectedObjects[i].parent.Remove_FromDocument(false);
                            arr_drawings_.push(this.selectedObjects[i].parent);
                        }
                        this.zIndexManager.removeArrayDrawings(arr_drawings_);
                        this.resetSelection();
                        first_selected.parent.GoTo_Text();
                        this.document.Recalculate();
                    }
                }
            }
        }
    },
    addGraphicObject: function (paraDrawing) {
        this.drawingObjects.push(paraDrawing);
        this.objectsMap["_" + paraDrawing.Get_Id()] = paraDrawing;
        if (!g_oTableId.m_bTurnOff) {
            this.zIndexManager.addItem(null, paraDrawing);
        }
    },
    isPointInDrawingObjects: function (x, y, pageIndex, bSelected, bNoText) {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if (isRealObject(ret)) {
            if (bNoText === true) {
                if (ret.cursorType === "text") {
                    return -1;
                }
            }
            var object = g_oTableId.Get_ById(ret.objectId);
            if (isRealObject(object) && (!(bSelected === true) || bSelected && object.selected)) {
                if (object.group) {
                    object = object.getMainGroup();
                }
                if (isRealObject(object) && isRealObject(object.parent)) {
                    return ret.bMarker ? DRAWING_ARRAY_TYPE_BEFORE : object.parent.getDrawingArrayType();
                }
            } else {
                if (! (bSelected === true)) {
                    return DRAWING_ARRAY_TYPE_BEFORE;
                }
                return -1;
            }
        }
        return -1;
    },
    isPointInDrawingObjects2: function (x, y, pageIndex, bSelected) {
        return this.isPointInDrawingObjects(x, y, pageIndex, bSelected, true) > -1;
    },
    pointInObjInDocContent: function (docContent, X, Y, pageIndex) {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, X, Y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if (ret) {
            var object = g_oTableId.Get_ById(ret.objectId);
            if (object) {
                var parent_drawing;
                if (!object.group && object.parent) {
                    parent_drawing = object;
                } else {
                    if (object.group) {
                        parent_drawing = object.group;
                        while (parent_drawing.group) {
                            parent_drawing = parent_drawing.group;
                        }
                    }
                }
                if (parent_drawing && parent_drawing.parent) {
                    return docContent === parent_drawing.parent.DocumentContent.Is_TopDocument(true);
                }
            }
        }
        return false;
    },
    pointInSelectedObject: function (x, y, pageIndex) {
        var ret;
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        ret = this.curState.onMouseDown(global_mouseEvent, x, y, pageIndex);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if (ret) {
            var object = g_oTableId.Get_ById(ret.objectId);
            if (object && object.selected) {
                return true;
            }
        }
        return false;
    },
    canChangeWrapPolygon: function () {
        return !this.selection.groupSelection && !this.selection.textSelection && !this.selection.chartSelection && this.selectedObjects.length === 1 && this.selectedObjects[0].canChangeWrapPolygon && this.selectedObjects[0].canChangeWrapPolygon() && !this.selectedObjects[0].parent.Is_Inline();
    },
    startChangeWrapPolygon: function () {
        if (this.canChangeWrapPolygon()) {
            if (this.selectedObjects[0].parent.wrappingType !== WRAPPING_TYPE_THROUGH && this.selectedObjects[0].parent.wrappingType !== WRAPPING_TYPE_TIGHT) {
                if (false === this.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                    Type: changestype_2_Element_and_Type,
                    Element: this.selectedObjects[0].parent.Get_ParentParagraph(),
                    CheckType: changestype_Paragraph_Content
                })) {
                    History.Create_NewPoint(historydescription_Document_GrObjectsChangeWrapPolygon);
                    this.selectedObjects[0].parent.Set_WrappingType(WRAPPING_TYPE_TIGHT);
                    this.document.Recalculate();
                    this.document.Document_UpdateInterfaceState();
                }
            }
            this.resetInternalSelection();
            this.selection.wrapPolygonSelection = this.selectedObjects[0];
            this.updateOverlay();
        }
    },
    getObjectById: function (id) {
        if (isRealObject(this.objectsMap["_" + id])) {
            return this.objectsMap["_" + id];
        }
        return null;
    },
    removeById: function (pageIndex, id) {
        var object = g_oTableId.Get_ById(id);
        if (isRealObject(object)) {
            var hdr_ftr = object.DocumentContent.Is_HdrFtr(true);
            var page = !hdr_ftr ? this.graphicPages[pageIndex] : null;
            if (isRealObject(page)) {
                var array_type = object.getDrawingArrayType();
                page.delObjectById(id, array_type);
            }
        }
    },
    removeFromAllHdrFtrPages: function (id, drawingType) {
        for (var i = 0; i < this.graphicPages.length; ++i) {
            this.removeFromHdrFrtPage(i, id, drawingType);
        }
    },
    removeFromHdrFrtPage: function (pageIndex, id, drawingType) {
        if (this.graphicPages[pageIndex] && this.graphicPages[pageIndex].hdrFtrPage) {
            this.graphicPages[pageIndex].hdrFtrPage.delObjectById(id, drawingType);
        }
    },
    Remove_ById: function (id) {
        for (var i = 0; i < this.graphicPages.length; ++i) {
            this.removeById(i, id);
        }
    },
    selectById: function (id, pageIndex) {
        this.resetSelection();
        var obj = g_oTableId.Get_ById(id),
        nPageIndex = pageIndex;
        if (obj && obj.GraphicObj) {
            if (obj.DocumentContent && obj.DocumentContent.Is_HdrFtr()) {
                if (obj.DocumentContent.Get_StartPage_Absolute() !== obj.PageNum) {
                    nPageIndex = obj.PageNum;
                }
            }
            obj.GraphicObj.select(this, nPageIndex);
        }
    },
    calculateAfterChangeTheme: function () {
        for (var i = 0; i < this.drawingObjects.length; ++i) {
            this.drawingObjects[i].calculateAfterChangeTheme();
        }
        editor.SyncLoadImages(this.urlMap);
        this.urlMap = [];
    },
    updateSelectionState: function () {
        return;
    },
    drawSelectionPage: function (pageIndex) {
        if (this.selection.textSelection) {
            if (this.selection.textSelection.selectStartPage === pageIndex) {
                this.drawingDocument.UpdateTargetTransform(this.selection.textSelection.transformText);
                this.selection.textSelection.getDocContent().Selection_Draw_Page(pageIndex);
            }
        } else {
            if (this.selection.groupSelection) {
                if (this.selection.groupSelection.selectStartPage === pageIndex) {
                    this.selection.groupSelection.drawSelectionPage(pageIndex);
                }
            } else {
                if (this.selection.chartSelection && this.selection.chartSelection.selectStartPage === pageIndex && this.selection.chartSelection.selection.textSelection) {
                    this.selection.chartSelection.selection.textSelection.getDocContent().Selection_Draw_Page(pageIndex);
                }
            }
        }
    },
    getAllRasterImagesOnPage: function (pageIndex) {
        var ret = [];
        var graphic_page = this.graphicPages[pageIndex];
        var hdr_ftr_page = this.getHdrFtrObjectsByPageIndex(pageIndex);
        var graphic_array = graphic_page.beforeTextObjects.concat(graphic_page.wrappingObjects).concat(graphic_page.inlineObjects).concat(graphic_page.behindDocObjects);
        graphic_array = graphic_array.concat(hdr_ftr_page.beforeTextObjects).concat(hdr_ftr_page.wrappingObjects).concat(hdr_ftr_page.inlineObjects).concat(hdr_ftr_page.behindDocObjects);
        for (var i = 0; i < graphic_array.length; ++i) {
            if (graphic_array[i].getAllRasterImages) {
                graphic_array[i].getAllRasterImages(ret);
            }
        }
        return ret;
    },
    checkChartTextSelection: DrawingObjectsController.prototype.checkChartTextSelection,
    checkNeedResetChartSelection: DrawingObjectsController.prototype.checkNeedResetChartSelection,
    addNewParagraph: DrawingObjectsController.prototype.addNewParagraph,
    paragraphClearFormatting: DrawingObjectsController.prototype.paragraphClearFormatting,
    applyDocContentFunction: DrawingObjectsController.prototype.applyDocContentFunction,
    applyTextFunction: DrawingObjectsController.prototype.applyTextFunction,
    setParagraphSpacing: DrawingObjectsController.prototype.setParagraphSpacing,
    setParagraphTabs: DrawingObjectsController.prototype.setParagraphTabs,
    setParagraphNumbering: DrawingObjectsController.prototype.setParagraphNumbering,
    setParagraphShd: DrawingObjectsController.prototype.setParagraphShd,
    setParagraphStyle: DrawingObjectsController.prototype.setParagraphStyle,
    setParagraphContextualSpacing: DrawingObjectsController.prototype.setParagraphContextualSpacing,
    setParagraphPageBreakBefore: DrawingObjectsController.prototype.setParagraphPageBreakBefore,
    setParagraphKeepLines: DrawingObjectsController.prototype.setParagraphKeepLines,
    setParagraphKeepNext: DrawingObjectsController.prototype.setParagraphKeepNext,
    setParagraphWidowControl: DrawingObjectsController.prototype.setParagraphWidowControl,
    setParagraphBorders: DrawingObjectsController.prototype.setParagraphBorders,
    paragraphAdd: DrawingObjectsController.prototype.paragraphAdd,
    paragraphIncDecFontSize: DrawingObjectsController.prototype.paragraphIncDecFontSize,
    paragraphIncDecIndent: DrawingObjectsController.prototype.paragraphIncDecIndent,
    setParagraphAlign: DrawingObjectsController.prototype.setParagraphAlign,
    setParagraphIndent: DrawingObjectsController.prototype.setParagraphIndent,
    getSelectedObjectsBounds: DrawingObjectsController.prototype.getSelectedObjectsBounds,
    CheckRange: function (X0, Y0, X1, Y1, Y0Sp, Y1Sp, LeftField, RightField, PageNum, HdrFtrRanges, docContent) {
        if (isRealObject(this.graphicPages[PageNum])) {
            var Ranges = this.graphicPages[PageNum].CheckRange(X0, Y0, X1, Y1, Y0Sp, Y1Sp, LeftField, RightField, HdrFtrRanges, docContent);
            var ResultRanges = [];
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
        var content = this.getTargetDocContent();
        if (content) {
            return content.Interface_Update_TablePr(true);
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
        default:
            this.currentPresetGeom = preset;
            this.changeCurrentState(new StartAddNewShape(this, preset));
            break;
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_ChangeColorScheme:
            this.document.theme.themeElements.clrScheme = data.oldScheme;
            this.drawingDocument.CheckGuiControlColors();
            editor.chartPreviewManager.clearPreviews();
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_ChangeColorScheme:
            this.document.theme.themeElements.clrScheme = data.newScheme;
            this.drawingDocument.CheckGuiControlColors();
            editor.chartPreviewManager.clearPreviews();
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_GrObjects);
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_ChangeColorScheme:
            data.newScheme.Write_ToBinary(w);
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
        case historyitem_ChangeColorScheme:
            var clr_scheme = new ClrScheme();
            clr_scheme.Read_FromBinary(r);
            this.document.theme.themeElements.clrScheme = clr_scheme;
            this.drawingDocument.CheckGuiControlColors();
            for (var i = 0; i < this.drawingObjects.length; ++i) {
                if (this.drawingObjects[i].GraphicObj) {
                    this.drawingObjects[i].GraphicObj.handleUpdateFill();
                    this.drawingObjects[i].GraphicObj.handleUpdateLn();
                }
            }
            editor.chartPreviewManager.clearPreviews();
            break;
        }
    },
    Refresh_RecalcData: function (data) {
        History.RecalcData_Add({
            All: true
        });
        for (var i = 0; i < this.drawingObjects.length; ++i) {
            if (this.drawingObjects[i].GraphicObj) {
                this.drawingObjects[i].GraphicObj.handleUpdateFill();
                this.drawingObjects[i].GraphicObj.handleUpdateLn();
            }
        }
        editor.chartPreviewManager.clearPreviews();
    }
};
function ComparisonByZIndexSimpleParent(obj1, obj2) {
    if (obj1.parent && obj2.parent) {
        return ComparisonByZIndexSimple(obj1.parent, obj2.parent);
    }
    return 0;
}
function ComparisonByZIndexSimple(obj1, obj2) {
    if (isRealNumber(obj1.RelativeHeight) && isRealNumber(obj2.RelativeHeight)) {
        return obj1.RelativeHeight - obj2.RelativeHeight;
    }
    if (!isRealNumber(obj1.RelativeHeight) && isRealNumber(obj2.RelativeHeight)) {
        return -1;
    }
    if (isRealNumber(obj1.RelativeHeight) && !isRealNumber(obj2.RelativeHeight)) {
        return 1;
    }
    return 0;
}
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
    var word_image = editor.WordControl.m_oLogicDocument.DrawingObjects.createImage(bin, 0, 0, w, h);
    para_drawing.Set_GraphicObject(word_image);
    word_image.setParent(para_drawing);
    para_drawing.Set_GraphicObject(word_image);
    return para_drawing;
}
function CreateImageFromBinary2(bin, w, h) {
    var para_drawing = new ParaDrawing(w, h, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    var word_image = editor.WordControl.m_oLogicDocument.DrawingObjects.createImage(bin, 0, 0, w, h);
    para_drawing.Set_GraphicObject(word_image);
    word_image.setParent(para_drawing);
    para_drawing.Set_GraphicObject(word_image);
    return para_drawing;
}
function CreateParaDrawingFromBinary(reader, bNoRecalc) {
    var para_drawing = new ParaDrawing(null, null, null, editor.WordControl.m_oLogicDocument.DrawingDocument, editor.WordControl.m_oLogicDocument, null);
    para_drawing.readFromBinaryForCopyPaste(reader, bNoRecalc);
    return para_drawing;
}
function ZIndexManager(drawingObjects) {
    this.drawingObjects = drawingObjects;
    this.Content = [];
    this.m_oContentChanges = new CContentChanges();
    this.bTurnOff = true;
    this.startRefreshIndex = -1;
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
ZIndexManager.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    addToRecalculate: function () {
        this.drawingObjects.addToRecalculate(this);
    },
    removeArrayDrawings: function (aDrawings) {
        aDrawings.sort(ComparisonByZIndexSimple);
        for (var i = aDrawings.length - 1; i > -1; --i) {
            this.removeItem(aDrawings[i].RelativeHeight - 1000);
        }
    },
    removeItem: function (pos) {
        History.Add(this, {
            Type: historyitem_ZIndexManagerRemoveItem,
            Pos: pos,
            Item: this.Content[pos]
        });
        return this.Content.splice(pos, 1)[0];
    },
    addItem: function (pos, item) {
        if (this.bTurnOff) {
            return;
        }
        if (!isRealNumber(pos)) {
            pos = this.Content.length;
        }
        History.Add(this, {
            Type: historyitem_ZIndexManagerAddItem,
            Pos: pos,
            Item: item
        });
        this.Content.splice(pos, 0, item);
        if (this.startRefreshIndex < 0 || this.startRefreshIndex > pos) {
            this.startRefreshIndex = pos;
        }
    },
    recalculate: function () {
        if (this.startRefreshIndex > -1) {
            for (var i = 0; i < this.Content.length; ++i) {
                this.Content[i].RelativeHeight = i + 1000;
            }
            this.startRefreshIndex = -1;
        }
        this.drawingObjects.sortDrawingArrays();
    },
    sendToBack: function (arrInd) {
        arrInd.sort(fSortAscending);
        var arrDrawings = [];
        var i;
        for (i = arrInd.length - 1; i > -1; --i) {
            arrDrawings.push(this.removeItem(arrInd[i]));
        }
        for (i = 0; i < arrDrawings.length; ++i) {
            this.addItem(0, arrDrawings[i]);
        }
    },
    bringForward: function (arrInd) {
        arrInd.sort(fSortAscending);
        var i;
        var item;
        if (arrInd[arrInd.length - 1] < this.Content.length - 1) {
            item = this.removeItem(arrInd[arrInd.length - 1]);
            this.addItem(++arrInd[arrInd.length - 1], item);
        }
        for (i = arrInd.length - 2; i > -1; --i) {
            if ((arrInd[i + 1] - arrInd[i]) > 1) {
                item = this.removeItem(arrInd[i]);
                this.addItem(++arrInd[i], item);
            }
        }
    },
    bringToFront: function (arrInd) {
        arrInd.sort(fSortAscending);
        var i;
        var arrDrawings = [];
        for (i = arrInd.length - 1; i > -1; --i) {
            arrDrawings.push(this.removeItem(arrInd[i]));
        }
        arrDrawings.reverse();
        for (i = 0; i < arrDrawings.length; ++i) {
            this.addItem(this.Content.length, arrDrawings[i]);
        }
    },
    bringBackward: function (arrInd) {
        arrInd.sort(fSortAscending);
        var i, item;
        if (arrInd[0] > 0) {
            item = this.removeItem(arrInd[0]);
            this.addItem(--arrInd[0], item);
        }
        for (i = 1; i < arrInd.length; ++i) {
            if (arrInd[i] - arrInd[i - 1] > 1) {
                item = this.removeItem(arrInd[i]);
                this.addItem(--arrInd[i], item);
            }
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_ZIndexManagerRemoveItem:
            this.Content.splice(data.Pos, 0, data.Item);
            break;
        case historyitem_ZIndexManagerAddItem:
            this.Content.splice(data.Pos, 1);
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_ZIndexManagerRemoveItem:
            this.Content.splice(data.Pos, 1);
            break;
        case historyitem_ZIndexManagerAddItem:
            this.Content.splice(data.Pos, 0, data.Item);
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        var Pos;
        switch (data.Type) {
        case historyitem_ZIndexManagerRemoveItem:
            Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
            break;
        case historyitem_ZIndexManagerAddItem:
            Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            w.WriteLong(Pos);
            w.WriteString2(data.Item.Get_Id());
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        var Pos, ChangedPos;
        switch (type) {
        case historyitem_ZIndexManagerRemoveItem:
            Pos = r.GetLong();
            ChangedPos = this.m_oContentChanges.Check(contentchanges_Remove, Pos);
            this.Content.splice(ChangedPos, 1);
            break;
        case historyitem_ZIndexManagerAddItem:
            Pos = r.GetLong();
            var Id = r.GetString2();
            ChangedPos = this.m_oContentChanges.Check(contentchanges_Add, Pos);
            this.Content.splice(ChangedPos, 0, g_oTableId.Get_ById(Id));
            break;
        }
    },
    Refresh_RecalcData: function (data) {
        switch (data.Type) {
        case historyitem_ZIndexManagerRemoveItem:
            case historyitem_ZIndexManagerAddItem:
            if (this.startRefreshIndex < 0) {
                this.startRefreshIndex = data.Pos;
            } else {
                if (this.startRefreshIndex > data.Pos) {
                    this.startRefreshIndex = data.Pos;
                }
            }
            break;
        }
        this.Refresh_RecalcData2();
    },
    Refresh_RecalcData2: function () {
        this.drawingObjects.addToRecalculate(this);
    },
    Clear_ContentChanges: function () {
        this.m_oContentChanges.Clear();
    },
    Add_ContentChanges: function (Changes) {
        this.m_oContentChanges.Add(Changes);
    },
    Refresh_ContentChanges: function () {
        this.m_oContentChanges.Refresh();
    }
};