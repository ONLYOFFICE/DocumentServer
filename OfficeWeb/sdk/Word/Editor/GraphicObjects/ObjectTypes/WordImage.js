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
 function WordImage(parent, document, drawingDocument, group) {
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
    this.bodyPr = new CBodyPr();
    this.bodyPr.setDefault();
    this.group = (group !== null && typeof group === "object") ? group : null;
    this.mainGroup = null;
    this.blipFill = null;
    this.brush = new CUniFill();
    this.brush.fill = this.blipFill;
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
    this.transform = null;
    this.transformText = new CMatrix();
    this.ownTransform = new CMatrix();
    this.selected = false;
    this.selectStartPage = -1;
    this.wrapPolygon = null;
    this.chart = null;
    this.recalcInfo = {
        recalculateTransform: true
    };
    this.needRedrawChart = true;
    g_oTableId.Add(this, g_oIdCounter.Get_NewId());
}
WordImage.prototype = {
    calculateAfterOpen10: function () {
        var xfrm = this.spPr.xfrm;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV, true);
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.calculateTransformMatrix();
        this.calculateFill();
        this.calculateLine();
    },
    recalcTransform: function () {
        this.recalcInfo.recalculateTransform = true;
    },
    recalculate2: function () {
        if (this.recalcInfo.recalculateTransform.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = true;
        }
    },
    isShape: function () {
        return false;
    },
    isImage: function () {
        return true;
    },
    canGroup: function () {
        return true;
    },
    canUnGroup: function () {
        return true;
    },
    updatePosition: function (x, y) {
        this.setAbsoluteTransform(x, y, null, null, null, null, null);
        this.calculateTransformMatrix();
        this.calculateTransformTextMatrix();
    },
    updatePosition2: function (x, y) {
        this.absOffsetX = x;
        this.absOffsetY = y;
        if (this.parent) {
            this.parent.absOffsetX = x;
            this.parent.absOffsetY = y;
        }
        this.calculateTransformMatrix();
        this.calculateTransformTextMatrix();
    },
    calculateAfterOpen: function () {
        var xfrm = this.spPr.xfrm;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV, true);
        if (this.chart != null) {
            this.chartModify(this.chart);
        }
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.calculateTransformMatrix();
        this.calculateFill();
        this.calculateLine();
    },
    calculateAfterOpenInGroup: function () {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.parent = new ParaDrawing(null, null, this, editor.WordControl.m_oLogicDocument.DrawingDocument, null, null);
        this.parent.Set_GraphicObject(this);
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, true);
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.calculateLine();
        this.calculateFill();
    },
    calculateAfterOpenInGroup2: function () {
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var flip_h = xfrm.flipH == null ? false : xfrm.flipH;
        var flip_v = xfrm.flipV == null ? false : xfrm.flipV;
        this.setAbsoluteTransform(xfrm.offX, xfrm.offY, xfrm.extX, xfrm.extY, rot, flip_h, flip_v, true);
        if (this.spPr.geometry) {
            this.spPr.geometry.Init(xfrm.extX, xfrm.extY);
        }
        this.calculateLine();
        this.calculateFill();
    },
    chartModify: function (chart) {
        var data = {
            Type: historyitem_ChangeDiagram,
            oldDiagram: this.chart == null ? null : this.chart.Get_Id(),
            newDiagram: chart.Get_Id()
        };
        History.Add(this, data);
        this.chart = chart;
        this.setRasterImage(chart.img);
    },
    init: function (Img, W, H, chart, canvas) {
        this.parent.GraphicObj = this;
        if (chart == null) {
            var data = {
                Type: historyitem_InitShape,
                Img: Img,
                W: W,
                H: H
            };
            History.Add(this, data);
            this.setRasterImage(Img, canvas);
        } else {
            var data = {
                Type: historyitem_ChangeDiagram2,
                diagram: chart.Get_Id(),
                W: W,
                H: H
            };
            History.Add(this, data);
            this.chart = chart;
            this.setRasterImage(chart.img);
        }
        this.absOffsetX = 0;
        this.absOffsetY = 0;
        this.absExtX = W;
        this.absExtY = H;
        this.absRot = 0;
        this.absFlipH = false;
        this.absFlipV = false;
        if (this.parent) {
            this.parent.absOffsetX = 0;
            this.parent.absOffsetY = 0;
            this.parent.absExtX = W;
            this.parent.absExtY = H;
            this.parent.absRot = 0;
            this.parent.absFlipH = false;
            this.parent.absFlipV = false;
        }
        this.addGeometry("rect");
        this.spPr.geometry.Init(W, H);
        this.calculateTransformTextMatrix();
        this.setXfrm(0, 0, W, H, 0, false, false);
        this.setAbsoluteTransform(0, 0, W, H, 0, false, false, true);
        return this;
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
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
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
        this.absOffsetX = t_xc - hc;
        this.absOffsetY = t_yc - vc;
        this.absExtX = xfrm.extX;
        this.absExtY = xfrm.extY;
        this.absRot = 0;
        this.absFlipH = false;
        this.absFlipV = false;
        this.parent = new ParaDrawing(xfrm.extX, xfrm.extY, this, this.drawingDocument, null, null);
    },
    getBase64Object: function () {
        var w = new CMemory();
        this.Write_ToBinary2(w);
        return w.GetBase64Memory();
    },
    getBase64Img: function () {
        if (isRealObject(this.blipFill) && typeof this.blipFill.RasterImageId === "string") {
            return _getFullImageSrc(this.blipFill.RasterImageId);
        }
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },
    getPageIndex: function () {
        return this.pageIndex;
    },
    setRasterImage: function (img, canvas) {
        this.blipFill = new CBlipFill();
        this.blipFill.RasterImageId = img;
        if (isRealObject(canvas)) {
            this.blipFill.canvas = canvas;
        }
        this.spPr.Fill = new CUniFill();
        this.spPr.Fill.fill = this.blipFill;
        this.brush = this.spPr.Fill;
    },
    setBlipFill: function (blipFill) {
        History.Add(this, {
            Type: historyitem_SetBlipFill,
            oldPr: this.blipFill,
            newPr: blipFill
        });
        this.blipFill = blipFill;
    },
    setRasterImage2: function (img) {
        History.Add(this, {
            Type: historyitem_SetRasterImage2,
            oldImage: isRealObject(this.blipFill) ? this.blipFill.RasterImageId : null,
            newImage: img
        });
        this.setRasterImage(img);
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
    Get_Id: function () {
        return this.Id;
    },
    Get_Numbering: function () {
        return this.document.Get_Numbering();
    },
    Get_Styles: function () {
        return this.document.Get_Styles();
    },
    Get_TableStyleForPara: function () {
        return this.document.Get_TableStyleForPara();
    },
    Is_Cell: function () {
        return false;
    },
    OnContentRecalculate: function () {
        if (this.bodyPr.anchor !== VERTICAL_ANCHOR_TYPE_TOP) {
            this.calculateTransformTextMatrix();
        }
    },
    OnContentReDraw: function () {},
    Get_ParentObject_or_DocumentPos: function () {
        return null;
    },
    setDiagram: function (chart) {
        var diagramm = new CChartData(true);
        diagramm.deserializeChart(chart);
        diagramm.putToHistory();
        var chartRender = new ChartRender();
        var chartBase64 = chartRender.insertChart(diagramm, null, diagramm.width, diagramm.height);
        if (chartBase64 && (diagramm.img != chartBase64)) {
            diagramm.img = chartBase64;
        }
        this.setAbsoluteTransform(null, null, this.drawingDocument.GetMMPerDot(diagramm.width), this.drawingDocument.GetMMPerDot(diagramm.height), null, false, false);
        this.setXfrm(null, null, this.drawingDocument.GetMMPerDot(diagramm.width), this.drawingDocument.GetMMPerDot(diagramm.height), null, false, false);
        this.calculateAfterResize(null, true);
        this.chartModify(diagramm);
        editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(diagramm.img);
    },
    calculate: function () {
        if (this.group !== null) {
            var _temp_main_group = this.group;
            while (_temp_main_group.group !== null) {
                _temp_main_group = _temp_main_group.group;
            }
            this.mainGroup = _temp_main_group;
        }
    },
    calculateFill: function () {},
    calculateLine: function () {},
    calculateText: function () {},
    documentGetAllFontNames: function (AllFonts) {
        if (isRealObject(this.chart) && typeof this.chart.documentGetAllFontNames === "function") {
            this.chart.documentGetAllFontNames(AllFonts);
        }
    },
    setRotate: function (rot) {
        var history_obj = {};
        history_obj.Type = historyitem_SetRotate;
        history_obj.oldRot = this.spPr.xfrm.rot;
        history_obj.newRot = rot;
        this.spPr.xfrm.rot = rot;
        History.Add(this, history_obj);
        this.setAbsoluteTransform(null, null, null, null, rot, null, null);
        this.calculateTransformMatrix();
        this.calculateLeftTopPoint();
        this.calculateTransformTextMatrix();
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
        this.spPr.xfrm.flipH = flipH;
        this.spPr.xfrm.flipV = flipV;
        this.absExtX = w;
        this.absExtY = h;
        this.absFlipH = flipH;
        this.absFlipV = flipV;
        this.absOffsetX = posX;
        this.absOffsetY = posY;
        if (this.parent) {
            this.parent.absOffsetX = posX;
            this.parent.absOffsetY = posY;
            this.parent.absExtX = w;
            this.parent.absExtY = h;
            this.parent.absFlipH = flipH;
            this.parent.absFlipV = flipV;
        }
        this.calculateAfterResize(null, true);
    },
    canTakeOutPage: function () {
        return false;
    },
    setSizesInGroup: function (posX, posY, extX, extY) {
        var data = {};
        data.Type = historyitem_SetSizesInGroup;
        data.oldX = this.absOffsetX;
        data.oldY = this.absOffsetY;
        data.oldExtX = this.absExtX;
        data.oldExtY = this.absExtY;
        data.newX = posX;
        data.newY = posY;
        data.newExtX = extX;
        data.newExtY = extY;
        History.Add(this, data);
        this.absOffsetX = posX;
        this.absOffsetY = posY;
        this.absExtX = extX;
        this.absExtY = extY;
        if (this.parent) {
            this.parent.absOffsetX = posX;
            this.parent.absOffsetY = posY;
            this.parent.absExtX = extX;
            this.parent.absExtY = extY;
        }
        this.calculateAfterResize(null, true);
    },
    setGroupAfterOpen: function (group) {
        this.group = group;
    },
    getImageUrl: function () {
        if (isRealObject(this.blipFill)) {
            return this.blipFill.RasterImageId;
        }
        return null;
    },
    recalculate: function (changeSize, bAfterOpen) {
        this.calculateAfterResize(null, changeSize, bAfterOpen);
        this.recalculateTransformMatrix();
        this.updateCursorTypes();
    },
    updateAbsPosInGroup: function () {
        if (isRealObject(this.group)) {
            this.setAbsoluteTransform(this.spPr.xfrm.offX, this.spPr.xfrm.offY, null, null, null, null, null);
        }
    },
    calculateContent: function () {},
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
    calculateTransformMatrix: function (transform) {
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
        if (isRealObject(transform)) {
            global_MatrixTransformer.MultiplyPrepend(_transform, transform);
        }
        this.transform = _transform;
        this.ownTransform = _transform.CreateDublicate();
    },
    getOwnTransform: function () {
        return this.ownTransform;
    },
    calculateTransformTextMatrix: function () {},
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
    calculateLeftTopPoint: function () {
        var _horizontal_center = this.absExtX * 0.5;
        var _vertical_enter = this.absExtY * 0.5;
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        this.absXLT = -_horizontal_center * _cos + _vertical_enter * _sin + this.absOffsetX + _horizontal_center;
        this.absYLT = -_horizontal_center * _sin - _vertical_enter * _cos + this.absOffsetY + _vertical_enter;
    },
    calculateAfterInternalResize: function () {},
    calculateTransformFromXfrmToAbsCoors: function () {},
    calculateTransformFromAbsCoorsToXfrm: function () {},
    transformPointRelativeShape: function (x, y) {
        this.calculateLeftTopPoint();
        var result_x, result_y;
        result_x = x;
        result_y = y;
        if (isRealObject(this.parent)) {
            if (this.parent.Is_Inline()) {
                if (this.parent.DocumentContent instanceof CDocumentContent) {
                    var cur_doc_content = this.parent.DocumentContent;
                    while (cur_doc_content.Is_TableCellContent()) {
                        cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                    }
                    if ((cur_doc_content instanceof CDocumentContent && cur_doc_content.Parent instanceof WordShape)) {
                        var invert_matrix = cur_doc_content.Parent.invertTextMatrix;
                        result_x = invert_matrix.TransformPointX(x, y);
                        result_y = invert_matrix.TransformPointY(x, y);
                    }
                }
            }
        }
        var _sin = Math.sin(this.absRot);
        var _cos = Math.cos(this.absRot);
        var _temp_x = result_x - this.absXLT;
        var _temp_y = result_y - this.absYLT;
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
    addGeometry: function (preset) {
        this.spPr.geometry = CreateGeometry(preset);
    },
    isGroup: function () {
        return false;
    },
    draw: function (graphics) {
        if (this.spPr.geometry !== null && isRealObject(this.transform)) {
            graphics.SaveGrState();
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.transform, false);
            var shape_drawer = new CShapeDrawer();
            shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
            shape_drawer.draw(this.spPr.geometry);
            graphics.RestoreGrState();
        }
    },
    getWrapPolygon: function () {
        this.wrapPolygon = this.spPr.geometry.getWrapPolygon(10, this.transform);
        return this.wrapPolygon;
    },
    drawAdjustments: function () {},
    calculateAfterResize: function (transform, bChangeSize, bAfterOpen) {
        if (isRealObject(this.parent)) {
            this.parent.bNeedUpdateWH = true;
        }
        if (this.spPr.geometry !== null) {
            this.spPr.geometry.Recalculate(this.absExtX, this.absExtY);
        }
        this.calculateTransformMatrix(transform);
        this.calculateTransformTextMatrix();
        this.calculateLeftTopPoint();
        if (isRealObject(this.chart) && (bChangeSize === true || this.chart.img == "") && bAfterOpen !== true) {
            this.chart.width = this.drawingDocument.GetDotsPerMM(this.absExtX);
            this.chart.height = this.drawingDocument.GetDotsPerMM(this.absExtY);
            var chartRender = new ChartRender();
            var chartBase64 = chartRender.insertChart(this.chart, null, this.chart.width, this.chart.height);
            this.chart.img = chartBase64;
            this.setRasterImage(this.chart.img);
            editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(this.chart.img);
        }
    },
    calculateAfterRotate: function () {
        this.calculateTransformMatrix();
        this.calculateTransformTextMatrix();
        this.calculateLeftTopPoint();
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
            _radius = this.drawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
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
            _dist_y = _relative_y + this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
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
    hitToTextRect: function (x, y) {
        return false;
    },
    checkLine: function () {
        return false;
    },
    checkDrawGeometry: function () {
        return this.spPr.geometry && ((this.pen && this.pen.Fill && this.pen.Fill.fill && this.pen.Fill.fill.type != FILL_TYPE_NOFILL && this.pen.Fill.fill.type != FILL_TYPE_NONE) || (this.brush && this.brush.fill && this.brush.fill && this.brush.fill.type != FILL_TYPE_NOFILL && this.brush.fill.type != FILL_TYPE_NONE));
    },
    getAngle: function (x, y) {
        var result_x, result_y;
        result_x = x;
        result_y = y;
        if (isRealObject(this.parent)) {
            if (this.parent.Is_Inline()) {
                if (this.parent.DocumentContent instanceof CDocumentContent) {
                    var cur_doc_content = this.parent.DocumentContent;
                    while (cur_doc_content.Is_TableCellContent()) {
                        cur_doc_content = cur_doc_content.Parent.Row.Table.Parent;
                    }
                    if ((cur_doc_content instanceof CDocumentContent && cur_doc_content.Parent instanceof WordShape)) {
                        var invert_matrix = cur_doc_content.Parent.invertTextMatrix;
                        result_x = invert_matrix.TransformPointX(x, y);
                        result_y = invert_matrix.TransformPointY(x, y);
                    }
                }
            }
        }
        var x_lt, y_lt;
        var hc, vc, sin, cos;
        hc = this.absExtX * 0.5;
        vc = this.absExtY * 0.5;
        sin = Math.sin(this.absRot);
        cos = Math.cos(this.absRot);
        x_lt = -hc * cos + vc * sin + this.absOffsetX + hc;
        y_lt = -hc * sin - vc * cos + this.absOffsetY + vc;
        var tx = result_x - x_lt,
        ty = result_y - y_lt;
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
    createTrackObjectForMove: function (majorOffsetX, majorOffsetY) {
        return new MoveTrackShape(this, majorOffsetX, majorOffsetY);
    },
    createTrackObjectForResize: function (handleNum, pageIndex) {
        return new ResizeTrackShape(this, handleNum, pageIndex);
    },
    createTrackObjectForRotate: function (pageIndex) {
        return new RotateTrackShape(this, pageIndex);
    },
    createObjectForDrawOnOverlayInGroup: function () {
        return new ShapeForDrawOnOverlayInGroup(this);
    },
    createObjectForResizeInGroup: function () {
        return new ShapeForTrackInResizeGroup(this);
    },
    createTrackObjectForMoveInGroup: function (majorOffsetX, majorOffsetY) {
        return new ShapeTrackForMoveInGroup(this, majorOffsetX, majorOffsetY);
    },
    canZeroDimension: function () {
        return false;
    },
    canFlipAtAddTrack: function () {
        return false;
    },
    setAbsoluteTransform: function (offsetX, offsetY, extX, extY, rot, flipH, flipV, bAfterOpen) {
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
        var b_change_size = extX != null || extY != null;
        this.recalculate(b_change_size, bAfterOpen);
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
    getAbsolutePosition: function () {
        return {
            x: this.absOffsetX,
            y: this.absOffsetY
        };
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
    getAspect: function (num) {
        var _tmp_x = this.absExtX != 0 ? this.absExtX : 0.1;
        var _tmp_y = this.absExtY != 0 ? this.absExtY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },
    getSpTree: function () {
        return [this];
    },
    getFullRotate: function () {
        if (this.mainGroup === null) {
            return this.absRot;
        } else {
            var ret = this.absRot + this.mainGroup.absRot;
            while (ret >= Math.PI * 2) {
                ret -= Math.PI * 2;
            }
            while (ret < 0) {
                ret += Math.PI * 2;
            }
        }
        return ret;
    },
    getFullOffset: function () {
        var _horizontal_center = this.absExtX * 0.5;
        var _vertical_center = this.absExtY * 0.5;
        return {
            x: this.transform.TransformPointX(_horizontal_center, _vertical_center) - _horizontal_center,
            y: this.transform.TransformPointY(_horizontal_center, _vertical_center) - _vertical_center
        };
    },
    getFullFlip: function () {
        var _transform = this.transform;
        var _full_rotate = this.getFullRotate();
        var _full_pos_x_lt = _transform.TransformPointX(0, 0);
        var _full_pos_y_lt = _transform.TransformPointY(0, 0);
        var _full_pos_x_rt = _transform.TransformPointX(this.absExtX, 0);
        var _full_pos_y_rt = _transform.TransformPointY(this.absExtX, 0);
        var _full_pos_x_rb = _transform.TransformPointX(this.absExtX, this.absExtY);
        var _full_pos_y_rb = _transform.TransformPointY(this.absExtX, this.absExtY);
        var _rotate_matrix = new CMatrix();
        _rotate_matrix.Rotate(rad2deg(_full_rotate), MATRIX_ORDER_PREPEND);
        var _rotated_pos_x_lt = _rotate_matrix.TransformPointX(_full_pos_x_lt, _full_pos_y_lt);
        var _rotated_pos_x_rt = _rotate_matrix.TransformPointX(_full_pos_x_rt, _full_pos_y_rt);
        var _rotated_pos_y_rt = _rotate_matrix.TransformPointY(_full_pos_x_rt, _full_pos_y_rt);
        var _rotated_pos_y_rb = _rotate_matrix.TransformPointY(_full_pos_x_rb, _full_pos_y_rb);
        return {
            flipH: _rotated_pos_x_lt > _rotated_pos_x_rt,
            flipV: _rotated_pos_y_rt > _rotated_pos_y_rb
        };
    },
    canRotate: function () {
        return !isRealObject(this.chart);
    },
    hit: function (x, y) {
        if (isRealObject(this.parent) && isRealObject(this.parent.Parent) && isRealObject(this.parent.Parent.Parent) && this.parent.Parent.Parent instanceof CDocumentContent && this.parent.wrappingType !== WRAPPING_TYPE_NONE && (!(this.parent.Parent.Parent.Is_HdrFtr() || this.parent.Is_Inline())) && !this.parent.Parent.Parent.Is_TopDocument() && !isRealObject(this.group)) {
            var tx, ty;
            var b_check = false;
            if (!this.parent.isShapeChild()) {
                tx = x;
                ty = y;
                b_check = true;
            } else {
                var parent_shape = this.parent.getParentShape();
                if (isRealObject(parent_shape) && isRealObject(parent_shape.invertTextMatrix) && isRealObject(parent_shape.parent) && parent_shape.parent.wrappingType !== WRAPPING_TYPE_NONE) {
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
        var t_x, t_y;
        if (this.group != null) {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        } else {
            t_x = x;
            t_y = y;
        }
        if (this.spPr.geometry === null) {
            return this.hitInBox(x, y);
        }
        var _hit_context = this.drawingDocument.CanvasHitContext;
        var _transformed_point = this.transformPointRelativeShape(t_x, t_y);
        if (this.spPr.geometry.hitInInnerArea(_hit_context, _transformed_point.x, _transformed_point.y) === false) {
            if (this.spPr.geometry.hitInPath(_hit_context, _transformed_point.x, _transformed_point.y)) {
                return true;
            }
        } else {
            return true;
        }
        if (this.selected === true) {
            return this.hitInBox(x, y);
        }
        return false;
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd) {
        if (this.textBoxContent) {
            this.textBoxContent.Remove(Count, bOnlyText, bRemoveOnlySelection, bOnTextAdd);
        }
    },
    hitToAdj: function (x, y) {
        return {
            hit: false,
            adjPolarFlag: null,
            adjNum: null
        };
    },
    hitInBox: function (x, y) {
        var t_x, t_y;
        if (this.group != null) {
            var inv_t = global_MatrixTransformer.Invert(this.group.transform);
            t_x = inv_t.TransformPointX(x, y);
            t_y = inv_t.TransformPointY(x, y);
        } else {
            t_x = x;
            t_y = y;
        }
        var _transformed_point = this.transformPointRelativeShape(t_x, t_y);
        var _tr_x = _transformed_point.x;
        var _tr_y = _transformed_point.y;
        var _hit_context = this.drawingDocument.CanvasHitContext;
        return (HitInLine(_hit_context, _tr_x, _tr_y, 0, 0, this.absExtX, 0) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX, 0, this.absExtX, this.absExtY) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX, this.absExtY, 0, this.absExtY) || HitInLine(_hit_context, _tr_x, _tr_y, 0, this.absExtY, 0, 0) || HitInLine(_hit_context, _tr_x, _tr_y, this.absExtX * 0.5, 0, this.absExtX * 0.5, -this.drawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE)));
    },
    hitToPath: function (x, y) {
        if (this.spPr.geometry !== null && typeof this.spPr.geometry === "object" && typeof this.spPr.geometry.hitToPath === "function") {
            var _transformed_point = this.transformPointRelativeShape(x, y);
            return this.spPr.geometry.hitToPath(_transformed_point.x, _transformed_point.y);
        }
        return false;
    },
    selectionSetStart: function (x, y, event) {
        if (this.textBoxContent) {
            var invert_transform = global_MatrixTransformer.Invert(this.transformText);
            var t_x = invert_transform.TransformPointX(x, y);
            var t_y = invert_transform.TransformPointY(x, y);
            this.textBoxContent.Selection_SetStart(t_x, t_y, this.pageIndex, event);
        }
    },
    selectionSetEnd: function (x, y, event) {
        if (this.textBoxContent) {
            var invert_transform = global_MatrixTransformer.Invert(this.transformText);
            var t_x = invert_transform.TransformPointX(x, y);
            var t_y = invert_transform.TransformPointY(x, y);
            this.textBoxContent.Selection_SetEnd(t_x, t_y, this.pageIndex, event);
        }
    },
    selectionRemove: function () {
        if (this.textBoxContent) {
            this.textBoxContent.Selection_Remove();
        }
    },
    updateSelectionState: function () {
        if (this.textBoxContent) {
            var Doc = this.textBoxContent;
            if (true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
                this.document.DrawingDocument.TargetEnd();
                this.document.DrawingDocument.SelectEnabled(true);
                this.document.DrawingDocument.SelectClear();
                this.document.DrawingDocument.SelectShow();
            } else {
                this.document.DrawingDocument.TargetShow();
                this.document.DrawingDocument.SelectEnabled(false);
            }
        }
    },
    updateChartImage: function () {
        if (isRealObject(this.chart)) {
            var chartRender = new ChartRender();
            var xfrm = this.spPr.xfrm;
            var width_pix = this.drawingDocument.GetDotsPerMM(xfrm.extX);
            var heght_pix = this.drawingDocument.GetDotsPerMM(xfrm.extY);
            var chartBase64 = chartRender.insertChart(this.chart, null, this.chart.width, this.chart.height);
            if (!chartBase64) {
                return;
            }
            this.chart.img = chartBase64;
            this.setRasterImage(this.chart.img);
            editor.WordControl.m_oLogicDocument.DrawingObjects.urlMap.push(chartBase64);
        }
    },
    normalizeXfrm2: function (kw, kh) {
        var xfrm = this.spPr.xfrm;
        xfrm.offX *= kw;
        xfrm.offY *= kh;
        xfrm.extX *= kw;
        xfrm.extY *= kh;
    },
    Get_StartPage_Absolute: function () {
        return 0;
    },
    Get_StartPage_Relative: function () {
        return 0;
    },
    setPageIndex: function (newPageIndex) {
        this.pageIndex = newPageIndex;
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
    getPresetGeom: function () {
        if (this.spPr.geometry) {
            return this.spPr.geometry.preset;
        }
        return null;
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
    },
    calculateWrapPolygon: function () {
        if (this.spPr.geometry === null) {
            var ret = [];
            ret.push({
                x: 0,
                y: 0
            });
            ret.push({
                x: this.absExtX,
                y: 0
            });
            ret.push({
                x: this.absExtX,
                y: this.absExtY
            });
            ret.push({
                x: 0,
                y: this.absExtY
            });
            return ret;
        }
        return this.spPr.geometry.calculateWrapPolygon();
    },
    getArrayWrapPolygons: function () {
        if (this.spPr.geometry) {
            return this.spPr.geometry.getArrayPolygons();
        }
        return [];
    },
    applyTextPr: function (paraItem, bRecalculate) {},
    canChangeWrapPolygon: function () {
        return true;
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
            this.calculateAfterResize(null, true);
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
                posX = 0;
                posY = 0;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        case historyitem_SetRotate:
            var oldRot = data.oldRot == null ? 0 : data.oldRot;
            this.spPr.xfrm.rot = oldRot;
            this.absRot = oldRot;
            if (this.parent) {
                this.parent.absRot = oldRot;
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateTransformTextMatrix();
            break;
        case historyitem_SetSizes:
            this.spPr.xfrm.extX = data.oldW;
            this.spPr.xfrm.extY = data.oldH;
            this.spPr.xfrm.flipH = data.oldFlipH;
            this.spPr.xfrm.flipV = data.oldFlipV;
            this.absExtX = data.oldW;
            this.absExtY = data.oldH;
            this.absFlipH = data.oldFlipH;
            this.absFlipV = data.oldFlipV;
            this.absOffsetX = data.oldPosX;
            this.absOffsetY = data.oldPosY;
            if (this.parent) {
                this.parent.absOffsetX = data.oldPosX;
                this.parent.absOffsetY = data.oldPosY;
                this.parent.absExtX = data.oldW;
                this.parent.absExtY = data.oldH;
                this.parent.absFlipH = data.oldFlipH;
                this.parent.absFlipV = data.oldFlipV;
            }
            this.calculateAfterResize(null, true);
            break;
        case historyitem_SetSizesInGroup:
            this.absOffsetX = data.oldX;
            this.absOffsetY = data.oldY;
            this.absExtX = data.oldExtX;
            this.absExtY = data.oldExtY;
            if (this.parent) {
                this.parent.absOffsetX = data.oldX;
                this.parent.absOffsetY = data.oldY;
                this.parent.absExtX = data.oldExtX;
                this.parent.absExtY = data.oldExtY;
            }
            this.calculateAfterResize(null, true);
            break;
        case historyitem_SetGroup:
            this.group = data.oldGroup;
            break;
        case historyitem_SetMainGroup:
            this.mainGroup = data.oldGroup;
            break;
        case historyitem_ChangeDiagram:
            this.chart = (data.oldDiagram === null) ? null : g_oTableId.Get_ById(data.oldDiagram);
            this.setRasterImage(this.chart != null ? this.chart.img : null);
            this.updateChartImage();
            break;
        case historyitem_SetSpPr:
            this.spPr = new CSpPr();
            break;
        case historyitem_SetRasterImage2:
            this.setRasterImage(data.oldImage);
            break;
        case historyitem_SetParent:
            if (data.oldParent == null) {
                this.parent = null;
            } else {
                this.parent = g_oTableId.Get_ById(data.oldParent);
            }
            break;
        case historyitem_SetStyle:
            this.style = null;
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
            this.calculateAfterResize(null, true);
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
                posX = 0;
                posY = 0;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        case historyitem_SetRotate:
            var newRot = data.newRot == null ? 0 : data.newRot;
            this.spPr.xfrm.rot = newRot;
            this.absRot = newRot;
            if (this.parent) {
                this.parent.absRot = newRot;
            }
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateTransformTextMatrix();
            break;
        case historyitem_SetSizes:
            this.spPr.xfrm.extX = data.newW;
            this.spPr.xfrm.extY = data.newH;
            this.spPr.xfrm.flipH = data.newFlipH;
            this.spPr.xfrm.flipV = data.newFlipV;
            this.absExtX = data.newW;
            this.absExtY = data.newH;
            this.absFlipH = data.newFlipH;
            this.absFlipV = data.newFlipV;
            this.absOffsetX = data.newPosX;
            this.absOffsetY = data.newPosY;
            if (this.parent) {
                this.parent.absOffsetX = data.newPosX;
                this.parent.absOffsetY = data.newPosY;
                this.parent.absExtX = data.newW;
                this.parent.absExtY = data.newH;
                this.parent.absFlipH = data.newFlipH;
                this.parent.absFlipV = data.newFlipV;
            }
            this.calculateAfterResize(null, true);
            break;
        case historyitem_SetSizesInGroup:
            this.absOffsetX = data.newX;
            this.absOffsetY = data.newY;
            this.absExtX = data.newExtX;
            this.absExtY = data.newExtY;
            if (this.parent) {
                this.parent.absOffsetX = data.newX;
                this.parent.absOffsetY = data.newY;
                this.parent.absExtX = data.newExtX;
                this.parent.absExtY = data.newExtY;
            }
            this.calculateAfterResize(null, true);
            break;
        case historyitem_SetGroup:
            this.group = data.newGroup;
            break;
        case historyitem_SetMainGroup:
            this.mainGroup = data.newGroup;
            break;
        case historyitem_ChangeDiagram:
            this.chart = (data.newDiagram === null) ? null : g_oTableId.Get_ById(data.newDiagram);
            this.setRasterImage(this.chart != null ? this.chart.img : null);
            this.updateChartImage();
            break;
        case historyitem_SetSpPr:
            this.spPr = data.spPr;
            if (this.spPr.Fill && this.spPr.Fill.fill && this.spPr.Fill.fill instanceof CBlipFill) {
                this.setRasterImage(this.spPr.Fill.fill.RasterImageId);
            }
            break;
        case historyitem_SetRasterImage2:
            this.setRasterImage(data.newImage);
            break;
        case historyitem_SetParent:
            if (data.newParent == null) {
                this.parent = null;
            } else {
                this.parent = g_oTableId.Get_ById(data.newParent);
            }
            break;
        case historyitem_SetStyle:
            this.style = data.style;
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
        case historyitem_InitShape:
            writer.WriteString2(data.Img);
            writer.WriteDouble(data.W);
            writer.WriteDouble(data.H);
            break;
        case historyitem_ChangeDiagram:
            var bool = typeof data.newDiagram === "string";
            writer.WriteBool(bool);
            if (bool) {
                writer.WriteString2(data.newDiagram);
            }
            break;
        case historyitem_ChangeDiagram2:
            writer.WriteString2(data.diagram);
            writer.WriteDouble(data.W);
            writer.WriteDouble(data.H);
            break;
        case historyitem_SetSpPr:
            data.spPr.Write_ToBinary2(writer);
            break;
        case historyitem_SetRasterImage2:
            writer.WriteString2(data.newImage);
            break;
        case historyitem_SetParent:
            writer.WriteBool(data.newParent != null);
            if (data.newParent != null) {
                writer.WriteString2(data.newParent);
            }
            break;
        case historyitem_SetStyle:
            data.style.Write_ToBinary2(writer);
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
        case historyitem_CalculateAfterCopyInGroup:
            this.calculateAfterOpenInGroup2();
            break;
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
            this.calculateAfterResize(null, true);
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
            if (this.spPr.geometry) {
                this.spPr.geometry.Recalculate(xfrm.extX, xfrm.extY);
            }
            var posX, posY;
            if (this.group == null) {
                posX = 0;
                posY = 0;
            } else {
                posX = xfrm.offX;
                posY = xfrm.offY;
            }
            this.setAbsoluteTransform(posX, posY, xfrm.extX, xfrm.extY, xfrm.rot == null ? 0 : xfrm.rot, xfrm.flipH == null ? false : xfrm.flipH, xfrm.flipV == null ? false : xfrm.flipV);
            break;
        case historyitem_SetRotate:
            var rotate = reader.GetDouble();
            this.spPr.xfrm.rot = rotate;
            this.absRot = rotate;
            this.calculateTransformMatrix();
            this.calculateLeftTopPoint();
            this.calculateTransformTextMatrix();
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
                this.parent.absExtX = extX;
                this.parent.absExtY = extY;
                this.parent.absFlipH = flipH;
                this.parent.absFlipV = flipV;
            }
            this.calculateAfterResize(null, true);
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
            this.calculateAfterResize(null, true);
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
        case historyitem_InitShape:
            this.document = editor.WordControl.m_oLogicDocument;
            this.drawingDocument = this.document.DrawingDocument;
            var _url = reader.GetString2();
            CollaborativeEditing.Add_NewImage(_url);
            this.setRasterImage(_url);
            this.absOffsetX = 0;
            this.absOffsetY = 0;
            this.absExtX = reader.GetDouble();
            this.absExtY = reader.GetDouble();
            this.absRot = 0;
            this.absFlipH = false;
            this.absFlipV = false;
            if (this.parent) {
                this.parent.absOffsetX = 0;
                this.parent.absOffsetY = 0;
                this.parent.absExtX = this.absExtX;
                this.parent.absExtY = this.absExtY;
                this.parent.absRot = 0;
                this.parent.absFlipH = false;
                this.parent.absFlipV = false;
            }
            this.addGeometry("rect");
            this.spPr.geometry.Init(this.absExtX, this.absExtY);
            this.calculateTransformTextMatrix();
            break;
        case historyitem_ChangeDiagram:
            if (reader.GetBool()) {
                this.chart = g_oTableId.Get_ById(reader.GetString2());
                if (isRealObject(this.chart)) {
                    var chartRender = new ChartRender();
                    var chartBase64 = chartRender.insertChart(this.chart, null, this.chart.width, this.chart.height);
                    if (chartBase64 && (this.chart.img != chartBase64)) {
                        this.chart.img = chartBase64;
                    }
                }
                if (isRealObject(this.chart) && typeof this.chart.img === "string") {
                    CollaborativeEditing.Add_NewImage(this.chart.img);
                }
                this.setRasterImage(this.chart != null ? this.chart.img : null);
                this.updateChartImage();
            } else {
                this.chart = null;
                this.setRasterImage(null);
            }
            break;
        case historyitem_ChangeDiagram2:
            var chart = g_oTableId.Get_ById(reader.GetString2());
            this.chart = chart;
            if (isRealObject(this.chart)) {
                var chartRender = new ChartRender();
                var chartBase64 = chartRender.insertChart(this.chart, null, this.chart.width, this.chart.height);
                if (chartBase64 && (this.chart.img != chartBase64)) {
                    this.chart.img = chartBase64;
                }
            }
            CollaborativeEditing.Add_NewImage(this.chart.img);
            this.setRasterImage(this.chart.img);
            this.absOffsetX = 0;
            this.absOffsetY = 0;
            this.absExtX = reader.GetDouble();
            this.absExtY = reader.GetDouble();
            this.absRot = 0;
            this.absFlipH = false;
            this.absFlipV = false;
            if (this.parent) {
                this.parent.absOffsetX = 0;
                this.parent.absOffsetY = 0;
                this.parent.absExtX = this.absExtX;
                this.parent.absExtY = this.absExtY;
                this.parent.absRot = 0;
                this.parent.absFlipH = false;
                this.parent.absFlipV = false;
            }
            this.addGeometry("rect");
            this.spPr.geometry.Init(this.absExtX, this.absExtY);
            this.calculateTransformMatrix();
            this.updateChartImage();
            break;
        case historyitem_SetSpPr:
            this.spPr = new CSpPr();
            this.spPr.Read_FromBinary2(reader);
            if (this.spPr.Fill && this.spPr.Fill.fill && this.spPr.Fill.fill instanceof CBlipFill) {
                if (typeof this.spPr.Fill.fill.RasterImageId === "string") {
                    CollaborativeEditing.Add_NewImage(this.spPr.Fill.fill.RasterImageId);
                }
                this.setRasterImage(this.spPr.Fill.fill.RasterImageId);
            }
            break;
        case historyitem_SetRasterImage2:
            var img = reader.GetString2();
            CollaborativeEditing.Add_NewImage(img);
            this.setRasterImage(img);
            break;
        case historyitem_SetParent:
            if (reader.GetBool()) {
                this.parent = g_oTableId.Get_ById(reader.GetString2());
            } else {
                this.parent = null;
            }
            break;
        case historyitem_SetStyle:
            this.style = new CShapeStyle();
            this.style.Read_FromBinary2(reader);
            break;
        }
        if (b_history_is_on) {
            History.TurnOn();
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
    recalculateDocContent: function () {},
    Write_ToBinary2: function (Writer) {
        Writer.WriteLong(historyitem_type_Image);
        Writer.WriteString2(this.Id);
        Writer.WriteBool(isRealObject(this.parent));
        if (isRealObject(this.parent)) {
            Writer.WriteString2(this.parent.Get_Id());
        }
        var bool = this.mainGroup != null;
        if (bool) {
            Writer.WriteString2(this.mainGroup.Get_Id());
        }
        bool = this.group != null;
        Writer.WriteBool(bool);
        if (bool) {
            Writer.WriteString2(this.group.Get_Id());
        }
        this.spPr.Write_ToBinary2(Writer);
        bool = this.blipFill != null;
        Writer.WriteBool(bool);
        if (bool) {
            this.blipFill.Write_ToBinary2(Writer);
        }
    },
    writeToBinaryForCopyPaste: function (w) {
        w.WriteLong(historyitem_type_Image);
        this.spPr.Write_ToBinary2(w);
        w.WriteBool(isRealObject(this.blipFill));
        if (isRealObject(this.blipFill)) {
            this.blipFill.Write_ToBinary2(w);
        }
        w.WriteBool(isRealObject(this.chart));
        if (isRealObject(this.chart)) {
            this.chart.Write_ToBinary2(w);
        }
    },
    readFromBinaryForCopyPaste: function (r, bNoRecalc) {
        if (this.parent) {
            this.parent.Set_GraphicObject(this);
        }
        var sp_pr = new CSpPr();
        sp_pr.Read_FromBinary2(r);
        this.setSpPr(sp_pr);
        if (r.GetBool()) {
            r.GetLong();
            this.blipFill = new CBlipFill();
            this.blipFill.Read_FromBinary2(r);
            this.setRasterImage2(this.blipFill.RasterImageId);
        }
        if (r.GetBool()) {
            var chart = new CChartData(true, null);
            r.GetLong();
            chart.Read_FromBinary2(r);
            this.chartModify(new CChartData(true, chart));
        }
    },
    calculateAfterChangeTheme: function () {
        if (isRealObject(this.chart)) {
            var chartRender = new ChartRender();
            var chartBase64 = chartRender.insertChart(this.chart, null, this.chart.width, this.chart.height);
            if (chartBase64) {
                this.setRasterImage(chartBase64);
                this.document.DrawingObjects.urlMap.push(chartBase64);
            }
        }
    },
    copy: function (parent, group) {
        var _group = isRealObject(group) ? group : null;
        var c = new WordImage(parent, editor.WordControl.m_oLogicDocument, editor.WordControl.m_oLogicDocument.DrawingDocument, _group);
        c.setSpPr(this.spPr.createDuplicate());
        if (isRealObject(this.chart)) {
            c.chartModify(new CChartData(true, this.chart));
        }
        if (isRealObject(this.blipFill)) {
            c.setRasterImage2(this.blipFill.RasterImageId);
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
        this.spPr.Read_FromBinary2(Reader);
        if (Reader.GetBool()) {
            Reader.GetLong();
            this.blipFill.Read_FromBinary2(Reader);
        }
        CollaborativeEditing.Add_NewObject(this);
        CollaborativeEditing.Add_LinkData(this, link_data);
    },
    Load_LinkData: function (linkData) {
        if (isRealObject(this.parent)) {
            editor.WordControl.m_oLogicDocument.DrawingObjects.addGraphicObject(this.parent);
        }
    }
};