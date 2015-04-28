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
function MoveShapeImageTrack(originalObject) {
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.x = null;
    this.y = null;
    this.pageIndex = null;
    this.originalShape = originalObject;
    if (!originalObject.isChart()) {
        this.brush = originalObject.brush;
        this.pen = originalObject.pen;
    } else {
        var pen_brush = CreatePenBrushForChartTrack();
        this.brush = pen_brush.brush;
        this.pen = pen_brush.pen;
    }
    this.overlayObject = new OverlayObject(!(this.originalObject.getObjectType() === historyitem_type_ChartSpace) && this.originalObject.spPr && this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.brush, this.pen, this.transform);
    this.groupInvertMatrix = null;
    if (this.originalObject.group) {
        this.groupInvertMatrix = this.originalObject.group.invertTransform.CreateDublicate();
        this.groupInvertMatrix.tx = 0;
        this.groupInvertMatrix.ty = 0;
    }
    this.getOriginalBoundsRect = function () {
        return this.originalObject.getRectBounds();
    };
    this.track = function (dx, dy, pageIndex) {
        var original = this.originalObject;
        var dx2, dy2;
        if (this.groupInvertMatrix) {
            dx2 = this.groupInvertMatrix.TransformPointX(dx, dy);
            dy2 = this.groupInvertMatrix.TransformPointY(dx, dy);
        } else {
            dx2 = dx;
            dy2 = dy;
        }
        this.x = original.x + dx2;
        this.y = original.y + dy2;
        this.transform.Reset();
        var hc = original.extX * 0.5;
        var vc = original.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if (original.flipH) {
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        }
        if (original.flipV) {
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(this.transform, -original.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        if (this.originalObject.group) {
            global_MatrixTransformer.MultiplyAppend(this.transform, this.originalObject.group.transform);
        }
        if (isRealNumber(pageIndex)) {
            this.pageIndex = pageIndex;
        }
    };
    this.draw = function (overlay) {
        if (isRealNumber(this.pageIndex) && overlay.SetCurrentPage) {
            overlay.SetCurrentPage(this.pageIndex);
        }
        this.overlayObject.draw(overlay);
    };
    this.trackEnd = function (bWord) {
        if (bWord) {
            if (this.originalObject.selectStartPage !== this.pageIndex) {
                this.originalObject.selectStartPage = this.pageIndex;
            }
        }
        var scale_coefficients, ch_off_x, ch_off_y;
        CheckSpPrXfrm(this.originalObject);
        if (this.originalObject.group) {
            scale_coefficients = this.originalObject.group.getResultScaleCoefficients();
            ch_off_x = this.originalObject.group.spPr.xfrm.chOffX;
            ch_off_y = this.originalObject.group.spPr.xfrm.chOffY;
        } else {
            if (bWord) {
                if (this.originalObject.spPr.xfrm.offX === 0 && this.originalObject.spPr.xfrm.offY === 0) {
                    return;
                }
            }
            scale_coefficients = {
                cx: 1,
                cy: 1
            };
            ch_off_x = 0;
            ch_off_y = 0;
            if (bWord) {
                this.x = 0;
                this.y = 0;
            }
        }
        this.originalObject.spPr.xfrm.setOffX(this.x / scale_coefficients.cx + ch_off_x);
        this.originalObject.spPr.xfrm.setOffY(this.y / scale_coefficients.cy + ch_off_y);
        this.originalObject.checkDrawingBaseCoords();
    };
}
MoveShapeImageTrack.prototype.getBounds = function () {
    var boundsChecker = new CSlideBoundsChecker();
    this.draw(boundsChecker);
    var tr = this.transform;
    var arr_p_x = [];
    var arr_p_y = [];
    arr_p_x.push(tr.TransformPointX(0, 0));
    arr_p_y.push(tr.TransformPointY(0, 0));
    arr_p_x.push(tr.TransformPointX(this.originalObject.extX, 0));
    arr_p_y.push(tr.TransformPointY(this.originalObject.extX, 0));
    arr_p_x.push(tr.TransformPointX(this.originalObject.extX, this.originalObject.extY));
    arr_p_y.push(tr.TransformPointY(this.originalObject.extX, this.originalObject.extY));
    arr_p_x.push(tr.TransformPointX(0, this.originalObject.extY));
    arr_p_y.push(tr.TransformPointY(0, this.originalObject.extY));
    arr_p_x.push(boundsChecker.Bounds.min_x);
    arr_p_x.push(boundsChecker.Bounds.max_x);
    arr_p_y.push(boundsChecker.Bounds.min_y);
    arr_p_y.push(boundsChecker.Bounds.max_y);
    boundsChecker.Bounds.min_x = Math.min.apply(Math, arr_p_x);
    boundsChecker.Bounds.max_x = Math.max.apply(Math, arr_p_x);
    boundsChecker.Bounds.min_y = Math.min.apply(Math, arr_p_y);
    boundsChecker.Bounds.max_y = Math.max.apply(Math, arr_p_y);
    boundsChecker.Bounds.posX = this.x;
    boundsChecker.Bounds.posY = this.y;
    boundsChecker.Bounds.extX = this.originalObject.extX;
    boundsChecker.Bounds.extY = this.originalObject.extY;
    return boundsChecker.Bounds;
};
function MoveShapeImageTrackInGroup(originalObject) {
    this.originalObject = originalObject;
    this.x = null;
    this.y = null;
    this.transform = new CMatrix();
    if (!originalObject.isChart()) {
        this.brush = originalObject.brush;
        this.pen = originalObject.pen;
    } else {
        var pen_brush = CreatePenBrushForChartTrack();
        this.brush = pen_brush.brush;
        this.pen = pen_brush.pen;
    }
    this.overlayObject = new OverlayObject(!(this.originalObject.getObjectType() === historyitem_type_ChartSpace) && this.originalObject.spPr && this.originalObject.spPr.geometry, this.originalObject.extX, this.originalObject.extY, this.brush, this.pen, this.transform);
    this.inv = global_MatrixTransformer.Invert(originalObject.group.transform);
    this.inv.tx = 0;
    this.inv.ty = 0;
    this.draw = function (overlay) {
        if (isRealNumber(this.pageIndex) && overlay.SetCurrentPage) {
            overlay.SetCurrentPage(this.pageIndex);
        }
        this.overlayObject.draw(overlay);
    };
    this.track = function (dx, dy) {
        var dx_t = this.inv.TransformPointX(dx, dy);
        var dy_t = this.inv.TransformPointY(dx, dy);
        this.x = this.originalObject.x + dx_t;
        this.y = this.originalObject.y + dy_t;
        this.calculateTransform();
    };
    this.getOriginalBoundsRect = function () {
        return this.originalObject.getRectBounds();
    };
    this.calculateTransform = function () {
        var t = this.transform;
        t.Reset();
        global_MatrixTransformer.TranslateAppend(t, -this.originalObject.extX * 0.5, -this.originalObject.extY * 0.5);
        if (this.originalObject.flipH) {
            global_MatrixTransformer.ScaleAppend(t, -1, 1);
        }
        if (this.originalObject.flipV) {
            global_MatrixTransformer.ScaleAppend(t, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(t, -this.originalObject.rot);
        global_MatrixTransformer.TranslateAppend(t, this.x + this.originalObject.extX * 0.5, this.y + this.originalObject.extY * 0.5);
        global_MatrixTransformer.MultiplyAppend(t, this.originalObject.group.getTransformMatrix());
    };
    this.trackEnd = function () {
        var scale_scale_coefficients = this.originalObject.group.getResultScaleCoefficients();
        var xfrm = this.originalObject.group.spPr.xfrm;
        CheckSpPrXfrm(this.originalObject);
        var shape_xfrm = this.originalObject.spPr.xfrm;
        shape_xfrm.setOffX(this.x / scale_scale_coefficients.cx + xfrm.chOffX);
        shape_xfrm.setOffY(this.y / scale_scale_coefficients.cy + xfrm.chOffY);
    };
}
function MoveGroupTrack(originalObject) {
    this.x = null;
    this.y = null;
    this.originalObject = originalObject;
    this.transform = new CMatrix();
    this.pageIndex = null;
    this.overlayObjects = [];
    this.arrTransforms2 = [];
    var arr_graphic_objects = originalObject.getArrGraphicObjects();
    var group_invert_transform = originalObject.invertTransform;
    for (var i = 0; i < arr_graphic_objects.length; ++i) {
        var gr_obj_transform_copy = arr_graphic_objects[i].transform.CreateDublicate();
        global_MatrixTransformer.MultiplyAppend(gr_obj_transform_copy, group_invert_transform);
        this.arrTransforms2[i] = gr_obj_transform_copy;
        this.overlayObjects[i] = new OverlayObject(!(arr_graphic_objects[i].getObjectType() === historyitem_type_ChartSpace) && arr_graphic_objects[i].spPr.geometry, arr_graphic_objects[i].extX, arr_graphic_objects[i].extY, arr_graphic_objects[i].brush, arr_graphic_objects[i].pen, new CMatrix());
    }
    this.getOriginalBoundsRect = function () {
        return this.originalObject.getRectBounds();
    };
    this.track = function (dx, dy, pageIndex) {
        this.pageIndex = pageIndex;
        var original = this.originalObject;
        this.x = original.x + dx;
        this.y = original.y + dy;
        this.transform.Reset();
        var hc = original.extX * 0.5;
        var vc = original.extY * 0.5;
        global_MatrixTransformer.TranslateAppend(this.transform, -hc, -vc);
        if (original.flipH) {
            global_MatrixTransformer.ScaleAppend(this.transform, -1, 1);
        }
        if (original.flipV) {
            global_MatrixTransformer.ScaleAppend(this.transform, 1, -1);
        }
        global_MatrixTransformer.RotateRadAppend(this.transform, -original.rot);
        global_MatrixTransformer.TranslateAppend(this.transform, this.x + hc, this.y + vc);
        for (var i = 0; i < this.overlayObjects.length; ++i) {
            var new_transform = this.arrTransforms2[i].CreateDublicate();
            global_MatrixTransformer.MultiplyAppend(new_transform, this.transform);
            this.overlayObjects[i].updateTransformMatrix(new_transform);
        }
    };
    this.draw = function (overlay) {
        if (isRealNumber(this.pageIndex) && overlay.SetCurrentPage) {
            overlay.SetCurrentPage(this.pageIndex);
        }
        for (var i = 0; i < this.overlayObjects.length; ++i) {
            this.overlayObjects[i].draw(overlay);
        }
    };
    this.getBounds = function () {
        var bounds_checker = new CSlideBoundsChecker();
        for (var i = 0; i < this.overlayObjects.length; ++i) {
            this.overlayObjects[i].draw(bounds_checker);
        }
        bounds_checker.Bounds.posX = this.x;
        bounds_checker.Bounds.posY = this.y;
        bounds_checker.Bounds.extX = this.originalObject.extX;
        bounds_checker.Bounds.extY = this.originalObject.extY;
        return bounds_checker.Bounds;
    };
    this.trackEnd = function (bWord) {
        if (bWord) {
            this.x = 0;
            this.y = 0;
        }
        CheckSpPrXfrm(this.originalObject);
        var xfrm = this.originalObject.spPr.xfrm;
        xfrm.setOffX(this.x);
        xfrm.setOffY(this.y);
        if (bWord) {
            if (this.originalObject.selectStartPage !== this.pageIndex) {
                this.originalObject.selectStartPage = this.pageIndex;
            }
        }
        this.originalObject.checkDrawingBaseCoords();
    };
}
function MoveComment(comment) {
    this.comment = comment;
    this.x = comment.x;
    this.y = comment.y;
    this.getOriginalBoundsRect = function () {};
    this.track = function (dx, dy) {
        var original = this.comment;
        this.x = original.x + dx;
        this.y = original.y + dy;
    };
    this.draw = function (overlay) {
        var Flags = 0;
        Flags |= 1;
        if (this.comment.Data.m_aReplies.length > 0) {
            Flags |= 2;
        }
        var dd = editor.WordControl.m_oDrawingDocument;
        overlay.DrawPresentationComment(Flags, this.x, this.y, dd.GetCommentWidth(Flags), dd.GetCommentHeight(Flags));
    };
    this.trackEnd = function () {
        this.comment.setPosition(this.x, this.y);
    };
}