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
function CImageShape() {
    this.nvPicPr = null;
    this.spPr = new CSpPr();
    this.blipFill = null;
    this.style = null;
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
    this.invertTransform = null;
    this.cursorTypes = [];
    this.brush = null;
    this.pen = null;
    this.bDeleted = true;
    this.selected = false;
    this.snapArrayX = [];
    this.snapArrayY = [];
    this.setRecalculateInfo();
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
}
CImageShape.prototype = {
    Get_Id: function () {
        return this.Id;
    },
    getObjectType: function () {
        return historyitem_type_ImageShape;
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(this.getObjectType());
        w.WriteString2(this.Get_Id());
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    setBDeleted: function (pr) {
        History.Add(this, {
            Type: historyitem_ShapeSetBDeleted,
            oldPr: this.bDeleted,
            newPr: pr
        });
        this.bDeleted = pr;
    },
    setNvPicPr: function (pr) {
        History.Add(this, {
            Type: historyitem_ImageShapeSetNvPicPr,
            oldPr: this.nvPicPr,
            newPr: pr
        });
        this.nvPicPr = pr;
    },
    setSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_ImageShapeSetSpPr,
            oldPr: this.spPr,
            newPr: pr
        });
        this.spPr = pr;
    },
    setBlipFill: function (pr) {
        History.Add(this, {
            Type: historyitem_ImageShapeSetBlipFill,
            oldPr: this.blipFill,
            newPr: pr
        });
        this.blipFill = pr;
    },
    setParent: function (pr) {
        History.Add(this, {
            Type: historyitem_ImageShapeSetParent,
            oldPr: this.parent,
            newPr: pr
        });
        this.parent = pr;
    },
    setGroup: function (pr) {
        History.Add(this, {
            Type: historyitem_ImageShapeSetGroup,
            oldPr: this.group,
            newPr: pr
        });
        this.group = pr;
    },
    setStyle: function (pr) {
        History.Add(this, {
            Type: historyitem_ImageShapeSetStyle,
            oldPr: this.style,
            newPr: pr
        });
        this.style = pr;
    },
    copy: function () {
        var copy = new CImageShape();
        if (this.nvPicPr) {
            copy.setNvPicPr(this.nvPicPr.createDuplicate());
        }
        if (this.spPr) {
            copy.setSpPr(this.spPr.createDuplicate());
            copy.spPr.setParent(copy);
        }
        if (this.blipFill) {
            copy.setBlipFill(this.blipFill.createDuplicate());
        }
        if (this.style) {
            copy.setStyle(this.style.createDuplicate());
        }
        copy.setBDeleted(this.bDeleted);
        copy.cachedImage = this.getBase64Img();
        return copy;
    },
    getImageUrl: function () {
        if (isRealObject(this.blipFill)) {
            return this.blipFill.RasterImageId;
        }
        return null;
    },
    isSimpleObject: function () {
        return true;
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
    getBoundsInGroup: function () {
        return getBoundsInGroup(this);
    },
    normalize: CShape.prototype.normalize,
    checkHitToBounds: CShape.prototype.checkHitToBounds,
    calculateSnapArrays: CShape.prototype.calculateSnapArrays,
    checkDrawingBaseCoords: CShape.prototype.checkDrawingBaseCoords,
    setDrawingBaseCoords: CShape.prototype.setDrawingBaseCoords,
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
    isPlaceholder: function () {
        return this.nvPicPr != null && this.nvPicPr.nvPr != undefined && this.nvPicPr.nvPr.ph != undefined;
    },
    isEmptyPlaceholder: function () {
        return false;
    },
    isShape: function () {
        return false;
    },
    isImage: function () {
        return true;
    },
    isChart: function () {
        return false;
    },
    isGroup: function () {
        return false;
    },
    hitToAdj: function (x, y) {
        return {
            hit: false,
            num: -1,
            polar: false
        };
    },
    getParentObjects: CShape.prototype.getParentObjects,
    hitInPath: CShape.prototype.hitInPath,
    hitInInnerArea: CShape.prototype.hitInInnerArea,
    getRotateAngle: CShape.prototype.getRotateAngle,
    changeSize: CShape.prototype.changeSize,
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
    getAspect: function (num) {
        var _tmp_x = this.extX != 0 ? this.extX : 0.1;
        var _tmp_y = this.extY != 0 ? this.extY : 0.1;
        return num === 0 || num === 4 ? _tmp_x / _tmp_y : _tmp_y / _tmp_x;
    },
    getFullRotate: function () {
        return !isRealObject(this.group) ? this.rot : this.rot + this.group.getFullRotate();
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
    canRotate: function () {
        return true;
    },
    canResize: function () {
        return true;
    },
    canMove: function () {
        return true;
    },
    canGroup: function () {
        return true;
    },
    canChangeAdjustments: function () {
        return true;
    },
    createRotateTrack: function () {
        return new RotateTrackShapeImage(this);
    },
    createResizeTrack: function (cardDirection) {
        return new ResizeTrackShapeImage(this, cardDirection);
    },
    createMoveTrack: function () {
        return new MoveShapeImageTrack(this);
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
    getInvertTransform: function () {
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = true;
        }
        return this.invertTransform;
    },
    hitInTextRect: function (x, y) {
        return false;
    },
    getBase64Img: CShape.prototype.getBase64Img,
    convertToWord: function (document) {
        this.setBDeleted(true);
        var oCopy = this.copy();
        oCopy.setBDeleted(false);
        return oCopy;
    },
    convertToPPTX: function (drawingDocument, worksheet) {
        var ret = this.copy();
        ret.setWorksheet(worksheet);
        ret.setParent(null);
        ret.setBDeleted(false);
        return ret;
    },
    recalculateBrush: function () {
        var is_on = History.Is_On();
        if (is_on) {
            History.TurnOff();
        }
        this.brush = new CUniFill();
        this.brush.setFill(this.blipFill);
        if (is_on) {
            History.TurnOn();
        }
    },
    recalculatePen: function () {},
    getAllRasterImages: function (images) {
        this.blipFill && typeof this.blipFill.RasterImageId === "string" && this.blipFill.RasterImageId.length > 0 && images.push(this.blipFill.RasterImageId);
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
            this.recalcInfo.recalculateShapeHierarchy = true;
        }
        return this.compiledHierarchy;
    },
    recalculateTransform: function () {
        this.cachedImage = null;
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
    Refresh_RecalcData: function (data) {
        switch (data.Type) {
        case historyitem_ImageShapeSetBlipFill:
            this.recalcBrush();
            this.recalcFill();
            this.addToRecalculate();
            break;
        }
    },
    recalculateGeometry: function () {
        if (isRealObject(this.spPr.geometry)) {
            var transform = this.getTransform();
            this.spPr.geometry.Recalculate(transform.extX, transform.extY);
        }
    },
    getTransformMatrix: function () {
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.transform;
    },
    getTransform: function () {
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return {
            x: this.x,
            y: this.y,
            extX: this.extX,
            extY: this.extY,
            rot: this.rot,
            flipH: this.flipH,
            flipV: this.flipV
        };
    },
    draw: function (graphics, transform) {
        if (graphics.updatedRect) {
            var rect = graphics.updatedRect;
            var bounds = this.bounds;
            if (bounds.x > rect.x + rect.w || bounds.y > rect.y + rect.h || bounds.x + bounds.w < rect.x || bounds.y + bounds.h < rect.y) {
                return;
            }
        }
        var _transform = transform ? transform : this.transform;
        graphics.SetIntegerGrid(false);
        graphics.transform3(_transform, false);
        var shape_drawer = new CShapeDrawer();
        shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
        shape_drawer.draw(this.spPr.geometry);
        if (locktype_None != this.Lock.Get_Type() && !this.group) {
            graphics.DrawLockObjectRect(this.Lock.Get_Type(), 0, 0, this.extX, this.extY);
        }
        graphics.reset();
        graphics.SetIntegerGrid(true);
    },
    select: CShape.prototype.select,
    recalculateLocalTransform: CShape.prototype.recalculateLocalTransform,
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
    getMainGroup: function () {
        if (!isRealObject(this.group)) {
            return null;
        }
        var cur_group = this.group;
        while (isRealObject(cur_group.group)) {
            cur_group = cur_group.group;
        }
        return cur_group;
    },
    drawAdjustments: function (drawingDocument) {},
    hitToAdjustment: function () {
        return {
            hit: false
        };
    },
    getPlaceholderType: function () {
        return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.type : null;
    },
    getPlaceholderIndex: function () {
        return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.idx : null;
    },
    getPhType: function () {
        return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.type : null;
    },
    getPhIndex: function () {
        return this.isPlaceholder() ? this.nvPicPr.nvPr.ph.idx : null;
    },
    setNvSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_ImageShapeSetNvPicPr,
            oldPr: this.nvPicPr,
            newPr: pr
        });
        this.nvPicPr = pr;
    },
    getAllImages: function (images) {
        if (this.blipFill instanceof CBlipFill && typeof this.blipFill.RasterImageId === "string") {
            images[_getFullImageSrc(this.blipFill.RasterImageId)] = true;
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
        case historyitem_ImageShapeSetNvPicPr:
            this.nvPicPr = data.oldPr;
            break;
        case historyitem_ImageShapeSetSpPr:
            this.spPr = data.oldPr;
            break;
        case historyitem_ImageShapeSetBlipFill:
            this.blipFill = data.oldPr;
            break;
        case historyitem_ImageShapeSetParent:
            this.parent = data.oldPr;
            break;
        case historyitem_ImageShapeSetGroup:
            this.group = data.oldPr;
            break;
        case historyitem_ImageShapeSetStyle:
            this.style = data.oldPr;
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
        case historyitem_ImageShapeSetNvPicPr:
            this.nvPicPr = data.newPr;
            break;
        case historyitem_ImageShapeSetSpPr:
            this.spPr = data.newPr;
            break;
        case historyitem_ImageShapeSetBlipFill:
            this.blipFill = data.newPr;
            break;
        case historyitem_ImageShapeSetParent:
            this.parent = data.newPr;
            break;
        case historyitem_ImageShapeSetGroup:
            this.group = data.newPr;
            break;
        case historyitem_ImageShapeSetStyle:
            this.style = data.newPr;
            break;
        }
    },
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
        case historyitem_ImageShapeSetNvPicPr:
            case historyitem_ImageShapeSetSpPr:
            case historyitem_ImageShapeSetParent:
            case historyitem_ImageShapeSetGroup:
            case historyitem_ImageShapeSetStyle:
            writeObject(w, data.newPr);
            break;
        case historyitem_ShapeSetBDeleted:
            writeBool(w, data.newPr);
            break;
        case historyitem_ImageShapeSetBlipFill:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary(w);
            }
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
        case historyitem_ImageShapeSetNvPicPr:
            this.nvPicPr = readObject(r);
            break;
        case historyitem_ImageShapeSetSpPr:
            this.spPr = readObject(r);
            break;
        case historyitem_ImageShapeSetBlipFill:
            if (r.GetBool()) {
                this.blipFill = new CBlipFill();
                r.GetLong();
                this.blipFill.Read_FromBinary(r);
                if (typeof CollaborativeEditing !== "undefined") {
                    if (typeof this.blipFill.RasterImageId === "string" && this.blipFill.RasterImageId.length > 0) {
                        var full_image_src_func;
                        if ((!editor || !editor.isDocumentEditor && !editor.isPresentationEditor) && typeof getFullImageSrc === "function") {
                            full_image_src_func = getFullImageSrc;
                        } else {
                            if (typeof _getFullImageSrc === "function") {
                                full_image_src_func = _getFullImageSrc;
                            }
                        }
                        if (full_image_src_func) {
                            CollaborativeEditing.Add_NewImage(full_image_src_func(this.blipFill.RasterImageId));
                        }
                    }
                }
            } else {
                this.blipFill = null;
            }
            this.handleUpdateFill();
            break;
        case historyitem_ImageShapeSetParent:
            this.parent = readObject(r);
            break;
        case historyitem_ImageShapeSetGroup:
            this.group = readObject(r);
            break;
        case historyitem_ImageShapeSetStyle:
            this.style = readObject(r);
            break;
        }
    },
    Load_LinkData: function (linkData) {}
};