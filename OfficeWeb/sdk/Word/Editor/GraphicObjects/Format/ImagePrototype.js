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
CImageShape.prototype.Get_Theme = CShape.prototype.Get_Theme;
CImageShape.prototype.Get_ColorMap = CShape.prototype.Get_ColorMap;
CImageShape.prototype.addToRecalculate = CShape.prototype.addToRecalculate;
CImageShape.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CImageShape.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CImageShape.prototype.getHierarchy = CShape.prototype.getHierarchy;
CImageShape.prototype.getParentObjects = CShape.prototype.getParentObjects;
CImageShape.prototype.recalculateTransform = CShape.prototype.recalculateTransform;
CImageShape.prototype.recalculateBounds = CShape.prototype.recalculateBounds;
CImageShape.prototype.deselect = CShape.prototype.deselect;
CImageShape.prototype.getArrayWrapPolygons = CShape.prototype.getArrayWrapPolygons;
CImageShape.prototype.hitToHandles = CShape.prototype.hitToHandles;
CImageShape.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CImageShape.prototype.getRotateAngle = CShape.prototype.getRotateAngle;
CImageShape.prototype.recalculateWrapPolygon = CShape.prototype.recalculateWrapPolygon;
CImageShape.prototype.setRecalculateInfo = function () {
    this.recalcInfo = {
        recalculateBrush: true,
        recalculatePen: true,
        recalculateTransform: true,
        recalculateBounds: true,
        recalculateGeometry: true,
        recalculateFill: true,
        recalculateLine: true,
        recalculateTransparent: true,
        recalculateWrapPolygon: true
    };
    this.bNeedUpdatePosition = true;
    this.bounds = {
        l: 0,
        t: 0,
        r: 0,
        b: 0,
        w: 0,
        h: 0
    };
    this.posX = null;
    this.posY = null;
    this.snapArrayX = [];
    this.snapArrayY = [];
    this.localTransform = new CMatrix();
    this.localTransformText = new CMatrix();
};
CImageShape.prototype.recalcBrush = function () {
    this.recalcInfo.recalculateBrush = true;
};
CImageShape.prototype.recalcPen = function () {
    this.recalcInfo.recalculatePen = true;
};
CImageShape.prototype.recalcTransform = function () {
    this.recalcInfo.recalculateTransform = true;
};
CImageShape.prototype.recalcBounds = function () {
    this.recalcInfo.recalculateBounds = true;
};
CImageShape.prototype.recalcGeometry = function () {
    this.recalcInfo.recalculateGeometry = true;
};
CImageShape.prototype.recalcStyle = function () {
    this.recalcInfo.recalculateStyle = true;
};
CImageShape.prototype.recalcFill = function () {
    this.recalcInfo.recalculateFill = true;
};
CImageShape.prototype.recalcLine = function () {
    this.recalcInfo.recalculateLine = true;
};
CImageShape.prototype.recalcTransparent = function () {
    this.recalcInfo.recalculateTransparent = true;
};
CImageShape.prototype.recalcWrapPolygon = function () {
    this.recalcInfo.recalculateWrapPolygon = true;
};
CImageShape.prototype.handleUpdatePosition = function () {
    this.recalcTransform();
    this.recalcBounds();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateExtents = function () {
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcTransform();
    this.recalcWrapPolygon();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateRot = function () {
    this.recalcTransform();
    this.recalcBounds();
    this.recalcWrapPolygon();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateFlip = function () {
    this.recalcTransform();
    this.recalcWrapPolygon();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateFill = function () {
    this.recalcBrush();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateLn = function () {
    this.recalcLine();
    this.addToRecalculate();
};
CImageShape.prototype.handleUpdateGeometry = function () {
    this.recalcBounds();
    this.recalcGeometry();
    this.addToRecalculate();
};
CImageShape.prototype.recalculateLocalTransform = CShape.prototype.recalculateLocalTransform;
CImageShape.prototype.convertPixToMM = CShape.prototype.convertPixToMM;
CImageShape.prototype.getCanvasContext = CShape.prototype.getCanvasContext;
CImageShape.prototype.getCompiledStyle = CShape.prototype.getCompiledStyle;
CImageShape.prototype.getHierarchy = CShape.prototype.getHierarchy;
CImageShape.prototype.getParentObjects = CShape.prototype.getParentObjects;
CImageShape.prototype.recalculate = function () {
    if (this.bDeleted) {
        return;
    }
    ExecuteNoHistory(function () {
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
        if (this.recalcInfo.recalculateGeometry) {
            this.recalculateGeometry();
            this.recalcInfo.recalculateGeometry = false;
        }
        if (this.recalcInfo.recalculateBounds) {
            this.recalculateBounds();
            this.recalcInfo.recalculateBounds = false;
        }
        if (this.recalcInfo.recalculateWrapPolygon) {
            this.recalculateWrapPolygon();
            this.recalcInfo.recalculateWrapPolygon = false;
        }
        this.bNeedUpdatePosition = true;
    },
    this, []);
};
CImageShape.prototype.canChangeWrapPolygon = CShape.prototype.canChangeWrapPolygon;
CImageShape.prototype.hitInInnerArea = CShape.prototype.hitInInnerArea;
CImageShape.prototype.hitInPath = CShape.prototype.hitInPath;
CImageShape.prototype.hitToHandles = CShape.prototype.hitToHandles;
CImageShape.prototype.hitInBoundingRect = CShape.prototype.hitInBoundingRect;
CImageShape.prototype.getNumByCardDirection = CShape.prototype.getNumByCardDirection;
CImageShape.prototype.getCardDirectionByNum = CShape.prototype.getCardDirectionByNum;
CImageShape.prototype.getResizeCoefficients = CShape.prototype.getResizeCoefficients;
CImageShape.prototype.check_bounds = CShape.prototype.check_bounds;
CImageShape.prototype.normalize = CShape.prototype.normalize;
CImageShape.prototype.updatePosition = CShape.prototype.updatePosition;
CImageShape.prototype.updateTransformMatrix = CShape.prototype.updateTransformMatrix;
CImageShape.prototype.getDrawingDocument = CShape.prototype.getDrawingDocument;
CImageShape.prototype.getArrayWrapIntervals = CShape.prototype.getArrayWrapIntervals;
CImageShape.prototype.getBounds = CShape.prototype.getBounds;
CImageShape.prototype.setStartPage = CShape.prototype.setStartPage;
CImageShape.prototype.getRecalcObject = CShape.prototype.getRecalcObject;
CImageShape.prototype.setRecalcObject = CShape.prototype.setRecalcObject;
CImageShape.prototype.checkContentDrawings = function () {};
CImageShape.prototype.hit = CShape.prototype.hit;
CImageShape.prototype.checkShapeChildTransform = function () {
    if (this.parent) {
        var parent_shape = this.parent.isShapeChild(true);
        if (parent_shape) {
            global_MatrixTransformer.MultiplyAppend(this.transform, parent_shape.transformText);
            this.invertTransform = global_MatrixTransformer.Invert(this.transform);
        }
    }
};