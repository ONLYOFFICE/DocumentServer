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
 function CImageShape(parent) {
    this.group = null;
    this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
    this.spLocks = null;
    this.useBgFill = null;
    this.nvSpPr = null;
    this.spPr = new CSpPr();
    this.blipFill = null;
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
    this.selected = false;
    this.recalcInfo = {
        recalculateBrush: true,
        recalculatePen: true,
        recalculateTransform: true,
        recalculateCursorTypes: true,
        recalculateGeometry: true,
        recalculateStyle: true,
        recalculateFill: true,
        recalculateLine: true,
        recalculateShapeHierarchy: true,
        recalculateTransparent: true,
        recalculateGroupHierarchy: true
    };
    this.groupHierarchy = [];
    this.compiledStyle = null;
    this.compiledTransparent = null;
    this.compiledHierarchy = [];
    this.compiledStyles = [];
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    if (isRealObject(parent)) {
        this.setParent(parent);
        var nv_sp_pr = new UniNvPr();
        nv_sp_pr.cNvPr.id = ++parent.maxId;
        this.setNvSpPr(nv_sp_pr);
    }
}
CImageShape.prototype = {
    copy: function (sp) {
        if (! (sp instanceof CImageShape)) {
            sp = new CImageShape();
        }
        if (this.blipFill) {
            sp.setBlipFill(this.blipFill.createDuplicate());
        }
        sp.setSpPr(this.spPr.createDuplicate());
        if (this.nvPicPr) {
            sp.setNvSpPr(this.nvPicPr.createDuplicate());
        }
        return sp;
    },
    getImageUrl: function () {
        if (isRealObject(this.blipFill) && isRealObject(this.blipFill.fill)) {
            return this.blipFill.fill.RasterImageId;
        }
        return null;
    },
    getSearchResults: function () {
        return null;
    },
    isSimpleObject: function () {
        return true;
    },
    recalcAllColors: function () {},
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
        var r = isRealNumber(this.rot) ? this.rot : 0;
        if ((r >= 0 && r < Math.PI * 0.25) || (r > 3 * Math.PI * 0.25 && r < 5 * Math.PI * 0.25) || (r > 7 * Math.PI * 0.25 && r < 2 * Math.PI)) {
            return {
                minX: this.x,
                minY: this.y,
                maxX: this.x + this.extX,
                maxY: this.y + this.extY
            };
        } else {
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
    recalcAll: function () {
        this.recalcInfo = {
            recalculateBrush: true,
            recalculatePen: true,
            recalculateTransform: true,
            recalculateCursorTypes: true,
            recalculateGeometry: true,
            recalculateStyle: true,
            recalculateFill: true,
            recalculateLine: true,
            recalculateShapeHierarchy: true,
            recalculateTransparent: true,
            recalculateGroupHierarchy: true
        };
    },
    isPlaceholder: function () {
        return this.nvPicPr != null && this.nvPicPr.nvPr != undefined && this.nvPicPr.nvPr.ph != undefined;
    },
    isEmptyPlaceholder: function () {
        return false;
    },
    Get_Id: function () {
        return this.Id;
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
    hitToAdj: function (x, y) {
        return {
            hit: false,
            num: -1,
            polar: false
        };
    },
    hitToPath: function (x, y) {
        if (isRealObject(this.spPr.geometry)) {
            var px = this.invertTransform.TransformPointX(x, y);
            var py = this.invertTransform.TransformPointY(x, y);
            return this.spPr.geometry.hitInPath(this.getParentObjects().presentation.DrawingDocument.CanvasHitContext, px, py);
        }
        return false;
    },
    hitInPath: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInPath(this.getParentObjects().presentation.DrawingDocument.CanvasHitContext, x_t, y_t);
        }
        return false;
    },
    hitInInnerArea: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInInnerArea(this.getParentObjects().presentation.DrawingDocument.CanvasHitContext, x_t, y_t);
        }
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },
    changeSize: function (kw, kh) {
        if (this.spPr.xfrm.isNotNull()) {
            var xfrm = this.spPr.xfrm;
            this.setOffset(xfrm.offX * kw, xfrm.offY * kh);
            this.setExtents(xfrm.extX * kw, xfrm.extY * kh);
        }
    },
    getRotateAngle: function (x, y) {
        var transform = this.getTransformMatrix();
        var rotate_distance = this.getParentObjects().presentation.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
        var hc = this.extX * 0.5;
        var vc = this.extY * 0.5;
        var xc_t = transform.TransformPointX(hc, vc);
        var yc_t = transform.TransformPointY(hc, vc);
        var rot_x_t = transform.TransformPointX(hc, -rotate_distance);
        var rot_y_t = transform.TransformPointY(hc, -rotate_distance);
        var invert_transform = this.getInvertTransform();
        var rel_x = invert_transform.TransformPointX(x, y);
        var v1_x, v1_y, v2_x, v2_y;
        v1_x = x - xc_t;
        v1_y = y - yc_t;
        v2_x = rot_x_t - xc_t;
        v2_y = rot_y_t - yc_t;
        var flip_h = this.getFullFlipH();
        var flip_v = this.getFullFlipV();
        var same_flip = flip_h && flip_v || !flip_h && !flip_v;
        var angle = rel_x > this.extX * 0.5 ? Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y) : -Math.atan2(Math.abs(v1_x * v2_y - v1_y * v2_x), v1_x * v2_x + v1_y * v2_y);
        return same_flip ? angle : -angle;
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
    getImageProps: function () {
        var _result_image_props = {};
        _result_image_props.Width = this.extX;
        _result_image_props.Height = this.extY;
        _result_image_props.Position = {
            X: this.x,
            Y: this.y
        };
        _result_image_props.Paddings = {
            Left: this.x,
            Top: this.y,
            Right: this.x + this.extX,
            Bottom: this.y + this.extY
        };
        if (this.blipFill && this.blipFill.fill && this.blipFill.fill.RasterImageId) {
            _result_image_props.ImageUrl = this.blipFill.fill.RasterImageId;
        }
        if (!isRealObject(this.group)) {
            _result_image_props.IsLocked = !(this.Lock.Type === locktype_None || this.Lock.Type === locktype_Mine);
        }
        return _result_image_props;
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
    hitToBoundsRect: function (x, y) {
        return false;
    },
    getType: function () {
        return DRAWING_OBJECT_TYPE_IMAGE;
    },
    getBase64Img: function () {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },
    recalculateBrush: function () {
        this.brush = this.blipFill;
    },
    recalculatePen: function () {},
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
            var b_is_single_body = this.getIsSingleBody();
            switch (this.parent.kind) {
            case SLIDE_KIND:
                var placeholder = this.parent.Layout.getMatchingShape(ph_type, ph_index, b_is_single_body);
                if (placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull()) {
                    return true;
                }
                placeholder = this.parent.Layout.Master.getMatchingShape(ph_type, ph_index, b_is_single_body);
                return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull();
            case LAYOUT_KIND:
                var placeholder = this.parent.Master.getMatchingShape(ph_type, ph_index, b_is_single_body);
                return placeholder && placeholder.spPr && placeholder.spPr.xfrm && placeholder.spPr.xfrm.isNotNull();
            }
        }
        return false;
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
    Refresh_RecalcData: function () {},
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
    recalculateCursorTypes: function () {
        var transform_matrix = this.getTransformMatrix();
        var transform = this.getTransform();
        var hc = transform.extX * 0.5;
        var vc = transform.extY * 0.5;
        var xc = transform_matrix.TransformPointX(hc, vc);
        var yc = transform_matrix.TransformPointY(hc, vc);
        var xt = transform_matrix.TransformPointX(hc, 0);
        var yt = transform_matrix.TransformPointY(hc, 0);
        var vx = xt - xc;
        var vy = yc - yt;
        var angle = Math.atan2(vy, vx) + Math.PI / 8;
        while (angle < 0) {
            angle += 2 * Math.PI;
        }
        while (angle >= 2 * Math.PI) {
            angle -= 2 * Math.PI;
        }
        var xlt = transform_matrix.TransformPointX(0, 0);
        var ylt = transform_matrix.TransformPointY(0, 0);
        var vx_lt = xlt - xc;
        var vy_lt = yc - ylt;
        var _index = Math.floor(angle / (Math.PI / 4));
        var _index2, t;
        if (vx_lt * vy - vx * vy_lt < 0) {
            for (var i = 0; i < 8; ++i) {
                t = i - _index + 17;
                _index2 = t - ((t / 8) >> 0) * 8;
                this.cursorTypes[i] = DEFAULT_CURSOR_TYPES[_index2];
            }
        } else {
            for (i = 0; i < 8; ++i) {
                t = -i - _index + 19;
                _index2 = t - ((t / 8) >> 0) * 8;
                this.cursorTypes[i] = DEFAULT_CURSOR_TYPES[_index2];
            }
        }
        this.recalcInfo.recalculateCursorTypes = false;
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
    recalculate: function () {
        if (this.recalcInfo.recalculateBrush) {
            this.recalculateBrush();
            this.recalcInfo.recalculateBrush = false;
        }
        if (this.recalcInfo.recalculatePen) {
            this.recalculatePen();
            this.recalcInfo.recalculatePen = false;
        }
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        if (this.recalcInfo.recalculateCursorTypes) {
            this.recalculateCursorTypes();
            this.recalcInfo.recalculateCursorTypes = false;
        }
        if (this.recalcInfo.recalculateGeometry) {
            this.recalculateGeometry();
            this.recalcInfo.recalculateGeometry = false;
        }
    },
    setGeometry: function (geometry) {
        var old_geometry = this.spPr.geometry;
        var new_geometry = geometry;
        this.spPr.geometry = geometry;
        History.Add(this, {
            Type: historyitem_SetShapeSetGeometry,
            oldGeometry: old_geometry,
            newGeometry: new_geometry
        });
        this.recalcInfo.recalculateGeometry = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    draw: function (graphics) {
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
        var rotate_distance = this.getParentObjects().presentation.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y * dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 8;
        }
        return -1;
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
    hitInBoundingRect: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        var _hit_context = this.getParentObjects().presentation.DrawingDocument.CanvasHitContext;
        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) || HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY) || HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY) || HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0));
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
    setNvSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_SetSetNvSpPr,
            oldPr: this.nvPicPr,
            newPr: pr
        });
        this.nvPicPr = pr;
        if (this.parent && pr && pr.cNvPr && isRealNumber(pr.cNvPr.id)) {
            if (pr.cNvPr.id > this.parent.maxId) {
                this.parent.maxId = pr.cNvPr.id + 1;
            }
        }
    },
    setSpPr: function (spPr) {
        History.Add(this, {
            Type: historyitem_SetSetSpPr,
            oldPr: this.spPr,
            newPr: spPr
        });
        this.spPr = spPr;
    },
    setStyle: function (style) {
        History.Add(this, {
            Type: historyitem_SetSetStyle,
            oldPr: this.style,
            newPr: style
        });
        this.style = style;
    },
    setBlipFill: function (blipFill) {
        History.Add(this, {
            Type: historyitem_SetBlipFill,
            oldPr: this.blipFill,
            newPr: blipFill
        });
        this.blipFill = blipFill;
        this.recalcInfo.recalculateBrush = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setGroup: function (group) {
        History.Add(this, {
            Type: historyitem_SetSpGroup,
            oldPr: this.group,
            newPr: group
        });
        this.group = group;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setParent: function (parent) {
        History.Add(this, {
            Type: historyitem_SetShapeParent,
            Old: this.parent,
            New: parent
        });
        this.parent = parent;
    },
    getAllImages: function (images) {
        if (this.blipFill && this.blipFill.fill instanceof CBlipFill && typeof this.blipFill.fill.RasterImageId === "string") {
            images[_getFullImageSrc(this.blipFill.fill.RasterImageId)] = true;
        }
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetShapeSetGeometry:
            if (isRealObject(data.oldGeometry)) {
                this.spPr.geometry = data.oldGeometry.createDuplicate();
                this.spPr.geometry.Init(5, 5);
            } else {
                this.spPr.geometry = null;
            }
            this.recalcInfo.recalculateGeometry = true;
            break;
        case historyitem_SetShapeRot:
            this.spPr.xfrm.rot = data.oldRot;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
            this.recalcInfo.recalculateGeometry = true;
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
            this.recalcInfo.recalculateGeometry = true;
            break;
        case historyitem_SetSetNvSpPr:
            this.nvPicPr = data.oldPr;
            break;
        case historyitem_SetSetSpPr:
            this.spPr = data.oldPr;
            this.recalcAll();
            break;
        case historyitem_SetSetStyle:
            this.style = data.oldPr;
            this.recalcAll();
            break;
        case historyitem_SetBlipFill:
            this.blipFill = data.oldPr;
            this.recalcInfo.recalculateBrush = true;
            break;
        case historyitem_SetSpGroup:
            this.group = data.oldPr;
            this.recalcAll();
            break;
        case historyitem_SetShapeParent:
            this.parent = data.New;
            break;
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SetShapeSetGeometry:
            if (isRealObject(data.newGeometry)) {
                this.spPr.geometry = data.newGeometry.createDuplicate();
                this.spPr.geometry.Init(5, 5);
            } else {
                this.spPr.geometry = null;
            }
            this.recalcInfo.recalculateGeometry = true;
            break;
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
        case historyitem_SetSetNvSpPr:
            this.nvPicPr = data.newPr;
            break;
        case historyitem_SetSetSpPr:
            this.spPr = data.newPr;
            this.recalcAll();
            break;
        case historyitem_SetSetStyle:
            this.style = data.newPr;
            this.recalcAll();
            break;
        case historyitem_SetBlipFill:
            this.blipFill = data.newPr;
            this.recalcInfo.recalculateBrush = true;
            break;
        case historyitem_SetSpGroup:
            this.group = data.newPr;
            this.recalcAll();
            break;
        case historyitem_SetShapeParent:
            this.parent = data.New;
            break;
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_Shape);
        w.WriteLong(data.Type);
        var bool;
        switch (data.Type) {
        case historyitem_SetShapeSetGeometry:
            w.WriteBool(isRealObject(data.newGeometry));
            if (isRealObject(data.newGeometry)) {
                data.newGeometry.Write_ToBinary2(w);
            }
            break;
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
        case historyitem_SetSetNvSpPr:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetSetSpPr:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetSetStyle:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetBlipFill:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
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
        }
    },
    Load_Changes: function (r) {
        if (r.GetLong() === historyitem_type_Shape) {
            switch (r.GetLong()) {
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
            case historyitem_SetSetNvSpPr:
                if (r.GetBool()) {
                    this.nvPicPr = new UniNvPr();
                    this.nvPicPr.Read_FromBinary2(r);
                } else {
                    this.nvPicPr = null;
                }
                break;
            case historyitem_SetSetSpPr:
                this.spPr = new CSpPr();
                if (r.GetBool()) {
                    this.spPr.Read_FromBinary2(r);
                }
                this.recalcAll();
                break;
            case historyitem_SetSetStyle:
                if (r.GetBool()) {
                    this.style = new CShapeStyle();
                    this.style.Read_FromBinary2(r);
                } else {
                    this.style = null;
                }
                this.recalcAll();
                break;
            case historyitem_SetBlipFill:
                if (r.GetBool()) {
                    this.blipFill = new CUniFill();
                    this.blipFill.Read_FromBinary2(r);
                    if (this.blipFill && this.blipFill.fill && typeof this.blipFill.fill.RasterImageId === "string") {
                        CollaborativeEditing.Add_NewImage(this.blipFill.fill.RasterImageId);
                    }
                } else {
                    this.blipFill = null;
                }
                this.recalcAll();
                break;
            case historyitem_SetSpGroup:
                if (r.GetBool()) {
                    this.group = g_oTableId.Get_ById(r.GetString2());
                } else {
                    this.group = null;
                }
                this.recalcAll();
                break;
            case historyitem_SetShapeParent:
                if (r.GetBool()) {
                    this.parent = g_oTableId.Get_ById(r.GetString2());
                }
                break;
            }
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_Image);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Load_LinkData: function (linkData) {}
};