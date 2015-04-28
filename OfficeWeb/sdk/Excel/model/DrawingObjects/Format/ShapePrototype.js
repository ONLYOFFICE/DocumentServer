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
var G_O_DEFAULT_COLOR_MAP = GenerateDefaultColorMap();
CShape.prototype.setDrawingObjects = function (drawingObjects) {};
CShape.prototype.setWorksheet = function (worksheet) {
    History.Add(this, {
        Type: historyitem_AutoShapes_SetWorksheet,
        oldPr: this.worksheet,
        newPr: worksheet
    });
    this.worksheet = worksheet;
    if (this.spTree) {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].setWorksheet(worksheet);
        }
    }
};
CShape.prototype.setDrawingBase = function (drawingBase) {
    this.drawingBase = drawingBase;
    if (Array.isArray(this.spTree)) {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].setDrawingBase(drawingBase);
        }
    }
};
CShape.prototype.getDrawingObjectsController = function () {
    var wsViews = Asc["editor"] && Asc["editor"].wb && Asc["editor"].wb.wsViews;
    if (wsViews) {
        for (var i = 0; i < wsViews.length; ++i) {
            if (wsViews[i] && wsViews[i].model === this.worksheet && wsViews[i].objectRender) {
                return wsViews[i].objectRender.controller;
            }
        }
    }
    return null;
};
function addToDrawings(worksheet, graphic, position, lockByDefault, anchor) {
    var drawingObjects;
    var wsViews = Asc["editor"].wb.wsViews;
    for (var i = 0; i < wsViews.length; ++i) {
        if (wsViews[i] && wsViews[i].model === worksheet) {
            drawingObjects = wsViews[i].objectRender;
            break;
        }
    }
    if (!drawingObjects) {
        drawingObjects = new DrawingObjects();
    }
    var oldDrawingBase = graphic.drawingBase;
    var drawingObject = drawingObjects.createDrawingObject(anchor);
    drawingObject.graphicObject = graphic;
    graphic.setDrawingBase(drawingObject);
    if (!worksheet) {
        return;
    }
    var ret, aObjects = worksheet.Drawings;
    if (isRealNumber(position)) {
        aObjects.splice(position, 0, drawingObject);
        ret = position;
    } else {
        ret = aObjects.length;
        aObjects.push(drawingObject);
    }
    if (oldDrawingBase) {
        drawingObject.from.col = oldDrawingBase.from.col;
        drawingObject.from.colOff = oldDrawingBase.from.colOff;
        drawingObject.from.row = oldDrawingBase.from.row;
        drawingObject.from.rowOff = oldDrawingBase.from.rowOff;
        drawingObject.to.col = oldDrawingBase.to.col;
        drawingObject.to.colOff = oldDrawingBase.to.colOff;
        drawingObject.to.row = oldDrawingBase.to.row;
        drawingObject.to.rowOff = oldDrawingBase.to.rowOff;
    }
    if (graphic.recalcTransform) {
        graphic.recalcTransform();
        if (graphic.recalcBounds) {
            graphic.recalcBounds();
        }
        graphic.addToRecalculate();
    }
    return ret;
}
function deleteDrawingBase(aObjects, graphicId) {
    var position = null;
    for (var i = 0; i < aObjects.length; i++) {
        if (aObjects[i].graphicObject.Get_Id() == graphicId) {
            aObjects.splice(i, 1);
            position = i;
            break;
        }
    }
    return position;
}
CShape.prototype.addToDrawingObjects = function (pos) {
    var controller = this.getDrawingObjectsController();
    var position = addToDrawings(this.worksheet, this, pos, undefined, undefined);
    var data = {
        Type: historyitem_AutoShapes_AddToDrawingObjects,
        Pos: position
    };
    History.Add(this, data);
    this.worksheet.addContentChanges(new CContentChangesElement(contentchanges_Add, data.Pos, 1, data));
};
CShape.prototype.deleteDrawingBase = function () {
    var position = deleteDrawingBase(this.worksheet.Drawings, this.Get_Id());
    if (isRealNumber(position)) {
        var data = {
            Type: historyitem_AutoShapes_RemoveFromDrawingObjects,
            Pos: position
        };
        History.Add(this, data);
        this.worksheet.addContentChanges(new CContentChangesElement(contentchanges_Remove, data.Pos, 1, data));
    }
    return position;
};
function getDrawingObjects_Sp(sp) {
    var controller = sp.getDrawingObjectsController();
    return controller && controller.drawingObjects;
}
CShape.prototype.setRecalculateInfo = function () {
    this.recalcInfo = {
        recalculateContent: true,
        recalculateBrush: true,
        recalculatePen: true,
        recalculateTransform: true,
        recalculateTransformText: true,
        recalculateBounds: true,
        recalculateGeometry: true,
        recalculateStyle: true,
        recalculateFill: true,
        recalculateLine: true,
        recalculateTransparent: true,
        recalculateTextStyles: [true, true, true, true, true, true, true, true, true]
    };
    this.compiledStyles = [];
    this.textPropsForRecalc = [];
    this.bounds = {
        l: 0,
        t: 0,
        r: 0,
        b: 0,
        w: 0,
        h: 0
    };
    this.lockType = c_oAscLockTypes.kLockTypeNone;
};
CShape.prototype.recalcContent = function () {
    this.recalcInfo.recalculateContent = true;
};
CShape.prototype.getDrawingDocument = function () {
    if (this.worksheet) {
        return this.worksheet.DrawingDocument;
    }
    var drawingObjects = getDrawingObjects_Sp(this);
    return drawingObjects && drawingObjects.drawingDocument;
};
CShape.prototype.recalcBrush = function () {
    this.recalcInfo.recalculateBrush = true;
};
CShape.prototype.recalcPen = function () {
    this.recalcInfo.recalculatePen = true;
};
CShape.prototype.recalcTransform = function () {
    this.recalcInfo.recalculateTransform = true;
};
CShape.prototype.recalcTransformText = function () {
    this.recalcInfo.recalculateTransformText = true;
};
CShape.prototype.recalcBounds = function () {
    this.recalcInfo.recalculateBounds = true;
};
CShape.prototype.recalcGeometry = function () {
    this.recalcInfo.recalculateGeometry = true;
};
CShape.prototype.recalcStyle = function () {
    this.recalcInfo.recalculateStyle = true;
};
CShape.prototype.recalcFill = function () {
    this.recalcInfo.recalculateFill = true;
};
CShape.prototype.recalcLine = function () {
    this.recalcInfo.recalculateLine = true;
};
CShape.prototype.recalcTransparent = function () {
    this.recalcInfo.recalculateTransparent = true;
};
CShape.prototype.recalcTextStyles = function () {
    this.recalcInfo.recalculateTextStyles = [true, true, true, true, true, true, true, true, true];
};
CShape.prototype.addToRecalculate = function () {
    var controller = this.getDrawingObjectsController && this.getDrawingObjectsController();
    if (controller) {
        controller.objectsForRecalculate[this.Id] = this;
    }
};
CShape.prototype.handleUpdatePosition = function () {
    this.recalcTransform();
    this.recalcBounds();
    this.recalcTransformText();
    this.addToRecalculate();
    delete this.fromSerialize;
};
CShape.prototype.handleUpdateExtents = function () {
    this.recalcContent();
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcTransform();
    this.recalcContent();
    this.addToRecalculate();
    delete this.fromSerialize;
};
CShape.prototype.handleUpdateRot = function () {
    this.recalcTransform();
    if (this.txBody && this.txBody.bodyPr && this.txBody.bodyPr.upright) {
        this.recalcContent();
    }
    this.recalcTransformText();
    this.recalcBounds();
    this.addToRecalculate();
    delete this.fromSerialize;
};
CShape.prototype.handleUpdateFlip = function () {
    this.recalcTransform();
    this.recalcTransformText();
    this.recalcContent();
    this.addToRecalculate();
    delete this.fromSerialize;
};
CShape.prototype.handleUpdateFill = function () {
    this.recalcBrush();
    this.recalcFill();
    this.recalcTransparent();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateLn = function () {
    this.recalcPen();
    this.recalcLine();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateGeometry = function () {
    this.recalcBounds();
    this.recalcGeometry();
    this.addToRecalculate();
};
CShape.prototype.convertPixToMM = function (pix) {
    var drawingObjects = getDrawingObjects_Sp(this);
    return drawingObjects ? drawingObjects.convertMetric(pix, 0, 3) : 0;
};
CShape.prototype.getCanvasContext = function () {
    var drawingObjects = getDrawingObjects_Sp(this);
    return drawingObjects ? drawingObjects.getCanvasContext() : null;
};
CShape.prototype.getCompiledStyle = function () {
    return this.style;
};
CShape.prototype.getHierarchy = function () {
    return [];
};
CShape.prototype.getParentObjects = function () {
    return {
        slide: null,
        layout: null,
        master: null,
        theme: window["Asc"]["editor"].wbModel.theme
    };
};
CShape.prototype.recalcText = function () {
    this.recalcInfo.recalculateContent = true;
    this.recalcInfo.recalculateTransformText = true;
};
CShape.prototype.recalculate = function () {
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
            this.calculateSnapArrays();
            this.recalcInfo.recalculateTransform = false;
        }
        if (this.recalcInfo.recalculateGeometry) {
            this.recalculateGeometry();
            this.recalcInfo.recalculateGeometry = false;
        }
        if (this.recalcInfo.recalculateContent) {
            this.recalculateContent();
            this.recalcInfo.recalculateContent = false;
        }
        if (this.recalcInfo.recalculateTransformText) {
            this.recalculateTransformText();
        }
        if (this.recalcInfo.recalculateBounds) {
            this.recalculateBounds();
            this.recalcInfo.recalculateBounds = false;
        }
    },
    this, []);
};
CShape.prototype.recalculateBounds = function () {
    var boundsChecker = new CSlideBoundsChecker();
    this.draw(boundsChecker);
    boundsChecker.CorrectBounds();
    this.bounds.x = boundsChecker.Bounds.min_x;
    this.bounds.y = boundsChecker.Bounds.min_y;
    this.bounds.l = boundsChecker.Bounds.min_x;
    this.bounds.t = boundsChecker.Bounds.min_y;
    this.bounds.r = boundsChecker.Bounds.max_x;
    this.bounds.b = boundsChecker.Bounds.max_y;
    this.bounds.w = boundsChecker.Bounds.max_x - boundsChecker.Bounds.min_x;
    this.bounds.h = boundsChecker.Bounds.max_y - boundsChecker.Bounds.min_y;
    if (this.drawingBase && !this.group) {
        this.drawingBase.checkBoundsFromTo();
    }
};
CShape.prototype.recalculateContent = function () {
    var content = this.getDocContent();
    if (content) {
        var w, h;
        var l_ins, t_ins, r_ins, b_ins;
        var body_pr = this.getBodyPr();
        if (body_pr) {
            l_ins = isRealNumber(body_pr.lIns) ? body_pr.lIns : 2.54;
            r_ins = isRealNumber(body_pr.rIns) ? body_pr.rIns : 2.54;
            t_ins = isRealNumber(body_pr.tIns) ? body_pr.tIns : 1.27;
            b_ins = isRealNumber(body_pr.bIns) ? body_pr.bIns : 1.27;
        } else {
            l_ins = 2.54;
            r_ins = 2.54;
            t_ins = 1.27;
            b_ins = 1.27;
        }
        if (this.spPr.geometry && this.spPr.geometry.rect && isRealNumber(this.spPr.geometry.rect.l) && isRealNumber(this.spPr.geometry.rect.t) && isRealNumber(this.spPr.geometry.rect.r) && isRealNumber(this.spPr.geometry.rect.r)) {
            w = this.spPr.geometry.rect.r - this.spPr.geometry.rect.l - (l_ins + r_ins);
            h = this.spPr.geometry.rect.b - this.spPr.geometry.rect.t - (t_ins + b_ins);
        } else {
            w = this.extX - (l_ins + r_ins);
            h = this.extY - (t_ins + b_ins);
        }
        if (this.txBody) {
            if (!body_pr.upright) {
                if (! (body_pr.vert === nVertTTvert || body_pr.vert === nVertTTvert270)) {
                    this.txBody.contentWidth = w;
                    this.txBody.contentHeight = h;
                } else {
                    this.txBody.contentWidth = h;
                    this.txBody.contentHeight = w;
                }
            } else {
                var _full_rotate = this.getFullRotate();
                if (checkNormalRotate(_full_rotate)) {
                    if (! (body_pr.vert === nVertTTvert || body_pr.vert === nVertTTvert270)) {
                        this.txBody.contentWidth = w;
                        this.txBody.contentHeight = h;
                    } else {
                        this.txBody.contentWidth = h;
                        this.txBody.contentHeight = w;
                    }
                } else {
                    if (! (body_pr.vert === nVertTTvert || body_pr.vert === nVertTTvert270)) {
                        this.txBody.contentWidth = h;
                        this.txBody.contentHeight = w;
                    } else {
                        this.txBody.contentWidth = w;
                        this.txBody.contentHeight = h;
                    }
                }
            }
        }
        this.contentWidth = this.txBody.contentWidth;
        this.contentHeight = this.txBody.contentHeight;
        content.Set_StartPage(0);
        content.Reset(0, 0, w, 20000);
        content.Recalculate_Page(content.StartPage, true);
    }
};
CShape.prototype.Get_ColorMap = function () {
    return G_O_DEFAULT_COLOR_MAP;
};
CShape.prototype.getStyles = function (index) {
    return this.Get_Styles(index);
};
CShape.prototype.Get_Worksheet = function () {
    return this.worksheet;
};
CTextBody.prototype.Get_Worksheet = function () {
    return this.parent && this.parent.Get_Worksheet && this.parent.Get_Worksheet();
};
CTextBody.prototype.getDrawingDocument = function () {
    return this.parent && this.parent.getDrawingDocument && this.parent.getDrawingDocument();
};