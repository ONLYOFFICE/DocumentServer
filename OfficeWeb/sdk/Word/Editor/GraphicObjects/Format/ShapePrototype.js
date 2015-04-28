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
 CShape.prototype.setRecalculateInfo = function () {
    this.recalcInfo = {
        recalculateContent: true,
        recalculateTxBoxContent: true,
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
        recalculateShapeStyleForParagraph: true,
        recalculateWrapPolygon: true
    };
    this.bNeedUpdatePosition = true;
    this.textStyleForParagraph = null;
    this.contentWidth = null;
    this.contentHeight = null;
    this.compiledStyles = [];
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
CShape.prototype.recalcContent = function () {
    if (this.bWordShape) {
        this.recalcInfo.recalculateTxBoxContent = true;
    } else {
        this.recalcInfo.recalculateContent = true;
    }
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
    this.snapArrayX.length = 0;
    this.snapArrayY.length = 0;
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
    this.recalcInfo.recalculateTextStyles = true;
};
CShape.prototype.recalcTxBoxContent = function () {
    this.recalcInfo.recalculateTxBoxContent = true;
};
CShape.prototype.recalcWrapPolygon = function () {
    this.recalcInfo.recalculateWrapPolygon = true;
};
CShape.prototype.addToRecalculate = function () {
    editor.WordControl.m_oLogicDocument.DrawingObjects.addToRecalculate(this);
};
CShape.prototype.handleUpdatePosition = function () {
    this.recalcTransform();
    this.recalcBounds();
    this.recalcTransformText();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateExtents = function () {
    this.recalcContent();
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcWrapPolygon();
    this.recalcContent();
    this.recalcTxBoxContent();
    this.recalcTransform();
    this.recalcTransformText();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateRot = function () {
    this.recalcTransform();
    if (this.txBody && this.txBody.bodyPr && this.txBody.bodyPr.upright) {
        this.recalcContent();
    }
    this.recalcTransformText();
    this.recalcBounds();
    this.recalcWrapPolygon();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateFlip = function () {
    this.recalcTransform();
    this.recalcTransformText();
    this.recalcContent();
    this.recalcWrapPolygon();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateFill = function () {
    this.recalcBrush();
    this.recalcFill();
    this.recalcTransparent();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateLn = function () {
    this.recalcLine();
    this.recalcPen();
    this.addToRecalculate();
};
CShape.prototype.handleUpdateGeometry = function () {
    this.recalcGeometry();
    this.recalcBounds();
    this.recalcWrapPolygon();
    this.addToRecalculate();
};
CShape.prototype.convertPixToMM = function (pix) {
    return this.getDrawingDocument().GetMMPerDot(pix);
};
CShape.prototype.getCanvasContext = function () {
    return this.getDrawingDocument().CanvasHitContext;
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
        theme: editor.WordControl.m_oLogicDocument.theme
    };
};
CShape.prototype.recalculateTxBoxContent = function () {
    if (this.textBoxContent === null || this.textBoxContent.Parent !== this) {
        return;
    }
    var _l, _t, _r, _b;
    var body_pr = this.getBodyPr();
    var l_ins = typeof body_pr.lIns === "number" ? body_pr.lIns : 2.54;
    var t_ins = typeof body_pr.tIns === "number" ? body_pr.tIns : 1.27;
    var r_ins = typeof body_pr.rIns === "number" ? body_pr.rIns : 2.54;
    var b_ins = typeof body_pr.bIns === "number" ? body_pr.bIns : 1.27;
    var _body_pr = this.getBodyPr();
    if (this.spPr && isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
        var _rect = this.spPr.geometry.rect;
        _l = _rect.l + l_ins;
        _t = _rect.t + t_ins;
        _r = _rect.r - r_ins;
        _b = _rect.b - b_ins;
    } else {
        _l = l_ins;
        _t = t_ins;
        _r = this.extX - r_ins;
        _b = this.extY - b_ins;
    }
    if (!_body_pr.upright) {
        var _content_width;
        if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
            _content_width = _r - _l;
            this.contentWidth = _content_width;
            this.contentHeight = _b - _t;
        } else {
            _content_width = _b - _t;
            this.contentWidth = _content_width;
            this.contentHeight = _r - _l;
        }
    } else {
        var _full_rotate = this.getFullRotate();
        if (checkNormalRotate(_full_rotate)) {
            if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                _content_width = _r - _l;
                this.contentWidth = _content_width;
                this.contentHeight = _b - _t;
            } else {
                _content_width = _b - _t;
                this.contentWidth = _content_width;
                this.contentHeight = _r - _l;
            }
        } else {
            if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                _content_width = _b - _t;
                this.contentWidth = _content_width;
                this.contentHeight = _r - _l;
            } else {
                _content_width = _r - _l;
                this.contentWidth = _content_width;
                this.contentHeight = _b - _t;
            }
        }
    }
    this.textBoxContent.Reset(0, 0, _content_width, 20000);
    var CurPage = 0;
    var RecalcResult = recalcresult2_NextPage;
    while (recalcresult2_End != RecalcResult) {
        RecalcResult = this.textBoxContent.Recalculate_Page(CurPage++, true);
    }
};
CShape.prototype.recalculate = function () {
    if (this.bDeleted || !this.bWordShape) {
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
CShape.prototype.recalculateText = function () {
    if (!this.bWordShape) {
        return;
    }
    ExecuteNoHistory(function () {
        if (this.bWordShape) {
            if (this.recalcInfo.recalculateTxBoxContent) {
                this.recalculateTxBoxContent();
                this.recalcInfo.recalculateTxBoxContent = false;
            }
        } else {
            if (this.recalcInfo.recalculateContent) {
                this.recalculateContent();
                this.recalcInfo.recalculateContent = false;
            }
        }
        if (this.recalcInfo.recalculateTransformText) {
            this.recalculateTransformText();
        }
    },
    this, []);
};
CShape.prototype.recalculateWrapPolygon = function () {
    if (this.parent) {
        var wrapping_polygon = this.parent.wrappingPolygon;
        if (!wrapping_polygon.edited) {
            if (this.spTree) {
                for (var i = 0; i < this.spTree.length; ++i) {
                    this.spTree[i].recalculate();
                }
            }
            wrapping_polygon.calculate(this);
        } else {
            wrapping_polygon.calculateRelToAbs(this.localTransform, this);
        }
    }
};
CShape.prototype.getArrayWrapPolygons = function () {
    var ret;
    if (this.spPr && this.spPr.geometry) {
        ret = this.spPr.geometry.getArrayPolygons();
    } else {
        ret = [];
    }
    var t = this.localTransform;
    for (var i = 0; i < ret.length; ++i) {
        var polygon = ret[i];
        for (var j = 0; j < polygon.length; ++j) {
            var p = polygon[j];
            var x = t.TransformPointX(p.x, p.y);
            var y = t.TransformPointY(p.x, p.y);
            p.x = x;
            p.y = y;
        }
    }
    return ret;
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
        if (this.spPr && this.spPr.geometry && this.spPr.geometry.rect && isRealNumber(this.spPr.geometry.rect.l) && isRealNumber(this.spPr.geometry.rect.t) && isRealNumber(this.spPr.geometry.rect.r) && isRealNumber(this.spPr.geometry.rect.r)) {
            w = this.spPr.geometry.rect.r - this.spPr.geometry.rect.l - (l_ins + r_ins);
            h = this.spPr.geometry.rect.b - this.spPr.geometry.rect.t - (t_ins + b_ins);
        } else {
            w = this.extX - (l_ins + r_ins);
            h = this.extY - (t_ins + b_ins);
        }
        content.Reset(0, 0, w, h);
        content.Recalculate_Page(content.StartPage, true);
    }
};
CShape.prototype.recalculateTransform = function () {
    this.recalculateLocalTransform(this.localTransform);
};
CShape.prototype.updatePosition = function (x, y) {
    this.posX = x;
    this.posY = y;
    if (!this.group) {
        this.x = this.localX + x;
        this.y = this.localY + y;
    } else {
        this.x = this.localX;
        this.y = this.localY;
    }
    this.updateTransformMatrix();
};
CShape.prototype.checkShapeChild = function () {
    return false;
};
CShape.prototype.checkShapeChildTransform = function () {};
CShape.prototype.getArrayWrapIntervals = function (x0, y0, x1, y1, Y0Sp, Y1Sp, LeftField, RightField, arr_intervals) {
    return this.parent.getArrayWrapIntervals(x0, y0, x1, y1, Y0Sp, Y1Sp, LeftField, RightField, arr_intervals);
};
CShape.prototype.updateTransformMatrix = function () {
    this.transform = this.localTransform.CreateDublicate();
    global_MatrixTransformer.TranslateAppend(this.transform, this.posX, this.posY);
    this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    if (this.localTransformText) {
        this.transformText = this.localTransformText.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transformText, this.posX, this.posY);
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
    }
    this.checkShapeChildTransform();
    this.checkContentDrawings();
};
CShape.prototype.checkContentDrawings = function () {
    if (this.textBoxContent) {
        var all_drawings = this.textBoxContent.Get_AllDrawingObjects([]);
        for (var i = 0; i < all_drawings.length; ++i) {
            all_drawings[i].GraphicObj.updateTransformMatrix();
        }
    }
};
CShape.prototype.applyParentTransform = function (transform) {
    global_MatrixTransformer.MultiplyAppend(this.transform, transform);
    global_MatrixTransformer.MultiplyAppend(this.transformText, transform);
    this.invertTransform = global_MatrixTransformer.Invert(this.transform);
    this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
};
CShape.prototype.recalculateShapeStyleForParagraph = function () {
    var styles = editor.WordControl.m_oLogicDocument.Styles;
    this.textStyleForParagraph = {
        TextPr: styles.Default.TextPr.Copy(),
        ParaPr: styles.Default.ParaPr.Copy()
    };
    var DefId = styles.Default.Paragraph;
    var DefaultStyle = styles.Style[DefId];
    if (DefaultStyle) {
        this.textStyleForParagraph.ParaPr.Merge(DefaultStyle.ParaPr);
        this.textStyleForParagraph.TextPr.Merge(DefaultStyle.TextPr);
    }
    if (this.style && this.style.fontRef) {
        this.textStyleForParagraph.TextPr.Color.Auto = false;
        var shape_text_pr = new CTextPr();
        if (this.style.fontRef.Color) {
            shape_text_pr.Unifill = CreateUniFillByUniColorCopy(this.style.fontRef.Color);
        }
        if (this.style.fontRef.idx === fntStyleInd_major) {
            shape_text_pr.RFonts.Ascii = {
                Name: "+mj-lt",
                Index: -1
            };
            shape_text_pr.RFonts.EastAsia = {
                Name: "+mj-ea",
                Index: -1
            };
            shape_text_pr.RFonts.CS = {
                Name: "+mj-cs",
                Index: -1
            };
        } else {
            if (this.style.fontRef.idx === fntStyleInd_minor) {
                shape_text_pr.RFonts.Ascii = {
                    Name: "+mn-lt",
                    Index: -1
                };
                shape_text_pr.RFonts.EastAsia = {
                    Name: "+mn-ea",
                    Index: -1
                };
                shape_text_pr.RFonts.CS = {
                    Name: "+mn-cs",
                    Index: -1
                };
            }
        }
        this.textStyleForParagraph.TextPr.Merge(shape_text_pr);
    }
};
CShape.prototype.Get_ShapeStyleForPara = function () {
    if (this.recalcInfo.recalculateShapeStyleForParagraph) {
        this.recalculateShapeStyleForParagraph();
        this.recalcInfo.recalculateShapeStyleForParagraph = false;
    }
    return this.textStyleForParagraph;
};
CShape.prototype.Refresh_RecalcData = function (data) {
    this.recalcTxBoxContent();
    this.recalcTransformText();
    this.Refresh_RecalcData2();
};
CShape.prototype.Refresh_RecalcData2 = function () {
    this.recalcTxBoxContent();
    this.recalcTransformText();
    this.addToRecalculate();
    var HdrFtr = this.Is_HdrFtr(true);
    if (HdrFtr) {
        HdrFtr.Refresh_RecalcData2();
    }
};
CShape.prototype.getStartPageAbsolute = function () {
    return 0;
};
CShape.prototype.Get_StartPage_Absolute = function () {
    return 0;
};
CShape.prototype.Get_Numbering = function () {
    return editor.WordControl.m_oLogicDocument.Numbering;
};
CShape.prototype.Get_TableStyleForPara = function () {
    return null;
};
CShape.prototype.Is_Cell = function () {
    return false;
};
CShape.prototype.hitInTextRect = function (x, y) {
    var content = this.getDocContent && this.getDocContent();
    if (content) {
        var t_x, t_y;
        t_x = this.invertTransform.TransformPointX(x, y);
        t_y = this.invertTransform.TransformPointY(x, y);
        var w, h, x, y;
        if (this.spPr && this.spPr.geometry && this.spPr.geometry.rect && isRealNumber(this.spPr.geometry.rect.l) && isRealNumber(this.spPr.geometry.rect.t) && isRealNumber(this.spPr.geometry.rect.r) && isRealNumber(this.spPr.geometry.rect.r)) {
            x = this.spPr.geometry.rect.l;
            y = this.spPr.geometry.rect.t;
            w = this.spPr.geometry.rect.r - this.spPr.geometry.rect.l;
            h = this.spPr.geometry.rect.b - this.spPr.geometry.rect.t;
        } else {
            x = 0;
            y = 0;
            w = this.extX;
            h = this.extY;
        }
        return t_x > x && t_x < x + w && t_y > y && t_y < y + h;
    }
    return false;
};
CShape.prototype.Set_CurrentElement = function (bUpdate, pageIndex) {
    var drawing_objects = editor.WordControl.m_oLogicDocument.DrawingObjects;
    drawing_objects.resetSelection(true);
    var para_drawing;
    if (this.group) {
        var main_group = this.group.getMainGroup();
        drawing_objects.selectObject(main_group, pageIndex);
        main_group.selectObject(this, pageIndex);
        main_group.selection.textSelection = this;
        drawing_objects.selection.groupSelection = main_group;
        para_drawing = main_group.parent;
    } else {
        drawing_objects.selectObject(this, pageIndex);
        drawing_objects.selection.textSelection = this;
        para_drawing = this.parent;
    }
    var hdr_ftr = para_drawing.DocumentContent.Is_HdrFtr(true);
    if (hdr_ftr) {
        hdr_ftr.Content.CurPos.Type = docpostype_DrawingObjects;
        hdr_ftr.Set_CurrentElement(bUpdate);
    } else {
        drawing_objects.document.CurPos.Type = docpostype_DrawingObjects;
        drawing_objects.document.Selection.Use = true;
        if (true === bUpdate) {
            drawing_objects.document.Document_UpdateInterfaceState();
            drawing_objects.document.Document_UpdateRulersState();
            drawing_objects.document.Document_UpdateSelectionState();
        }
    }
};
CShape.prototype.GetParaDrawing = function () {
    if (this.group) {
        var cur_group = this.group;
        while (cur_group.group) {
            cur_group = cur_group.group;
        }
        if (cur_group.parent) {
            return cur_group.parent;
        }
    } else {
        if (this.parent) {
            return this.parent;
        }
    }
    return null;
};
CShape.prototype.Get_StartPage_Relative = function () {
    return 0;
};
CShape.prototype.Check_TableCoincidence = function (table) {
    var para_drawing = this.GetParaDrawing();
    if (para_drawing && para_drawing.DocumentContent) {
        return para_drawing.DocumentContent.Check_TableCoincidence(table);
    }
    return false;
};
CShape.prototype.Get_PrevElementEndInfo = function (CurElement) {
    var para_drawing = this.GetParaDrawing();
    if (isRealObject(para_drawing) && isRealObject(para_drawing.DocumentContent) && (para_drawing.DocumentContent.Get_PrevElementEndInfo)) {
        var parent_paragraph = para_drawing.Get_ParentParagraph();
        if (parent_paragraph) {
            return para_drawing.DocumentContent.Get_PrevElementEndInfo(parent_paragraph);
        }
    }
    return null;
};
CShape.prototype.Is_ThisElementCurrent = function (CurElement) {
    return editor.WordControl.m_oLogicDocument.DrawingObjects.getTargetDocContent() === this.getDocContent();
};
CShape.prototype.Is_UseInDocument = function () {
    return !this.bDeleted;
};
CShape.prototype.Is_HdrFtr = function (bool) {
    if (!this.group) {
        if (isRealObject(this.parent) && isRealObject(this.parent.DocumentContent)) {
            return this.parent.DocumentContent.Is_HdrFtr(bool);
        }
    } else {
        var cur_group = this.group;
        while (cur_group.group) {
            cur_group = cur_group.group;
        }
        if (isRealObject(cur_group.parent) && isRealObject(cur_group.parent.DocumentContent)) {
            return cur_group.parent.DocumentContent.Is_HdrFtr(bool);
        }
    }
    return bool ? null : false;
};
CShape.prototype.OnContentReDraw = function () {
    if (!isRealObject(this.group)) {
        if (isRealObject(this.parent)) {
            this.parent.OnContentReDraw();
        }
    } else {
        var cur_group = this.group;
        while (isRealObject(cur_group.group)) {
            cur_group = cur_group.group;
        }
        if (isRealObject(cur_group) && isRealObject(cur_group.parent)) {
            cur_group.parent.OnContentReDraw();
        }
    }
};
CShape.prototype.Get_TextBackGroundColor = function () {
    return undefined;
};
CShape.prototype.documentStatistics = function (stats) {
    var content = this.getDocContent();
    return content && content.DocumentStatistics(stats);
};
CShape.prototype.checkPosTransformText = function () {
    if (isRealNumber(this.posX) && isRealNumber(this.posY)) {
        this.transformText = this.localTransformText.CreateDublicate();
        global_MatrixTransformer.TranslateAppend(this.transformText, this.posX, this.posY);
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
    }
};
CShape.prototype.getNearestPos = function (x, y, pageIndex) {
    if (isRealObject(this.textBoxContent)) {
        var t_x = this.invertTransformText.TransformPointX(x, y);
        var t_y = this.invertTransformText.TransformPointY(x, y);
        var nearest_pos = this.textBoxContent.Get_NearestPos(pageIndex, t_x, t_y, false);
        nearest_pos.transform = this.transformText;
        return nearest_pos;
    }
    return null;
};
CShape.prototype.cursorGetPos = function () {
    var content = this.getDocContent();
    if (isRealObject(content)) {
        var pos = content.Cursor_GetPos();
        var transform = this.transformText;
        var x = transform.TransformPointX(pos.X, pos.Y);
        var y = transform.TransformPointY(pos.X, pos.Y);
        return {
            X: x,
            Y: y
        };
    }
    return {
        X: 0,
        Y: 0
    };
};
CShape.prototype.cursorMoveAt = function (X, Y, AddToSelect) {
    var content = this.getDocContent();
    if (isRealObject(content)) {
        var t_x = this.invertTransformText.TransformPointX(X, Y);
        var t_y = this.invertTransformText.TransformPointY(X, Y);
        content.Cursor_MoveAt(t_x, t_y, AddToSelect, undefined, isRealNumber(this.selectStartPage) ? this.selectStartPage : 0);
    }
};
CShape.prototype.Get_Styles = function () {
    return editor.WordControl.m_oLogicDocument.Styles;
};
CShape.prototype.Is_InTable = function (bReturnTopTable) {
    if (true === bReturnTopTable) {
        return null;
    }
    return false;
};
CShape.prototype.Get_Numbering = function () {
    return editor.WordControl.m_oLogicDocument.Get_Numbering();
};
CShape.prototype.Get_TableStyleForPara = function () {
    return editor.WordControl.m_oLogicDocument.Get_TableStyleForPara();
};
CShape.prototype.Is_Cell = function () {
    return false;
};
CShape.prototype.Is_DrawingShape = function () {
    return true;
};
CShape.prototype.Is_InTable = function (bReturnTopTable) {
    if (true === bReturnTopTable) {
        return null;
    }
    return false;
};
CShape.prototype.canChangeWrapPolygon = function (bReturnTopTable) {
    return true;
};
CShape.prototype.Get_ColorMap = function () {
    return editor.WordControl.m_oLogicDocument.Get_ColorMap();
};
CShape.prototype.Is_TopDocument = function () {
    return false;
};
CShape.prototype.recalcText = function () {
    if (this.recalculateText && this.recalcTxBoxContent && this.recalculateText) {
        this.recalcTxBoxContent();
        this.recalcTransformText();
    }
};
CShape.prototype.getRecalcObject = function () {
    var content = this.getDocContent && this.getDocContent();
    if (content) {
        return content.Save_RecalculateObject();
    }
    if (this.spTree) {
        var ret = [];
        for (var i = 0; i < this.spTree.length; ++i) {
            ret.push(this.spTree[i].getRecalcObject());
        }
        return ret;
    }
    return null;
};
CShape.prototype.setRecalcObject = function (object) {
    if (!object) {
        return;
    }
    var content = this.getDocContent && this.getDocContent();
    if (content) {
        content.Load_RecalculateObject(object);
    }
    if (Array.isArray(object) && this.spTree && this.spTree.length === object.length) {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].setRecalcObject(object[i]);
        }
    }
};
CShape.prototype.setStartPage = function (pageIndex, bNoResetSelectPage) {
    if (! (bNoResetSelectPage === true)) {
        this.selectStartPage = pageIndex;
    }
    var content = this.getDocContent && this.getDocContent();
    content && content.Set_StartPage(pageIndex);
    if (Array.isArray(this.spTree)) {
        for (var i = 0; i < this.spTree.length; ++i) {
            this.spTree[i].setStartPage && this.spTree[i].setStartPage(pageIndex);
        }
    }
};
CShape.prototype.getStyles = function () {
    return {
        styles: editor.WordControl.m_oLogicDocument.Styles,
        styleId: null
    };
};