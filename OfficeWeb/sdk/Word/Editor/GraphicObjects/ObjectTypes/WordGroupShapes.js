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
 function WordGroupShapes(parent, document, drawingDocument, group) {
    this.parent = parent;
    this.document = document;
    this.drawingDocument = drawingDocument;
    this.document = document;
    this.document = editor.WordControl.m_oLogicDocument;
    this.drawingDocument = drawingDocument;
    this.drawingDocument = this.document.DrawingDocument;
    if (parent !== null && typeof parent === "object" && typeof parent.pageIndex === "number") {
        this.pageIndex = parent.pageIndex;
    }
    this.spPr = new CSpPr();
    this.style = null;
    this.textBoxContent = null;
    this.group = (group !== null && typeof group === "object") ? group : null;
    this.mainGroup = null;
    this.spTree = [];
    this.arrGraphicObjects = [];
    this.brush = null;
    this.pen = null;
    this.absOffsetX = null;
    this.absOffsetY = null;
    this.absExtX = null;
    this.absExtY = null;
    this.absRot = null;
    this.absFlipH = null;
    this.absFlipV = null;
    this.absXLT = null;
    this.absYLT = null;
    this.transform = new CMatrix();
    this.ownTransform = new CMatrix();
    this.selected = false;
    this.selectStartPage = -1;
    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];
    this.selectionInfo = {
        selectionArray: []
    };
    this.recalcInfo = {
        recalculateTransform: true,
        recalculateTextTransform: true,
        recalculateCursorTypes: true
    };
    this.majorGraphicObject = null;
    g_oTableId.Add(this, g_oIdCounter.Get_NewId());
}
WordGroupShapes.prototype = {
    calculateAfterOpen10: function () {
        var kw, kh;
        var xfrm = this.spPr.xfrm;
        kw = this.parent.Extent.W / xfrm.extX;
        kh = this.parent.Extent.H / xfrm.extY;
        this.normalizeXfrm2(kw, kh);
        this.normalizeXfrm();
        xfrm.offX = 0;
        xfrm.offY = 0;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV, false);
        var arr_gr_objects = this.arrGraphicObjects;
        for (var i = 0; i < arr_gr_objects.length; ++i) {
            arr_gr_objects[i].setGroupAfterOpen(this);
            arr_gr_objects[i].calculateAfterOpenInGroup();
        }
    },
    Search_GetId: function (bNext, bCurrent) {
        if (!bCurrent) {
            if (bNext) {
                for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
                    if (this.arrGraphicObjects[i].Search_GetId) {
                        var result = this.arrGraphicObjects[i].Search_GetId(bNext, bCurrent);
                        if (result) {
                            return result;
                        }
                    }
                }
                return null;
            } else {
                for (var i = this.arrGraphicObjects.length - 1; i > -1; --i) {
                    if (this.arrGraphicObjects[i].Search_GetId) {
                        var result = this.arrGraphicObjects[i].Search_GetId(bNext, bCurrent);
                        if (result) {
                            return result;
                        }
                    }
                }
                return null;
            }
        } else {
            var last_selected;
            if (bNext) {
                last_selected = -1;
                for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
                    if (this.arrGraphicObjects[i].Search_GetId && this.arrGraphicObjects[i].selected) {
                        var result = this.arrGraphicObjects[i].Search_GetId(bNext, bCurrent);
                        if (result) {
                            return result;
                        }
                        last_selected = i;
                    }
                }
                for (var i = last_selected + 1; i < this.arrGraphicObjects.length; ++i) {
                    if (this.arrGraphicObjects[i].Search_GetId) {
                        var result = this.arrGraphicObjects[i].Search_GetId(bNext, false);
                        if (result) {
                            return result;
                        }
                        last_selected = i;
                    }
                }
                return null;
            } else {
                last_selected = this.arrGraphicObjects.length;
                for (var i = this.arrGraphicObjects.length - 1; i > -1; --i) {
                    if (this.arrGraphicObjects[i].Search_GetId && this.arrGraphicObjects[i].selected) {
                        var result = this.arrGraphicObjects[i].Search_GetId(bNext, bCurrent);
                        if (result) {
                            return result;
                        }
                        last_selected = i;
                    }
                }
                for (var i = last_selected - 1; i > -1; --i) {
                    if (this.arrGraphicObjects[i].Search_GetId) {
                        var result = this.arrGraphicObjects[i].Search_GetId(bNext, false);
                        if (result) {
                            return result;
                        }
                        last_selected = i;
                    }
                }
                return null;
            }
        }
    },
    recalcTransform: function () {
        this.recalcInfo.recalculateTransform = true;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].recalcTransform === "function") {
                this.spTree[i].recalcTransform();
            }
        }
    },
    recalculate2: function () {
        if (this.recalcInfo.recalculateBrush) {
            this.calculateFill();
            this.recalcInfo.recalculateBrush = false;
        }
        if (this.recalcInfo.recalculatePen) {
            this.calculateLine();
            this.recalcInfo.recalculatePen = false;
        }
        if (this.recalcInfo.recalculateTransform.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = true;
        }
        if (this.recalcInfo.recalculateContent) {
            this.calculateContent();
            this.recalcInfo.recalculateContent = false;
        }
        if (this.recalcInfo.recalculateTextTransform) {
            this.calculateTransformTextMatrix();
            this.recalcInfo.recalculateTextTransform = false;
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    isShape: function () {
        return false;
    },
    isImage: function () {
        return false;
    },
    isGroup: function () {
        return true;
    },
    setPaddings: function (paddings) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].setPaddings) {
                this.spTree[i].setPaddings(paddings);
            }
        }
    },
    setGroup: function (group) {
        var data = {};
        data.Type = historyitem_SetGroup;
        data.oldGroup = this.group;
        data.newGroup = group;
        History.Add(this, data);
        this.group = group;
    },
    setMainGroup: function (group) {
        var data = {};
        data.Type = historyitem_SetMainGroup;
        data.oldGroup = this.mainGroup;
        data.newGroup = group;
        History.Add(this, data);
        this.mainGroup = group;
        if (group != null) {
            for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
                this.arrGraphicObjects[i].setMainGroup(group);
            }
        } else {
            for (i = 0; i < this.arrGraphicObjects.length; ++i) {
                this.arrGraphicObjects[i].setMainGroup(this);
            }
        }
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
    calculateAfterChangeTheme: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].calculateAfterChangeTheme === "function") {
                this.spTree[i].calculateAfterChangeTheme();
            }
        }
    },
    getResultScaleCoefficients: function () {
        if (this.recalcInfo.recalculateScaleCoefficients) {
            var cx, cy;
            if (this.spPr.xfrm.chExtX > 0) {
                cx = this.spPr.xfrm.extX / this.spPr.xfrm.chExtX;
            } else {
                cx = 1;
            }
            if (this.spPr.xfrm.chExtY > 0) {
                cy = this.spPr.xfrm.extY / this.spPr.xfrm.chExtY;
            } else {
                cy = 1;
            }
            if (isRealObject(this.group)) {
                var group_scale_coefficients = this.group.getResultScaleCoefficients();
                cx *= group_scale_coefficients.cx;
                cy *= group_scale_coefficients.cy;
            }
            this.scaleCoefficients.cx = cx;
            this.scaleCoefficients.cy = cy;
            this.recalcInfo.recalculateScaleCoefficients = false;
        }
        return this.scaleCoefficients;
    },
    getFill: function () {
        var _ret = null;
        var _shapes = this.spTree;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes.length; ++_shape_index) {
            if (_shapes[_shape_index].isShape()) {
                _ret = _shapes[_shape_index].getFill();
                if (_ret == null) {
                    return null;
                }
                break;
            }
        }
        if (_shape_index < _shapes.length) {
            ++_shape_index;
            var _cur_fill;
            for (; _shape_index < _shapes.length; ++_shape_index) {
                if (_shapes[_shape_index].isShape()) {
                    _cur_fill = _shapes[_shape_index].getFill();
                    _ret = CompareUniFill(_ret, _cur_fill);
                }
            }
        }
        return _ret;
    },
    getStroke: function () {
        var _ret = null;
        var _shapes = this.spTree;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes.length; ++_shape_index) {
            if (_shapes[_shape_index].isShape()) {
                _ret = _shapes[_shape_index].getStroke();
                if (_ret == null) {
                    return null;
                }
                break;
            }
        }
        if (_shape_index < _shapes.length) {
            ++_shape_index;
            var _cur_line;
            for (; _shape_index < _shapes.length; ++_shape_index) {
                if (_shapes[_shape_index].isShape()) {
                    _cur_line = _shapes[_shape_index].getStroke();
                    if (_cur_line == null) {
                        return null;
                    } else {
                        _ret = _ret.compare(_cur_line);
                    }
                }
            }
        }
        return _ret;
    },
    getPaddings: function () {
        var paddings = null;
        var cur_paddings;
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            cur_paddings = null;
            if (typeof this.arrGraphicObjects[i].getPaddings === "function") {
                cur_paddings = this.arrGraphicObjects[i].getPaddings();
            }
            if (cur_paddings) {
                if (!paddings) {
                    paddings = cur_paddings;
                } else {
                    paddings.Left = isRealNumber(paddings.Left) ? (paddings.Left === cur_paddings.Left ? paddings.Left : undefined) : undefined;
                    paddings.Top = isRealNumber(paddings.Top) ? (paddings.Top === cur_paddings.Top ? paddings.Top : undefined) : undefined;
                    paddings.Right = isRealNumber(paddings.Right) ? (paddings.Right === cur_paddings.Right ? paddings.Right : undefined) : undefined;
                    paddings.Bottom = isRealNumber(paddings.Bottom) ? (paddings.Bottom === cur_paddings.Bottom ? paddings.Bottom : undefined) : undefined;
                }
            }
        }
        return paddings;
    },
    canChangeArrows: function () {
        var _ret = false;
        var _shapes = this.spTree;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes.length; ++_shape_index) {
            if (_shapes[_shape_index].canChangeArrows) {
                _ret = _shapes[_shape_index].canChangeArrows();
                if (_ret == false) {
                    return false;
                }
                break;
            }
        }
        if (_shape_index < _shapes.length) {
            ++_shape_index;
            var _cur_line;
            for (; _shape_index < _shapes.length; ++_shape_index) {
                if (_shapes[_shape_index].canChangeArrows) {
                    if (_shapes[_shape_index].canChangeArrows() == false) {
                        return false;
                    }
                }
            }
        }
        return _ret;
    },
    haveShapes: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].isShape()) {
                return true;
            }
        }
        return false;
    },
    haveImages: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].isImage() && !isRealObject(this.spTree[i].chart)) {
                return true;
            }
        }
        return false;
    },
    getImageUrl: function () {
        var ret = null;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].isImage() && !isRealObject(this.spTree[i].chart)) {
                if (ret === null) {
                    ret = this.spTree[i].getImageUrl();
                } else {
                    if (ret !== this.spTree[i].getImageUrl()) {
                        return undefined;
                    }
                }
            }
        }
        return ret;
    },
    getPresetGeom: function () {
        var _ret = null;
        var _shapes = this.spTree;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shapes.length; ++_shape_index) {
            if (_shapes[_shape_index].isShape()) {
                _ret = _shapes[_shape_index].getPresetGeom();
                if (_ret == null) {
                    return null;
                }
                break;
            }
        }
        if (_shape_index < _shapes.length) {
            ++_shape_index;
            var _cur_preset;
            for (; _shape_index < _shapes.length; ++_shape_index) {
                if (_shapes[_shape_index].isShape()) {
                    _cur_preset = _shapes[_shape_index].getPresetGeom();
                    if (_cur_preset == null || _cur_preset != _ret) {
                        return null;
                    }
                }
            }
        }
        return _ret;
    },
    getImageProps: function () {
        var _objects = this.spTree;
        var _cur_object;
        var _object_index;
        var _object_count = _objects.length;
        var _cur_image_props;
        var _result_image_props = null;
        for (_object_index = 0; _object_index < _object_count; ++_object_index) {
            _cur_object = _objects[_object_index];
            if (_cur_object.isImage()) {
                _cur_image_props = _cur_object.getImageProps();
                if (_cur_image_props !== null) {
                    if (_result_image_props === null) {
                        _result_image_props = _cur_image_props;
                    } else {
                        _result_image_props = CompareImageProperties(_result_image_props, _cur_image_props);
                    }
                }
            }
        }
        return _result_image_props;
    },
    getShapeProps: function () {
        if (this.haveShapes()) {
            return {
                ShapeProperties: {
                    type: this.getPresetGeom(),
                    fill: this.getFill(),
                    stroke: this.getStroke(),
                    canChangeArrows: this.canChangeArrows(),
                    paddings: this.getPaddings()
                }
            };
        }
        return null;
    },
    getImageProps2: function () {
        if (this.haveImages()) {
            return {
                ImageUrl: this.getImageUrl()
            };
        }
        return null;
    },
    getChartProps: function () {
        var ret = null;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (isRealObject(this.spTree[i].chart)) {
                if (!isRealObject(ret)) {
                    ret = {
                        ChartProperties: this.spTree[i].chart
                    };
                } else {
                    ret.severalCharts = true;
                    if (ret.severalChartTypes !== true) {
                        if (! (ret.ChartProperties.type === this.spTree[i].chart.type && ret.ChartProperties.subType === this.spTree[i].chart.subType)) {
                            ret.severalChartTypes = true;
                        }
                    }
                    if (ret.severalChartStyles !== true) {
                        if (ret.ChartProperties.styleId !== this.spTree[i].chart.styleId) {
                            ret.severalChartStyles = true;
                        }
                    }
                }
            }
        }
        return ret;
    },
    setDiagram: function (chart) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].setDiagram === "function" && isRealObject(this.spTree[i].chart)) {
                this.spTree[i].setDiagram(chart);
            }
        }
    },
    changeFill: function (ascFill) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].changeFill === "function") {
                this.spTree[i].changeFill(ascFill);
            }
        }
    },
    changeLine: function (line) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].changeLine === "function") {
                this.spTree[i].changeLine(line);
            }
        }
    },
    changePresetGeometry: function (sPreset) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].changePresetGeometry === "function") {
                this.spTree[i].changePresetGeometry(sPreset);
            }
        }
    },
    calculateAfterOpen: function () {
        var kw, kh;
        var xfrm = this.spPr.xfrm;
        kw = this.parent.Extent.W / xfrm.extX;
        kh = this.parent.Extent.H / xfrm.extY;
        this.normalizeXfrm2(kw, kh);
        this.normalizeXfrm();
        xfrm.offX = 0;
        xfrm.offY = 0;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV, false);
        var arr_gr_objects = this.arrGraphicObjects;
        for (var i = 0; i < arr_gr_objects.length; ++i) {
            arr_gr_objects[i].setGroupAfterOpen(this);
            arr_gr_objects[i].calculateAfterOpenInGroup();
        }
    },
    calculateAfterOpen2: function () {
        var xfrm = this.spPr.xfrm;
        xfrm.offX = 0;
        xfrm.offY = 0;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV, false);
        var arr_gr_objects = this.arrGraphicObjects;
        for (var i = 0; i < arr_gr_objects.length; ++i) {
            arr_gr_objects[i].setGroupAfterOpen(this);
            arr_gr_objects[i].calculateAfterOpenInGroup();
        }
    },
    calculateAfterOpen3: function () {
        var xfrm = this.spPr.xfrm;
        xfrm.offX = 0;
        xfrm.offY = 0;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV, false);
        var arr_gr_objects = this.arrGraphicObjects;
        for (var i = 0; i < arr_gr_objects.length; ++i) {
            arr_gr_objects[i].setGroupAfterOpen(this);
            arr_gr_objects[i].calculateAfterOpenInGroup2();
        }
    },
    setGroupAfterOpen: function (group) {
        this.group = group;
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].setGroupAfterOpen(this);
        }
    },
    calculateAfterOpenInGroup: function () {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.parent = new ParaDrawing(null, null, this, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        this.parent.Set_GraphicObject(this);
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, false);
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].calculateAfterOpenInGroup();
        }
    },
    calculateAfterOpenInGroup2: function () {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, false);
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].calculateAfterOpenInGroup2();
        }
    },
    normalizeXfrm: function () {
        var xfrm = this.spPr.xfrm;
        var scaleX = 1,
        scaleY = 1;
        if (xfrm.chExtX != 0) {
            scaleX = xfrm.extX / xfrm.chExtX;
        }
        if (xfrm.chExtY != 0) {
            scaleY = xfrm.extY / xfrm.chExtY;
        }
        xfrm.chExtX = xfrm.extX;
        xfrm.chExtY = xfrm.extY;
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            var cur_gr_obj = this.arrGraphicObjects[i];
            var cur_xfrm = cur_gr_obj.spPr.xfrm;
            var rot = typeof cur_xfrm.rot === "number" && !isNaN(cur_xfrm.rot) ? cur_xfrm.rot : 0;
            cur_xfrm.offX = scaleX * (cur_xfrm.offX - xfrm.chOffX);
            cur_xfrm.offY = scaleY * (cur_xfrm.offY - xfrm.chOffY);
            cur_xfrm.extX *= scaleX;
            cur_xfrm.extY *= scaleY;
            if (cur_gr_obj.isGroup()) {
                cur_gr_obj.normalizeXfrm();
            }
        }
        xfrm.chOffX = 0;
        xfrm.chOffY = 0;
    },
    normalizeXfrm2: function (kw, kh) {
        var xfrm = this.spPr.xfrm;
        xfrm.offX *= kw;
        xfrm.offY *= kh;
        xfrm.extX *= kw;
        xfrm.extY *= kh;
        xfrm.chOffX *= kw;
        xfrm.chOffY *= kh;
        xfrm.chExtX *= kw;
        xfrm.chExtY *= kh;
        var arr_sp = this.arrGraphicObjects;
        for (var i = 0, n = arr_sp.length; i < n; ++i) {
            arr_sp[i].normalizeXfrm2(kw, kh);
        }
    },
    getSpTree2: function () {
        var sp_tree = [];
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            if (!this.arrGraphicObjects[i].isGroup()) {
                sp_tree.push(this.arrGraphicObjects[i]);
            } else {
                sp_tree = sp_tree.concat(this.arrGraphicObjects[i].getSpTree2());
            }
        }
        return sp_tree;
    },
    calculateTransformChildElements: function () {
        this.transform = new CMatrix();
        var transform = this.transform;
        var xfrm = this.spPr.xfrm;
        var hc = xfrm.extX * 0.5;
        var vc = xfrm.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(transform, -hc, -vc);
        var flipH = xfrm.flipH == null ? false : xfrm.flipH;
        if (flipH) {
            global_MatrixTransformer.ScaleAppend(transform, -1, 1);
        }
        var flipV = xfrm.flipV == null ? false : xfrm.flipV;
        if (flipV) {
            global_MatrixTransformer.ScaleAppend(transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(transform, xfrm.rot);
        global_MatrixTransformer.TranslateAppend(transform, xfrm.offX + hc, xfrm.offY + vc);
        if (this.group != null) {
            global_MatrixTransformer.MultiplyAppend(transform, this.group.transform);
        }
        var local_transform = transform.CreateDublicate();
        var main_group_matrix_invert = global_MatrixTransformer.Invert(this.mainGroup.transform);
        global_MatrixTransformer.MultiplyAppend(local_transform, main_group_matrix_invert);
        var t_xc = local_transform.TransformPointX(hc, vc);
        var t_yc = local_transform.TransformPointY(hc, vc);
        if (this.group === this.mainGroup) {
            this.absOffsetX = xfrm.offX;
            this.absOffsetY = xfrm.offY;
        } else {
            this.absOffsetX = t_xc - hc;
            this.absOffsetY = t_yc - vc;
        }
        this.absExtX = xfrm.extX;
        this.absExtY = xfrm.extY;
        this.absFlipH = flipH;
        this.absFlipV = flipV;
        if (this.group != null) {
            var abs_rot;
            if (this.mainGroup === this.group) {
                abs_rot = xfrm.rot == null ? 0 : xfrm.rot;
            } else {
                var cur_group = this.group;
                abs_rot = 0;
                while (cur_group != this.mainGroup) {
                    var cur_rot = cur_group.spPr.xfrm.rot == null ? 0 : cur_group.spPr.xfrm.rot;
                    abs_rot += cur_rot;
                    cur_group = cur_group.group;
                }
            }
            this.absRot = abs_rot;
        } else {
            this.absRot = xfrm.rot == null ? 0 : xfrm.rot;
        }
        this.parent = new ParaDrawing(xfrm.extX, xfrm.extY, this, this.drawingDocument, null, null);
        this.parent.Set_DrawingType(drawing_Anchor);
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].setGroup(this);
            this.arrGraphicObjects[i].setMainGroup(this.mainGroup);
            this.arrGraphicObjects[i].calculateTransformChildElements();
        }
        this.spTree = this.getSpTree2();
    },
    updatePosition: function (x, y) {
        this.setAbsoluteTransform(x, y, null, null, null, null, null);
        this.calculateTransformMatrix();
        var _sp_tree = this.spTree;
        var _shape_count = _sp_tree.length;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            _sp_tree[_shape_index].calculateTransformMatrix();
            _sp_tree[_shape_index].calculateTransformTextMatrix();
            _sp_tree[_shape_index].calculateLeftTopPoint();
        }
        this.calculateLeftTopPoint();
        var _arrGraphicObjects = this.arrGraphicObjects;
        _shape_count = _arrGraphicObjects.length;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            if (_arrGraphicObjects[_shape_index].isGroup()) {
                _arrGraphicObjects[_shape_index].calculateFullTransformMatrix();
            }
        }
    },
    updatePosition2: function (x, y) {
        this.absOffsetX = x;
        this.absOffsetY = y;
        if (this.parent) {
            this.parent.absOffsetX = x;
            this.parent.absOffsetY = y;
        }
        this.calculateTransformMatrix();
        var _sp_tree = this.spTree;
        var _shape_count = _sp_tree.length;
        var _shape_index;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            _sp_tree[_shape_index].calculateTransformMatrix();
            _sp_tree[_shape_index].calculateTransformTextMatrix();
            _sp_tree[_shape_index].calculateLeftTopPoint();
        }
        this.calculateLeftTopPoint();
        var _arrGraphicObjects = this.arrGraphicObjects;
        _shape_count = _arrGraphicObjects.length;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            if (_arrGraphicObjects[_shape_index].isGroup()) {
                _arrGraphicObjects[_shape_index].calculateFullTransformMatrix();
            }
        }
    },
    setAllParagraphsShd: function (shd) {
        var sp_tree = this.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            if (typeof sp_tree[i].setAllParagraphsShd === "function") {
                sp_tree[i].setAllParagraphsShd(shd);
            }
        }
    },
    setRotate: function (rot) {
        var data = {};
        data.Type = historyitem_SetRotate;
        data.oldRot = this.spPr.xfrm.rot;
        data.newRot = rot;
        History.Add(this, data);
        this.spPr.xfrm.rot = rot;
        this.setAbsoluteTransform(null, null, null, null, rot, null, null);
        this.calculateAfterRotate();
        var _shapes = this.spTree;
        var _shape_index;
        var _shape_count = _shapes.length;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            _shapes[_shape_index].calculateTransformMatrix();
            _shapes[_shape_index].calculateContent();
            _shapes[_shape_index].calculateTransformTextMatrix();
        }
        var _arrGraphicObjects = this.arrGraphicObjects;
        _shape_count = _arrGraphicObjects.length;
        for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
            if (_arrGraphicObjects[_shape_index].isGroup()) {
                _arrGraphicObjects[_shape_index].calculateFullTransformMatrix();
            }
        }
    },
    setSizes: function (posX, posY, w, h, flipH, flipV, childTracks) {
        var kw, kh;
        kw = w / this.absExtX;
        kh = h / this.absExtY;
        var data = {};
        data.Type = historyitem_SetSizes;
        data.kw = kw;
        data.kh = kh;
        data.oldW = this.absExtX;
        data.oldH = this.absExtY;
        data.oldPosX = this.absOffsetX;
        data.oldPosY = this.absOffsetY;
        data.oldFlipH = this.absFlipH;
        data.oldFlipV = this.absFlipV;
        data.newW = w;
        data.newH = h;
        data.newPosX = posX;
        data.newPosY = posY;
        data.newFlipH = flipH;
        data.newFlipV = flipV;
        History.Add(this, data);
        var xfrm = this.spPr.xfrm;
        xfrm.extX = w;
        xfrm.extY = h;
        xfrm.flipH = flipH;
        xfrm.flipV = flipV;
        this.absOffsetX = posX;
        this.absOffsetY = posY;
        this.absExtX = w;
        this.absExtY = h;
        this.absFlipH = flipH;
        this.absFlipV = flipV;
        if (this.parent) {
            this.parent.absOffsetX = posX;
            this.parent.absOffsetY = posY;
            this.parent.absExtX = w;
            this.parent.absExtY = h;
            this.parent.absFlipH = flipH;
            this.parent.absFlipV = flipV;
        }
        this.calculateTransformMatrix();
        for (var _child_index = 0; _child_index < childTracks.length; ++_child_index) {
            childTracks[_child_index].endTrack();
        }
        this.startChangeChildSizes(kw, kh);
        this.startCalculateAfterInternalResize();
    },
    canTakeOutPage: function () {
        return true;
    },
    setSizes2: function (w, h) {
        var kw, kh;
        kw = w / this.absExtX;
        kh = h / this.absExtY;
        var data = {};
        data.Type = historyitem_SetSizes2;
        data.kw = kw;
        data.kh = kh;
        data.oldW = this.absExtX;
        data.oldH = this.absExtY;
        data.newW = w;
        data.newH = h;
        History.Add(this, data);
        var xfrm = this.spPr.xfrm;
        xfrm.extX = w;
        xfrm.extY = h;
        this.absExtX = w;
        this.absExtY = h;
        if (this.parent) {
            this.parent.absExtX = w;
            this.parent.absExtY = h;
        }
        this.calculateTransformMatrix();
        var sp_tree = this.spTree;
        var old_hc = data.oldW * 0.5;
        var old_vc = data.oldH * 0.5;
        var new_hc = w * 0.5;
        var new_vc = h * 0.5;
        for (var i = 0; i < sp_tree.length; ++i) {
            var cur_sp = sp_tree[i];
            var result_kw, result_kh;
            var rot = cur_sp.absRot;
            if ((rot < Math.PI * 0.25 || rot > Math.PI * 1.75 || (rot > Math.PI * 0.75 && rot < Math.PI * 1.25))) {
                result_kh = kh;
                result_kw = kw;
            } else {
                result_kh = kw;
                result_kw = kh;
            }
            var new_ext_x = cur_sp.absExtX * result_kw;
            var new_ext_y = cur_sp.absExtY * result_kh;
            var new_off_x = (cur_sp.absOffsetX + cur_sp.absExtX * 0.5 - old_hc) * kw + new_hc - new_ext_x * 0.5;
            var new_off_y = (cur_sp.absOffsetY + cur_sp.absExtY * 0.5 - old_vc) * kh + new_vc - new_ext_y * 0.5;
            cur_sp.setSizesInGroup(new_off_x, new_off_y, new_ext_x, new_ext_y);
        }
        this.startChangeChildSizes(kw, kh);
        this.startCalculateAfterInternalResize();
    },
    canGroup: function () {
        return true;
    },
    getPageIndex: function () {
        return this.pageIndex;
    },
    setStartPage: function (pageIndex) {
        var spTree = this.spTree;
        for (var i = 0; i < spTree.length; ++i) {
            if (typeof spTree[i].setStartPage === "function") {
                spTree[i].setStartPage(pageIndex);
            }
        }
    },
    calculate: function () {},
    setPageIndex: function (pageIndex) {
        this.pageIndex = pageIndex;
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].setPageIndex(pageIndex);
        }
    },
    calculateTransformMatrix: function () {
        var _transform = new CMatrix();
        var _horizontal_center = this.absExtX * 0.5;
        var _vertical_center = this.absExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.absFlipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.absFlipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.absRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.absOffsetX, this.absOffsetY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        if (this.mainGroup !== null) {
            global_MatrixTransformer.MultiplyAppend(_transform, this.mainGroup.getTransform());
        }
        this.transform = _transform;
        this.ownTransform = _transform.CreateDublicate();
    },
    getOwnTransform: function () {
        return this.ownTransform;
    },
    calculateAfterRotate: function () {
        if (isRealObject(this.parent)) {
            this.parent.bNeedUpdateWH = true;
        }
        this.calculateTransformMatrix();
        this.calculateLeftTopPoint();
    },
    calculateAfterResize: function () {
        if (isRealObject(this.parent)) {
            this.parent.bNeedUpdateWH = true;
        }
        for (var i = 0; i < this.spTree.length; ++i) {
            var cur_sp = this.spTree[i];
            cur_sp.calculateAfterResize();
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
    getTransform: function () {
        return this.transform;
    },
    getTransformMatrix: function () {
        return this.transform;
    },
    getExtensions: function () {
        return {
            extX: this.absExtX,
            extY: this.absExtY
        };
    },
    getAngle: function (x, y) {
        var x_lt, y_lt;
        var hc, vc, sin, cos;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        sin = Math.sin(this.absRot);
        cos = Math.cos(this.absRot);
        x_lt = -hc * cos + vc * sin + this.absOffsetX + hc;
        y_lt = -hc * sin - vc * cos + this.absOffsetY + vc;
        var tx = x - x_lt,
        ty = y - y_lt;
        var vx, vy;
        vx = tx * cos + ty * sin;
        vy = -tx * sin + ty * cos;
        var ang = Math.PI * 0.5 + Math.atan2(vy - vc, vx - hc);
        if (!this.absFlipV) {
            return ang;
        } else {
            return ang + Math.PI;
        }
    },
    getAspect: function (num) {
        var _tmp_x = this.absExtX != 0 ? this.absExtX : 0.1;
        var _tmp_y = this.absExtY != 0 ? this.absExtY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },
    getObjectForResize: function (parent) {},
    createTrackObjectForMove: function (majorOffsetX, majorOffsetY) {
        return new GroupForResize(this, null, null, majorOffsetX, majorOffsetY);
    },
    createTrackObjectForResize: function (handleNumber, pageIndex) {
        return new GroupForResize(this, null, handleNumber);
    },
    createTrackObjectForRotate: function () {
        return new GroupForResize(this, null, null, null, null);
    },
    documentSearch: function (String, search_Common) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].documentSearch === "function") {
                this.spTree[i].documentSearch(String, search_Common);
            }
        }
    },
    Get_AllParagraphs_ByNumbering: function (NumPr, ParaArray) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (isRealObject(this.spTree[i]) && typeof this.spTree[i].Get_AllParagraphs_ByNumbering === "function") {
                this.spTree[i].Get_AllParagraphs_ByNumbering(NumPr, ParaArray);
            }
        }
    },
    Search: function (Str, Props, SearchEngine, Type) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].Search === "function") {
                this.spTree[i].Search(Str, Props, SearchEngine, Type);
            }
        }
    },
    fromArrayGraphicObjects: function (arrGrObj) {
        for (var i = 0; i < arrGrObj.length; ++i) {
            arrGrObj[i].deselect();
        }
        arrGrObj.sort(ComparisonByZIndex);
        for (i = 0; i < arrGrObj.length; ++i) {
            this.addGraphicObject(arrGrObj[i].GraphicObj);
        }
        var min_x, max_x, min_y, max_y;
        var g_o = arrGrObj[0];
        var rot = g_o.absRot;
        var x_c, y_c;
        if ((rot >= 0 && rot < Math.PI * 0.25) || (rot > 3 * Math.PI * 0.25 && rot < 5 * Math.PI * 0.25) || (rot > 7 * Math.PI * 0.25 && rot < 2 * Math.PI)) {
            min_x = g_o.absOffsetX;
            min_y = g_o.absOffsetY;
            max_x = g_o.absOffsetX + g_o.absExtX;
            max_y = g_o.absOffsetY + g_o.absExtY;
        } else {
            x_c = g_o.absOffsetX + g_o.absExtX * 0.5;
            y_c = g_o.absOffsetY + g_o.absExtY * 0.5;
            min_x = x_c - g_o.absExtY * 0.5;
            max_x = x_c + g_o.absExtY * 0.5;
            min_y = y_c - g_o.absExtX * 0.5;
            max_y = y_c + g_o.absExtX * 0.5;
        }
        var cur_min_x, cur_max_x, cur_min_y, cur_max_y;
        for (i = 1; i < arrGrObj.length; ++i) {
            g_o = arrGrObj[i];
            rot = g_o.absRot;
            if ((rot >= 0 && rot < Math.PI * 0.25) || (rot > 3 * Math.PI * 0.25 && rot < 5 * Math.PI * 0.25) || (rot > 7 * Math.PI * 0.25 && rot < 2 * Math.PI)) {
                cur_min_x = g_o.absOffsetX;
                cur_min_y = g_o.absOffsetY;
                cur_max_x = g_o.absOffsetX + g_o.absExtX;
                cur_max_y = g_o.absOffsetY + g_o.absExtY;
            } else {
                x_c = g_o.absOffsetX + g_o.absExtX * 0.5;
                y_c = g_o.absOffsetY + g_o.absExtY * 0.5;
                cur_min_x = x_c - g_o.absExtY * 0.5;
                cur_max_x = x_c + g_o.absExtY * 0.5;
                cur_min_y = y_c - g_o.absExtX * 0.5;
                cur_max_y = y_c + g_o.absExtX * 0.5;
            }
            if (cur_max_x > max_x) {
                max_x = cur_max_x;
            }
            if (cur_min_x < min_x) {
                min_x = cur_min_x;
            }
            if (cur_max_y > max_y) {
                max_y = cur_max_y;
            }
            if (cur_min_y < min_y) {
                min_y = cur_min_y;
            }
        }
        this.setXfrm(0, 0, max_x - min_x, max_y - min_y, 0, false, false);
        this.setAbsoluteTransform(min_x, min_y, max_x - min_x, max_y - min_y, 0, false, false);
        for (i = 0; i < this.arrGraphicObjects.length; ++i) {
            var gr_o = this.arrGraphicObjects[i];
            gr_o.setGroup(this);
            gr_o.setXfrm(gr_o.absOffsetX - min_x, gr_o.absOffsetY - min_y, null, null, null, null, null);
            gr_o.setAbsoluteTransform(gr_o.spPr.xfrm.offX, gr_o.spPr.xfrm.offY, null, null, null, null, null);
        }
        this.recalculate();
    },
    recalculate: function (bOpen) {
        this.recalculateTransformMatrix();
        var arr_gr_o = this.arrGraphicObjects;
        for (var i = 0; i < arr_gr_o.length; ++i) {
            arr_gr_o[i].recalculate(bOpen);
        }
        this.updateCursorTypes();
        this.spTree = this.getSpTree2();
    },
    updateAbsPosInGroup: function () {
        if (isRealObject(this.group)) {
            this.setAbsoluteTransform(this.spPr.xfrm.offX, this.spPr.xfrm.offY, null, null, null, null, null);
        }
    },
    recalculateTransformMatrix: function () {
        if (this.group == null) {
            var hc = this.absExtX * 0.5;
            var vc = this.absExtY * 0.5;
            this.transform = new CMatrix();
            var t = this.transform;
            global_MatrixTransformer.TranslateAppend(t, -hc, -vc);
            if (this.absFlipH) {
                global_MatrixTransformer.ScaleAppend(t, -1, 1);
            }
            if (this.absFlipV) {
                global_MatrixTransformer.ScaleAppend(t, 1, -1);
            }
            global_MatrixTransformer.RotateRadAppend(t, -this.absRot);
            global_MatrixTransformer.TranslateAppend(t, this.absOffsetX + hc, this.absOffsetY + vc);
        } else {
            var xfrm = this.spPr.xfrm;
            hc = xfrm.extX * 0.5;
            vc = xfrm.extY * 0.5;
            this.transform = new CMatrix();
            t = this.transform;
            global_MatrixTransformer.TranslateAppend(t, -hc, -vc);
            var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
            if (flip_h) {
                global_MatrixTransformer.ScaleAppend(t, -1, 1);
            }
            var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
            if (flip_v) {
                global_MatrixTransformer.ScaleAppend(t, 1, -1);
            }
            var rot = xfrm.rot == null ? 0 : xfrm.rot;
            global_MatrixTransformer.RotateRadAppend(t, -rot);
            global_MatrixTransformer.TranslateAppend(t, xfrm.offX + hc, xfrm.offY + vc);
            global_MatrixTransformer.MultiplyAppend(t, this.group.getTransform());
        }
        this.ownTransform = this.transform.CreateDublicate();
    },
    updateCursorTypes: function () {
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].updateCursorTypes();
        }
    },
    recalculateAfterInternalResize: function () {
        if (isRealObject(this.parent)) {
            this.parent.bNeedUpdateWH = true;
        }
        var _hc, _vc;
        var _x_min, _y_min, _x_max, _y_max;
        var _cur_element = this.arrGraphicObjects[0];
        var _xfrm = _cur_element.spPr.xfrm;
        var _cur_rot = _xfrm.rot == null ? 0 : _xfrm.rot;
        var _xc, _yc;
        if ((_cur_rot >= 0 && _cur_rot < Math.PI * 0.25) || (_cur_rot > 3 * Math.PI * 0.25 && _cur_rot < 5 * Math.PI * 0.25) || (_cur_rot > 7 * Math.PI * 0.25 && _cur_rot < 2 * Math.PI)) {
            _x_min = _xfrm.offX;
            _y_min = _xfrm.offY;
            _x_max = _x_min + _xfrm.extX;
            _y_max = _y_min + _xfrm.extY;
        } else {
            _hc = _xfrm.extX * 0.5;
            _vc = _xfrm.extY * 0.5;
            _xc = _hc + _xfrm.offX;
            _yc = _vc + _xfrm.offY;
            _x_min = _xc - _vc;
            _y_min = _yc - _hc;
            _x_max = _xc + _vc;
            _y_max = _yc + _hc;
        }
        var _cur_x_max, _cur_y_max, _cur_x_min, _cur_y_min;
        for (var _index = 1; _index < this.arrGraphicObjects.length; ++_index) {
            _cur_element = this.arrGraphicObjects[_index];
            _xfrm = _cur_element.spPr.xfrm;
            _cur_rot = _xfrm.rot;
            if ((_cur_rot >= 0 && _cur_rot < Math.PI * 0.25) || (_cur_rot > 3 * Math.PI * 0.25 && _cur_rot < 5 * Math.PI * 0.25) || (_cur_rot > 7 * Math.PI * 0.25 && _cur_rot < 2 * Math.PI)) {
                _cur_x_min = _xfrm.offX;
                _cur_y_min = _xfrm.offY;
                _cur_x_max = _cur_x_min + _xfrm.extX;
                _cur_y_max = _cur_y_min + _xfrm.extY;
            } else {
                _hc = _xfrm.extX * 0.5;
                _vc = _xfrm.extY * 0.5;
                _xc = _hc + _xfrm.offX;
                _yc = _vc + _xfrm.offY;
                _cur_x_min = _xc - _vc;
                _cur_y_min = _yc - _hc;
                _cur_x_max = _xc + _vc;
                _cur_y_max = _yc + _hc;
            }
            if (_cur_x_max > _x_max) {
                _x_max = _cur_x_max;
            }
            if (_cur_y_max > _y_max) {
                _y_max = _cur_y_max;
            }
            if (_cur_x_min < _x_min) {
                _x_min = _cur_x_min;
            }
            if (_cur_y_min < _y_min) {
                _y_min = _cur_y_min;
            }
        }
        var _x_min_clear = _x_min;
        var _y_min_clear = _y_min;
        if (this.absFlipH) {
            var _t = _x_max;
            _x_max = this.spPr.xfrm.extX - _x_min;
            _x_min = this.spPr.xfrm.extX - _t;
        }
        if (this.absFlipV) {
            _t = _y_max;
            _y_max = this.spPr.xfrm.extY - _y_min;
            _y_min = this.spPr.xfrm.extY - _t;
        }
        var old_x0, old_y0;
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var hc = xfrm.extX * 0.5;
        var vc = xfrm.extY * 0.5;
        old_x0 = xfrm.offX + hc - (hc * Math.cos(rot) - vc * Math.sin(rot));
        old_y0 = xfrm.offY + vc - (hc * Math.sin(rot) + vc * Math.cos(rot));
        var t_dx = _x_min * Math.cos(rot) - _y_min * Math.sin(rot);
        var t_dy = _x_min * Math.sin(rot) + _y_min * Math.cos(rot);
        var new_x0, new_y0;
        new_x0 = old_x0 + t_dx;
        new_y0 = old_y0 + t_dy;
        var new_hc = Math.abs(_x_max - _x_min) * 0.5;
        var new_vc = Math.abs(_y_max - _y_min) * 0.5;
        var new_xc = new_x0 + (new_hc * Math.cos(rot) - new_vc * Math.sin(rot));
        var new_yc = new_y0 + (new_hc * Math.sin(rot) + new_vc * Math.cos(rot));
        var pos_x, pos_y;
        if (this.group != null) {
            pos_x = new_xc - new_hc;
            pos_y = new_yc - new_vc;
        } else {
            pos_x = 0;
            pos_y = 0;
        }
        this.setXfrm(pos_x, pos_y, Math.abs(_x_max - _x_min), Math.abs(_y_max - _y_min), null, null, null);
        this.setAbsoluteTransform(pos_x, pos_y, Math.abs(_x_max - _x_min), Math.abs(_y_max - _y_min), null, null, null);
        for (_index = 0; _index < this.arrGraphicObjects.length; ++_index) {
            this.arrGraphicObjects[_index].setXfrm(this.arrGraphicObjects[_index].spPr.xfrm.offX - _x_min_clear, this.arrGraphicObjects[_index].spPr.xfrm.offY - _y_min_clear, null, null, null, null, null);
        }
        if (this.group != null) {
            this.group.recalculateAfterInternalResize();
        }
    },
    addGraphicObject: function (graphicObject) {
        History.Add(this, {
            Type: historyitem_AddGraphicObject,
            id: graphicObject.Get_Id(),
            index: this.arrGraphicObjects.length
        });
        this.arrGraphicObjects.push(graphicObject);
    },
    addToSpTree: function (sp) {
        History.Add(this, {
            Type: historyitem_AddToSpTree,
            id: sp.Get_Id(),
            index: this.spTree.length
        });
        this.spTree.push(sp);
    },
    fromArrayGraphicObjects2: function (arrGraphicObjects) {
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
        for (object_index = 0; object_index < arrGraphicObjects.length; object_index++) {
            cur_graphic_object = arrGraphicObjects[object_index].GraphicObj;
            if (cur_graphic_object.isGroup()) {
                cur_sp_tree = cur_graphic_object.spTree;
                var new_rot, new_offset_x, new_offset_y, new_flip_h, new_flip_v;
                var full_offset;
                var full_flip;
                for (sp_index = 0; sp_index < cur_sp_tree.length; ++sp_index) {
                    cur_sp = cur_sp_tree[sp_index];
                    new_rot = cur_sp.getFullRotate();
                    full_offset = cur_sp.getFullOffset();
                    new_offset_x = full_offset.x - x_min;
                    new_offset_y = full_offset.y - y_min;
                    full_flip = cur_sp.getFullFlip();
                    new_flip_h = full_flip.flipH;
                    new_flip_v = full_flip.flipV;
                    cur_sp.setAbsoluteTransform(new_offset_x, new_offset_y, null, null, new_rot, new_flip_h, new_flip_v);
                    cur_sp.setMainGroup(this);
                }
                for (var j = 0; j < cur_sp_tree.length; ++j) {
                    this.addToSpTree(cur_sp_tree[j]);
                }
            } else {
                new_offset_x = cur_graphic_object.absOffsetX - x_min;
                new_offset_y = cur_graphic_object.absOffsetY - y_min;
                cur_graphic_object.setAbsoluteTransform(new_offset_x, new_offset_y, null, null, null, null, null);
                this.addToSpTree(cur_graphic_object);
            }
            this.addGraphicObject(cur_graphic_object);
            cur_graphic_object.setGroup(this);
            cur_graphic_object.setMainGroup(this);
        }
        this.setAbsoluteTransform(x_min, y_min, x_max - x_min, y_max - y_min, 0, false, false);
        this.calculateTransformMatrix();
        var _arr_str_gr_obj = this.arrGraphicObjects;
        for (var _index = 0; _index < _arr_str_gr_obj.length; ++_index) {
            var _cur_obj = _arr_str_gr_obj[_index];
            if (_cur_obj.isGroup()) {
                _cur_obj.setXfrm(_cur_obj.absOffsetX - this.absOffsetX, _cur_obj.absOffsetY - this.absOffsetY, _cur_obj.absExtX, _cur_obj.absExtY, _cur_obj.absRot, _cur_obj.absFlipH, _cur_obj.absFlipV);
            }
        }
        var _graphic_object_count = this.spTree.length;
        for (var _graphic_object_index = 0; _graphic_object_index < _graphic_object_count; ++_graphic_object_index) {
            var _current_graphic_object = this.spTree[_graphic_object_index];
            _current_graphic_object.calculateTransformMatrix();
        }
        this.startCalculateAfterInternalResize();
    },
    documentStatistics: function (stat) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].documentStatistics === "function") {
                this.spTree[i].documentStatistics(stat);
            }
        }
    },
    getAllParagraphParaPr: function () {
        var result = null;
        var cur_pr;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].getAllParagraphParaPr === "function") {
                cur_pr = this.spTree[i].getAllParagraphParaPr();
            } else {
                cur_pr = null;
            }
            if (cur_pr != null) {
                if (result === null) {
                    result = cur_pr;
                } else {
                    result = result.Compare(cur_pr);
                }
            }
        }
        return result;
    },
    resetSelection: function () {},
    getAllParagraphTextPr: function () {
        var result = null;
        var cur_pr;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].getAllParagraphTextPr === "function") {
                cur_pr = this.spTree[i].getAllParagraphTextPr();
            } else {
                cur_pr = null;
            }
            if (cur_pr != null) {
                if (result === null) {
                    result = cur_pr;
                } else {
                    result = result.Compare(cur_pr);
                }
            }
        }
        return result;
    },
    startChangeChildSizes: function (kw, kh) {
        var _arr_graphic_objects = this.arrGraphicObjects;
        var _length = _arr_graphic_objects.length;
        var _cur_gr_object;
        var oldXc = this.absExtX * 0.5 / kw;
        var oldYc = this.absExtY * 0.5 / kh;
        for (var _index = 0; _index < _length; ++_index) {
            _cur_gr_object = _arr_graphic_objects[_index];
            var _rot = _cur_gr_object.spPr.xfrm.rot;
            var _old_gr_xc = _cur_gr_object.spPr.xfrm.offX + _cur_gr_object.spPr.xfrm.extX * 0.5;
            var _old_gr_yc = _cur_gr_object.spPr.xfrm.offY + _cur_gr_object.spPr.xfrm.extY * 0.5;
            if ((_rot >= 0 && _rot < Math.PI * 0.25) || (_rot > 3 * Math.PI * 0.25 && _rot < 5 * Math.PI * 0.25) || (_rot > 7 * Math.PI * 0.25 && _rot < 2 * Math.PI)) {
                _cur_gr_object.spPr.xfrm.extX *= kw;
                _cur_gr_object.spPr.xfrm.extY *= kh;
            } else {
                _cur_gr_object.spPr.xfrm.extX *= kh;
                _cur_gr_object.spPr.xfrm.extY *= kw;
            }
            _cur_gr_object.spPr.xfrm.offX = (_old_gr_xc - oldXc) * kw + this.absExtX * 0.5 - _cur_gr_object.spPr.xfrm.extX * 0.5;
            _cur_gr_object.spPr.xfrm.offY = (_old_gr_yc - oldYc) * kh + this.absExtY * 0.5 - _cur_gr_object.spPr.xfrm.extY * 0.5;
            if (!_cur_gr_object.isGroup()) {
                _cur_gr_object.calculateTransformMatrix();
            }
            if (_cur_gr_object.isGroup()) {
                _cur_gr_object.calculateFullTransformMatrix();
                var _child_gr_object = _cur_gr_object.arrGraphicObjects;
                for (var _i = 0; _i < _child_gr_object.length; ++_i) {
                    if (_child_gr_object[_i].isGroup()) {
                        if ((_rot >= 0 && _rot < Math.PI * 0.25) || (_rot > 3 * Math.PI * 0.25 && _rot < 5 * Math.PI * 0.25) || (_rot > 7 * Math.PI * 0.25 && _rot < 2 * Math.PI)) {
                            _child_gr_object[_i].changeSizeAfterResizeMainGroup(kw, kh);
                        } else {
                            _child_gr_object[_i].changeSizeAfterResizeMainGroup(kh, kw);
                        }
                    }
                }
            }
        }
    },
    changeSizeAfterResizeMainGroup: function (kw, kh) {
        var _arr_graphic_objects = this.arrGraphicObjects;
        var _length = _arr_graphic_objects.length;
        var _cur_gr_object;
        var oldXc = this.spPr.xfrm.extX * 0.5 / kw;
        var oldYc = this.spPr.xfrm.extY * 0.5 / kh;
        for (var _index = 0; _index < _length; ++_index) {
            _cur_gr_object = _arr_graphic_objects[_index];
            var _rot = _cur_gr_object.spPr.xfrm.rot;
            var _old_gr_xc = _cur_gr_object.spPr.xfrm.offX + _cur_gr_object.spPr.xfrm.extX * 0.5;
            var _old_gr_yc = _cur_gr_object.spPr.xfrm.offY + _cur_gr_object.spPr.xfrm.extY * 0.5;
            if ((_rot >= 0 && _rot < Math.PI * 0.25) || (_rot > 3 * Math.PI * 0.25 && _rot < 5 * Math.PI * 0.25) || (_rot > 7 * Math.PI * 0.25 && _rot < 2 * Math.PI)) {
                _cur_gr_object.spPr.xfrm.extX *= kw;
                _cur_gr_object.spPr.xfrm.extY *= kh;
            } else {
                _cur_gr_object.spPr.xfrm.extX *= kh;
                _cur_gr_object.spPr.xfrm.extY *= kw;
            }
            _cur_gr_object.spPr.xfrm.offX = (_old_gr_xc - oldXc) * kw + this.absExtX * 0.5 - _cur_gr_object.spPr.xfrm.extX * 0.5;
            _cur_gr_object.spPr.xfrm.offY = (_old_gr_yc - oldYc) * kh + this.absExtY * 0.5 - _cur_gr_object.spPr.xfrm.extY * 0.5;
            if (_cur_gr_object.isGroup()) {
                _cur_gr_object.calculateFullTransformMatrix();
                var _child_gr_object = _cur_gr_object.arrGraphicObjects;
                for (var _i = 0; _i < _child_gr_object.length; ++_i) {
                    if (_child_gr_object[_i].isGroup()) {
                        if ((_rot >= 0 && _rot < Math.PI * 0.25) || (_rot > 3 * Math.PI * 0.25 && _rot < 5 * Math.PI * 0.25) || (_rot > 7 * Math.PI * 0.25 && _rot < 2 * Math.PI)) {
                            _child_gr_object[_i].changeSizeAfterResizeMainGroup(kw, kh);
                        } else {
                            _child_gr_object[_i].changeSizeAfterResizeMainGroup(kh, kw);
                        }
                    }
                }
            }
        }
    },
    getSpTree: function () {
        return this.spTree;
    },
    drawBounds: function (graphics) {
        graphics.SetIntegerGrid(false);
        var _xfrm = this.spPr.xfrm;
        graphics.transform3(this.transform, false);
        graphics.p_color(0, 0, 0, 255);
        graphics.p_width(100);
        graphics._m(0, 0);
        graphics._l(_xfrm.extX, 0);
        graphics._l(_xfrm.extX, _xfrm.extY);
        graphics._l(0, _xfrm.extY);
        graphics._z();
        graphics.ds();
        graphics.SetIntegerGrid(true);
        for (var _index = 0; _index < this.arrGraphicObjects.length; ++_index) {
            if (typeof this.arrGraphicObjects[_index].drawBounds === "function") {
                this.arrGraphicObjects[_index].drawBounds(graphics);
            }
        }
    },
    getAbsolutePosition: function () {
        return {
            x: this.absOffsetX,
            y: this.absOffsetY
        };
    },
    calculateSnapArrays: function (snapArrayX, snapArrayY) {
        var t = this.transform;
        snapArrayX.push(t.TransformPointX(0, 0));
        snapArrayY.push(t.TransformPointY(0, 0));
        snapArrayX.push(t.TransformPointX(this.absExtX, 0));
        snapArrayY.push(t.TransformPointY(this.absExtX, 0));
        snapArrayX.push(t.TransformPointX(this.absExtX * 0.5, this.absExtY * 0.5));
        snapArrayY.push(t.TransformPointY(this.absExtX * 0.5, this.absExtY * 0.5));
        snapArrayX.push(t.TransformPointX(this.absExtX, this.absExtY));
        snapArrayY.push(t.TransformPointY(this.absExtX, this.absExtY));
        snapArrayX.push(t.TransformPointX(0, this.absExtY));
        snapArrayY.push(t.TransformPointY(0, this.absExtY));
        var spTree = this.spTree;
        var n = spTree.length;
        for (var i = 0; i < n; ++i) {
            if (typeof spTree[i].calculateSnapArrays === "function") {
                spTree[i].calculateSnapArrays(snapArrayX, snapArrayY);
            }
        }
    },
    draw: function (graphics) {
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].draw(graphics);
        }
    },
    drawOnOverlay: function (overlay) {
        if (this.arrTrackObjects.length > 0) {
            for (var _track_index = 0; _track_index < this.arrTrackObjects.length; ++_track_index) {
                this.arrTrackObjects.draw(overlay);
            }
        }
    },
    drawSelect: function () {
        var _selection_array = this.selectionInfo.selectionArray;
        var _selection_count = _selection_array.length;
        for (var _selection_index = 0; _selection_index < _selection_count; ++_selection_index) {
            var _graphic_object = _selection_array[_selection_index].graphicObject;
            this.drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, _graphic_object.transform, 0, 0, _graphic_object.absExtX, _graphic_object.absExtY, false);
        }
        if (_selection_count === 1 && typeof _graphic_object.drawAdjustments === "function") {
            _graphic_object.drawAdjustments();
        }
    },
    calculateLeftTopPoint: function () {
        var _horizontal_center = this.absExtX * 0.5;
        var _vertical_enter = this.absExtY * 0.5;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        this.absXLT = -_horizontal_center * _cos + _vertical_enter * _sin + this.absOffsetX + _horizontal_center;
        this.absYLT = -_horizontal_center * _sin - _vertical_enter * _cos + this.absOffsetY + _vertical_enter;
    },
    getNearestPos: function (x, y, pageIndex) {
        var spTree = this.spTree;
        for (var i = spTree.length - 1; i > -1; --i) {
            if (typeof spTree[i].getNearestPos === "function" && typeof spTree[i].hitToTextRect === "function" && spTree[i].hitToTextRect(x, y)) {
                var near_pos = spTree[i].getNearestPos(x, y, pageIndex);
                if (near_pos != null) {
                    return near_pos;
                }
            }
        }
        return null;
    },
    startCalculateAfterInternalResize: function () {
        var _arr_gr_objects = this.arrGraphicObjects;
        for (var _index = 0; _index < _arr_gr_objects.length; ++_index) {
            var _cur_gr_object = _arr_gr_objects[_index];
            if (_cur_gr_object.isGroup()) {
                _cur_gr_object.calculateAfterInternalResize();
            } else {
                _cur_gr_object.setXfrm(_cur_gr_object.absOffsetX, _cur_gr_object.absOffsetY, _cur_gr_object.absExtX, _cur_gr_object.absExtY, _cur_gr_object.absRot, _cur_gr_object.absFlipH, _cur_gr_object.absFlipV);
            }
        }
        var _x_min, _y_min, _x_max, _y_max;
        var _cur_element = this.spTree[0];
        var _cur_rot = _cur_element.absRot;
        var _xc, _yc, _hc, _vc;
        if ((_cur_rot >= 0 && _cur_rot < Math.PI * 0.25) || (_cur_rot > 3 * Math.PI * 0.25 && _cur_rot < 5 * Math.PI * 0.25) || (_cur_rot > 7 * Math.PI * 0.25 && _cur_rot < 2 * Math.PI)) {
            _x_min = _cur_element.absOffsetX;
            _y_min = _cur_element.absOffsetY;
            _x_max = _x_min + _cur_element.absExtX;
            _y_max = _y_min + _cur_element.absExtY;
        } else {
            _hc = _cur_element.absExtX * 0.5;
            _vc = _cur_element.absExtY * 0.5;
            _xc = _cur_element.absOffsetX + _hc;
            _yc = _cur_element.absOffsetY + _vc;
            _x_min = _xc - _vc;
            _y_min = _yc - _hc;
            _x_max = _xc + _vc;
            _y_max = _yc + _hc;
        }
        var _cur_x_max, _cur_y_max, _cur_x_min, _cur_y_min;
        for (_index = 1; _index < this.spTree.length; ++_index) {
            _cur_element = this.spTree[_index];
            _cur_rot = _cur_element.absRot;
            if ((_cur_rot >= 0 && _cur_rot < Math.PI * 0.25) || (_cur_rot > 3 * Math.PI * 0.25 && _cur_rot < 5 * Math.PI * 0.25) || (_cur_rot > 7 * Math.PI * 0.25 && _cur_rot < 2 * Math.PI)) {
                _cur_x_min = _cur_element.absOffsetX;
                _cur_y_min = _cur_element.absOffsetY;
                _cur_x_max = _cur_x_min + _cur_element.absExtX;
                _cur_y_max = _cur_y_min + _cur_element.absExtY;
            } else {
                _hc = _cur_element.absExtX * 0.5;
                _vc = _cur_element.absExtY * 0.5;
                _xc = _cur_element.absOffsetX + _hc;
                _yc = _cur_element.absOffsetY + _vc;
                _cur_x_min = _xc - _vc;
                _cur_y_min = _yc - _hc;
                _cur_x_max = _xc + _vc;
                _cur_y_max = _yc + _hc;
            }
            if (_cur_x_max > _x_max) {
                _x_max = _cur_x_max;
            }
            if (_cur_y_max > _y_max) {
                _y_max = _cur_y_max;
            }
            if (_cur_x_min < _x_min) {
                _x_min = _cur_x_min;
            }
            if (_cur_y_min < _y_min) {
                _y_min = _cur_y_min;
            }
        }
        var _transformed_lt_x = this.transform.TransformPointX(_x_min, _y_min);
        var _transformed_lt_y = this.transform.TransformPointY(_x_min, _y_min);
        var _transformed_rb_x = this.transform.TransformPointX(_x_max, _y_max);
        var _transformed_rb_y = this.transform.TransformPointY(_x_max, _y_max);
        var _new_x_c = 0.5 * (_transformed_lt_x + _transformed_rb_x);
        var _new_y_c = 0.5 * (_transformed_lt_y + _transformed_rb_y);
        for (_index = 0; _index < this.arrGraphicObjects.length; ++_index) {
            this.arrGraphicObjects[_index].setXfrm(this.arrGraphicObjects[_index].spPr.xfrm.offX - _x_min, this.arrGraphicObjects[_index].spPr.xfrm.offY - _y_min, null, null, null, null, null);
        }
        for (_index = 0; _index < this.spTree.length; ++_index) {
            this.spTree[_index].setAbsoluteTransform(this.spTree[_index].absOffsetX - _x_min, this.spTree[_index].absOffsetY - _y_min, null, null, null, null, null);
        }
        this.setAbsoluteTransform(_new_x_c - (_x_max - _x_min) * 0.5, _new_y_c - (_y_max - _y_min) * 0.5, _x_max - _x_min, _y_max - _y_min, null, null, null);
        this.calculateTransformMatrix();
        for (_index = 0; _index < this.arrGraphicObjects.length; ++_index) {
            if (this.arrGraphicObjects[_index].isGroup()) {
                this.arrGraphicObjects[_index].calculateFullTransformMatrix();
            }
        }
    },
    setTextVerticalAlign: function (align) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].setTextVerticalAlign === "function") {
                this.spTree[i].setTextVerticalAlign(align);
            }
        }
    },
    checkLine: function () {
        return false;
    },
    calculateAfterInternalResize: function () {
        var _arr_graphic_objects = this.arrGraphicObjects;
        var _invert_transform = global_MatrixTransformer.Invert(this.transform);
        var _hc, _vc;
        for (var _index = 0; _index < _arr_graphic_objects.length; ++_index) {
            var _cur_gr_object = _arr_graphic_objects[_index];
            if (_cur_gr_object.isGroup()) {
                _cur_gr_object.calculateAfterInternalResize();
            } else {
                var _relative_xc, _relative_yc;
                var _abs_xc, _abs_yc;
                _hc = _cur_gr_object.absExtX * 0.5;
                _vc = _cur_gr_object.absExtY * 0.5;
                _abs_xc = _cur_gr_object.transform.TransformPointX(_hc, _vc);
                _abs_yc = _cur_gr_object.transform.TransformPointY(_hc, _vc);
                _relative_xc = _invert_transform.TransformPointX(_abs_xc, _abs_yc);
                _relative_yc = _invert_transform.TransformPointY(_abs_xc, _abs_yc);
                var _new_offset_x = _relative_xc - _hc;
                var _new_offset_y = _relative_yc - _vc;
                var _relative_rotate = _cur_gr_object.absRot;
                var _cur_group = this;
                while (_cur_group != this.mainGroup && this.mainGroup != null) {
                    _relative_rotate -= _cur_group.spPr.xfrm.rot;
                    _cur_group = _cur_group.group;
                }
                while (_relative_rotate < 0) {
                    _relative_rotate += Math.PI * 2;
                }
                while (_relative_rotate >= 2 * Math.PI) {
                    _relative_rotate -= Math.PI * 2;
                }
                _cur_gr_object.setXfrm(_new_offset_x, _new_offset_y, _cur_gr_object.absExtX, _cur_gr_object.absExtY, _relative_rotate, null, null);
            }
        }
        var _x_min, _y_min, _x_max, _y_max;
        var _cur_element = this.arrGraphicObjects[0];
        var _xfrm = _cur_element.spPr.xfrm;
        var _cur_rot = _xfrm.rot;
        var _xc, _yc;
        if ((_cur_rot >= 0 && _cur_rot < Math.PI * 0.25) || (_cur_rot > 3 * Math.PI * 0.25 && _cur_rot < 5 * Math.PI * 0.25) || (_cur_rot > 7 * Math.PI * 0.25 && _cur_rot < 2 * Math.PI)) {
            _x_min = _xfrm.offX;
            _y_min = _xfrm.offY;
            _x_max = _x_min + _xfrm.extX;
            _y_max = _y_min + _xfrm.extY;
        } else {
            _hc = _xfrm.extX * 0.5;
            _vc = _xfrm.extY * 0.5;
            _xc = _hc + _xfrm.offX;
            _yc = _vc + _xfrm.offY;
            _x_min = _xc - _vc;
            _y_min = _yc - _hc;
            _x_max = _xc + _vc;
            _y_max = _yc + _hc;
        }
        var _cur_x_max, _cur_y_max, _cur_x_min, _cur_y_min;
        for (_index = 1; _index < this.arrGraphicObjects.length; ++_index) {
            _cur_element = this.arrGraphicObjects[_index];
            _xfrm = _cur_element.spPr.xfrm;
            _cur_rot = _xfrm.rot;
            if ((_cur_rot >= 0 && _cur_rot < Math.PI * 0.25) || (_cur_rot > 3 * Math.PI * 0.25 && _cur_rot < 5 * Math.PI * 0.25) || (_cur_rot > 7 * Math.PI * 0.25 && _cur_rot < 2 * Math.PI)) {
                _cur_x_min = _xfrm.offX;
                _cur_y_min = _xfrm.offY;
                _cur_x_max = _cur_x_min + _xfrm.extX;
                _cur_y_max = _cur_y_min + _xfrm.extY;
            } else {
                _hc = _xfrm.extX * 0.5;
                _vc = _xfrm.extY * 0.5;
                _xc = _hc + _xfrm.offX;
                _yc = _vc + _xfrm.offY;
                _cur_x_min = _xc - _vc;
                _cur_y_min = _yc - _hc;
                _cur_x_max = _xc + _vc;
                _cur_y_max = _yc + _hc;
            }
            if (_cur_x_max > _x_max) {
                _x_max = _cur_x_max;
            }
            if (_cur_y_max > _y_max) {
                _y_max = _cur_y_max;
            }
            if (_cur_x_min < _x_min) {
                _x_min = _cur_x_min;
            }
            if (_cur_y_min < _y_min) {
                _y_min = _cur_y_min;
            }
        }
        var _x_min_clear = _x_min;
        var _y_min_clear = _y_min;
        if (this.absFlipH) {
            var _t = _x_max;
            _x_max = this.spPr.xfrm.extX - _x_min;
            _x_min = this.spPr.xfrm.extX - _t;
        }
        if (this.absFlipV) {
            _t = _y_max;
            _y_max = this.spPr.xfrm.extY - _y_min;
            _y_min = this.spPr.xfrm.extY - _t;
        }
        var old_x0, old_y0;
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var hc = xfrm.extX * 0.5;
        var vc = xfrm.extY * 0.5;
        old_x0 = xfrm.offX + hc - (hc * Math.cos(rot) - vc * Math.sin(rot));
        old_y0 = xfrm.offY + vc - (hc * Math.sin(rot) + vc * Math.cos(rot));
        var t_dx = _x_min * Math.cos(rot) - _y_min * Math.sin(rot);
        var t_dy = _x_min * Math.sin(rot) + _y_min * Math.cos(rot);
        var new_x0, new_y0;
        new_x0 = old_x0 + t_dx;
        new_y0 = old_y0 + t_dy;
        var new_hc = Math.abs(_x_max - _x_min) * 0.5;
        var new_vc = Math.abs(_y_max - _y_min) * 0.5;
        var new_xc = new_x0 + (new_hc * Math.cos(rot) - new_vc * Math.sin(rot));
        var new_yc = new_y0 + (new_hc * Math.sin(rot) + new_vc * Math.cos(rot));
        this.setXfrm(new_xc - new_hc, new_yc - new_vc, Math.abs(_x_max - _x_min), Math.abs(_y_max - _y_min), null, null, null);
        for (_index = 0; _index < this.arrGraphicObjects.length; ++_index) {
            this.arrGraphicObjects[_index].setXfrm(this.arrGraphicObjects[_index].spPr.xfrm.offX - _x_min_clear, this.arrGraphicObjects[_index].spPr.xfrm.offY - _y_min_clear, null, null, null, null, null);
        }
    },
    calculateAfterUnGroup: function () {
        var _sp_tree = this.spTree;
        var _invert_transform = this.transform;
        for (var _sp_index = 0; _sp_index < _sp_tree.length; ++_sp_index) {
            var _cur_sp = _sp_tree[_sp_index];
            var _cur_sp_transform = _cur_sp.transform;
            var _hc = _cur_sp.absExtX * 0.5;
            var _vc = _cur_sp.absExtY * 0.5;
            var _abs_xc = _cur_sp_transform.TransformPointX(_hc, _vc);
            var _abs_yc = _cur_sp_transform.TransformPointY(_hc, _vc);
            var _rel_xc = _invert_transform.TransformPointX(_abs_xc, _abs_yc);
            var _rel_yc = _invert_transform.TransformPointY(_abs_xc, _abs_yc);
            var _new_rel_pox_x = _rel_xc - _hc;
            var _new_rel_pos_y = _rel_yc - _vc;
            var _new_rel_rot = _cur_sp.absRot - this.spPr.xfrm.rot;
        }
    },
    calculateFullTransformMatrix: function () {
        var _transform = new CMatrix();
        var _horizontal_center = this.spPr.xfrm.extX * 0.5;
        var _vertical_center = this.spPr.xfrm.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.absFlipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.absFlipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.spPr.xfrm.rot);
        global_MatrixTransformer.TranslateAppend(_transform, this.spPr.xfrm.offX, this.spPr.xfrm.offY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        global_MatrixTransformer.MultiplyAppend(_transform, this.group.getTransform());
        this.transform = _transform;
        for (var _index = 0; _index < this.arrGraphicObjects.length; ++_index) {
            if (this.arrGraphicObjects[_index].isGroup()) {
                this.arrGraphicObjects[_index].calculateFullTransformMatrix();
            }
        }
    },
    getBase64Object: function () {
        var w = new CMemory();
        this.Write_ToBinary2(w);
        return w.GetBase64Memory();
    },
    getBase64Img: function () {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },
    setAbsoluteTransform: function (offsetX, offsetY, extX, extY, rot, flipH, flipV, bOpen) {
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
        this.recalculate(bOpen);
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
    getArrayWrapPolygons: function () {
        var ret = [];
        var invert_transform = global_MatrixTransformer.Invert(this.transform);
        var sp_tree = this.getSpTree2();
        for (var sp_index = 0; sp_index < sp_tree.length; ++sp_index) {
            if (typeof sp_tree[sp_index].getArrayWrapPolygons === "function") {
                var cur_polygon_array = sp_tree[sp_index].getArrayWrapPolygons();
                var cur_transform = new CMatrix();
                global_MatrixTransformer.MultiplyAppend(cur_transform, sp_tree[sp_index].getTransformMatrix());
                global_MatrixTransformer.MultiplyAppend(cur_transform, invert_transform);
                for (var polygon_index = 0; polygon_index < cur_polygon_array.length; ++polygon_index) {
                    var cur_polygon = cur_polygon_array[polygon_index];
                    for (var point_index = 0; point_index < cur_polygon.length; ++point_index) {
                        var cur_point = cur_polygon[point_index];
                        var t_x = cur_transform.TransformPointX(cur_point.x, cur_point.y);
                        var t_y = cur_transform.TransformPointY(cur_point.x, cur_point.y);
                        cur_point.x = t_x;
                        cur_point.y = t_y;
                    }
                }
                ret = ret.concat(cur_polygon_array);
            }
        }
        return ret;
    },
    transformPointRelativeShape: function (x, y) {
        this.calculateLeftTopPoint();
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        var _temp_x = x - this.absXLT;
        var _temp_y = y - this.absYLT;
        var _relative_x = _temp_x * _cos + _temp_y * _sin;
        var _relative_y = -_temp_x * _sin + _temp_y * _cos;
        if (this.absFlipH) {
            _relative_x = this.absExtX - _relative_x;
        }
        if (this.absFlipV) {
            _relative_y = this.absExtY - _relative_y;
        }
        return {
            x: _relative_x,
            y: _relative_y
        };
    },
    hit: function (x, y) {
        if (isRealObject(this.parent) && isRealObject(this.parent.Parent) && isRealObject(this.parent.Parent.Parent) && this.parent.Parent.Parent instanceof CDocumentContent && this.parent.wrappingType !== WRAPPING_TYPE_NONE && (!(this.parent.Parent.Parent.Is_HdrFtr() || this.parent.Is_Inline())) && !this.parent.Parent.Parent.Is_TopDocument()) {
            var tx, ty;
            var b_check = false;
            if (!this.parent.isShapeChild()) {
                tx = x;
                ty = y;
                b_check = true;
            } else {
                var parent_shape = this.parent.getParentShape();
                if (isRealObject(parent_shape) && isRealObject(parent_shape.invertTextMatrix)) {
                    tx = parent_shape.invertTextMatrix.TransformPointX(x, y);
                    ty = parent_shape.invertTextMatrix.TransformPointY(x, y);
                    b_check = true;
                }
            }
            if (b_check) {
                var doc_content = this.parent.Parent.Parent;
                var rel_page_index = this.pageIndex - doc_content.Get_StartPage_Absolute();
                if (isRealObject(doc_content.Pages[rel_page_index])) {
                    var bounds = doc_content.Pages[rel_page_index].Bounds;
                    if (tx < bounds.Left || tx > bounds.Right || ty < bounds.Top || ty > bounds.Bottom) {
                        return false;
                    }
                }
                var cur_doc_content;
                cur_doc_content = doc_content;
                if (cur_doc_content.Parent instanceof WordShape) {
                    var shape = cur_doc_content.Parent;
                    if (shape.group == null && isRealObject(shape.parent) && isRealObject(shape.parent.Parent) && isRealObject(shape.parent.Parent.Parent)) {
                        cur_doc_content = shape.parent.Parent.Parent;
                    } else {
                        var cur_group = shape.group;
                        if (isRealObject(shape.group)) {
                            while (isRealObject(cur_group.group)) {
                                cur_group = cur_group.group;
                            }
                            if (isRealObject(cur_group) && isRealObject(cur_group.parent) && isRealObject(cur_group.parent.Parent) && isRealObject(cur_group.parent.Parent.Parent)) {
                                cur_doc_content = cur_group.parent.Parent.Parent;
                            }
                        }
                    }
                    if (cur_doc_content.Is_TableCellContent()) {
                        rel_page_index = this.pageIndex - cur_doc_content.Get_StartPage_Absolute();
                        if (isRealObject(cur_doc_content.Pages[rel_page_index])) {
                            bounds = cur_doc_content.Pages[rel_page_index].Bounds;
                            if (x < bounds.Left || x > bounds.Right || y < bounds.Top || y > bounds.Bottom) {
                                return false;
                            }
                        }
                    }
                    tx = x;
                    ty = y;
                }
                if (doc_content.Is_TableCellContent()) {
                    cur_doc_content = doc_content.Parent.Row.Table.Parent;
                    while (cur_doc_content.Is_TableCellContent()) {
                        rel_page_index = this.pageIndex - cur_doc_content.Get_StartPage_Absolute();
                        if (isRealObject(cur_doc_content.Pages[rel_page_index])) {
                            bounds = cur_doc_content.Pages[rel_page_index].Bounds;
                            if (tx < bounds.Left || tx > bounds.Right || ty < bounds.Top || ty > bounds.Bottom) {
                                return false;
                            }
                        }
                        cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                        if (cur_doc_content.Parent instanceof WordShape) {
                            shape = cur_doc_content.Parent;
                            if (shape.group == null && isRealObject(shape.parent) && isRealObject(shape.parent.Parent) && isRealObject(shape.parent.Parent.Parent)) {
                                cur_doc_content = shape.parent.Parent.Parent;
                            } else {
                                cur_group = shape.group;
                                if (isRealObject(shape.group)) {
                                    while (isRealObject(cur_group.group)) {
                                        cur_group = cur_group.group;
                                    }
                                    if (isRealObject(cur_group) && isRealObject(cur_group.parent) && isRealObject(cur_group.parent.Parent) && isRealObject(cur_group.parent.Parent.Parent)) {
                                        cur_doc_content = cur_group.parent.Parent.Parent;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var gr_objects = this.arrGraphicObjects;
        for (var i = gr_objects.length - 1; i > -1; --i) {
            if (gr_objects[i].hit(x, y)) {
                return true;
            }
        }
        if (this.selected === true) {
            return this.hitInBox(x, y);
        }
        return false;
    },
    hitInBox: function (x, y) {
        var t_x, t_y;
        t_x = x;
        t_y = y;
        var _transformed_point = this.transformPointRelativeShape(t_x, t_y);
        var _tr_x = _transformed_point.x;
        var _tr_y = _transformed_point.y;
        var _hit_context = this.drawingDocument.CanvasHitContext;
        return (HitInLine(_hit_context, _tr_x, _tr_y, 0, 0, this.absExtX, 0) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX, 0, this.absExtX, this.absExtY) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX, this.absExtY, 0, this.absExtY) || HitInLine(_hit_context, _tr_x, _tr_y, 0, this.absExtY, 0, 0) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX * 0.5, 0, this.absExtX * 0.5, -this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE)));
    },
    hitToHandle: function (x, y, radius) {
        var _radius;
        if (! (typeof radius === "number")) {
            _radius = this.drawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        } else {
            _radius = radius;
        }
        this.calculateLeftTopPoint();
        var _temp_x = x - this.absXLT;
        var _temp_y = y - this.absYLT;
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
        _dist_y = _relative_y + this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
        if (Math.sqrt(_dist_x * _dist_x + _dist_y * _dist_y) < _radius) {
            return {
                hit: true,
                handleRotate: true,
                handleNum: 8
            };
        }
        return {
            hit: false,
            handleRotate: false,
            handleNum: null
        };
    },
    hitToTextRect: function (x, y) {
        for (var object_index = 0; object_index < this.spTree.length; ++object_index) {
            if (this.spTree[object_index].hitToTextRect(x, y)) {
                return {
                    hit: true,
                    num: object_index
                };
            }
        }
        return {
            hit: false
        };
    },
    select: function (pageIndex) {
        this.selected = true;
        if (typeof pageIndex === "number") {
            this.selectStartPage = pageIndex;
        }
    },
    canRotate: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (!this.spTree[i].canRotate()) {
                return false;
            }
        }
        return true;
    },
    deselect: function () {
        this.selected = false;
        this.selectStartPage = -1;
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].deselect();
        }
    },
    applyTextPr: function (paraItem, bRecalculate) {
        var sp_tree = this.spTree;
        for (var sp_index = 0; sp_index < sp_tree.length; ++sp_index) {
            if (typeof sp_tree[sp_index].applyTextPr === "function") {
                sp_tree[sp_index].applyTextPr(paraItem, bRecalculate);
            }
        }
    },
    removeObjectFromSpTreeById: function (id) {
        var sp_tree = this.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            if (sp_tree[i].Get_Id() === id) {
                var data = {
                    Type: historyitem_RemoveFromSpTree,
                    id: id
                };
                History.Add(this, data);
                sp_tree.splice(i, 1);
                return;
            }
        }
    },
    removeObjectFromArrGraphicObjects: function (id) {
        var arr_gr_objects = this.arrGraphicObjects;
        for (var i = 0; i < arr_gr_objects.length; ++i) {
            if (arr_gr_objects[i].Get_Id() === id) {
                var data = {
                    Type: historyitem_RemoveFromArrGraphicObj,
                    id: id,
                    index: i
                };
                History.Add(this, data);
                arr_gr_objects.splice(i, 1);
            }
        }
    },
    swapGraphicObject: function (oldId, newId) {
        var new_obj = g_oTableId.Get_ById(newId);
        if (isRealObject(new_obj)) {
            for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
                if (this.arrGraphicObjects[i].Get_Id() === oldId) {
                    this.arrGraphicObjects[i] = new_obj;
                    History.Add(this, {
                        Type: historyitem_SwapGrObject,
                        oldId: oldId,
                        newId: newId
                    });
                    return;
                }
            }
        }
    },
    removeObjectFromArrGraphicObjects2: function (index) {
        var arr_gr_objects = this.arrGraphicObjects;
        if (isRealObject(arr_gr_objects[index])) {
            var data = {
                Type: historyitem_RemoveFromArrGraphicObj2,
                id: arr_gr_objects[index].Get_Id(),
                index: index
            };
            History.Add(this, data);
            return arr_gr_objects.splice(index, 1)[0];
        }
        return null;
    },
    Undo: function (data) {
        var b_history_is_on = History.Is_On();
        if (b_history_is_on) {
            History.TurnOff();
        }
        switch (data.Type) {
        case historyitem_SetAbsoluteTransform:
            if (data.oldOffsetX != null) {
                this.absOffsetX = data.oldOffsetX;
            }
            if (data.oldOffsetY != null) {
                this.absOffsetY = data.oldOffsetY;
            }
            if (data.oldExtX != null) {
                this.absExtX = data.oldExtX;
            }
            if (data.oldExtY != null) {
                this.absExtY = data.oldExtY;
            }
            if (data.oldRot != null) {
                this.absRot = data.oldRot;
            }
            if (data.oldFlipH != null) {
                this.absFlipH = data.oldFlipH;
            }
            if (data.oldFlipV != null) {
                this.absFlipV = data.oldFlipV;
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateAfterResize();
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
        case historyitem_SetRotate:
            var rot = data.oldRot == null ? 0 : data.oldRot;
            this.absRot = rot;
            this.spPr.xfrm.rot = rot;
            if (this.parent) {
                this.parent.absRot = rot;
            }
            this.calculateAfterRotate();
            var _shapes = this.spTree;
            var _shape_index;
            var _shape_count = _shapes.length;
            for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                _shapes[_shape_index].calculateTransformMatrix();
                _shapes[_shape_index].calculateContent();
                _shapes[_shape_index].calculateTransformTextMatrix();
            }
            var _arrGraphicObjects = this.arrGraphicObjects;
            _shape_count = _arrGraphicObjects.length;
            for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                if (_arrGraphicObjects[_shape_index].isGroup()) {
                    _arrGraphicObjects[_shape_index].calculateFullTransformMatrix();
                }
            }
            break;
        case historyitem_SetSizes:
            var xfrm = this.spPr.xfrm;
            xfrm.extX = data.oldW;
            xfrm.extY = data.oldH;
            xfrm.flipH = data.oldFlipH;
            xfrm.flipV = data.oldFlipV;
            this.absOffsetX = data.oldPosX;
            this.absOffsetY = data.oldPosY;
            this.absExtX = data.oldW;
            this.absExtY = data.oldH;
            this.absFlipH = data.oldFlipH;
            this.absFlipV = data.oldFlipV;
            if (this.parent) {
                this.parent.absOffsetX = data.oldPosX;
                this.parent.absOffsetY = data.oldPosY;
                this.parent.absExtX = data.oldW;
                this.parent.absExtY = data.oldH;
                this.parent.absFlipH = data.oldFlipH;
                this.parent.absFlipV = data.oldFlipV;
            }
            this.calculateTransformMatrix();
            this.startChangeChildSizes(1 / data.kw, 1 / data.kh);
            this.startCalculateAfterInternalResize();
            break;
        case historyitem_InternalChanges:
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateAfterResize();
            break;
        case historyitem_SetGroup:
            this.group = data.oldGroup;
            break;
        case historyitem_SetMainGroup:
            this.mainGroup = data.oldGroup;
            break;
        case historyitem_RemoveFromSpTree:
            var sp = g_oTableId.Get_ById(data.id);
            if (isRealObject(sp)) {
                this.spTree.push(sp);
                this.spTree.sort(function (a, b) {
                    if (isRealObject(a) && isRealObject(a.parent) && isRealObject(b) && isRealObject(b.parent)) {
                        return a.parent.RelativeHeight - b.parent.RelativeHeight;
                    }
                    return 0;
                });
            }
            break;
        case historyitem_RemoveFromArrGraphicObj:
            var gr_obj = g_oTableId.Get_ById(data.id);
            if (isRealObject(gr_obj)) {
                this.arrGraphicObjects.splice(data.index, 0, gr_obj);
            }
            break;
        case historyitem_RemoveFromArrGraphicObj2:
            this.arrGraphicObjects.splice(data.index, 0, g_oTableId.Get_ById(data.id));
            break;
        case historyitem_MoveShapeInArray:
            if (data.oldPos !== data.newPos) {
                this.arrGraphicObjects.splice(data.oldPos, 0, this.arrGraphicObjects.splice(data.newPos, 1)[0]);
            }
            break;
        case historyitem_UpadteSpTreeBefore:
            this.updateSpTree();
            break;
        case historyitem_SwapGrObject:
            var old = g_oTableId.Get_ById(data.oldId);
            for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
                if (this.arrGraphicObjects[i].Get_Id() === data.newId) {
                    this.arrGraphicObjects[i] = old;
                    break;
                }
            }
            break;
        case historyitem_SetSpPr:
            this.spPr = new CSpPr();
            break;
        case historyitem_SetStyle:
            this.style = null;
            break;
        case historyitem_SetBodyPr:
            this.bodyPr = new CBodyPr();
            this.bodyPr.setDefault();
            break;
        case historyitem_GroupRecalculate:
            this.recalculate();
            break;
        case historyitem_AddGraphicObject:
            for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
                if (this.arrGraphicObjects[i].Get_Id() === data.id) {
                    this.arrGraphicObjects.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_SetParent:
            if (data.oldParent == null) {
                this.parent = null;
            } else {
                this.parent = g_oTableId.Get_ById(data.oldParent);
            }
            break;
        }
        if (b_history_is_on) {
            History.TurnOn();
        }
    },
    Redo: function (data) {
        var b_history_is_on = History.Is_On();
        if (b_history_is_on) {
            History.TurnOff();
        }
        switch (data.Type) {
        case historyitem_SetAbsoluteTransform:
            if (data.newOffsetX != null) {
                this.absOffsetX = data.newOffsetX;
            }
            if (data.newOffsetY != null) {
                this.absOffsetY = data.newOffsetY;
            }
            if (data.newExtX != null) {
                this.absExtX = data.newExtX;
            }
            if (data.newExtY != null) {
                this.absExtY = data.newExtY;
            }
            if (data.newRot != null) {
                this.absRot = data.newRot;
            }
            if (data.newFlipH != null) {
                this.absFlipH = data.newFlipH;
            }
            if (data.newFlipV != null) {
                this.absFlipV = data.newFlipV;
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
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
        case historyitem_SetRotate:
            var rot = data.newRot == null ? 0 : data.newRot;
            this.absRot = rot;
            this.spPr.xfrm.rot = rot;
            if (this.parent) {
                this.parent.absRot = rot;
            }
            this.calculateAfterRotate();
            var _shapes = this.spTree;
            var _shape_index;
            var _shape_count = _shapes.length;
            for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                _shapes[_shape_index].calculateTransformMatrix();
                _shapes[_shape_index].calculateContent();
                _shapes[_shape_index].calculateTransformTextMatrix();
            }
            var _arrGraphicObjects = this.arrGraphicObjects;
            _shape_count = _arrGraphicObjects.length;
            for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                if (_arrGraphicObjects[_shape_index].isGroup()) {
                    _arrGraphicObjects[_shape_index].calculateFullTransformMatrix();
                }
            }
            break;
        case historyitem_SetSizes:
            var xfrm = this.spPr.xfrm;
            xfrm.extX = data.newW;
            xfrm.extY = data.newH;
            xfrm.flipH = data.newFlipH;
            xfrm.flipV = data.newFlipV;
            this.absOffsetX = data.newPosX;
            this.absOffsetY = data.newPosY;
            this.absExtX = data.newW;
            this.absExtY = data.newH;
            this.absFlipH = data.newFlipH;
            this.absFlipV = data.newFlipV;
            if (this.parent) {
                this.parent.absOffsetX = data.newPosX;
                this.parent.absOffsetY = data.newPosY;
                this.parent.absExtX = data.newW;
                this.parent.absExtY = data.newH;
                this.parent.absFlipH = data.newFlipH;
                this.parent.absFlipV = data.newFlipV;
            }
            this.calculateTransformMatrix();
            var history_is_on = History.Is_On();
            if (history_is_on) {
                History.TurnOff();
            }
            this.startChangeChildSizes(data.kw, data.kh);
            this.startCalculateAfterInternalResize();
            if (history_is_on) {
                History.TurnOn();
            }
            break;
        case historyitem_InternalChanges:
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateAfterResize();
            break;
        case historyitem_SetGroup:
            this.group = data.newGroup;
            break;
        case historyitem_SetMainGroup:
            this.mainGroup = data.newGroup;
            break;
        case historyitem_RemoveFromSpTree:
            var sp_tree = this.spTree;
            var id = data.id;
            for (var i = 0; i < sp_tree.length; ++i) {
                if (sp_tree[i].Get_Id() === id) {
                    sp_tree.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_RemoveFromArrGraphicObj:
            var arr_gr_objects = this.arrGraphicObjects;
            id = data.id;
            for (i = 0; i < arr_gr_objects.length; ++i) {
                if (arr_gr_objects[i].Get_Id() === id) {
                    arr_gr_objects.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_RemoveFromArrGraphicObj2:
            this.arrGraphicObjects.splice(data.index, 1);
            break;
        case historyitem_MoveShapeInArray:
            if (data.oldPos !== data.newPos) {
                this.arrGraphicObjects.splice(data.newPos, 0, this.arrGraphicObjects.splice(data.oldPos, 1)[0]);
            }
            break;
        case historyitem_UpadteSpTreeAfter:
            this.updateSpTree();
            break;
        case historyitem_SwapGrObject:
            var new_sp = g_oTableId.Get_ById(data.newId);
            for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
                if (this.arrGraphicObjects[i].Get_Id() === data.oldId) {
                    this.arrGraphicObjects[i] = new_sp;
                    break;
                }
            }
            break;
        case historyitem_SetSpPr:
            this.spPr = data.spPr;
            break;
        case historyitem_SetStyle:
            this.style = null;
            break;
        case historyitem_SetBodyPr:
            this.bodyPr = data.bodyPr;
            break;
        case historyitem_AddGraphicObject:
            var object = g_oTableId.Get_ById(data.id);
            if (isRealObject(object)) {
                this.arrGraphicObjects.splice(data.index, 0, object);
            }
            break;
        case historyitem_SetParent:
            if (data.newParent == null) {
                this.parent = null;
            } else {
                this.parent = g_oTableId.Get_ById(data.newParent);
            }
            break;
        }
        if (b_history_is_on) {
            History.TurnOn();
        }
    },
    Save_Changes: function (data, writer) {
        writer.WriteLong(historyitem_type_Shape);
        writer.WriteLong(data.Type);
        var bool;
        switch (data.Type) {
        case historyitem_SetAbsoluteTransform:
            bool = data.newOffsetX != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newOffsetX);
            }
            bool = data.newOffsetY != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newOffsetY);
            }
            bool = data.newExtX != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newExtX);
            }
            bool = data.newExtY != null;
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteDouble(data.newExtY);
            }
            bool = data.newRot != null;
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
        case historyitem_SetRotate:
            writer.WriteDouble(data.newRot);
            break;
        case historyitem_SetSizes:
            writer.WriteDouble(data.newPosX);
            writer.WriteDouble(data.newPosY);
            writer.WriteDouble(data.newW);
            writer.WriteDouble(data.newH);
            writer.WriteBool(data.newFlipH);
            writer.WriteBool(data.newFlipV);
            break;
        case historyitem_SetSizesInGroup:
            writer.WriteDouble(data.newX);
            writer.WriteDouble(data.newY);
            writer.WriteDouble(data.newExtX);
            writer.WriteDouble(data.newExtY);
            break;
        case historyitem_SetAdjValue:
            var geometry = this.spPr.geometry;
            bool = typeof geometry.gdLst[data.ref1] === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteString2(data.ref1);
                writer.WriteDouble(data.newValue1);
            }
            bool = typeof geometry.gdLst[data.ref2] === "number";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteString2(data.ref2);
                writer.WriteDouble(data.newValue2);
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
        case historyitem_AddGraphicObject:
            case historyitem_AddToSpTree:
            writer.WriteString2(data.id);
            writer.WriteLong(data.index);
            break;
        case historyitem_RemoveFromArrGraphicObj:
            writer.WriteString2(data.id);
            break;
        case historyitem_SwapGrObject:
            writer.WriteString2(data.oldId);
            writer.WriteString2(data.newId);
            break;
        case historyitem_SetSpPr:
            data.spPr.Write_ToBinary2(writer);
            break;
        case historyitem_SetStyle:
            data.style.Write_ToBinary2(writer);
            break;
        case historyitem_SetBodyPr:
            data.bodyPr.Write_ToBinary2(writer);
            break;
        case historyitem_SetParent:
            writer.WriteBool(data.newParent != null);
            if (data.newParent != null) {
                writer.WriteString2(data.newParent);
            }
            break;
        }
    },
    Load_Changes: function (reader) {
        var ClassType = reader.GetLong();
        if (historyitem_type_Shape != ClassType) {
            return;
        }
        var b_history_is_on = History.Is_On();
        if (b_history_is_on) {
            History.TurnOff();
        }
        var type = reader.GetLong();
        switch (type) {
        case historyitem_SetAbsoluteTransform:
            if (reader.GetBool()) {
                this.absOffsetX = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absOffsetY = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absExtX = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absExtY = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absRot = reader.GetDouble();
            }
            if (reader.GetBool()) {
                this.absFlipH = reader.GetBool();
            }
            if (reader.GetBool()) {
                this.absFlipV = reader.GetBool();
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateAfterResize();
            break;
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
        case historyitem_SetRotate:
            var rot = reader.GetDouble();
            this.absRot = rot;
            this.spPr.xfrm.rot = rot;
            if (this.parent) {
                this.parent.absRot = rot;
            }
            this.calculateAfterRotate();
            var _shapes = this.spTree;
            var _shape_index;
            var _shape_count = _shapes.length;
            for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                _shapes[_shape_index].calculateTransformMatrix();
                _shapes[_shape_index].calculateContent();
                _shapes[_shape_index].calculateTransformTextMatrix();
            }
            var _arrGraphicObjects = this.arrGraphicObjects;
            _shape_count = _arrGraphicObjects.length;
            for (_shape_index = 0; _shape_index < _shape_count; ++_shape_index) {
                if (_arrGraphicObjects[_shape_index].isGroup()) {
                    _arrGraphicObjects[_shape_index].calculateFullTransformMatrix();
                }
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
            this.spPr.xfrm.flipH = flipH;
            this.spPr.xfrm.flipV = flipV;
            this.absExtX = extX;
            this.absExtY = extY;
            this.absFlipH = flipH;
            this.absFlipV = flipV;
            this.absOffsetX = posX;
            this.absOffsetY = posY;
            if (this.parent) {
                this.parent.absOffsetX = posX;
                this.parent.absOffsetY = posY;
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateAfterResize();
            break;
        case historyitem_SetSizesInGroup:
            this.absOffsetX = reader.GetDouble();
            this.absOffsetY = reader.GetDouble();
            this.absExtX = reader.GetDouble();
            this.absExtY = reader.GetDouble();
            if (this.parent) {
                this.parent.absOffsetX = this.absOffsetX;
                this.parent.absOffsetY = this.absOffsetY;
                this.parent.absExtX = this.absExtX;
                this.parent.absExtY = this.absExtY;
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateAfterResize();
            break;
        case historyitem_SetAdjValue:
            var geometry = this.spPr.geometry;
            if (reader.GetBool()) {
                var name = reader.GetString2();
                geometry.gdLst[name] = reader.GetDouble();
            }
            if (reader.GetBool()) {
                name = reader.GetString2();
                geometry.gdLst[name] = reader.GetDouble();
            }
            break;
        case historyitem_SetGroup:
            if (reader.GetBool()) {
                this.group = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.group = null;
            }
            break;
        case historyitem_SetMainGroup:
            if (reader.GetBool()) {
                this.mainGroup = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.mainGroup = null;
            }
            break;
        case historyitem_AddGraphicObject:
            var id = reader.GetString2();
            var index = reader.GetLong();
            this.arrGraphicObjects.splice(index, 0, g_oTableId.Get_ById(id));
            this.arrGraphicObjects[index].group = this;
            this.arrGraphicObjects[index].mainGroup = this;
            break;
        case historyitem_AddToSpTree:
            id = reader.GetString2();
            index = reader.GetLong();
            this.spTree[index] = g_oTableId.Get_ById(id);
            this.spTree[index].mainGroup = this;
            break;
        case historyitem_RemoveFromArrGraphicObj:
            var arr_gr_objects = this.arrGraphicObjects;
            id = reader.GetString2();
            for (var i = 0; i < arr_gr_objects.length; ++i) {
                if (arr_gr_objects[i].Get_Id() === id) {
                    arr_gr_objects.splice(i, 1);
                    break;
                }
            }
            break;
        case historyitem_SwapGrObject:
            var oldId = reader.GetString2();
            var newId = reader.GetString2();
            var new_obj = g_oTableId.Get_ById(newId);
            if (isRealObject(new_obj)) {
                for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
                    if (this.arrGraphicObjects[i].Get_Id() === oldId) {
                        this.arrGraphicObjects[i] = new_obj;
                        return;
                    }
                }
            }
        case historyitem_SetSpPr:
            var sp_pr = new CSpPr();
            sp_pr.Read_FromBinary2(reader);
            this.spPr = sp_pr;
            break;
        case historyitem_SetStyle:
            this.style = new CShapeStyle();
            this.style.Read_FromBinary2(reader);
            break;
        case historyitem_SetBodyPr:
            this.bodyPr = new CBodyPr();
            this.bodyPr.Read_FromBinary2(reader);
            break;
        case historyitem_GroupRecalculate:
            this.recalculate();
            break;
        case historyitem_SetParent:
            if (reader.GetBool()) {
                this.parent = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.parent = null;
            }
            break;
        case historyitem_CalculateAfterCopyInGroup:
            this.calculateAfterOpen10();
            break;
        }
        if (b_history_is_on) {
            History.TurnOn();
        }
    },
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_GroupShapes);
        Writer.WriteString2(this.Id);
        Writer.WriteBool(isRealObject(this.parent));
        if (isRealObject(this.parent)) {
            Writer.WriteString2(this.parent.Get_Id());
        }
        var bool = this.mainGroup != null;
        Writer.WriteBool(bool);
        if (bool) {
            Writer.WriteString2(this.mainGroup.Get_Id());
        }
        bool = this.group != null;
        Writer.WriteBool(bool);
        if (bool) {
            Writer.WriteString2(this.group.Get_Id());
        }
        this.spPr.Write_ToBinary2(Writer);
        var bool = this.style != null;
        Writer.WriteBool(bool);
        if (bool) {
            this.style.Write_ToBinary2(Writer);
        }
        var gr_object_count = this.arrGraphicObjects.length;
        Writer.WriteLong(gr_object_count);
        for (var i = 0; i < gr_object_count; ++i) {
            this.arrGraphicObjects[i].Write_ToBinary2(Writer);
        }
    },
    writeToBinaryForCopyPaste: function (w) {
        w.WriteLong(historyitem_type_GroupShapes);
        this.spPr.Write_ToBinary2(w);
        w.WriteBool(isRealObject(this.style));
        if (isRealObject(this.style)) {
            this.style.Write_ToBinary2(w);
        }
        w.WriteLong(this.arrGraphicObjects.length);
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].writeToBinaryForCopyPaste(w);
        }
    },
    readFromBinaryForCopyPaste: function (r, bNoRecalc) {
        var sp_pr = new CSpPr();
        sp_pr.Read_FromBinary2(r);
        this.setSpPr(sp_pr);
        if (r.GetBool()) {
            var style = new CShapeStyle();
            style.Read_FromBinary2(r);
            this.setStyle(style);
        }
        var l = r.GetLong();
        for (var i = 0; i < l; ++i) {
            var type = r.GetLong();
            var g;
            switch (type) {
            case historyitem_type_Shape:
                g = new WordShape(null, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, this);
                g.readFromBinaryForCopyPaste(r, bNoRecalc);
                this.addGraphicObject(g);
                break;
            case historyitem_type_Image:
                g = new WordImage(null, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, this);
                g.readFromBinaryForCopyPaste(r, bNoRecalc);
                this.addGraphicObject(g);
                break;
            case historyitem_type_GroupShapes:
                g = new WordGroupShapes(null, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, this);
                g.readFromBinaryForCopyPaste(r, bNoRecalc);
                this.addGraphicObject(g);
                break;
            }
        }
    },
    copy: function (parent) {
        var c = new WordGroupShapes(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, null);
        c.setSpPr(this.spPr.createDuplicate());
        if (isRealObject(this.style)) {
            c.setStyle(this.style.createDuplicate());
        }
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            c.addGraphicObject(this.arrGraphicObjects[i].copy(null));
        }
        return c;
    },
    setSpPr: function (spPr) {
        var data = {
            Type: historyitem_SetSpPr,
            spPr: spPr
        };
        History.Add(this, data);
        this.spPr = spPr;
    },
    setStyle: function (style) {
        var data = {
            Type: historyitem_SetStyle,
            style: style
        };
        History.Add(this, data);
        this.style = style;
    },
    setBodyPr: function (b) {
        History.Add(this, {
            Type: historyitem_SetBodyPr,
            bodyPr: b
        });
        this.bodyPr = b;
    },
    Read_FromBinary2: function (Reader) {
        this.Id = Reader.GetString2();
        var link_data = {};
        if (Reader.GetBool()) {
            link_data.parent = Reader.GetString2();
        } else {
            link_data.parent = null;
        }
        if (Reader.GetBool()) {
            link_data.mainGroup = Reader.GetString2();
        } else {
            link_data.mainGroup = null;
        }
        if (Reader.GetBool()) {
            link_data.group = Reader.GetString2();
        } else {
            link_data.group = null;
        }
        this.parent = g_oTableId.Get_ById(link_data.parent);
        this.spPr.Read_FromBinary2(Reader);
        if (Reader.GetBool()) {
            this.style = new CShapeStyle();
            this.style.Read_FromBinary2(Reader);
        }
        var gr_object_count = Reader.GetLong();
        for (var i = 0; i < gr_object_count; ++i) {
            var object_type = Reader.GetLong();
            switch (object_type) {
            case historyitem_type_Shape:
                this.arrGraphicObjects[i] = new WordShape();
                break;
            case historyitem_type_Image:
                this.arrGraphicObjects[i] = new WordImage();
                break;
            case historyitem_type_GroupShapes:
                this.arrGraphicObjects[i] = new WordGroupShapes();
                break;
            }
            this.arrGraphicObjects[i].Read_FromBinary2(Reader);
        }
        this.document = editor.WordControl.m_oLogicDocument;
        this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        CollaborativeEditing.Add_NewObject(this);
        CollaborativeEditing.Add_LinkData(this, link_data);
    },
    bringToFront: function () {
        History.Add(this, {
            Type: historyitem_UpadteSpTreeBefore
        });
        var gr_objects = this.arrGraphicObjects;
        var new_pos = gr_objects.length - 1;
        var last_id = gr_objects[gr_objects.length - 1].Get_Id();
        var b_break = false;
        for (var i = 0; i < gr_objects.length; ++i) {
            if (gr_objects[i].Get_Id() === last_id) {
                b_break = true;
            }
            if (gr_objects[i].isGroup()) {
                gr_objects[i].bringToFront();
            }
            if (gr_objects[i].selected) {
                History.Add(this, {
                    Type: historyitem_MoveShapeInArray,
                    oldPos: i,
                    newPos: new_pos
                });
                gr_objects.push(gr_objects.splice(i, 1)[0]);
                --i;
            }
            if (b_break) {
                break;
            }
        }
        this.updateSpTree();
        History.Add(this, {
            Type: historyitem_UpadteSpTreeAfter
        });
    },
    bringForward: function () {
        History.Add(this, {
            Type: historyitem_UpadteSpTreeBefore
        });
        var gr_objects = this.arrGraphicObjects;
        for (var i = gr_objects.length - 1; i > -1; --i) {
            if (gr_objects[i].isGroup()) {
                gr_objects[i].bringForward();
            }
            if (gr_objects[i].selected && i < gr_objects.length - 1 && !gr_objects[i + 1].selected) {
                History.Add(this, {
                    Type: historyitem_MoveShapeInArray,
                    oldPos: i,
                    newPos: i + 1
                });
                var object = gr_objects.splice(i, 1)[0];
                gr_objects.splice(i + 1, 0, object);
            }
        }
        this.updateSpTree();
        History.Add(this, {
            Type: historyitem_UpadteSpTreeAfter
        });
    },
    sendToBack: function () {
        var gr_objects = this.arrGraphicObjects;
        var last_id = null;
        for (var i = gr_objects.length - 1; i > -1; --i) {
            if (gr_objects[i].selected && i > 0) {
                last_id = gr_objects[i].Get_Id();
                break;
            }
        }
        if (typeof last_id === "string") {
            History.Add(this, {
                Type: historyitem_UpadteSpTreeBefore
            });
            for (i = gr_objects.length - 1; i > -1; --i) {
                if (gr_objects[i].isGroup()) {
                    gr_objects[i].sendToBack();
                }
                if (gr_objects[i].selected) {
                    History.Add(this, {
                        Type: historyitem_MoveShapeInArray,
                        oldPos: i,
                        newPos: 0
                    });
                    gr_objects.splice(0, 0, gr_objects.splice(i, 1)[0]);
                    if (gr_objects[i].Get_Id() === last_id) {
                        break;
                    }++i;
                }
            }
            this.updateSpTree();
            History.Add(this, {
                Type: historyitem_UpadteSpTreeAfter
            });
        }
    },
    bringBackward: function () {
        History.Add(this, {
            Type: historyitem_UpadteSpTreeBefore
        });
        var gr_objects = this.arrGraphicObjects;
        for (var i = 0; i < gr_objects.length; ++i) {
            if (gr_objects[i].isGroup()) {
                gr_objects[i].bringBackward();
            }
            if (gr_objects[i].selected && i > 0 && !gr_objects[i - 1].selected) {
                History.Add(this, {
                    Type: historyitem_MoveShapeInArray,
                    oldPos: i,
                    newPos: i - 1
                });
                var object = gr_objects.splice(i, 1)[0];
                gr_objects.splice(i - 1, 0, object);
            }
        }
        this.updateSpTree();
        History.Add(this, {
            Type: historyitem_UpadteSpTreeAfter
        });
    },
    updateSpTree: function () {
        this.spTree = this.getSpTree2();
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            if (this.arrGraphicObjects[i].isGroup()) {
                this.arrGraphicObjects[i].updateSpTree();
            }
        }
    },
    updateSizes: function () {
        var arr_gr_obj = this.arrGraphicObjects;
        for (var i = 0; i < arr_gr_obj.length; ++i) {
            if (arr_gr_obj[i].isGroup()) {
                arr_gr_obj[i].updateSizes();
            }
        }
        var min_x, max_x, min_y, max_y;
        var sp = arr_gr_obj[0];
        var xfrm = sp.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var xc, yc;
        if (rot < Math.PI * 0.25 || rot > Math.PI * 1.75 || (rot > Math.PI * 0.75 && rot < Math.PI * 1.25)) {
            min_x = xfrm.offX;
            min_y = xfrm.offY;
            max_x = xfrm.offX + xfrm.extX;
            max_y = xfrm.offY + xfrm.extY;
        } else {
            xc = xfrm.offX + xfrm.extX * 0.5;
            yc = xfrm.offY + xfrm.extY * 0.5;
            min_x = xc - xfrm.extY * 0.5;
            min_y = yc - xfrm.extX * 0.5;
            max_x = xc + xfrm.extY * 0.5;
            max_y = yc + xfrm.extX * 0.5;
        }
        var cur_max_x, cur_min_x, cur_max_y, cur_min_y;
        for (i = 0; i < arr_gr_obj.length; ++i) {
            sp = arr_gr_obj[i];
            xfrm = sp.spPr.xfrm;
            rot = xfrm.rot == null ? 0 : xfrm.rot;
            if (rot < Math.PI * 0.25 || rot > Math.PI * 1.75 || (rot > Math.PI * 0.75 && rot < Math.PI * 1.25)) {
                cur_min_x = xfrm.offX;
                cur_min_y = xfrm.offY;
                cur_max_x = xfrm.offX + xfrm.extX;
                cur_max_y = xfrm.offY + xfrm.extY;
            } else {
                xc = xfrm.offX + xfrm.extX * 0.5;
                yc = xfrm.offY + xfrm.extY * 0.5;
                cur_min_x = xc - xfrm.extY * 0.5;
                cur_min_y = yc - xfrm.extX * 0.5;
                cur_max_x = xc + xfrm.extY * 0.5;
                cur_max_y = yc + xfrm.extX * 0.5;
            }
            if (cur_max_x > max_x) {
                max_x = cur_max_x;
            }
            if (cur_min_x < min_x) {
                min_x = cur_min_x;
            }
            if (cur_max_y > max_y) {
                max_y = cur_max_y;
            }
            if (cur_min_y < min_y) {
                min_y = cur_min_y;
            }
        }
        var temp;
        var x_min_clear = min_x;
        var y_min_clear = min_y;
        if (this.spPr.xfrm.flipH === true) {
            temp = max_x;
            max_x = this.absExtX - min_x;
            min_x = this.absExtX - temp;
        }
        if (this.spPr.xfrm.flipV === true) {
            temp = max_y;
            max_y = this.absExtY - min_y;
            min_y = this.absExtY - temp;
        }
        var old_x0, old_y0;
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var hc = xfrm.extX * 0.5;
        var vc = xfrm.extY * 0.5;
        old_x0 = this.absOffsetX + hc - (hc * Math.cos(rot) - vc * Math.sin(rot));
        old_y0 = this.absOffsetY + vc - (hc * Math.sin(rot) + vc * Math.cos(rot));
        var t_dx = min_x * Math.cos(rot) - min_y * Math.sin(rot);
        var t_dy = min_x * Math.sin(rot) + min_y * Math.cos(rot);
        var new_x0, new_y0;
        new_x0 = old_x0 + t_dx;
        new_y0 = old_y0 + t_dy;
        var new_hc = Math.abs(max_x - min_x) * 0.5;
        var new_vc = Math.abs(max_y - min_y) * 0.5;
        var new_xc = new_x0 + (new_hc * Math.cos(rot) - new_vc * Math.sin(rot));
        var new_yc = new_y0 + (new_hc * Math.sin(rot) + new_vc * Math.cos(rot));
        var pos_x, pos_y;
        if (this.group != null) {
            pos_x = new_xc - new_hc;
            pos_y = new_yc - new_vc;
        } else {
            pos_x = 0;
            pos_y = 0;
        }
        this.setXfrm(pos_x, pos_y, Math.abs(max_x - min_x), Math.abs(max_y - min_y), null, null, null);
        this.setAbsoluteTransform(new_xc - new_hc, new_yc - new_vc, Math.abs(max_x - min_x), Math.abs(max_y - min_y), null, null, null);
        for (i = 0; i < arr_gr_obj.length; ++i) {
            arr_gr_obj[i].setXfrm(arr_gr_obj[i].spPr.xfrm.offX - x_min_clear, arr_gr_obj[i].spPr.xfrm.offY - y_min_clear, null, null, null, null, null);
            arr_gr_obj[i].setAbsoluteTransform(arr_gr_obj[i].spPr.xfrm.offX, arr_gr_obj[i].spPr.xfrm.offY, null, null, null, null, null);
        }
    },
    documentGetAllFontNames: function (AllFonts) {
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            if (typeof this.arrGraphicObjects[i].documentGetAllFontNames === "function") {
                this.arrGraphicObjects[i].documentGetAllFontNames(AllFonts);
            }
        }
    },
    Load_LinkData: function (linkData) {
        if (isRealObject(this.parent)) {
            editor.WordControl.m_oLogicDocument.DrawingObjects.addGraphicObject(this.parent);
        }
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
        History.RecalcData_Add({
            Type: historyrecalctype_Flow,
            Data: this
        });
    },
    recalculateDocContent: function () {
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            this.arrGraphicObjects[i].recalculateDocContent();
        }
    }
};
function GroupForResize(originalGroup, parentTrack, numberHandle, majorOffsetX, majorOffsetY) {
    this.original = originalGroup;
    this.parentTrack = parentTrack;
    this.majorOffsetX = majorOffsetX;
    this.majorOffsetY = majorOffsetY;
    this.pageIndex = originalGroup.pageIndex;
    var xfrm = originalGroup.spPr.xfrm;
    if (originalGroup.group == null) {
        this.x = originalGroup.absOffsetX;
        this.y = originalGroup.absOffsetY;
    } else {
        this.x = xfrm.offX;
        this.y = xfrm.offY;
    }
    this.originalRot = xfrm.rot == null ? 0 : xfrm.rot;
    this.extX = xfrm.extX;
    this.extY = xfrm.extY;
    this.rot = xfrm.rot == null ? 0 : xfrm.rot;
    this.flipH = xfrm.flipH == null ? false : xfrm.flipH;
    this.flipV = xfrm.flipV == null ? false : xfrm.flipV;
    this.transform = originalGroup.transform.CreateDublicate();
    this.bSwapCoef = !(this.rot < Math.PI * 0.25 || this.rot > Math.PI * 1.75 || (this.rot > Math.PI * 0.75 && this.rot < Math.PI * 1.25));
    this.childs = [];
    var a = originalGroup.arrGraphicObjects;
    for (var i = 0; i < a.length; ++i) {
        if (a[i].isGroup()) {
            this.childs[i] = new GroupForResize(a[i], this);
        } else {
            this.childs[i] = new ShapeForResizeInGroup(a[i], this);
        }
    }
    if (typeof numberHandle === "number") {
        var _translated_num_handle;
        var _flip_h = this.flipH;
        var _flip_v = this.flipV;
        var _sin = Math.sin(this.rot);
        var _cos = Math.cos(this.rot);
        var _half_width = this.extX * 0.5;
        var _half_height = this.extY * 0.5;
        if (!_flip_h && !_flip_v) {
            _translated_num_handle = numberHandle;
        } else {
            if (_flip_h && !_flip_v) {
                _translated_num_handle = TRANSLATE_HANDLE_FLIP_H[numberHandle];
            } else {
                if (!_flip_h && _flip_v) {
                    _translated_num_handle = TRANSLATE_HANDLE_FLIP_V[numberHandle];
                } else {
                    _translated_num_handle = TRANSLATE_HANDLE_FLIP_H_AND_FLIP_V[numberHandle];
                }
            }
        }
        this.bAspect = numberHandle % 2 === 0;
        this.aspect = this.bAspect === true ? this.original.getAspect(_translated_num_handle) : 0;
        this.sin = _sin;
        this.cos = _cos;
        this.translatetNumberHandle = _translated_num_handle;
        switch (_translated_num_handle) {
        case 0:
            case 1:
            this.fixedPointX = (_half_width * _cos - _half_height * _sin) + _half_width + this.x;
            this.fixedPointY = (_half_width * _sin + _half_height * _cos) + _half_height + this.y;
            break;
        case 2:
            case 3:
            this.fixedPointX = (-_half_width * _cos - _half_height * _sin) + _half_width + this.x;
            this.fixedPointY = (-_half_width * _sin + _half_height * _cos) + _half_height + this.y;
            break;
        case 4:
            case 5:
            this.fixedPointX = (-_half_width * _cos + _half_height * _sin) + _half_width + this.x;
            this.fixedPointY = (-_half_width * _sin - _half_height * _cos) + _half_height + this.y;
            break;
        case 6:
            case 7:
            this.fixedPointX = (_half_width * _cos + _half_height * _sin) + _half_width + this.x;
            this.fixedPointY = (_half_width * _sin - _half_height * _cos) + _half_height + this.y;
            break;
        }
        this.mod = this.translatetNumberHandle % 4;
        this.centerPointX = this.x + _half_width;
        this.centerPointY = this.y + _half_height;
        this.lineFlag = false;
        this.originalExtX = this.extX;
        this.originalExtY = this.extY;
        this.originalFlipH = _flip_h;
        this.originalFlipV = _flip_v;
        this.usedExtX = this.originalExtX === 0 ? (0.01) : this.originalExtX;
        this.usedExtY = this.originalExtY === 0 ? (0.01) : this.originalExtY;
        this.resizedExtX = this.originalExtX;
        this.resizedExtY = this.originalExtY;
        this.resizedflipH = _flip_h;
        this.resizedflipV = _flip_v;
        this.resizedPosX = this.x;
        this.resizedPosY = this.y;
        this.resizedRot = this.rot;
        this.transformMatrix = this.transform;
        this.bChangeCoef = this.translatetNumberHandle % 2 === 0 && this.originalFlipH !== this.originalFlipV;
    }
    if (this.parentTrack) {
        this.centerDistX = this.x + this.extX * 0.5 - this.parentTrack.extX * 0.5;
        this.centerDistY = this.y + this.extY * 0.5 - this.parentTrack.extY * 0.5;
    }
    this.resize = function (kd1, kd2, shiftKey) {
        var _cos = this.cos;
        var _sin = this.sin;
        var _real_height, _real_width;
        var _abs_height, _abs_width;
        var _new_resize_half_width;
        var _new_resize_half_height;
        var _new_used_half_width;
        var _new_used_half_height;
        var _temp;
        if (shiftKey === true && this.bAspect === true) {
            var _new_aspect = this.aspect * (Math.abs(kd1 / kd2));
            if (_new_aspect >= this.aspect) {
                kd2 = Math.abs(kd1) * (kd2 >= 0 ? 1 : -1);
            } else {
                kd1 = Math.abs(kd2) * (kd1 >= 0 ? 1 : -1);
            }
        }
        if (this.bChangeCoef) {
            _temp = kd1;
            kd1 = kd2;
            kd2 = _temp;
        }
        switch (this.translatetNumberHandle) {
        case 0:
            case 1:
            if (this.translatetNumberHandle === 0) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                if (_real_width < 0) {
                    this.resizedflipH = !this.originalFlipH;
                } else {
                    this.resizedflipH = this.originalFlipH;
                }
            }
            if (this.translatetNumberHandle === 1) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
            if (_real_height < 0) {
                this.resizedflipV = !this.originalFlipV;
            } else {
                this.resizedflipV = this.originalFlipV;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (-_new_used_half_width * _cos + _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (-_new_used_half_width * _sin - _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 2:
            case 3:
            if (this.translatetNumberHandle === 2) {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
            if (_real_width < 0) {
                this.resizedflipH = !this.originalFlipH;
            } else {
                this.resizedflipH = this.originalFlipH;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (_new_used_half_width * _cos + _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (_new_used_half_width * _sin - _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 4:
            case 5:
            if (this.translatetNumberHandle === 4) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                if (_real_width < 0) {
                    this.resizedflipH = !this.originalFlipH;
                } else {
                    this.resizedflipH = this.originalFlipH;
                }
            } else {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
            if (_real_height < 0) {
                this.resizedflipV = !this.originalFlipV;
            } else {
                this.resizedflipV = this.originalFlipV;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (_new_used_half_width * _cos - _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (_new_used_half_width * _sin + _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        case 6:
            case 7:
            if (this.translatetNumberHandle === 6) {
                _real_height = this.usedExtY * kd1;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                if (_real_height < 0) {
                    this.resizedflipV = !this.originalFlipV;
                } else {
                    this.resizedflipV = this.originalFlipV;
                }
            } else {
                _temp = kd2;
                kd2 = kd1;
                kd1 = _temp;
            }
            _real_width = this.usedExtX * kd2;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
            if (_real_width < 0) {
                this.resizedflipH = !this.originalFlipH;
            } else {
                this.resizedflipH = this.originalFlipH;
            }
            _new_resize_half_width = this.resizedExtX * 0.5;
            _new_resize_half_height = this.resizedExtY * 0.5;
            if (this.resizedflipH !== this.originalFlipH) {
                _new_used_half_width = -_new_resize_half_width;
            } else {
                _new_used_half_width = _new_resize_half_width;
            }
            if (this.resizedflipV !== this.originalFlipV) {
                _new_used_half_height = -_new_resize_half_height;
            } else {
                _new_used_half_height = _new_resize_half_height;
            }
            this.resizedPosX = this.fixedPointX + (-_new_used_half_width * _cos - _new_used_half_height * _sin) - _new_resize_half_width;
            this.resizedPosY = this.fixedPointY + (-_new_used_half_width * _sin + _new_used_half_height * _cos) - _new_resize_half_height;
            break;
        }
        this.x = this.resizedPosX;
        this.y = this.resizedPosY;
        this.extX = this.resizedExtX;
        this.extY = this.resizedExtY;
        this.flipH = this.resizedflipH;
        this.flipV = this.resizedflipV;
        var _transform = this.transform;
        _transform.Reset();
        var _horizontal_center = this.resizedExtX * 0.5;
        var _vertical_center = this.resizedExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.resizedflipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.resizedflipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.resizedRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        var xfrm = this.original.spPr.xfrm;
        var kw = this.resizedExtX / xfrm.extX;
        var kh = this.resizedExtY / xfrm.extY;
        for (var i = 0; i < this.childs.length; ++i) {
            var cur_child = this.childs[i];
            cur_child.updateSize(kw, kh);
        }
    };
    this.resizeRelativeCenter = function (kd1, kd2, shiftKey) {
        kd1 = 2 * kd1 - 1;
        kd2 = 2 * kd2 - 1;
        var _real_height, _real_width;
        var _abs_height, _abs_width;
        if (shiftKey === true && this.bAspect === true) {
            var _new_aspect = this.aspect * (Math.abs(kd1 / kd2));
            if (_new_aspect >= this.aspect) {
                kd2 = Math.abs(kd1) * (kd2 >= 0 ? 1 : -1);
            } else {
                kd1 = Math.abs(kd2) * (kd1 >= 0 ? 1 : -1);
            }
        }
        var _temp;
        if (this.bChangeCoef) {
            _temp = kd1;
            kd1 = kd2;
            kd2 = _temp;
        }
        if (this.mod === 0 || this.mod === 1) {
            if (this.mod === 0) {
                _real_width = this.usedExtX * kd1;
                _abs_width = Math.abs(_real_width);
                this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
                this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
            } else {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
            }
            _real_height = this.usedExtY * kd2;
            _abs_height = Math.abs(_real_height);
            this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
            this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
        } else {
            if (this.mod === 2) {
                _temp = kd1;
                kd1 = kd2;
                kd2 = _temp;
                _real_height = this.usedExtY * kd2;
                _abs_height = Math.abs(_real_height);
                this.resizedExtY = _abs_height >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_height : MIN_SHAPE_SIZE;
                this.resizedflipV = _real_height < 0 ? !this.originalFlipV : this.originalFlipV;
            }
            _real_width = this.usedExtX * kd1;
            _abs_width = Math.abs(_real_width);
            this.resizedExtX = _abs_width >= MIN_SHAPE_SIZE || this.lineFlag ? _abs_width : MIN_SHAPE_SIZE;
            this.resizedflipH = _real_width < 0 ? !this.originalFlipH : this.originalFlipH;
        }
        this.resizedPosX = this.centerPointX - this.resizedExtX * 0.5;
        this.resizedPosY = this.centerPointY - this.resizedExtY * 0.5;
        this.x = this.resizedPosX;
        this.y = this.resizedPosY;
        this.extX = this.resizedExtX;
        this.extY = this.resizedExtY;
        this.flipH = this.resizedflipH;
        this.flipV = this.resizedflipV;
        var _transform = this.transform;
        _transform.Reset();
        var _horizontal_center = this.resizedExtX * 0.5;
        var _vertical_center = this.resizedExtY * 0.5;
        global_MatrixTransformer.TranslateAppend(_transform, -_horizontal_center, -_vertical_center);
        if (this.resizedflipH) {
            global_MatrixTransformer.ScaleAppend(_transform, -1, 1);
        }
        if (this.resizedflipV) {
            global_MatrixTransformer.ScaleAppend(_transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(_transform, -this.resizedRot);
        global_MatrixTransformer.TranslateAppend(_transform, this.resizedPosX, this.resizedPosY);
        global_MatrixTransformer.TranslateAppend(_transform, _horizontal_center, _vertical_center);
        var xfrm = this.original.spPr.xfrm;
        var kw = this.resizedExtX / xfrm.extX;
        var kh = this.resizedExtY / xfrm.extY;
        for (var i = 0; i < this.childs.length; ++i) {
            this.childs[i].updateSize(kw, kh);
        }
    };
    this.updateSize = function (kw, kh) {
        var _kw, _kh;
        if (this.bSwapCoef) {
            _kw = kh;
            _kh = kw;
        } else {
            _kw = kw;
            _kh = kh;
        }
        var xfrm = this.original.spPr.xfrm;
        this.extX = xfrm.extX * _kw;
        this.extY = xfrm.extY * _kh;
        this.x = this.centerDistX * kw + this.parentTrack.extX * 0.5 - this.extX * 0.5;
        this.y = this.centerDistY * kh + this.parentTrack.extY * 0.5 - this.extY * 0.5;
        this.transform.Reset();
        var t = this.transform;
        global_MatrixTransformer.TranslateAppend(t, -this.extX * 0.5, -this.extY * 0.5);
        if (xfrm.flipH == null ? false : xfrm.flipH) {
            global_MatrixTransformer.ScaleAppend(t, -1, 1);
        }
        if (xfrm.flipV == null ? false : xfrm.flipV) {
            global_MatrixTransformer.ScaleAppend(t, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(t, xfrm.rot == null ? 0 : -xfrm.rot);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.extX * 0.5, this.y + this.extY * 0.5);
        global_MatrixTransformer.MultiplyAppend(t, this.parentTrack.transform);
        for (var i = 0; i < this.childs.length; ++i) {
            this.childs[i].updateSize(_kw, _kh);
        }
    };
    this.draw = function (graphics) {
        for (var i = 0; i < this.childs.length; ++i) {
            this.childs[i].draw(graphics);
        }
    };
    this.getBoundsRect = function () {
        var t = this.transform;
        var min_x, max_x, min_y, max_y;
        min_x = t.TransformPointX(0, 0);
        max_x = min_x;
        min_y = t.TransformPointY(0, 0);
        max_y = min_y;
        var arr = [{
            x: this.extX,
            y: 0
        },
        {
            x: this.extX,
            y: this.extY
        },
        {
            x: 0,
            y: this.extY
        }];
        var t_x, t_y;
        for (var i = 0; i < arr.length; ++i) {
            var p = arr[i];
            t_x = t.TransformPointX(p.x, p.y);
            t_y = t.TransformPointY(p.x, p.y);
            if (t_x < min_x) {
                min_x = t_x;
            }
            if (t_x > max_x) {
                max_x = t_x;
            }
            if (t_y < min_y) {
                min_y = t_y;
            }
            if (t_y > max_y) {
                max_y = t_y;
            }
        }
        return {
            l: min_x,
            t: min_y,
            r: max_x,
            b: max_y
        };
    };
    this.endTrack = function () {
        var pos_x, pos_y;
        if (this.parentTrack == null) {
            pos_x = 0;
            pos_y = 0;
        } else {
            pos_x = this.x;
            pos_y = this.y;
        }
        this.original.setXfrm(pos_x, pos_y, this.extX, this.extY, null, this.flipH, this.flipV);
        this.original.setAbsoluteTransform(this.x, this.y, this.extX, this.extY, null, this.flipH, this.flipV);
        for (var i = 0; i < this.childs.length; ++i) {
            this.childs[i].endTrack();
        }
        if (this.parentTrack == null) {
            this.original.recalculate();
        }
    };
    this.track = function (x, y, pageIndex) {
        if (arguments.length === 3) {
            this.x = x + this.majorOffsetX;
            this.y = y + this.majorOffsetY;
            this.setPageIndex(pageIndex);
        } else {
            var angle = x;
            var shiftKey = y;
            var _new_rot = angle + this.originalRot;
            while (_new_rot < 0) {
                _new_rot += 2 * Math.PI;
            }
            while (_new_rot >= 2 * Math.PI) {
                _new_rot -= 2 * Math.PI;
            }
            if (_new_rot < MIN_ANGLE || _new_rot > 2 * Math.PI - MIN_ANGLE) {
                _new_rot = 0;
            }
            if (Math.abs(_new_rot - Math.PI * 0.5) < MIN_ANGLE) {
                _new_rot = Math.PI * 0.5;
            }
            if (Math.abs(_new_rot - Math.PI) < MIN_ANGLE) {
                _new_rot = Math.PI;
            }
            if (Math.abs(_new_rot - 1.5 * Math.PI) < MIN_ANGLE) {
                _new_rot = 1.5 * Math.PI;
            }
            if (shiftKey) {
                _new_rot = (Math.PI / 12) * Math.floor(12 * _new_rot / (Math.PI));
            }
            this.rot = _new_rot;
        }
        this.updateTransform();
    };
    this.setPageIndex = function (pageIndex) {
        this.pageIndex = pageIndex;
        for (var i = 0; i < this.childs.length; ++i) {
            this.childs[i].setPageIndex(pageIndex);
        }
    };
    this.trackEnd = function (e, moveFlag) {
        if (moveFlag === true) {
            if (!e.CtrlKey) {
                this.original.setAbsoluteTransform(this.x, this.y, null, null, null, null, null);
                this.original.setPageIndex(this.pageIndex);
                this.original.recalculate();
            } else {
                var para_drawing = this.original.parent.copy();
                this.original = para_drawing.GraphicObj;
                var near_pos = this.original.document.Get_NearestPos(this.pageIndex, this.x, this.y);
                para_drawing.Set_XYForAdd(this.x, this.y, near_pos, this.pageIndex);
                para_drawing.Add_ToDocument(near_pos, false);
                this.original.setAbsoluteTransform(this.x, this.y, null, null, null, null, null);
                this.original.recalculate();
            }
        } else {
            if (this.rot != (this.original.spPr.xfrm.rot == null ? 0 : this.original.spPr.xfrm.rot)) {
                this.original.setXfrm(null, null, null, null, this.rot, null, null);
                this.original.setAbsoluteTransform(null, null, null, null, this.rot, null, null);
            }
            this.original.setAbsoluteTransform(this.x, this.y, null, null, null, null, null);
            this.original.setPageIndex(this.pageIndex);
            this.original.recalculate();
        }
    };
    this.updateTransform = function () {
        this.transform.Reset();
        var t = this.transform;
        global_MatrixTransformer.TranslateAppend(t, -this.extX * 0.5, -this.extY * 0.5);
        if (xfrm.flipH == null ? false : xfrm.flipH) {
            global_MatrixTransformer.ScaleAppend(t, -1, 1);
        }
        if (xfrm.flipV == null ? false : xfrm.flipV) {
            global_MatrixTransformer.ScaleAppend(t, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(t, -this.rot);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.extX * 0.5, this.y + this.extY * 0.5);
        if (this.parentTrack) {
            global_MatrixTransformer.MultiplyAppend(t, this.parentTrack.transform);
        }
        for (var i = 0; i < this.childs.length; ++i) {
            this.childs[i].updateTransform();
        }
    };
    this.modify = function (angle, shift) {};
}
function ShapeForResizeInGroup(originalShape, parentTrack) {
    this.original = originalShape;
    this.parentTrack = parentTrack;
    this.pageIndex = originalShape.pageIndex;
    var xfrm = this.original.spPr.xfrm;
    this.x = xfrm.offX;
    this.y = xfrm.offY;
    this.extX = xfrm.extX;
    this.extY = xfrm.extY;
    this.rot = xfrm.rot == null ? 0 : xfrm.rot;
    this.flipH = xfrm.flipH == null ? false : xfrm.flipH;
    this.flipV = xfrm.flipV == null ? false : xfrm.flipV;
    this.transform = originalShape.transform.CreateDublicate();
    this.bSwapCoef = !(this.rot < Math.PI * 0.25 || this.rot > Math.PI * 1.75 || (this.rot > Math.PI * 0.75 && this.rot < Math.PI * 1.25));
    this.centerDistX = this.x + this.extX * 0.5 - this.parentTrack.extX * 0.5;
    this.centerDistY = this.y + this.extY * 0.5 - this.parentTrack.extY * 0.5;
    this.geometry = originalShape.spPr.geometry !== null ? originalShape.spPr.geometry.createDuplicate() : null;
    if (this.geometry) {
        this.geometry.Recalculate(this.extX, this.extY);
    }
    var pen, brush;
    if (originalShape instanceof CChartAsGroup) {
        brush = new CUniFill();
        brush.fill = new CSolidFill();
        brush.fill.color = new CUniColor();
        brush.fill.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        brush.fill.color.color = new CRGBColor();
        brush.fill.color.color.RGBA = {
            R: 255,
            G: 255,
            B: 255,
            A: 255
        };
        pen = new CLn();
        pen.Fill = new CUniFill();
        pen.Fill.fill = new CSolidFill();
        pen.Fill.fill.color = new CUniColor();
        pen.Fill.fill.color.color = new CRGBColor();
        pen = pen;
        brush = brush;
    } else {
        pen = originalShape.pen;
        brush = originalShape.brush;
    }
    this.objectForOverlay = new ObjectForShapeDrawer(this.geometry, this.extX, this.extY, brush, pen, this.transform);
    this.updateSize = function (kw, kh) {
        var _kw, _kh;
        if (this.bSwapCoef) {
            _kw = kh;
            _kh = kw;
        } else {
            _kw = kw;
            _kh = kh;
        }
        var xfrm = this.original.spPr.xfrm;
        this.extX = xfrm.extX * _kw;
        this.extY = xfrm.extY * _kh;
        this.x = this.centerDistX * kw + this.parentTrack.extX * 0.5 - this.extX * 0.5;
        this.y = this.centerDistY * kh + this.parentTrack.extY * 0.5 - this.extY * 0.5;
        if (this.geometry) {
            this.geometry.Recalculate(this.extX, this.extY);
        }
        this.transform.Reset();
        var t = this.transform;
        global_MatrixTransformer.TranslateAppend(t, -this.extX * 0.5, -this.extY * 0.5);
        if (xfrm.flipH == null ? false : xfrm.flipH) {
            global_MatrixTransformer.ScaleAppend(t, -1, 1);
        }
        if (xfrm.flipV == null ? false : xfrm.flipV) {
            global_MatrixTransformer.ScaleAppend(t, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(t, xfrm.rot == null ? 0 : -xfrm.rot);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.extX * 0.5, this.y + this.extY * 0.5);
        global_MatrixTransformer.MultiplyAppend(t, this.parentTrack.transform);
    };
    this.draw = function (overlay) {
        overlay.SetCurrentPage(this.pageIndex);
        overlay.transform3(this.transform);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this.objectForOverlay, overlay, this.geometry);
        shape_drawer.draw(this.geometry);
        overlay.reset();
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        bounds_checker.init(Page_Width, Page_Height, Page_Width, Page_Height);
        this.draw(bounds_checker);
        return {
            l: bounds_checker.Bounds.min_x,
            t: bounds_checker.Bounds.min_y,
            r: bounds_checker.Bounds.max_x,
            b: bounds_checker.Bounds.max_y
        };
    };
    this.endTrack = function () {
        this.original.setXfrm(this.x, this.y, this.extX, this.extY, null, null, null);
        this.original.setAbsoluteTransform(this.x, this.y, this.extX, this.extY, null, null, null);
        if (this.original.spPr.geometry !== null) {
            this.original.spPr.geometry.Recalculate(this.original.absExtX, this.original.absExtY);
        }
        this.original.calculateContent();
        this.original.recalculate();
        if (this.original.isImage() && isRealObject(this.original.chart)) {
            var or_shp = this.original;
            or_shp.chart.width = or_shp.drawingDocument.GetDotsPerMM(or_shp.absExtX);
            or_shp.chart.height = or_shp.drawingDocument.GetDotsPerMM(or_shp.absExtY);
            var chartRender = new ChartRender();
            var chartBase64 = chartRender.insertChart(or_shp.chart, null, or_shp.chart.width, or_shp.chart.height);
            or_shp.chart.img = chartBase64;
            or_shp.setRasterImage(or_shp.chart.img);
            editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(or_shp.chart.img);
        }
    };
    this.setPageIndex = function (pageIndex) {
        this.pageIndex = pageIndex;
    };
    this.updateTransform = function () {
        this.transform.Reset();
        var t = this.transform;
        global_MatrixTransformer.TranslateAppend(t, -this.extX * 0.5, -this.extY * 0.5);
        if (xfrm.flipH == null ? false : xfrm.flipH) {
            global_MatrixTransformer.ScaleAppend(t, -1, 1);
        }
        if (xfrm.flipV == null ? false : xfrm.flipV) {
            global_MatrixTransformer.ScaleAppend(t, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(t, xfrm.rot == null ? 0 : -xfrm.rot);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.extX * 0.5, this.y + this.extY * 0.5);
        if (this.parentTrack) {
            global_MatrixTransformer.MultiplyAppend(t, this.parentTrack.transform);
        }
    };
}
function isRealNumber(number) {
    return number === number && typeof number === "number";
}