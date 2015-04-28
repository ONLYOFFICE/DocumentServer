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
function CGroupShape() {
    this.nvGrpSpPr = null;
    this.spPr = null;
    this.spTree = [];
    this.parent = null;
    this.group = null;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();
    this.localTransform = new CMatrix();
    this.invertTransform = null;
    this.brush = null;
    this.pen = null;
    this.scaleCoefficients = {
        cx: 1,
        cy: 1
    };
    this.selected = false;
    this.arrGraphicObjects = [];
    this.selectedObjects = [];
    this.bDeleted = true;
    this.selection = {
        groupSelection: null,
        chartSelection: null,
        textSelection: null
    };
    this.snapArrayX = [];
    this.snapArrayY = [];
    this.setRecalculateInfo();
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CGroupShape.prototype = {
    getObjectType: function () {
        return historyitem_type_GroupShape;
    },
    Get_Id: function () {
        return this.Id;
    },
    documentGetAllFontNames: function (allFonts) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].documentGetAllFontNames) {
                this.spTree[i].documentGetAllFontNames(allFonts);
            }
        }
    },
    documentCreateFontMap: function (allFonts) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].documentCreateFontMap) {
                this.spTree[i].documentCreateFontMap(allFonts);
            }
        }
    },
    setBDeleted: function (pr) {
        History.Add(this, {
            Type: historyitem_ShapeSetBDeleted,
            oldPr: this.bDeleted,
            newPr: pr
        });
        this.bDeleted = pr;
    },
    setBDeleted2: function (pr) {
        this.bDeleted = pr;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].setBDeleted2) {
                this.spTree[i].setBDeleted2(pr);
            } else {
                this.spTree[i].bDeleted = pr;
            }
        }
    },
    checkRemoveCache: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].checkRemoveCache && this.spTree[i].checkRemoveCache();
        }
    },
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
                    this.getDrawingDocument().SelectClear();
                    this.getDrawingDocument().TargetEnd();
                }
            }
        }
    },
    drawSelectionPage: function (pageIndex) {
        if (this.selection.textSelection) {
            this.getDrawingDocument().UpdateTargetTransform(this.selection.textSelection.transformText);
            this.selection.textSelection.getDocContent().Selection_Draw_Page(pageIndex);
        } else {
            if (this.selection.chartSelection && this.selection.chartSelection.selection.textSelection) {
                this.selection.chartSelection.selection.textSelection.getDocContent().Selection_Draw_Page(pageIndex);
            }
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_GroupShape);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    setNvGrpSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_GroupShapeSetNvGrpSpPr,
            oldPr: this.nvGrpSpPr,
            newPr: pr
        });
        this.nvGrpSpPr = pr;
    },
    setSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_GroupShapeSetSpPr,
            oldPr: this.spPr,
            newPr: pr
        });
        this.spPr = pr;
    },
    addToSpTree: function (pos, item) {
        if (!isRealNumber(pos)) {
            pos = this.spTree.length;
        }
        History.Add(this, {
            Type: historyitem_GroupShapeAddToSpTree,
            pos: pos,
            item: item
        });
        this.handleUpdateSpTree();
        this.spTree.splice(pos, 0, item);
    },
    setParent: function (pr) {
        History.Add(this, {
            Type: historyitem_GroupShapeSetParent,
            oldPr: this.parent,
            newPr: pr
        });
        this.parent = pr;
    },
    setGroup: function (group) {
        History.Add(this, {
            Type: historyitem_GroupShapeSetGroup,
            oldPr: this.group,
            newPr: group
        });
        this.group = group;
    },
    removeFromSpTree: function (id) {
        for (var i = this.spTree.length - 1; i > -1; --i) {
            if (this.spTree[i].Get_Id() === id) {
                this.handleUpdateSpTree();
                History.Add(this, {
                    Type: historyitem_GroupShapeRemoveFromSpTree,
                    pos: i,
                    item: this.spTree[i]
                });
                return this.spTree.splice(i, 1)[0];
            }
        }
        return null;
    },
    removeFromSpTreeByPos: function (pos) {
        History.Add(this, {
            Type: historyitem_GroupShapeRemoveFromSpTree,
            pos: pos,
            item: this.spTree[pos]
        });
        this.handleUpdateSpTree();
        return this.spTree.splice(pos, 1)[0];
    },
    handleUpdateSpTree: function () {
        if (!this.group) {
            this.recalcInfo.recalculateArrGraphicObjects = true;
            this.recalcBounds();
            this.addToRecalculate();
        } else {
            this.recalcInfo.recalculateArrGraphicObjects = true;
            this.group.handleUpdateSpTree();
            this.recalcBounds();
        }
    },
    copy: function () {
        var copy = new CGroupShape();
        if (this.nvGrpSpPr) {
            copy.setNvGrpSpPr(this.nvGrpSpPr.createDuplicate());
        }
        if (this.spPr) {
            copy.setSpPr(this.spPr.createDuplicate());
            copy.spPr.setParent(copy);
        }
        for (var i = 0; i < this.spTree.length; ++i) {
            copy.addToSpTree(copy.spTree.length, this.spTree[i].copy());
            copy.spTree[copy.spTree.length - 1].setGroup(copy);
        }
        copy.setBDeleted(this.bDeleted);
        copy.cachedImage = this.getBase64Img();
        return copy;
    },
    getAllImages: function (images) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].getAllImages === "function") {
                this.spTree[i].getAllImages(images);
            }
        }
    },
    getBoundsInGroup: function () {
        return getBoundsInGroup(this);
    },
    getBase64Img: CShape.prototype.getBase64Img,
    convertToWord: function (document) {
        this.setBDeleted(true);
        var c = new CGroupShape();
        c.setBDeleted(false);
        if (this.nvGrpSpPr) {
            c.setNvSpPr(this.nvGrpSpPr.createDuplicate());
        }
        if (this.spPr) {
            c.setSpPr(this.spPr.createDuplicate());
            c.spPr.setParent(c);
        }
        for (var i = 0; i < this.spTree.length; ++i) {
            c.addToSpTree(c.spTree.length, this.spTree[i].convertToWord(document));
            c.spTree[c.spTree.length - 1].setGroup(c);
        }
        return c;
    },
    convertToPPTX: function (drawingDocument, worksheet) {
        var c = new CGroupShape();
        c.setBDeleted(false);
        c.setWorksheet(worksheet);
        if (this.nvGrpSpPr) {
            c.setNvSpPr(this.nvGrpSpPr.createDuplicate());
        }
        if (this.spPr) {
            c.setSpPr(this.spPr.createDuplicate());
            c.spPr.setParent(c);
        }
        for (var i = 0; i < this.spTree.length; ++i) {
            c.addToSpTree(c.spTree.length, this.spTree[i].convertToPPTX(drawingDocument, worksheet));
            c.spTree[c.spTree.length - 1].setGroup(c);
        }
        return c;
    },
    isSimpleObject: function () {
        return false;
    },
    setDiagram: function (chartPr) {
        var bRecalc = false;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].setDiagram) {
                this.spTree[i].setDiagram(chartPr);
            }
        }
    },
    getAllFonts: function (fonts) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].getAllFonts === "function") {
                this.spTree[i].getAllFonts(fonts);
            }
        }
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
    isShape: function () {
        return false;
    },
    isImage: function () {
        return false;
    },
    isChart: function () {
        return false;
    },
    isGroup: function () {
        return true;
    },
    isPlaceholder: function () {
        return this.nvGrpSpPr != null && this.nvGrpSpPr.nvPr != undefined && this.nvGrpSpPr.nvPr.ph != undefined;
    },
    getAllRasterImages: function (images) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].getAllRasterImages) {
                this.spTree[i].getAllRasterImages(images);
            }
        }
    },
    draw: function (graphics) {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].draw(graphics);
        }
        if (locktype_None != this.Lock.Get_Type() && !this.group) {
            graphics.transform3(this.transform);
            graphics.SetIntegerGrid(false);
            graphics.DrawLockObjectRect(this.Lock.Get_Type(), 0, 0, this.extX, this.extY);
            graphics.reset();
            graphics.SetIntegerGrid(true);
        }
    },
    getLocalTransform: function () {
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.localTransform;
    },
    getArrGraphicObjects: function () {
        if (this.recalcInfo.recalculateArrGraphicObjects) {
            this.recalculateArrGraphicObjects();
        }
        return this.arrGraphicObjects;
    },
    getInvertTransform: function () {
        return this.invertTransform;
    },
    getRectBounds: function () {
        var transform = this.getTransformMatrix();
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
    getResultScaleCoefficients: function () {
        if (this.recalcInfo.recalculateScaleCoefficients) {
            var cx, cy;
            if (this.spPr.xfrm.isNotNullForGroup()) {
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
            } else {
                cx = 1;
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
    getType: function () {
        return DRAWING_OBJECT_TYPE_GROUP;
    },
    getCompiledTransparent: function () {
        return null;
    },
    selectObject: function (object, pageIndex) {
        object.select(this, pageIndex);
    },
    recalculate: function () {
        var recalcInfo = this.recalcInfo;
        if (recalcInfo.recalculateBrush) {
            this.recalculateBrush();
            recalcInfo.recalculateBrush = false;
        }
        if (recalcInfo.recalculatePen) {
            this.recalculatePen();
            recalcInfo.recalculatePen = false;
        }
        if (recalcInfo.recalculateScaleCoefficients) {
            this.getResultScaleCoefficients();
            recalcInfo.recalculateScaleCoefficients = false;
        }
        if (recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            recalcInfo.recalculateTransform = false;
        }
        if (recalcInfo.recalculateArrGraphicObjects) {
            this.recalculateArrGraphicObjects();
        }
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].recalculate();
        }
        if (recalcInfo.recalculateBounds) {
            this.recalculateBounds();
            recalcInfo.recalculateBounds = false;
        }
    },
    recalcTransform: function () {
        this.recalcInfo.recalculateTransform = true;
        this.recalcInfo.recalculateScaleCoefficients = true;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].recalcTransform) {
                this.spTree[i].recalcTransform();
            } else {
                this.spTree[i].recalcInfo.recalculateTransform = true;
                this.spTree[i].recalcInfo.recalculateTransformText = true;
            }
        }
    },
    canRotate: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (!this.spTree[i].canRotate || !this.spTree[i].canRotate()) {
                return false;
            }
        }
        return true;
    },
    canResize: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (!this.spTree[i].canResize || !this.spTree[i].canResize()) {
                return false;
            }
        }
        return true;
    },
    canMove: function () {
        return true;
    },
    canGroup: function () {
        return true;
    },
    canChangeAdjustments: function () {
        return false;
    },
    drawAdjustments: function () {},
    hitToAdjustment: function () {
        return {
            hit: false
        };
    },
    recalculateBrush: function () {},
    recalculatePen: function () {},
    recalculateArrGraphicObjects: function () {
        this.arrGraphicObjects.length = 0;
        for (var i = 0; i < this.spTree.length; ++i) {
            if (!this.spTree[i].isGroup()) {
                this.arrGraphicObjects.push(this.spTree[i]);
            } else {
                var arr_graphic_objects = this.spTree[i].getArrGraphicObjects();
                for (var j = 0; j < arr_graphic_objects.length; ++j) {
                    this.arrGraphicObjects.push(arr_graphic_objects[j]);
                }
            }
        }
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        if (this.selection.textSelection) {
            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
        } else {
            if (this.selection.chartSelection) {
                this.selection.chartSelection.paragraphAdd(paraItem, bRecalculate);
            } else {
                var i;
                if (paraItem.Type === para_TextPr) {
                    DrawingObjectsController.prototype.applyDocContentFunction.call(this, CDocumentContent.prototype.Paragraph_Add, [paraItem, bRecalculate], CTable.prototype.Paragraph_Add);
                } else {
                    if (this.selectedObjects.length === 1 && this.selectedObjects[0].getObjectType() === historyitem_type_Shape && !CheckLinePreset(this.selectedObjects[0].getPresetGeom())) {
                        this.selection.textSelection = this.selectedObjects[0];
                        this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
                        if (isRealNumber(this.selection.textSelection.selectStartPage)) {
                            this.selection.textSelection.select(this, this.selection.textSelection.selectStartPage);
                        }
                    } else {
                        if (this.selectedObjects.length > 0) {
                            if (this.parent) {
                                this.parent.GoTo_Text();
                                this.resetSelection();
                            }
                        }
                    }
                }
            }
        }
    },
    applyTextFunction: DrawingObjectsController.prototype.applyTextFunction,
    applyDocContentFunction: DrawingObjectsController.prototype.applyDocContentFunction,
    applyAllAlign: function (val) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].applyAllAlign === "function") {
                this.spTree[i].applyAllAlign(val);
            }
        }
    },
    applyAllSpacing: function (val) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].applyAllSpacing === "function") {
                this.spTree[i].applyAllSpacing(val);
            }
        }
    },
    applyAllNumbering: function (val) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].applyAllNumbering === "function") {
                this.spTree[i].applyAllNumbering(val);
            }
        }
    },
    applyAllIndent: function (val) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].applyAllIndent === "function") {
                this.spTree[i].applyAllIndent(val);
            }
        }
    },
    Paragraph_IncDecFontSizeAll: function (val) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (typeof this.spTree[i].Paragraph_IncDecFontSizeAll === "function") {
                this.spTree[i].Paragraph_IncDecFontSizeAll(val);
            }
        }
    },
    changeSize: function (kw, kh) {
        if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNullForGroup()) {
            var xfrm = this.spPr.xfrm;
            xfrm.setOffX(xfrm.offX * kw);
            xfrm.setOffY(xfrm.offY * kh);
            xfrm.setExtX(xfrm.extX * kw);
            xfrm.setExtY(xfrm.extY * kh);
            xfrm.setChExtX(xfrm.chExtX * kw);
            xfrm.setChExtY(xfrm.chExtY * kh);
            xfrm.setChOffX(xfrm.chOffX * kw);
            xfrm.setChOffY(xfrm.chOffY * kh);
        }
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].changeSize(kw, kh);
        }
    },
    recalculateTransform: function () {
        this.cachedImage = null;
        var xfrm;
        if (this.spPr.xfrm.isNotNullForGroup()) {
            xfrm = this.spPr.xfrm;
        } else {
            xfrm = new CXfrm();
            xfrm.offX = 0;
            xfrm.offY = 0;
            xfrm.extX = 5;
            xfrm.extY = 5;
            xfrm.chOffX = 0;
            xfrm.chOffY = 0;
            xfrm.chExtX = 5;
            xfrm.chExtY = 5;
        }
        if (!isRealObject(this.group)) {
            this.x = xfrm.offX;
            this.y = xfrm.offY;
            this.extX = xfrm.extX;
            this.extY = xfrm.extY;
            this.rot = isRealNumber(xfrm.rot) ? xfrm.rot : 0;
            this.flipH = this.flipH === true;
            this.flipV = this.flipV === true;
        } else {
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
        if (this.drawingBase && !this.group) {
            this.drawingBase.setGraphicObjectCoords();
        }
    },
    getTransformMatrix: function () {
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
        }
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
        for (var i = 0; i < this.arrGraphicObjects.length; ++i) {
            if (this.arrGraphicObjects[i].getSnapArrays) {
                this.arrGraphicObjects[i].getSnapArrays(snapX, snapY);
            }
        }
    },
    getPlaceholderType: function () {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.type : null;
    },
    getPlaceholderIndex: function () {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.idx : null;
    },
    getPhType: function () {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.type : null;
    },
    getPhIndex: function () {
        return this.isPlaceholder() ? this.nvGrpSpPr.nvPr.ph.idx : null;
    },
    getSelectionState: function () {
        var selection_state = {};
        if (this.selection.textSelection) {
            selection_state.textObject = this.selection.textSelection;
            selection_state.selectStartPage = this.selection.textSelection.selectStartPage;
            selection_state.textSelection = this.selection.textSelection.getDocContent().Get_SelectionState();
        } else {
            if (this.selection.chartSelection) {
                selection_state.chartObject = this.selection.chartSelection;
                selection_state.selectStartPage = this.selection.chartSelection.selectStartPage;
                selection_state.chartSelection = this.selection.chartSelection.getSelectionState();
            } else {
                selection_state.selection = [];
                for (var i = 0; i < this.selectedObjects.length; ++i) {
                    selection_state.selection.push({
                        object: this.selectedObjects[i],
                        pageIndex: this.selectedObjects[i].selectStartPage
                    });
                }
            }
        }
        return selection_state;
    },
    setSelectionState: function (selection_state) {
        this.resetSelection(this);
        if (selection_state.textObject) {
            this.selectObject(selection_state.textObject, selection_state.selectStartPage);
            this.selection.textSelection = selection_state.textObject;
            selection_state.textObject.getDocContent().Set_SelectionState(selection_state.textSelection, selection_state.textSelection.length - 1);
        } else {
            if (selection_state.chartSelection) {
                this.selectObject(selection_state.chartObject, selection_state.selectStartPage);
                this.selection.chartSelection = selection_state.chartObject;
                selection_state.chartObject.setSelectionState(selection_state.chartSelection);
            } else {
                for (var i = 0; i < selection_state.selection.length; ++i) {
                    this.selectObject(selection_state.selection[i].object, selection_state.selection[i].pageIndex);
                }
            }
        }
    },
    documentUpdateRulersState: function () {
        if (this.selectedObjects.length === 1 && this.selectedObjects[0].documentUpdateRulersState) {
            this.selectedObjects[0].documentUpdateRulersState();
        }
    },
    updateChartReferences: function (oldWorksheet, newWorksheet, bNoRebuildCache) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].updateChartReferences) {
                this.spTree[i].updateChartReferences(oldWorksheet, newWorksheet, bNoRebuildCache);
            }
        }
    },
    rebuildSeries: function (data) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].rebuildSeries) {
                this.spTree[i].rebuildSeries(data);
            }
        }
    },
    Search: function (Str, Props, SearchEngine, Type) {
        var Len = this.arrGraphicObjects.length;
        for (var i = 0; i < Len; ++i) {
            if (this.arrGraphicObjects[i].Search) {
                this.arrGraphicObjects[i].Search(Str, Props, SearchEngine, Type);
            }
        }
    },
    Search_GetId: function (bNext, bCurrent) {
        var Current = -1;
        var Len = this.arrGraphicObjects.length;
        var Id = null;
        if (true === bCurrent) {
            for (var i = 0; i < Len; ++i) {
                if (this.arrGraphicObjects[i] === this.selection.textSelection) {
                    Current = i;
                    break;
                }
            }
        }
        if (true === bNext) {
            var Start = (-1 !== Current ? Current : 0);
            for (var i = Start; i < Len; i++) {
                if (this.arrGraphicObjects[i].Search_GetId) {
                    Id = this.arrGraphicObjects[i].Search_GetId(true, i === Current ? true : false);
                    if (null !== Id) {
                        return Id;
                    }
                }
            }
        } else {
            var Start = (-1 !== Current ? Current : Len - 1);
            for (var i = Start; i >= 0; i--) {
                if (this.arrGraphicObjects[i].Search_GetId) {
                    Id = this.arrGraphicObjects[i].Search_GetId(false, i === Current ? true : false);
                    if (null !== Id) {
                        return Id;
                    }
                }
            }
        }
        return null;
    },
    isEmptyPlaceholder: function () {
        return false;
    },
    getCompiledFill: function () {
        this.compiledFill = null;
        if (isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealObject(this.spPr.Fill.fill)) {
            this.compiledFill = this.spPr.Fill.createDuplicate();
        } else {
            if (isRealObject(this.group)) {
                var group_compiled_fill = this.group.getCompiledFill();
                if (isRealObject(group_compiled_fill) && isRealObject(group_compiled_fill.fill)) {
                    this.compiledFill = group_compiled_fill.createDuplicate();
                } else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill)) {
                            this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                            break;
                        }
                    }
                }
            } else {
                var hierarchy = this.getHierarchy();
                for (var i = 0; i < hierarchy.length; ++i) {
                    if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealObject(hierarchy[i].spPr.Fill.fill)) {
                        this.compiledFill = hierarchy[i].spPr.Fill.createDuplicate();
                        break;
                    }
                }
            }
        }
        return this.compiledFill;
    },
    getCompiledLine: function () {
        return null;
    },
    setVerticalAlign: function (align) {
        for (var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index) {
            if (this.spTree[_shape_index].setVerticalAlign) {
                this.spTree[_shape_index].setVerticalAlign(align);
            }
        }
    },
    setPaddings: function (paddings) {
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].setPaddings) {
                this.spTree[i].setPaddings(paddings);
            }
        }
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
    changePresetGeom: function (preset) {
        for (var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index) {
            if (this.spTree[_shape_index].changePresetGeom) {
                this.spTree[_shape_index].changePresetGeom(preset);
            }
        }
    },
    changeFill: function (fill) {
        for (var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index) {
            if (this.spTree[_shape_index].changeFill) {
                this.spTree[_shape_index].changeFill(fill);
            }
        }
    },
    changeLine: function (line) {
        for (var _shape_index = 0; _shape_index < this.spTree.length; ++_shape_index) {
            if (this.spTree[_shape_index].changeLine) {
                this.spTree[_shape_index].changeLine(line);
            }
        }
    },
    getMainGroup: function () {
        if (!isRealObject(this.group)) {
            return this;
        }
        return this.group.getMainGroup();
    },
    canUnGroup: function () {
        return true;
    },
    normalize: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].normalize();
        }
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
        var xfrm = this.spPr.xfrm;
        xfrm.setOffX(new_off_x);
        xfrm.setOffY(new_off_y);
        xfrm.setExtX(new_ext_x);
        xfrm.setExtY(new_ext_y);
        xfrm.setChExtX(new_ext_x);
        xfrm.setChExtY(new_ext_y);
        xfrm.setChOffX(0);
        xfrm.setChOffY(0);
    },
    updateCoordinatesAfterInternalResize: function () {
        this.normalize();
        for (var i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].isGroup()) {
                this.spTree[i].updateCoordinatesAfterInternalResize();
            }
        }
        var sp_tree = this.spTree;
        var min_x, max_x, min_y, max_y;
        var sp = sp_tree[0];
        var xfrm = sp.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var xc, yc;
        if (checkNormalRotate(rot)) {
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
        for (i = 1; i < sp_tree.length; ++i) {
            sp = sp_tree[i];
            xfrm = sp.spPr.xfrm;
            rot = xfrm.rot == null ? 0 : xfrm.rot;
            if (checkNormalRotate(rot)) {
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
            max_x = this.spPr.xfrm.extX - min_x;
            min_x = this.spPr.xfrm.extX - temp;
        }
        if (this.spPr.xfrm.flipV === true) {
            temp = max_y;
            max_y = this.spPr.xfrm.extY - min_y;
            min_y = this.spPr.xfrm.extY - temp;
        }
        var old_x0, old_y0;
        var xfrm = this.spPr.xfrm;
        var rot = xfrm.rot == null ? 0 : xfrm.rot;
        var hc = xfrm.extX * 0.5;
        var vc = xfrm.extY * 0.5;
        old_x0 = this.spPr.xfrm.offX + hc - (hc * Math.cos(rot) - vc * Math.sin(rot));
        old_y0 = this.spPr.xfrm.offY + vc - (hc * Math.sin(rot) + vc * Math.cos(rot));
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
        pos_x = new_xc - new_hc;
        pos_y = new_yc - new_vc;
        var xfrm = this.spPr.xfrm;
        xfrm.setOffX(pos_x);
        xfrm.setOffY(pos_y);
        xfrm.setExtX(Math.abs(max_x - min_x));
        xfrm.setExtY(Math.abs(max_y - min_y));
        xfrm.setChExtX(Math.abs(max_x - min_x));
        xfrm.setChExtY(Math.abs(max_y - min_y));
        xfrm.setChOffX(0);
        xfrm.setChOffY(0);
        for (i = 0; i < sp_tree.length; ++i) {
            sp_tree[i].spPr.xfrm.setOffX(sp_tree[i].spPr.xfrm.offX - x_min_clear);
            sp_tree[i].spPr.xfrm.setOffY(sp_tree[i].spPr.xfrm.offY - y_min_clear);
        }
        this.checkDrawingBaseCoords();
    },
    select: CShape.prototype.select,
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
        return this;
    },
    getParentObjects: function () {
        var parents = {
            slide: null,
            layout: null,
            master: null,
            theme: null
        };
        return parents;
    },
    getCardDirectionByNum: function (num) {
        var num_north = this.getNumByCardDirection(CARD_DIRECTION_N);
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if (same_flip) {
            return ((num - num_north) + CARD_DIRECTION_N + 8) % 8;
        }
        return (CARD_DIRECTION_N - (num - num_north) + 8) % 8;
    },
    getNumByCardDirection: function (cardDirection) {
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        var transform = this.getTransformMatrix();
        var y1, y3, y5, y7;
        y1 = transform.TransformPointY(hc, 0);
        y3 = transform.TransformPointY(this.extX, vc);
        y5 = transform.TransformPointY(hc, this.extY);
        y7 = transform.TransformPointY(0, vc);
        var north_number;
        var full_flip_h = this.getFullFlipH();
        var full_flip_v = this.getFullFlipV();
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
        var same_flip = !full_flip_h && !full_flip_v || full_flip_h && full_flip_v;
        if (same_flip) {
            return (north_number + cardDirection) % 8;
        }
        return (north_number - cardDirection + 8) % 8;
    },
    getAspect: function (num) {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },
    getFullFlipH: function () {
        if (!isRealObject(this.group)) {
            return this.flipH;
        } else {
            return this.group.getFullFlipH() ? !this.flipH : this.flipH;
        }
    },
    getFullFlipV: function () {
        if (!isRealObject(this.group)) {
            return this.flipV;
        } else {
            return this.group.getFullFlipV() ? !this.flipV : this.flipV;
        }
    },
    getFullRotate: function () {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
    },
    createRotateTrack: function () {
        return new RotateTrackGroup(this);
    },
    createMoveTrack: function () {
        return new MoveGroupTrack(this);
    },
    createResizeTrack: function (cardDirection) {
        return new ResizeTrackGroup(this, cardDirection);
    },
    resetSelection: function (graphicObjects) {
        this.selection.textSelection = null;
        if (this.selection.chartSelection) {
            this.selection.chartSelection.resetSelection();
        }
        this.selection.chartSelection = null;
        for (var i = this.selectedObjects.length - 1; i > -1; --i) {
            var old_gr = this.selectedObjects[i].group;
            var obj = this.selectedObjects[i];
            obj.group = this;
            obj.deselect(graphicObjects);
            obj.group = old_gr;
        }
    },
    resetInternalSelection: DrawingObjectsController.prototype.resetInternalSelection,
    recalculateCurPos: DrawingObjectsController.prototype.recalculateCurPos,
    checkHitToBounds: CShape.prototype.checkHitToBounds,
    checkDrawingBaseCoords: CShape.prototype.checkDrawingBaseCoords,
    setDrawingBaseCoords: CShape.prototype.setDrawingBaseCoords,
    calculateSnapArrays: function (snapArrayX, snapArrayY) {
        if (!Array.isArray(snapArrayX) || !Array.isArray(snapArrayX)) {
            snapArrayX = this.snapArrayX;
            snapArrayY = this.snapArrayY;
            snapArrayX.length = 0;
            snapArrayY.length = 0;
        }
        var sp;
        for (var i = 0; i < this.spTree.length; ++i) {
            sp = this.spTree[i];
            sp.calculateSnapArrays(snapArrayX, snapArrayY);
            sp.snapArrayX.length = 0;
            sp.snapArrayY.length = 0;
            sp.calculateSnapArrays(sp.snapArrayX, sp.snapArrayY);
        }
    },
    hitToAdj: function (x, y) {
        return {
            hit: false,
            num: -1,
            polar: false
        };
    },
    setNvSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_GroupShapeSetNvGrpSpPr,
            oldPr: this.nvGrpSpPr,
            newPr: pr
        });
        this.nvGrpSpPr = pr;
    },
    Restart_CheckSpelling: function () {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].Restart_CheckSpelling && this.spTree[i].Restart_CheckSpelling();
        }
    },
    recalculateLocalTransform: CShape.prototype.recalculateLocalTransform,
    bringToFront: function () {
        var i;
        var arrDrawings = [];
        for (i = this.spTree.length - 1; i > -1; --i) {
            if (this.spTree[i].getObjectType() === historyitem_type_GroupShape) {
                this.spTree[i].bringToFront();
            } else {
                if (this.spTree[i].selected) {
                    arrDrawings.push(this.removeFromSpTreeByPos(i));
                }
            }
        }
        for (i = arrDrawings.length - 1; i > -1; --i) {
            this.addToSpTree(null, arrDrawings[i]);
        }
    },
    bringForward: function () {
        var i;
        for (i = this.spTree.length - 1; i > -1; --i) {
            if (this.spTree[i].getObjectType() === historyitem_type_GroupShape) {
                this.spTree[i].bringForward();
            } else {
                if (i < this.spTree.length - 1 && this.spTree[i].selected && !this.spTree[i + 1].selected) {
                    var item = this.removeFromSpTreeByPos(i);
                    this.addToSpTree(i + 1, item);
                }
            }
        }
    },
    sendToBack: function () {
        var i, arrDrawings = [];
        for (i = this.spTree.length - 1; i > -1; --i) {
            if (this.spTree[i].getObjectType() === historyitem_type_GroupShape) {
                this.spTree[i].sendToBack();
            } else {
                if (this.spTree[i].selected) {
                    arrDrawings.push(this.removeFromSpTreeByPos(i));
                }
            }
        }
        arrDrawings.reverse();
        for (i = 0; i < arrDrawings.length; ++i) {
            this.addToSpTree(i, arrDrawings[i]);
        }
    },
    bringBackward: function () {
        var i;
        for (i = 0; i < this.spTree.length; ++i) {
            if (this.spTree[i].getObjectType() === historyitem_type_GroupShape) {
                this.spTree[i].bringBackward();
            } else {
                if (i > 0 && this.spTree[i].selected && !this.spTree[i - 1].selected) {
                    this.addToSpTree(i - 1, this.removeFromSpTreeByPos(i));
                }
            }
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_AutoShapes_RemoveFromDrawingObjects:
            addToDrawings(this.worksheet, this, data.Pos);
            break;
        case historyitem_AutoShapes_AddToDrawingObjects:
            deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
            break;
        case historyitem_AutoShapes_SetWorksheet:
            this.worksheet = data.oldPr;
            break;
        case historyitem_ShapeSetBDeleted:
            this.bDeleted = data.oldPr;
            break;
        case historyitem_GroupShapeSetSpPr:
            this.spPr = data.oldPr;
            break;
        case historyitem_GroupShapeAddToSpTree:
            for (var i = this.spTree.length - 1; i > -1; --i) {
                if (this.spTree[i] === data.item) {
                    this.spTree.splice(i, 1);
                    break;
                }
            }
            this.handleUpdateSpTree();
            break;
        case historyitem_GroupShapeSetGroup:
            this.group = data.oldPr;
            break;
        case historyitem_GroupShapeSetNvGrpSpPr:
            this.nvGrpSpPr = data.oldPr;
            break;
        case historyitem_GroupShapeSetParent:
            this.parent = data.oldPr;
            break;
        case historyitem_GroupShapeRemoveFromSpTree:
            this.spTree.splice(data.pos, 0, data.item);
            this.handleUpdateSpTree();
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_AutoShapes_RemoveFromDrawingObjects:
            deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
            break;
        case historyitem_AutoShapes_AddToDrawingObjects:
            addToDrawings(this.worksheet, this, data.Pos);
            break;
        case historyitem_AutoShapes_SetWorksheet:
            this.worksheet = data.newPr;
            break;
        case historyitem_ShapeSetBDeleted:
            this.bDeleted = data.newPr;
            break;
        case historyitem_GroupShapeSetSpPr:
            this.spPr = data.newPr;
            break;
        case historyitem_GroupShapeAddToSpTree:
            this.spTree.splice(data.pos, 0, data.item);
            this.handleUpdateSpTree();
            break;
        case historyitem_GroupShapeSetGroup:
            this.group = data.newPr;
            break;
        case historyitem_GroupShapeSetNvGrpSpPr:
            this.nvGrpSpPr = data.newPr;
            break;
        case historyitem_GroupShapeSetParent:
            this.parent = data.newPr;
            break;
        case historyitem_GroupShapeRemoveFromSpTree:
            for (var i = this.spTree.length; i > -1; --i) {
                if (this.spTree[i] === data.item) {
                    this.spTree.splice(i, 1);
                    this.handleUpdateSpTree();
                    break;
                }
            }
            break;
        }
    },
    Refresh_RecalcData: function () {},
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_AutoShapes_SetDrawingBaseCoors:
            writeDouble(w, data.fromCol);
            writeDouble(w, data.fromColOff);
            writeDouble(w, data.fromRow);
            writeDouble(w, data.fromRowOff);
            writeDouble(w, data.toCol);
            writeDouble(w, data.toColOff);
            writeDouble(w, data.toRow);
            writeDouble(w, data.toRowOff);
            writeDouble(w, data.posX);
            writeDouble(w, data.posY);
            writeDouble(w, data.cx);
            writeDouble(w, data.cy);
            break;
        case historyitem_AutoShapes_RemoveFromDrawingObjects:
            break;
        case historyitem_AutoShapes_AddToDrawingObjects:
            var Pos = data.UseArray ? data.PosArray[0] : data.Pos;
            writeLong(w, Pos);
            break;
        case historyitem_AutoShapes_SetWorksheet:
            writeBool(w, isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                writeString(w, data.newPr.getId());
            }
            break;
        case historyitem_GroupShapeAddToSpTree:
            case historyitem_GroupShapeRemoveFromSpTree:
            writeLong(w, data.pos);
            writeObject(w, data.item);
            break;
        case historyitem_GroupShapeSetGroup:
            case historyitem_GroupShapeSetNvGrpSpPr:
            case historyitem_GroupShapeSetParent:
            case historyitem_GroupShapeSetSpPr:
            writeObject(w, data.newPr);
            break;
        case historyitem_ShapeSetBDeleted:
            writeBool(w, data.newPr);
            break;
        }
    },
    Load_Changes: function (r) {
        var type = r.GetLong();
        switch (type) {
        case historyitem_AutoShapes_SetDrawingBaseCoors:
            if (this.drawingBase) {
                this.drawingBase.from.col = readDouble(r);
                this.drawingBase.from.colOff = readDouble(r);
                this.drawingBase.from.row = readDouble(r);
                this.drawingBase.from.rowOff = readDouble(r);
                this.drawingBase.to.col = readDouble(r);
                this.drawingBase.to.colOff = readDouble(r);
                this.drawingBase.to.row = readDouble(r);
                this.drawingBase.to.rowOff = readDouble(r);
                this.drawingBase.Pos.X = readDouble(r);
                this.drawingBase.Pos.Y = readDouble(r);
                this.drawingBase.ext.cx = readDouble(r);
                this.drawingBase.ext.cy = readDouble(r);
            }
            break;
        case historyitem_AutoShapes_RemoveFromDrawingObjects:
            deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
            break;
        case historyitem_AutoShapes_AddToDrawingObjects:
            var pos = readLong(r);
            if (this.worksheet) {
                pos = this.worksheet.contentChanges.Check(contentchanges_Add, pos);
            }
            addToDrawings(this.worksheet, this, pos);
            break;
        case historyitem_AutoShapes_SetWorksheet:
            ReadWBModel(this, r);
            break;
        case historyitem_ShapeSetBDeleted:
            this.bDeleted = readBool(r);
            break;
        case historyitem_GroupShapeAddToSpTree:
            var pos = readLong(r);
            var item = readObject(r);
            if (isRealObject(item) && isRealNumber(pos)) {
                this.spTree.splice(pos, 0, item);
            }
            this.handleUpdateSpTree();
            break;
        case historyitem_GroupShapeSetGroup:
            this.group = readObject(r);
            break;
        case historyitem_GroupShapeSetNvGrpSpPr:
            this.nvGrpSpPr = readObject(r);
            break;
        case historyitem_GroupShapeSetParent:
            this.parent = readObject(r);
            break;
        case historyitem_GroupShapeRemoveFromSpTree:
            var pos = readLong(r);
            var item = readObject(r);
            if (isRealNumber(pos) && isRealObject(item)) {
                if (this.spTree[pos] === item) {
                    this.spTree.splice(pos, 1);
                    this.handleUpdateSpTree();
                }
            }
            break;
        case historyitem_GroupShapeSetSpPr:
            this.spPr = readObject(r);
            break;
        }
    }
};
function normalizeRotate(rot) {
    var new_rot = rot;
    if (isRealNumber(new_rot)) {
        while (new_rot >= 2 * Math.PI) {
            new_rot -= 2 * Math.PI;
        }
        while (new_rot < 0) {
            new_rot += 2 * Math.PI;
        }
        return new_rot;
    }
    return new_rot;
}