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
CRFonts.prototype.Merge = function (RFonts) {
    if (undefined !== RFonts.Ascii) {
        this.Ascii = RFonts.Ascii;
    }
    if (undefined != RFonts.EastAsia) {
        this.EastAsia = RFonts.EastAsia;
    } else {
        if (undefined !== RFonts.Ascii) {
            this.EastAsia = RFonts.Ascii;
        }
    }
    if (undefined != RFonts.HAnsi) {
        this.HAnsi = RFonts.HAnsi;
    } else {
        if (undefined !== RFonts.Ascii) {
            this.HAnsi = RFonts.Ascii;
        }
    }
    if (undefined != RFonts.CS) {
        this.CS = RFonts.CS;
    } else {
        if (undefined !== RFonts.Ascii) {
            this.CS = RFonts.Ascii;
        }
    }
    if (undefined != RFonts.Hint) {
        this.Hint = RFonts.Hint;
    }
};
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
    if (this.parent && this.parent.getObjectType() === historyitem_type_Slide) {
        return this.parent.graphicObjects;
    }
    return null;
};
function addToDrawings(worksheet, graphic, position, lockByDefault) {
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
    var drawingObject = drawingObjects.createDrawingObject();
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
    if (graphic.recalcTransform) {
        graphic.recalcTransform();
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
    if (this.parent && this.parent.cSld && this.parent.cSld.spTree) {
        this.parent.shapeAdd(pos, this);
    }
};
CShape.prototype.deleteDrawingBase = function (bCheckPlaceholder) {
    if (this.parent && this.parent.cSld && this.parent.cSld.spTree) {
        var pos = this.parent.removeFromSpTreeById(this.Id);
        if (bCheckPlaceholder && this.isPlaceholder() && !this.isEmptyPlaceholder()) {
            var hierarchy = this.getHierarchy();
            if (hierarchy[0]) {
                var copy = hierarchy[0].copy();
                copy.setParent(this.parent);
                copy.addToDrawingObjects(pos);
                var doc_content = copy.getDocContent && copy.getDocContent();
                if (doc_content) {
                    doc_content.Set_ApplyToAll(true);
                    doc_content.Remove(-1);
                    doc_content.Set_ApplyToAll(false);
                }
            }
        }
        return pos;
    }
    return -1;
};
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
        recalculateTextStyles: [true, true, true, true, true, true, true, true, true],
        recalculateContent2: true
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
CShape.prototype.recalcContent2 = function () {
    this.recalcInfo.recalculateContent2 = true;
};
CShape.prototype.getDrawingDocument = function () {
    return editor.WordControl.m_oLogicDocument.DrawingDocument;
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
    History.RecalcData_Add({
        Type: historyrecalctype_Drawing,
        Object: this
    });
};
CShape.prototype.getSlideIndex = function () {
    if (this.parent && isRealNumber(this.parent.num)) {
        return this.parent.num;
    }
    return null;
};
CShape.prototype.handleUpdatePosition = function () {
    this.recalcTransform();
    this.recalcBounds();
    this.recalcTransformText();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateExtents = function () {
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcTransform();
    this.recalcContent();
    this.recalcContent2();
    this.recalcTransformText();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateTheme = function () {
    this.setRecalculateInfo();
    if (this.isPlaceholder() && !(this.spPr && this.spPr.xfrm && (this.getObjectType() === historyitem_type_GroupShape && this.spPr.xfrm.isNotNullForGroup() || this.getObjectType() !== historyitem_type_GroupShape && this.spPr.xfrm.isNotNull()))) {
        this.recalcTransform();
        this.recalcGeometry();
    }
    var content = this.getDocContent && this.getDocContent();
    if (content) {
        content.Recalc_AllParagraphs_CompiledPr();
    }
    this.recalcContent && this.recalcContent();
    this.recalcFill && this.recalcFill();
    this.recalcLine && this.recalcLine();
    this.recalcPen && this.recalcPen();
    this.recalcBrush && this.recalcBrush();
    this.recalcStyle && this.recalcStyle();
    this.recalcInfo.recalculateTextStyles && (this.recalcInfo.recalculateTextStyles = [true, true, true, true, true, true, true, true, true]);
    this.recalcBounds && this.recalcBounds();
    this.handleTitlesAfterChangeTheme && this.handleTitlesAfterChangeTheme();
    if (Array.isArray(this.spTree)) {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].handleUpdateTheme();
        }
    }
};
CShape.prototype.handleUpdateRot = function () {
    this.recalcTransform();
    if (this.txBody && this.txBody.bodyPr && this.txBody.bodyPr.upright) {
        this.recalcContent();
        this.recalcContent2();
    }
    this.recalcTransformText();
    this.recalcBounds();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateFlip = function () {
    this.recalcTransform();
    this.recalcTransformText();
    this.recalcContent();
    this.recalcContent2();
    this.addToRecalculate();
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
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcContent();
    this.recalcContent2();
    this.recalcTransformText();
    this.addToRecalculate();
};
CShape.prototype.convertPixToMM = function (pix) {
    return editor.WordControl.m_oLogicDocument.DrawingDocument.GetMMPerDot(pix);
};
CShape.prototype.getCanvasContext = function () {
    return editor.WordControl.m_oLogicDocument.DrawingDocument.CanvasHitContext;
};
CShape.prototype.getCompiledStyle = function () {
    return this.style;
};
CShape.prototype.getParentObjects = function () {
    if (this.parent) {
        switch (this.parent.getObjectType()) {
        case historyitem_type_Slide:
            return {
                presentation: editor.WordControl.m_oLogicDocument,
                slide: this.parent,
                layout: this.parent.Layout,
                master: this.parent.Layout ? this.parent.Layout.Master : null,
                theme: this.themeOverride ? this.themeOverride : (this.parent.Layout && this.parent.Layout.Master ? this.parent.Layout.Master.Theme : null)
            };
        case historyitem_type_SlideLayout:
            return {
                presentation: editor.WordControl.m_oLogicDocument,
                slide: null,
                layout: this.parent,
                master: this.parent.Master,
                theme: this.themeOverride ? this.themeOverride : (this.parent.Master ? this.parent.Master.Theme : null)
            };
        case historyitem_type_SlideMaster:
            return {
                presentation: editor.WordControl.m_oLogicDocument,
                slide: null,
                layout: null,
                master: this.parent,
                theme: this.themeOverride ? this.themeOverride : this.parent.Theme
            };
        }
    }
    return {
        slide: null,
        layout: null,
        master: null,
        theme: null
    };
};
CShape.prototype.recalcText = function () {
    this.recalcInfo.recalculateContent = true;
    this.recalcInfo.recalculateContent2 = true;
    this.recalcInfo.recalculateTransformText = true;
};
CShape.prototype.recalculate = function () {
    if (this.bDeleted || !this.parent) {
        return;
    }
    var check_slide_placeholder = !this.isPlaceholder() || (this.parent && this.parent.getObjectType() === historyitem_type_Slide);
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
        if (this.recalcInfo.recalculateContent && check_slide_placeholder) {
            this.recalculateContent();
            this.recalcInfo.recalculateContent = false;
        }
        if (this.recalcInfo.recalculateContent2 && check_slide_placeholder) {
            this.recalculateContent2();
            this.recalcInfo.recalculateContent2 = false;
        }
        if (this.recalcInfo.recalculateTransformText && check_slide_placeholder) {
            this.recalculateTransformText();
            this.recalcInfo.recalculateTransformText = false;
            this.clipRect = null;
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
            w = this.spPr.geometry.rect.r - this.spPr.geometry.rect.l - (l_ins + r_ins) + 1;
            h = this.spPr.geometry.rect.b - this.spPr.geometry.rect.t - (t_ins + b_ins) + 1;
        } else {
            w = this.extX - (l_ins + r_ins) + 1;
            h = this.extY - (t_ins + b_ins) + 1;
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
CShape.prototype.recalculateContent2 = function () {
    if (this.txBody) {
        if (this.isPlaceholder()) {
            if (!this.isEmptyPlaceholder()) {
                return;
            }
            var text = typeof pHText[0][this.nvSpPr.nvPr.ph.type] === "string" && pHText[0][this.nvSpPr.nvPr.ph.type].length > 0 ? pHText[0][this.nvSpPr.nvPr.ph.type] : pHText[0][phType_body];
            if (!this.txBody.content2) {
                this.txBody.content2 = CreateDocContentFromString(text, this.getDrawingDocument(), this.txBody);
            } else {
                this.txBody.content2.Recalc_AllParagraphs_CompiledPr();
            }
            var content = this.txBody.content2;
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
                if (!body_pr.upright) {
                    if (! (body_pr.vert === nVertTTvert || body_pr.vert === nVertTTvert270)) {
                        this.txBody.contentWidth2 = w;
                        this.txBody.contentHeight2 = h;
                    } else {
                        this.txBody.contentWidth2 = h;
                        this.txBody.contentHeight2 = w;
                    }
                } else {
                    var _full_rotate = this.getFullRotate();
                    if (checkNormalRotate(_full_rotate)) {
                        if (! (body_pr.vert === nVertTTvert || body_pr.vert === nVertTTvert270)) {
                            this.txBody.contentWidth2 = w;
                            this.txBody.contentHeight2 = h;
                        } else {
                            this.txBody.contentWidth2 = h;
                            this.txBody.contentHeight2 = w;
                        }
                    } else {
                        if (! (body_pr.vert === nVertTTvert || body_pr.vert === nVertTTvert270)) {
                            this.txBody.contentWidth2 = h;
                            this.txBody.contentHeight2 = w;
                        } else {
                            this.txBody.contentWidth2 = w;
                            this.txBody.contentHeight2 = h;
                        }
                    }
                }
            }
            this.contentWidth2 = this.txBody.contentWidth2;
            this.contentHeight2 = this.txBody.contentHeight2;
            var content_ = this.getDocContent();
            if (content_ && content_.Content[0]) {
                content.Content[0].Pr = content_.Content[0].Pr;
                var para_text_pr = new ParaTextPr(content_.Content[0].Get_FirstRunPr());
                content.Set_ApplyToAll(true);
                content.Paragraph_Add(para_text_pr);
                content.Set_ApplyToAll(false);
            }
            content.Set_StartPage(0);
            content.Reset(0, 0, w, 20000);
            content.Recalculate_Page(content.StartPage, true);
        } else {
            this.txBody.content2 = null;
        }
    }
};
CShape.prototype.Get_ColorMap = function () {
    var parent_objects = this.getParentObjects();
    if (parent_objects.slide && parent_objects.slide.clrMap) {
        return parent_objects.slide.clrMap;
    } else {
        if (parent_objects.layout && parent_objects.layout.clrMap) {
            return parent_objects.layout.clrMap;
        } else {
            if (parent_objects.master && parent_objects.master.clrMap) {
                return parent_objects.master.clrMap;
            }
        }
    }
    return G_O_DEFAULT_COLOR_MAP;
};
CShape.prototype.getStyles = function (index) {
    return this.Get_Styles(index);
};
CShape.prototype.Get_Worksheet = function () {
    return this.worksheet;
};
CShape.prototype.setParent2 = function (parent) {
    this.setParent(parent);
    if (Array.isArray(this.spTree)) {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].setParent2(parent);
        }
    }
};
CShape.prototype.hitInTextRect = function (x, y) {
    var content = this.getDocContent && this.getDocContent();
    if (content && this.invertTransformText) {
        var t_x, t_y;
        t_x = this.invertTransformText.TransformPointX(x, y);
        t_y = this.invertTransformText.TransformPointY(x, y);
        return t_x > 0 && t_x < content.XLimit && t_y > 0 && t_y < content.Get_SummaryHeight();
    }
    return false;
};
CShape.prototype.getIsSingleBody = function (x, y) {
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
                return false;
            }
        }
    }
    return true;
};
CShape.prototype.Set_CurrentElement = function (bUpdate, pageIndex) {
    if (this.parent) {
        var drawing_objects = this.parent.graphicObjects;
        drawing_objects.resetSelection(true);
        if (this.group) {
            var main_group = this.group.getMainGroup();
            drawing_objects.selectObject(main_group, 0);
            main_group.selectObject(this, 0);
            main_group.selection.textSelection = this;
            drawing_objects.selection.groupSelection = main_group;
        } else {
            drawing_objects.selectObject(this, 0);
            drawing_objects.selection.textSelection = this;
        }
        if (editor.WordControl.m_oLogicDocument.CurPage !== this.parent.num) {
            editor.WordControl.m_oLogicDocument.Set_CurPage(this.parent.num);
            editor.WordControl.GoToPage(this.parent.num);
        }
    }
};
CTextBody.prototype.Get_Worksheet = function () {
    return this.parent && this.parent.Get_Worksheet && this.parent.Get_Worksheet();
};
CTextBody.prototype.getDrawingDocument = function () {
    return this.parent && this.parent.getDrawingDocument && this.parent.getDrawingDocument();
};