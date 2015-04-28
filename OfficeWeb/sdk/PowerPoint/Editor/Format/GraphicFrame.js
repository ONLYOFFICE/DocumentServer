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
function CGraphicFrame() {
    this.parent = null;
    this.graphicObject = null;
    this.nvGraphicFramePr = null;
    this.spPr = null;
    this.group = null;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.transform = new CMatrix();
    this.compiledHierarchy = [];
    this.snapArrayX = [];
    this.snapArrayY = [];
    this.Pages = [];
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    this.compiledStyles = [];
    this.recalcInfo = {
        recalculateTransform: true,
        recalculateSizes: true,
        recalculateNumbering: true,
        recalculateShapeHierarchy: true,
        recalculateTable: true
    };
    this.bounds = {
        l: 0,
        t: 0,
        r: 0,
        b: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    this.RecalcInfo = {};
    this.bDeleted = true;
}
CGraphicFrame.prototype = {
    addToRecalculate: CShape.prototype.addToRecalculate,
    Get_Theme: CShape.prototype.Get_Theme,
    Get_ColorMap: CShape.prototype.Get_ColorMap,
    setBDeleted: CShape.prototype.setBDeleted,
    getBase64Img: CShape.prototype.getBase64Img,
    checkDrawingBaseCoords: CShape.prototype.checkDrawingBaseCoords,
    getSlideIndex: CShape.prototype.getSlideIndex,
    calculateSnapArrays: CShape.prototype.calculateSnapArrays,
    Is_DrawingShape: function () {
        return false;
    },
    handleUpdatePosition: function () {
        this.recalcInfo.recalculateTransform = true;
        this.addToRecalculate();
    },
    handleUpdateTheme: function () {
        this.compiledStyles = [];
        if (this.graphicObject) {
            this.graphicObject.Recalc_CompiledPr2();
            this.graphicObject.RecalcInfo.Recalc_AllCells();
            this.recalcInfo.recalculateSizes = true;
            this.recalcInfo.recalculateShapeHierarchy = true;
            this.recalcInfo.recalculateTable = true;
            this.addToRecalculate();
        }
    },
    handleUpdateFill: function () {},
    handleUpdateLn: function () {},
    handleUpdateExtents: function () {
        this.recalcInfo.recalculateTransform = true;
        this.addToRecalculate();
    },
    recalcText: function () {
        this.compiledStyles = [];
        if (this.graphicObject) {
            this.graphicObject.Recalc_CompiledPr2();
            this.graphicObject.RecalcInfo.Reset(true);
        }
        this.recalcInfo.recalculateTable = true;
        this.recalcInfo.recalculateSizes = true;
    },
    Get_TextBackGroundColor: function () {
        return undefined;
    },
    Get_PrevElementEndInfo: function () {
        return null;
    },
    Get_PageFields: function () {
        return editor.WordControl.m_oLogicDocument.Get_PageFields();
    },
    getDocContent: function () {
        if (this.graphicObject && this.graphicObject.CurCell && (false === this.graphicObject.Selection.Use || (true === this.graphicObject.Selection.Use && table_Selection_Text === this.graphicObject.Selection.Type))) {
            return this.graphicObject.CurCell.Content;
        }
        return null;
    },
    setSpPr: function (spPr) {
        History.Add(this, {
            Type: historyitem_GraphicFrameSetSpPr,
            oldPr: this.spPr,
            newPr: spPr
        });
        this.spPr = spPr;
    },
    setGraphicObject: function (graphicObject) {
        History.Add(this, {
            Type: historyitem_GraphicFrameSetGraphicObject,
            oldPr: this.graphicObject,
            newPr: graphicObject
        });
        this.graphicObject = graphicObject;
        if (this.graphicObject) {
            this.graphicObject.Index = 0;
        }
    },
    setNvSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_GraphicFrameSetSetNvSpPr,
            oldPr: this.nvGraphicFramePr,
            newPr: pr
        });
        this.nvGraphicFramePr = pr;
    },
    setParent: function (parent) {
        History.Add(this, {
            Type: historyitem_GraphicFrameSetSetParent,
            oldPr: this.parent,
            newPr: parent
        });
        this.parent = parent;
    },
    setGroup: function (group) {
        History.Add(this, {
            Type: historyitem_GraphicFrameSetSetGroup,
            oldPr: this.group,
            newPr: group
        });
        this.group = group;
    },
    getObjectType: function () {
        return historyitem_type_GraphicFrame;
    },
    Search: function (Str, Props, SearchEngine, Type) {
        if (this.graphicObject) {
            this.graphicObject.Search(Str, Props, SearchEngine, Type);
        }
    },
    Search_GetId: function (bNext, bCurrent) {
        if (this.graphicObject) {
            return this.graphicObject.Search_GetId(bNext, bCurrent);
        }
        return null;
    },
    copy: function () {
        var ret = new CGraphicFrame();
        if (this.graphicObject) {
            ret.setGraphicObject(this.graphicObject.Copy(ret));
            if (editor && editor.WordControl && editor.WordControl.m_oLogicDocument && isRealObject(editor.WordControl.m_oLogicDocument.globalTableStyles)) {
                ret.graphicObject.Reset(0, 0, this.graphicObject.XLimit, this.graphicObject.YLimit, ret.graphicObject.PageNum);
            }
        }
        if (this.nvGraphicFramePr) {
            ret.setNvSpPr(this.nvGraphicFramePr.createDuplicate());
        }
        if (this.spPr) {
            ret.setSpPr(this.spPr.createDuplicate());
            ret.spPr.setParent(ret);
        }
        ret.setBDeleted(false);
        if (!this.recalcInfo.recalculateTable && !this.recalcInfo.recalculateSizes && !this.recalcInfo.recalculateTransform) {
            ret.cachedImage = this.getBase64Img();
        }
        return ret;
    },
    isEmptyPlaceholder: function () {
        return false;
    },
    getAllFonts: function (fonts) {
        if (this.graphicObject) {
            for (var i = 0; i < this.graphicObject.Content.length; ++i) {
                var row = this.graphicObject.Content[i];
                var cells = row.Content;
                for (var j = 0; j < cells.length; ++j) {
                    cells[j].Content.Document_Get_AllFontNames(fonts);
                }
            }
            delete fonts["+mj-lt"];
            delete fonts["+mn-lt"];
            delete fonts["+mj-ea"];
            delete fonts["+mn-ea"];
            delete fonts["+mj-cs"];
            delete fonts["+mn-cs"];
        }
    },
    isSimpleObject: function () {
        return true;
    },
    Cursor_MoveToStartPos: function () {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveToStartPos();
            this.graphicObject.RecalculateCurPos();
        }
    },
    Cursor_MoveToEndPos: function () {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveToEndPos();
            this.graphicObject.RecalculateCurPos();
        }
    },
    hitInPath: function () {
        return false;
    },
    paragraphFormatPaste: function (CopyTextPr, CopyParaPr, Bool) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Paragraph_ClearFormatting: function () {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Paragraph_ClearFormatting();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Set_Props: function (props) {
        if (this.graphicObject) {
            var bApplyToAll = this.parent.graphicObjects.State.textObject !== this;
            this.graphicObject.Set_Props(props, bApplyToAll);
            this.OnContentRecalculate();
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    updateCursorType: function (x, y, e) {
        var tx = this.invertTransform.TransformPointX(x, y);
        var ty = this.invertTransform.TransformPointY(x, y);
        this.graphicObject.Update_CursorType(tx, ty, 0);
    },
    sendMouseData: function () {},
    Get_Id: function () {
        return this.Id;
    },
    getIsSingleBody: CShape.prototype.getIsSingleBody,
    getHierarchy: CShape.prototype.getHierarchy,
    getAllImages: function (images) {},
    recalculate: function () {
        if (this.bDeleted || !this.parent) {
            return;
        }
        ExecuteNoHistory(function () {
            if (this.recalcInfo.recalculateTable) {
                if (this.graphicObject) {
                    this.graphicObject.Set_PositionH(c_oAscHAnchor.Page, false, 0);
                    this.graphicObject.Set_PositionV(c_oAscVAnchor.Page, false, 0);
                    this.graphicObject.Parent = this;
                    this.graphicObject.Reset(0, 0, this.spPr.xfrm.extX, 10000, 0);
                    this.graphicObject.Recalculate_Page(0);
                }
                this.recalcInfo.recalculateTable = false;
            }
            if (this.recalcInfo.recalculateSizes) {
                this.recalculateSizes();
                this.recalcInfo.recalculateSizes = false;
            }
            if (this.recalcInfo.recalculateTransform) {
                this.recalculateTransform();
                this.calculateSnapArrays();
                this.recalcInfo.recalculateTransform = false;
                this.transformText = this.transform;
                this.invertTransformText = this.invertTransform;
                this.cachedImage = null;
                this.bounds.l = this.x;
                this.bounds.t = this.y;
                this.bounds.r = this.x + this.extX;
                this.bounds.b = this.y + this.extY;
                this.bounds.x = this.x;
                this.bounds.y = this.y;
                this.bounds.w = this.extX;
                this.bounds.h = this.extY;
            }
        },
        this, []);
    },
    recalculateSizes: function () {
        if (this.graphicObject) {
            this.graphicObject.XLimit -= this.graphicObject.X;
            this.graphicObject.X = 0;
            this.graphicObject.Y = 0;
            this.graphicObject.X_origin = 0;
            var _page_bounds = this.graphicObject.Get_PageBounds(0);
            this.spPr.xfrm.extY = _page_bounds.Bottom - _page_bounds.Top;
            this.spPr.xfrm.extX = _page_bounds.Right - _page_bounds.Left;
            this.extX = this.spPr.xfrm.extX;
            this.extY = this.spPr.xfrm.extY;
        }
    },
    Selection_Is_OneElement: function () {
        return 0;
    },
    recalculateCurPos: function () {
        this.graphicObject.RecalculateCurPos();
    },
    isShape: function () {
        return false;
    },
    isImage: function () {
        return false;
    },
    isGroup: function () {
        return false;
    },
    isChart: function () {
        return false;
    },
    isTable: function () {
        return this.graphicObject instanceof CTable;
    },
    Hyperlink_CanAdd: function (bCheck) {
        if (this.graphicObject) {
            return this.graphicObject.Hyperlink_CanAdd(bCheck);
        }
        return false;
    },
    Hyperlink_Check: function (bCheck) {
        if (this.graphicObject) {
            return this.graphicObject.Hyperlink_Check(bCheck);
        }
        return false;
    },
    getTransformMatrix: function () {
        return this.transform;
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
        return this.transform;
    },
    OnContentReDraw: function () {},
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
    changeSize: function (kw, kh) {
        if (this.spPr && this.spPr.xfrm && this.spPr.xfrm.isNotNull()) {
            var xfrm = this.spPr.xfrm;
            xfrm.setOffX(xfrm.offX * kw);
            xfrm.setOffY(xfrm.offY * kh);
        }
        this.recalcTransform && this.recalcTransform();
    },
    recalcTransform: function () {
        this.recalcInfo.recalculateTransform = true;
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
    canRotate: function () {
        return false;
    },
    canResize: function () {
        return false;
    },
    canMove: function () {
        return true;
    },
    canGroup: function () {
        return false;
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
    getSnapArrays: function (snapX, snapY) {
        var transform = this.getTransformMatrix();
        snapX.push(transform.tx);
        snapX.push(transform.tx + this.extX * 0.5);
        snapX.push(transform.tx + this.extX);
        snapY.push(transform.ty);
        snapY.push(transform.ty + this.extY * 0.5);
        snapY.push(transform.ty + this.extY);
    },
    hitInInnerArea: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
    },
    hitInTextRect: function (x, y) {
        return this.hitInInnerArea(x, y);
    },
    getInvertTransform: function () {
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
        }
        return this.invertTransform;
    },
    hitInBoundingRect: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        var _hit_context = this.getParentObjects().presentation.DrawingDocument.CanvasHitContext;
        return (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) || HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY) || HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY) || HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0));
    },
    Document_UpdateRulersState: function (margins) {
        if (this.graphicObject) {
            this.graphicObject.Document_UpdateRulersState(this.parent.num);
        }
    },
    Get_PageLimits: function (PageIndex) {
        return {
            X: 0,
            Y: 0,
            XLimit: Page_Width,
            YLimit: Page_Height
        };
    },
    getParentObjects: CShape.prototype.getParentObjects,
    Is_HdrFtr: function (bool) {
        if (bool) {
            return null;
        }
        return false;
    },
    Is_TableCellContent: function () {
        return false;
    },
    Is_InTable: function () {
        return null;
    },
    selectionSetStart: function (e, x, y, slideIndex) {
        if (g_mouse_button_right === e.Button) {
            this.rightButtonFlag = true;
            return;
        }
        if (isRealObject(this.graphicObject)) {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            if (g_mouse_event_type_down === e.Type) {
                if (this.graphicObject.Is_TableBorder(tx, ty, 0)) {
                    if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                        History.Create_NewPoint(historydescription_Presentation_TableBorder);
                    } else {
                        return;
                    }
                }
            }
            this.graphicObject.Selection_SetStart(tx, ty, 0, e);
            this.graphicObject.RecalculateCurPos();
            return;
        }
    },
    selectionSetEnd: function (e, x, y, slideIndex) {
        if (g_mouse_event_type_move === e.Type) {
            this.rightButtonFlag = false;
        }
        if (this.rightButtonFlag && g_mouse_event_type_up === e.Type) {
            this.rightButtonFlag = false;
            return;
        }
        if (isRealObject(this.graphicObject)) {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            this.graphicObject.Selection_SetEnd(tx, ty, 0, e);
        }
    },
    updateSelectionState: function () {
        if (isRealObject(this.graphicObject)) {
            var drawingDocument = this.parent.presentation.DrawingDocument;
            var Doc = this.graphicObject;
            if (true === Doc.Is_SelectionUse() && !Doc.Selection_IsEmpty()) {
                drawingDocument.UpdateTargetTransform(this.transform);
                drawingDocument.TargetEnd();
                drawingDocument.SelectEnabled(true);
                drawingDocument.SelectClear();
                Doc.Selection_Draw_Page(this.parent.num);
                drawingDocument.SelectShow();
            } else {
                drawingDocument.SelectEnabled(false);
                Doc.RecalculateCurPos();
                drawingDocument.UpdateTargetTransform(this.transform);
                drawingDocument.TargetShow();
            }
        } else {
            this.parent.presentation.DrawingDocument.UpdateTargetTransform(null);
            this.parent.presentation.DrawingDocument.TargetEnd();
            this.parent.presentation.DrawingDocument.SelectEnabled(false);
            this.parent.presentation.DrawingDocument.SelectClear();
            this.parent.presentation.DrawingDocument.SelectShow();
        }
    },
    Is_TopDocument: function () {
        return false;
    },
    drawAdjustments: function () {},
    recalculateTransform: CShape.prototype.recalculateTransform,
    recalculateLocalTransform: CShape.prototype.recalculateLocalTransform,
    deleteDrawingBase: CShape.prototype.deleteDrawingBase,
    addToDrawingObjects: CShape.prototype.addToDrawingObjects,
    select: CShape.prototype.select,
    deselect: CShape.prototype.deselect,
    Update_ConentIndexing: function () {},
    draw: function (graphics) {
        if (graphics.IsSlideBoundsCheckerType === true) {
            graphics.transform3(this.transform);
            graphics._s();
            graphics._m(0, 0);
            graphics._l(this.extX, 0);
            graphics._l(this.extX, this.extY);
            graphics._l(0, this.extY);
            graphics._e();
            return;
        }
        if (this.graphicObject) {
            graphics.transform3(this.transform);
            graphics.SetIntegerGrid(true);
            this.graphicObject.Draw(0, graphics);
            if (locktype_None != this.Lock.Get_Type() && !this.group) {
                graphics.DrawLockObjectRect(this.Lock.Get_Type(), 0, 0, this.extX, this.extY);
            }
            graphics.reset();
            graphics.SetIntegerGrid(true);
        }
    },
    Select: function () {},
    Set_CurrentElement: function () {
        if (this.parent && this.parent.graphicObjects) {
            this.parent.graphicObjects.resetSelection(true);
            if (this.group) {
                var main_group = this.group.getMainGroup();
                this.parent.graphicObjects.selectObject(main_group, 0);
                main_group.selectObject(this, this.parent.num);
                main_group.selection.textSelection = this;
            } else {
                this.parent.graphicObjects.selectObject(this, 0);
                this.parent.graphicObjects.selection.textSelection = this;
            }
            if (editor.WordControl.m_oLogicDocument.CurPage !== this.parent.num) {
                editor.WordControl.m_oLogicDocument.Set_CurPage(this.parent.num);
                editor.WordControl.GoToPage(this.parent.num);
            }
        }
    },
    OnContentRecalculate: function () {
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.Document_UpdateRulersState();
    },
    getTextSelectionState: function () {
        return this.graphicObject.Get_SelectionState();
    },
    setTextSelectionState: function (Sate) {
        return this.graphicObject.Set_SelectionState(Sate, Sate.length - 1);
    },
    isPlaceholder: function () {
        return this.nvGraphicFramePr && this.nvGraphicFramePr.nvPr && this.nvGraphicFramePr.nvPr.ph !== null;
    },
    getPhType: function () {
        if (this.isPlaceholder()) {
            return this.nvGraphicFramePr.nvPr.ph.type;
        }
        return null;
    },
    getPhIndex: function () {
        if (this.isPlaceholder()) {
            return this.nvGraphicFramePr.nvPr.ph.idx;
        }
        return null;
    },
    getPlaceholderType: function () {
        return this.getPhType();
    },
    getPlaceholderIndex: function () {
        return this.getPhIndex();
    },
    paragraphAdd: function (paraItem, bRecalculate) {},
    applyTextFunction: function (docContentFunction, tableFunction, args) {
        if (tableFunction === CTable.prototype.Paragraph_Add) {
            if ((args[0].Type === para_NewLine || args[0].Type === para_Text || args[0].Type === para_Space || args[0].Type === para_Tab || args[0].Type === para_PageNum) && this.graphicObject.Selection.Use) {
                this.graphicObject.Remove(1, true, undefined, true);
            }
        } else {
            if (tableFunction === CTable.prototype.Add_NewParagraph) {
                this.graphicObject.Selection.Use && this.graphicObject.Remove(1, true, undefined, true);
            }
        }
        tableFunction.apply(this.graphicObject, args);
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        this.graphicObject.Remove(Count, bOnlyText, bRemoveOnlySelection);
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
    },
    addNewParagraph: function () {
        this.graphicObject.Add_NewParagraph(false);
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateTransformText = true;
    },
    setParagraphAlign: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ParagraphAlign(val);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransform = true;
        }
    },
    applyAllAlign: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphAlign(val);
            this.graphicObject.Set_ApplyToAll(false);
        }
    },
    setParagraphSpacing: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ParagraphSpacing(val);
        }
    },
    applyAllSpacing: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphSpacing(val);
            this.graphicObject.Set_ApplyToAll(false);
        }
    },
    setParagraphNumbering: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ParagraphNumbering(val);
        }
    },
    setParagraphIndent: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ParagraphIndent(val);
        }
    },
    setParent2: function (parent) {
        History.Add(this, {
            Type: historyitem_GraphicFrameSetSetParent,
            oldPr: this.parent,
            newPr: parent
        });
        this.parent = parent;
    },
    setWordFlag: function (bPresentation, Document) {
        if (this.graphicObject) {
            this.graphicObject.bPresentation = bPresentation;
            for (var i = 0; i < this.graphicObject.Content.length; ++i) {
                var row = this.graphicObject.Content[i];
                for (var j = 0; j < row.Content.length; ++j) {
                    var content = row.Content[j].Content;
                    if (!bPresentation && Document) {
                        content.Styles = Document.Styles;
                    } else {
                        content.Styles = null;
                    }
                    content.bPresentation = bPresentation;
                    for (var k = 0; k < content.Content.length; ++k) {
                        content.Content[k].bFromDocument = !bPresentation;
                    }
                }
            }
        }
    },
    Get_Styles: function (level) {
        if (isRealNumber(level)) {
            if (!this.compiledStyles[level]) {
                CShape.prototype.recalculateTextStyles.call(this, level);
            }
            return this.compiledStyles[level];
        } else {
            return editor.WordControl.m_oLogicDocument.globalTableStyles;
        }
    },
    Get_StartPage_Absolute: function () {
        return this.parent.num;
    },
    Get_PageContentStartPos: function (PageNum) {
        var presentation = editor.WordControl.m_oLogicDocument;
        return {
            X: 0,
            XLimit: presentation.Width,
            Y: 0,
            YLimit: presentation.Height,
            MaxTopBorder: 0
        };
    },
    hitToHandles: function () {
        return -1;
    },
    hitToAdjustment: function () {
        return {
            hit: false
        };
    },
    Refresh_RecalcData: function () {
        this.Refresh_RecalcData2();
    },
    Refresh_RecalcData2: function () {
        this.recalcInfo.recalculateTable = true;
        this.recalcInfo.recalculateSizes = true;
        this.addToRecalculate();
    },
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_ShapeSetBDeleted:
            this.bDeleted = data.oldPr;
            break;
        case historyitem_GraphicFrameSetSpPr:
            this.spPr = data.oldPr;
            break;
        case historyitem_GraphicFrameSetGraphicObject:
            this.graphicObject = data.oldPr;
            if (this.graphicObject) {
                this.graphicObject.Index = 0;
            }
            break;
        case historyitem_GraphicFrameSetSetNvSpPr:
            this.nvGraphicFramePr = data.oldPr;
            break;
        case historyitem_GraphicFrameSetSetParent:
            this.parent = data.oldPr;
            break;
        case historyitem_GraphicFrameSetSetGroup:
            this.group = data.oldPr;
            break;
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_ShapeSetBDeleted:
            this.bDeleted = data.newPr;
            break;
        case historyitem_GraphicFrameSetSpPr:
            this.spPr = data.newPr;
            break;
        case historyitem_GraphicFrameSetGraphicObject:
            this.graphicObject = data.newPr;
            if (this.graphicObject) {
                this.graphicObject.Index = 0;
            }
            break;
        case historyitem_GraphicFrameSetSetNvSpPr:
            this.nvGraphicFramePr = data.newPr;
            break;
        case historyitem_GraphicFrameSetSetParent:
            this.parent = data.newPr;
            break;
        case historyitem_GraphicFrameSetSetGroup:
            this.group = data.newPr;
            break;
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(data.Type);
        switch (data.Type) {
        case historyitem_GraphicFrameSetSpPr:
            case historyitem_GraphicFrameSetGraphicObject:
            case historyitem_GraphicFrameSetSetNvSpPr:
            case historyitem_GraphicFrameSetSetParent:
            case historyitem_GraphicFrameSetSetGroup:
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
        case historyitem_ShapeSetBDeleted:
            this.bDeleted = readBool(r);
            break;
        case historyitem_GraphicFrameSetSpPr:
            this.spPr = readObject(r);
            break;
        case historyitem_GraphicFrameSetGraphicObject:
            this.graphicObject = readObject(r);
            if (this.graphicObject) {
                this.graphicObject.Index = 0;
            }
            break;
        case historyitem_GraphicFrameSetSetNvSpPr:
            this.nvGraphicFramePr = readObject(r);
            break;
        case historyitem_GraphicFrameSetSetParent:
            this.parent = readObject(r);
            break;
        case historyitem_GraphicFrameSetSetGroup:
            this.group = readObject(r);
            break;
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_GraphicFrame);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    }
};