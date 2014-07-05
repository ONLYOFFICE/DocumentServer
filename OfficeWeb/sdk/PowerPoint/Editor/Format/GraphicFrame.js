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
 function CGraphicFrame(parent) {
    this.graphicObject = null;
    this.nvGraphicFramePr = null;
    this.spPr = new CSpPr();
    this.recalcInfo = {
        recalculateTransform: true,
        recalculateSizes: true,
        recalculateNumbering: true,
        recalculateShapeHierarchy: true
    };
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.transform = new CMatrix();
    this.compiledHierarchy = [];
    this.textPropsForRecalc = [];
    this.Lock = new CLock();
    this.Id = g_oIdCounter.Get_NewId();
    g_oTableId.Add(this, this.Id);
    this.stlesForParagraph = [];
    if (parent) {
        this.setParent(parent);
        var nv_sp_pr = new UniNvPr();
        nv_sp_pr.cNvPr.id = ++parent.maxId;
        this.setNvSpPr(nv_sp_pr);
    }
}
CGraphicFrame.prototype = {
    getCurDocumentContent: function () {
        return this.graphicObject.CurCell ? this.graphicObject.CurCell.Content : null;
    },
    setSpPr: function (spPr) {
        History.Add(this, {
            Type: historyitem_SetSetSpPr,
            oldPr: this.spPr,
            newPr: spPr
        });
        this.spPr = spPr;
    },
    copy: function (sp) {
        if (! (sp instanceof CGraphicFrame)) {
            sp = new CGraphicFrame();
        }
        sp.setSpPr(this.spPr.createDuplicate());
        if (this.nvGraphicFramePr) {
            sp.setNvSpPr(this.nvGraphicFramePr.createDuplicate());
        }
        var table = this.graphicObject.Copy(sp);
        sp.setGraphicObject(table);
        return sp;
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
    getSearchResults: function (str) {
        if (this.graphicObject instanceof CTable) {
            var ret = [];
            var rows = this.graphicObject.Content;
            for (var i = 0; i < rows.length; ++i) {
                var cells = rows[i].Content;
                for (var j = 0; j < cells.length; ++j) {
                    var cell = cells[j];
                    var s_arr = cell.Content.getSearchResults(str);
                    if (Array.isArray(s_arr) && s_arr.length > 0) {
                        for (var t = 0; t < s_arr.length; ++t) {
                            var s = {};
                            s.id = STATES_ID_TEXT_ADD;
                            s.textObject = this;
                            var TableState = new Object();
                            TableState.Selection = {
                                Start: true,
                                Use: true,
                                StartPos: {
                                    Pos: {
                                        Row: i,
                                        Cell: j
                                    },
                                    X: this.graphicObject.Selection.StartPos.X,
                                    Y: this.graphicObject.Selection.StartPos.Y
                                },
                                EndPos: {
                                    Pos: {
                                        Row: i,
                                        Cell: j
                                    },
                                    X: this.graphicObject.Selection.EndPos.X,
                                    Y: this.graphicObject.Selection.EndPos.Y
                                },
                                Type: table_Selection_Text,
                                Data: null,
                                Type2: table_Selection_Common,
                                Data2: null
                            };
                            TableState.Selection.Data = new Array();
                            TableState.CurCell = {
                                Row: i,
                                Cell: j
                            };
                            s_arr[t].push(TableState);
                            s.textSelectionState = s_arr[t];
                            ret.push(s);
                        }
                    }
                }
            }
            return ret;
        }
        return [];
    },
    hitInPath: function () {
        return false;
    },
    setGraphicObject: function (graphicObject) {
        History.Add(this, {
            Type: historyitem_SetGraphicObject,
            oldPr: this.graphicObject,
            newPr: graphicObject
        });
        this.graphicObject = graphicObject;
    },
    setNvSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_SetSetNvSpPr,
            oldPr: this.nvGraphicFramePr,
            newPr: pr
        });
        this.nvGraphicFramePr = pr;
        if (this.parent && pr && pr.cNvPr && isRealNumber(pr.cNvPr.id)) {
            if (pr.cNvPr.id > this.parent.maxId) {
                this.parent.maxId = pr.cNvPr.id + 1;
            }
        }
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
    pointInSelectedText: function (x, y) {
        if (this.graphicObject) {
            var tx = this.invertTransform.TransformPointX(x, y);
            var ty = this.invertTransform.TransformPointY(x, y);
            return this.graphicObject.Selection_Check(tx, ty, this.parent.num);
        }
        return false;
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
    recalculate: function () {
        if (isRealObject(this.graphicObject) && isRealObject(this.parent) && (Array.isArray(this.graphicObject.Content) && this.graphicObject.Content.length > 0)) {
            if (this.recalcInfo.recalculateNumbering) {
                var rows = this.graphicObject.Content;
                for (var i = 0; i < rows.length; ++i) {
                    var row = rows[i];
                    var cells = row.Content;
                    for (var j = 0; j < cells.length; ++j) {
                        var cell = cells[j];
                        cell.Content.RecalculateNumbering();
                    }
                }
            }
            this.graphicObject.X = 0;
            this.graphicObject.Y = 0;
            this.graphicObject.PageNum = 0;
            var parent_object = this.getParentObjects();
            for (var i = 0; i < this.textPropsForRecalc.length; ++i) {
                var props = this.textPropsForRecalc[i].Value;
                if (props && props.FontFamily && typeof props.FontFamily.Name === "string" && isThemeFont(props.FontFamily.Name)) {
                    props.FontFamily.themeFont = props.FontFamily.Name;
                    props.FontFamily.Name = getFontInfo(props.FontFamily.Name)(parent_object.theme.themeElements.fontScheme);
                }
                var TextPr = props;
                var parents = parent_object;
                if (isRealObject(TextPr) && isRealObject(TextPr.unifill)) {
                    TextPr.unifill.calculate(parents.theme, parents.slide, parents.layout, parents.master, {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 255
                    });
                    var _rgba = TextPr.unifill.getRGBAColor();
                    TextPr.Color = new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
                }
                if (isRealObject(props.FontFamily) && typeof props.FontFamily.Name === "string") {
                    TextPr.RFonts.Ascii = {
                        Name: TextPr.FontFamily.Name,
                        Index: -1
                    };
                    TextPr.RFonts.CS = {
                        Name: TextPr.FontFamily.Name,
                        Index: -1
                    };
                    TextPr.RFonts.HAnsi = {
                        Name: TextPr.FontFamily.Name,
                        Index: -1
                    };
                }
            }
            this.textPropsForRecalc.length = 0;
            this.graphicObject.Recalculate_Page(0);
        }
        if (this.recalcInfo.recalculateSizes) {
            this.recalculateSizes();
            this.recalcInfo.recalculateSizes = false;
        }
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = false;
        }
    },
    onParagraphChanged: function () {
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    recalculateSizes: function () {
        this.graphicObject.XLimit -= this.graphicObject.X;
        this.graphicObject.YLimit -= this.graphicObject.Y;
        this.graphicObject.X = 0;
        this.graphicObject.Y = 0;
        this.graphicObject.X_origin = 0;
        var _page_bounds = this.graphicObject.Get_PageBounds(0);
        this.spPr.xfrm.extY = _page_bounds.Bottom - _page_bounds.Top;
        this.spPr.xfrm.extX = _page_bounds.Right - _page_bounds.Left;
    },
    Selection_Is_OneElement: function () {
        return true;
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
    recalcAllColors: function () {
        this.recalcInfo.recalculateNumbering = true;
        this.stlesForParagraph = [];
        this.graphicObject.Recalc_CompiledPr();
    },
    recalcAll: function () {
        this.recalcInfo = {
            recalculateTransform: true,
            recalculateSizes: true,
            recalculateNumbering: true,
            recalculateShapeHierarchy: true
        };
        this.stlesForParagraph = [];
        this.graphicObject.Recalc_CompiledPr();
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
    Hyperlink_Add: function (HyperProps) {
        if (this.graphicObject) {
            this.graphicObject.Hyperlink_Add(HyperProps);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransform = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Hyperlink_Modify: function (HyperProps) {
        if (this.graphicObject) {
            this.graphicObject.Hyperlink_Modify(HyperProps);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransform = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Hyperlink_Remove: function () {
        if (this.graphicObject) {
            this.graphicObject.Hyperlink_Remove();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransform = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
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
    applyAllTextProps: function (textPr) {
        if (this.graphicObject) {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Paragraph_Add(textPr);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateSizes = true;
            this.recalcInfo.recalculateTransform = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
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
    changeSize: function (kw, kh) {},
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
        xfrm.rot = rot;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
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
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
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
    getSnapArrays: function (snapX, snapY) {
        var transform = this.getTransformMatrix();
        snapX.push(transform.tx);
        snapX.push(transform.tx + this.extX * 0.5);
        snapX.push(transform.tx + this.extX);
        snapY.push(transform.ty);
        snapY.push(transform.ty + this.extY * 0.5);
        snapY.push(transform.ty + this.extY);
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
        if (isRealObject(this.graphicObject)) {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            if (g_mouse_event_type_down === e.Type) {
                if (this.graphicObject.Is_TableBorder(tx, ty, 0)) {
                    History.Create_NewPoint();
                }
            }
            this.graphicObject.Selection_SetStart(tx, ty, 0, e);
            this.graphicObject.RecalculateCurPos();
            return;
        }
    },
    isTableBorder: function (x, y) {
        var tx, ty;
        tx = this.invertTransform.TransformPointX(x, y);
        ty = this.invertTransform.TransformPointY(x, y);
        return this.graphicObject.Is_TableBorder(tx, ty, 0) != null;
    },
    selectionSetEnd: function (e, x, y, slideIndex) {
        if (isRealObject(this.graphicObject)) {
            var tx, ty;
            tx = this.invertTransform.TransformPointX(x, y);
            ty = this.invertTransform.TransformPointY(x, y);
            this.graphicObject.Selection_SetEnd(tx, ty, 0, e);
            if (g_mouse_event_type_up === e.Type) {
                editor.WordControl.m_oLogicDocument.Recalculate();
            }
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
                drawingDocument.UpdateTargetTransform(this.transform);
                drawingDocument.TargetShow();
                drawingDocument.SelectEnabled(false);
            }
        } else {
            this.parent.presentation.DrawingDocument.UpdateTargetTransform(null);
            this.parent.presentation.DrawingDocument.TargetEnd();
            this.parent.presentation.DrawingDocument.SelectEnabled(false);
            this.parent.presentation.DrawingDocument.SelectClear();
            this.parent.presentation.DrawingDocument.SelectShow();
        }
    },
    updateInterfaceTextState: function () {
        if (this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Document_UpdateInterfaceState === "function") {
            return this.graphicObject.Document_UpdateInterfaceState();
        }
    },
    drawAdjustments: function () {},
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
    draw: function (graphics) {
        if (this.graphicObject !== null && typeof this.graphicObject === "object" && this.graphicObject.Draw) {
            graphics.transform3(this.transform);
            graphics.SetIntegerGrid(true);
            this.graphicObject.Draw(0, graphics);
            if (locktype_None != this.Lock.Get_Type()) {
                graphics.DrawLockObjectRect(this.Lock.Get_Type(), 0, 0, this.extX, this.extY);
            }
            graphics.reset();
            graphics.SetIntegerGrid(true);
        }
    },
    Select: function () {},
    Set_CurrentElement: function () {},
    OnContentRecalculate: function () {
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    getTextSelectionState: function () {
        return this.graphicObject.Get_SelectionState();
    },
    setTextSelectionState: function (Sate) {
        return this.graphicObject.Set_SelectionState(Sate, Sate.length - 1);
    },
    getStylesForParagraph: function (level) {
        if (level == undefined) {
            level = 0;
        }
        if (this.stlesForParagraph[level]) {
            return this.stlesForParagraph[level];
        }
        var Styles = new CStyles();
        var theme = null,
        layout = null,
        master = null,
        presentation;
        switch (this.parent.kind) {
        case SLIDE_KIND:
            layout = this.parent.Layout;
            if (layout != null) {
                master = layout.Master;
                if (master != null) {
                    theme = master.Theme;
                    presentation = master.presentation;
                }
            }
            break;
        case LAYOUT_KIND:
            layout = this.parent;
            if (layout != null) {
                master = layout.Master;
                if (master != null) {
                    theme = master.Theme;
                    presentation = master.presentation;
                }
            }
            break;
        case MASTER_KIND:
            master = this.parent;
            if (master != null) {
                theme = master.Theme;
                presentation = master.presentation;
            }
            break;
        }
        var isPlaceholder = this.isPlaceholder();
        if (isPlaceholder) {
            var phId = this.nvGraphicFramePr.nvPr.ph.idx,
            phType = this.nvGraphicFramePr.nvPr.ph.type;
            var b_is_single_body = this.getIsSingleBody();
            var layoutShape = null,
            masterShape = null;
            if (layout != null) {
                layoutShape = layout.getMatchingShape(phType, phId, b_is_single_body);
            }
            if (master != null) {
                masterShape = master.getMatchingShape(phType, phId, b_is_single_body);
            }
        }
        var defaultStyle = null,
        masterStyle = null,
        masterShapeStyle = null,
        layoutShapeStyle = null,
        slideShapeStyle = null;
        if (presentation != null && presentation.defaultTextStyle != null && presentation.defaultTextStyle.levels[level] != null) {
            defaultStyle = new CStyle("defaultStyle", null, null, null);
            defaultStyle.ParaPr = clone(presentation.defaultTextStyle.levels[level].pPr);
            defaultStyle.TextPr = clone(presentation.defaultTextStyle.levels[level].rPr);
            if (defaultStyle.TextPr != undefined) {
                if (defaultStyle.TextPr.FontFamily && defaultStyle.TextPr.FontFamily.Name) {
                    if (isThemeFont(defaultStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                        defaultStyle.TextPr.FontFamily.themeFont = defaultStyle.TextPr.FontFamily.Name;
                        defaultStyle.TextPr.FontFamily.Name = getFontInfo(defaultStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                }
                if (defaultStyle.TextPr.unifill && defaultStyle.TextPr.unifill.fill) {
                    defaultStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 0
                    });
                    var _rgba = defaultStyle.TextPr.unifill.getRGBAColor();
                    defaultStyle.TextPr.Color = new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
                }
                if (defaultStyle.TextPr.FontSize != undefined) {
                    defaultStyle.TextPr.themeFontSize = defaultStyle.TextPr.FontSize;
                }
            }
        }
        if (master && master.txStyles) {
            if (isPlaceholder) {
                switch (phType) {
                case phType_ctrTitle:
                    case phType_title:
                    if (master.txStyles.titleStyle && master.txStyles.titleStyle.levels[level]) {
                        masterStyle = new CStyle("masterStyle", null, null, null);
                        masterStyle.ParaPr = clone(master.txStyles.titleStyle.levels[level].pPr);
                        masterStyle.TextPr = clone(master.txStyles.titleStyle.levels[level].rPr);
                    }
                    break;
                case phType_body:
                    case phType_subTitle:
                    case phType_obj:
                    if (master.txStyles.bodyStyle && master.txStyles.bodyStyle.levels[level]) {
                        masterStyle = new CStyle("masterStyle", null, null, null);
                        masterStyle.ParaPr = clone(master.txStyles.bodyStyle.levels[level].pPr);
                        masterStyle.TextPr = clone(master.txStyles.bodyStyle.levels[level].rPr);
                    }
                    break;
                default:
                    if (master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level]) {
                        masterStyle = new CStyle("masterStyle", null, null, null);
                        masterStyle.ParaPr = clone(master.txStyles.otherStyle.levels[level].pPr);
                        masterStyle.TextPr = clone(master.txStyles.otherStyle.levels[level].rPr);
                    }
                    break;
                }
            } else {
                if (master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level]) {
                    masterStyle = new CStyle("masterStyle", null, null, null);
                    masterStyle.ParaPr = clone(master.txStyles.otherStyle.levels[level].pPr);
                    masterStyle.TextPr = clone(master.txStyles.otherStyle.levels[level].rPr);
                }
            }
            if (masterStyle && masterStyle.TextPr) {
                if (masterStyle.TextPr.FontFamily && masterStyle.TextPr.FontFamily.Name) {
                    if (masterStyle.TextPr.FontFamily && isThemeFont(masterStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                        masterStyle.TextPr.FontFamily.themeFont = masterStyle.TextPr.FontFamily.Name;
                        masterStyle.TextPr.FontFamily.Name = getFontInfo(masterStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                }
                if (masterStyle.TextPr.unifill && masterStyle.TextPr.unifill.fill) {
                    masterStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 0
                    });
                    var _rgba = masterStyle.TextPr.unifill.getRGBAColor();
                    masterStyle.TextPr.Color = new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
                }
                if (masterStyle.TextPr.FontSize != undefined) {
                    masterStyle.TextPr.themeFontSize = masterStyle.TextPr.FontSize;
                }
            }
        }
        if (isPlaceholder) {
            if (masterShape && masterShape.txBody && masterShape.txBody.lstStyle && masterShape.txBody.lstStyle.levels[level]) {
                masterShapeStyle = new CStyle("masterShapeStyle", null, null, null);
                masterShapeStyle.ParaPr = clone(masterShape.txBody.lstStyle.levels[level].pPr);
                masterShapeStyle.TextPr = clone(masterShape.txBody.lstStyle.levels[level].rPr);
                if (masterShapeStyle.TextPr) {
                    if (masterShapeStyle.TextPr.FontFamily && isThemeFont(masterShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                        masterShapeStyle.TextPr.FontFamily.themeFont = masterShapeStyle.TextPr.FontFamily.Name;
                        masterShapeStyle.TextPr.FontFamily.Name = getFontInfo(masterShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                    if (masterShapeStyle.TextPr.unifill && masterShapeStyle.TextPr.unifill.fill) {
                        masterShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                            R: 0,
                            G: 0,
                            B: 0,
                            A: 0
                        });
                        var _rgba = masterShapeStyle.TextPr.unifill.getRGBAColor();
                        masterShapeStyle.TextPr.Color = new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
                    }
                }
            }
            if (layoutShape && layoutShape.txBody && layoutShape.txBody.lstStyle && layoutShape.txBody.lstStyle.levels[level]) {
                layoutShapeStyle = new CStyle("layoutShapeStyle", null, null, null);
                layoutShapeStyle.ParaPr = clone(layoutShape.txBody.lstStyle.levels[level].pPr);
                layoutShapeStyle.TextPr = clone(layoutShape.txBody.lstStyle.levels[level].rPr);
                if (layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.FontFamily && isThemeFont(layoutShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                    layoutShapeStyle.TextPr.FontFamily.themeFont = layoutShapeStyle.TextPr.FontFamily.Name;
                    layoutShapeStyle.TextPr.FontFamily.Name = getFontInfo(layoutShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                }
                if (layoutShapeStyle && layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.unifill) {
                    layoutShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 0
                    });
                    var _rgba = layoutShapeStyle.TextPr.unifill.getRGBAColor();
                    layoutShapeStyle.TextPr.Color = new CDocumentColor(_rgba.R, _rgba.G, _rgba.B);
                }
            }
        }
        if (this.txBody && this.txBody.lstStyle && this.txBody.lstStyle.levels[level]) {
            slideShapeStyle = new CStyle("slideShapeStyle", null, null, null);
            slideShapeStyle.ParaPr = clone(this.txBody.lstStyle.levels[level].pPr);
            slideShapeStyle.TextPr = clone(this.txBody.lstStyle.levels[level].rPr);
            if (slideShapeStyle.TextPr && slideShapeStyle.TextPr.FontFamily && isThemeFont(slideShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                slideShapeStyle.TextPr.FontFamily.themeFont = slideShapeStyle.TextPr.FontFamily.Name;
                slideShapeStyle.TextPr.FontFamily.Name = getFontInfo(slideShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
            }
            if (slideShapeStyle && slideShapeStyle.TextPr && slideShapeStyle.TextPr.unifill && slideShapeStyle.TextPr.unifill.fill) {
                slideShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                    R: 0,
                    G: 0,
                    B: 0,
                    A: 0
                });
                var _rgba = slideShapeStyle.TextPr.unifill.getRGBAColor();
                slideShapeStyle.TextPr.Color = {
                    r: _rgba.R,
                    g: _rgba.G,
                    b: _rgba.B,
                    a: _rgba.A
                };
            }
        }
        if (isPlaceholder) {
            if (defaultStyle) {
                Styles.Style[Styles.Id] = defaultStyle;
                defaultStyle.BasedOn = null;
                ++Styles.Id;
            }
            if (masterStyle) {
                Styles.Style[Styles.Id] = masterStyle;
                masterStyle.BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
        } else {
            if (masterStyle) {
                Styles.Style[Styles.Id] = masterStyle;
                masterStyle.BasedOn = null;
                ++Styles.Id;
            }
            if (defaultStyle) {
                Styles.Style[Styles.Id] = defaultStyle;
                defaultStyle.BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
        }
        if (masterShapeStyle) {
            Styles.Style[Styles.Id] = masterShapeStyle;
            masterShapeStyle.BasedOn = Styles.Id - 1;
            ++Styles.Id;
        }
        if (layoutShapeStyle) {
            Styles.Style[Styles.Id] = layoutShapeStyle;
            layoutShapeStyle.BasedOn = Styles.Id - 1;
            ++Styles.Id;
        }
        if (slideShapeStyle) {
            Styles.Style[Styles.Id] = slideShapeStyle;
            slideShapeStyle.BasedOn = Styles.Id - 1;
            ++Styles.Id;
        }
        this.stlesForParagraph[level] = Styles;
        return Styles;
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
    setParent: function (parent) {
        History.Add(this, {
            Type: historyitem_SetShapeParent,
            Old: this.parent,
            New: parent
        });
        this.parent = parent;
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        this.graphicObject.Paragraph_Add(paraItem, false);
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        this.graphicObject.Remove(Count, bOnlyText, bRemoveOnlySelection);
        this.recalcInfo.recalculateSizes = true;
        this.recalcInfo.recalculateTransform = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    addNewParagraph: function () {
        this.graphicObject.Add_NewParagraph(false);
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setParagraphAlign: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ParagraphAlign(val);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransform = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    applyAllAlign: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphAlign(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    setParagraphSpacing: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ParagraphSpacing(val);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    applyAllSpacing: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphSpacing(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    setParagraphNumbering: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ParagraphNumbering(val);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    applyAllNumbering: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphNumbering(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    setParagraphIndent: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ParagraphIndent(val);
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    applyAllIndent: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Set_ParagraphIndent(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Paragraph_IncDecFontSize: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Paragraph_IncDecFontSize(val);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Paragraph_IncDecFontSizeAll: function (val) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Set_ApplyToAll(true);
            this.graphicObject.Paragraph_IncDecFontSize(val);
            this.graphicObject.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveLeft(AddToSelect, Word);
            this.graphicObject.RecalculateCurPos();
        }
    },
    Cursor_MoveRight: function (AddToSelect, Word) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveRight(AddToSelect, Word);
            this.graphicObject.RecalculateCurPos();
        }
    },
    Cursor_MoveUp: function (AddToSelect) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveUp(AddToSelect);
            this.graphicObject.RecalculateCurPos();
        }
    },
    Cursor_MoveDown: function (AddToSelect) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveDown(AddToSelect);
            this.graphicObject.RecalculateCurPos();
        }
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveEndOfLine(AddToSelect);
            this.graphicObject.RecalculateCurPos();
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveStartOfLine(AddToSelect);
            this.graphicObject.RecalculateCurPos();
        }
    },
    Cursor_MoveAt: function (X, Y, AddToSelect) {
        if (isRealObject(this.graphicObject)) {
            this.graphicObject.Cursor_MoveAt(X, Y, AddToSelect);
            this.graphicObject.RecalculateCurPos();
        }
    },
    Get_Styles: function (level, bTablesStyleId, bParagraph) {
        if (level == undefined) {
            level = 0;
        }
        var Styles = new CStyles();
        if (!this.parent) {
            return Styles;
        }
        var theme = null,
        layout = null,
        master = null,
        presentation;
        switch (this.parent.kind) {
        case SLIDE_KIND:
            layout = this.parent.Layout;
            if (layout != null) {
                master = layout.Master;
                if (master != null) {
                    theme = master.Theme;
                    presentation = master.presentation;
                }
            }
            break;
        case LAYOUT_KIND:
            layout = this.parent;
            if (layout != null) {
                master = layout.Master;
                if (master != null) {
                    theme = master.Theme;
                    presentation = master.presentation;
                }
            }
            break;
        case MASTER_KIND:
            master = this.parent;
            if (master != null) {
                theme = master.Theme;
                presentation = master.presentation;
            }
            break;
        }
        if (bParagraph && false) {
            var isPlaceholder = this.isPlaceholder();
            if (isPlaceholder) {
                var phId = this.nvGraphicFramePr.nvPr.ph.idx,
                phType = this.nvGraphicFramePr.nvPr.ph.type;
                var b_is_single_body = this.getIsSingleBody();
                var layoutShape = null,
                masterShape = null;
                if (layout != null) {
                    layoutShape = layout.getMatchingShape(phType, phId, b_is_single_body);
                }
                if (master != null) {
                    masterShape = master.getMatchingShape(phType, phId, b_is_single_body);
                }
            }
            var defaultStyle = null,
            masterStyle = null,
            masterShapeStyle = null,
            layoutShapeStyle = null,
            slideShapeStyle = null;
            if (presentation != null && presentation.defaultTextStyle != null && presentation.defaultTextStyle.levels[level] != null) {
                defaultStyle = new CStyle("defaultStyle", null, null, null);
                defaultStyle.ParaPr = clone(presentation.defaultTextStyle.levels[level].pPr);
                defaultStyle.TextPr = clone(presentation.defaultTextStyle.levels[level].rPr);
                if (defaultStyle.TextPr != undefined) {
                    if (defaultStyle.TextPr.FontFamily && defaultStyle.TextPr.FontFamily.Name) {
                        if (isThemeFont(defaultStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                            defaultStyle.TextPr.FontFamily.themeFont = defaultStyle.TextPr.FontFamily.Name;
                            defaultStyle.TextPr.FontFamily.Name = getFontInfo(defaultStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                        }
                    }
                    if (defaultStyle.TextPr.unifill && defaultStyle.TextPr.unifill.fill) {
                        defaultStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                            R: 0,
                            G: 0,
                            B: 0,
                            A: 0
                        });
                        var _rgba = defaultStyle.TextPr.unifill.getRGBAColor();
                        defaultStyle.TextPr.Color = {
                            r: _rgba.R,
                            g: _rgba.G,
                            b: _rgba.B,
                            a: _rgba.A
                        };
                    }
                    if (defaultStyle.TextPr.FontSize != undefined) {
                        defaultStyle.TextPr.themeFontSize = defaultStyle.TextPr.FontSize;
                    }
                }
            }
            if (master && master.txStyles) {
                if (isPlaceholder) {
                    switch (phType) {
                    case phType_ctrTitle:
                        case phType_title:
                        if (master.txStyles.titleStyle && master.txStyles.titleStyle.levels[level]) {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr = clone(master.txStyles.titleStyle.levels[level].pPr);
                            masterStyle.TextPr = clone(master.txStyles.titleStyle.levels[level].rPr);
                        }
                        break;
                    case phType_body:
                        case phType_subTitle:
                        case phType_obj:
                        case null:
                        if (master.txStyles.bodyStyle && master.txStyles.bodyStyle.levels[level]) {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr = clone(master.txStyles.bodyStyle.levels[level].pPr);
                            masterStyle.TextPr = clone(master.txStyles.bodyStyle.levels[level].rPr);
                        }
                        break;
                    default:
                        if (master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level]) {
                            masterStyle = new CStyle("masterStyle", null, null, null);
                            masterStyle.ParaPr = clone(master.txStyles.otherStyle.levels[level].pPr);
                            masterStyle.TextPr = clone(master.txStyles.otherStyle.levels[level].rPr);
                        }
                        break;
                    }
                } else {
                    if (master.txStyles.otherStyle && master.txStyles.otherStyle.levels[level]) {
                        masterStyle = new CStyle("masterStyle", null, null, null);
                        masterStyle.ParaPr = clone(master.txStyles.otherStyle.levels[level].pPr);
                        masterStyle.TextPr = clone(master.txStyles.otherStyle.levels[level].rPr);
                    }
                }
                if (masterStyle && masterStyle.TextPr) {
                    if (masterStyle.TextPr.FontFamily && masterStyle.TextPr.FontFamily.Name) {
                        if (masterStyle.TextPr.FontFamily && isThemeFont(masterStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                            masterStyle.TextPr.FontFamily.themeFont = masterStyle.TextPr.FontFamily.Name;
                            masterStyle.TextPr.FontFamily.Name = getFontInfo(masterStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                        }
                    }
                    if (masterStyle.TextPr.unifill && masterStyle.TextPr.unifill.fill) {
                        masterStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                            R: 0,
                            G: 0,
                            B: 0,
                            A: 0
                        });
                        var _rgba = masterStyle.TextPr.unifill.getRGBAColor();
                        masterStyle.TextPr.Color = {
                            r: _rgba.R,
                            g: _rgba.G,
                            b: _rgba.B,
                            a: _rgba.A
                        };
                    }
                    if (masterStyle.TextPr.FontSize != undefined) {
                        masterStyle.TextPr.themeFontSize = masterStyle.TextPr.FontSize;
                    }
                }
            }
            if (isPlaceholder) {
                if (masterShape && masterShape.txBody && masterShape.txBody.lstStyle && masterShape.txBody.lstStyle.levels[level]) {
                    masterShapeStyle = new CStyle("masterShapeStyle", null, null, null);
                    masterShapeStyle.ParaPr = clone(masterShape.txBody.lstStyle.levels[level].pPr);
                    masterShapeStyle.TextPr = clone(masterShape.txBody.lstStyle.levels[level].rPr);
                    if (masterShapeStyle.TextPr) {
                        if (masterShapeStyle.TextPr.FontFamily && isThemeFont(masterShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                            masterShapeStyle.TextPr.FontFamily.themeFont = masterShapeStyle.TextPr.FontFamily.Name;
                            masterShapeStyle.TextPr.FontFamily.Name = getFontInfo(masterShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                        }
                        if (masterShapeStyle.TextPr.unifill && masterShapeStyle.TextPr.unifill.fill) {
                            masterShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                                R: 0,
                                G: 0,
                                B: 0,
                                A: 0
                            });
                            var _rgba = masterShapeStyle.TextPr.unifill.getRGBAColor();
                            masterShapeStyle.TextPr.Color = {
                                r: _rgba.R,
                                g: _rgba.G,
                                b: _rgba.B,
                                a: _rgba.A
                            };
                        }
                    }
                }
                if (layoutShape && layoutShape.txBody && layoutShape.txBody.lstStyle && layoutShape.txBody.lstStyle.levels[level]) {
                    layoutShapeStyle = new CStyle("layoutShapeStyle", null, null, null);
                    layoutShapeStyle.ParaPr = clone(layoutShape.txBody.lstStyle.levels[level].pPr);
                    layoutShapeStyle.TextPr = clone(layoutShape.txBody.lstStyle.levels[level].rPr);
                    if (layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.FontFamily && isThemeFont(layoutShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                        layoutShapeStyle.TextPr.FontFamily.themeFont = layoutShapeStyle.TextPr.FontFamily.Name;
                        layoutShapeStyle.TextPr.FontFamily.Name = getFontInfo(layoutShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                    }
                    if (layoutShapeStyle && layoutShapeStyle.TextPr && layoutShapeStyle.TextPr.unifill && layoutShapeStyle.TextPr.unifill.fill) {
                        layoutShapeStyle.unifill.calculate(theme, this.parent, layout, master, {
                            R: 0,
                            G: 0,
                            B: 0,
                            A: 0
                        });
                        var _rgba = layoutShapeStyle.unifill.getRGBAColor();
                        layoutShapeStyle.TextPr.Color = {
                            r: _rgba.R,
                            g: _rgba.G,
                            b: _rgba.B,
                            a: _rgba.A
                        };
                    }
                }
            }
            if (this.txBody && this.txBody.lstStyle && this.txBody.lstStyle.levels[level]) {
                slideShapeStyle = new CStyle("slideShapeStyle", null, null, null);
                slideShapeStyle.ParaPr = clone(this.txBody.lstStyle.levels[level].pPr);
                slideShapeStyle.TextPr = clone(this.txBody.lstStyle.levels[level].rPr);
                if (slideShapeStyle.TextPr && slideShapeStyle.TextPr.FontFamily && isThemeFont(slideShapeStyle.TextPr.FontFamily.Name) && theme && theme.themeElements.fontScheme) {
                    slideShapeStyle.TextPr.FontFamily.themeFont = slideShapeStyle.TextPr.FontFamily.Name;
                    slideShapeStyle.TextPr.FontFamily.Name = getFontInfo(slideShapeStyle.TextPr.FontFamily.Name)(theme.themeElements.fontScheme);
                }
                if (slideShapeStyle && slideShapeStyle.TextPr && slideShapeStyle.TextPr.unifill) {
                    slideShapeStyle.TextPr.unifill.calculate(theme, this.parent, layout, master, {
                        R: 0,
                        G: 0,
                        B: 0,
                        A: 0
                    });
                    var _rgba = slideShapeStyle.TextPr.unifill.getRGBAColor();
                    slideShapeStyle.TextPr.Color = {
                        r: _rgba.R,
                        g: _rgba.G,
                        b: _rgba.B,
                        a: _rgba.A
                    };
                }
            }
            if (isPlaceholder) {
                if (defaultStyle) {
                    Styles.Style[Styles.Id] = defaultStyle;
                    defaultStyle.BasedOn = null;
                    ++Styles.Id;
                }
                if (masterStyle) {
                    Styles.Style[Styles.Id] = masterStyle;
                    masterStyle.BasedOn = Styles.Id - 1;
                    ++Styles.Id;
                }
            } else {
                if (masterStyle) {
                    Styles.Style[Styles.Id] = masterStyle;
                    masterStyle.BasedOn = null;
                    ++Styles.Id;
                }
                if (defaultStyle) {
                    Styles.Style[Styles.Id] = defaultStyle;
                    defaultStyle.BasedOn = Styles.Id - 1;
                    ++Styles.Id;
                }
            }
            if (masterShapeStyle) {
                Styles.Style[Styles.Id] = masterShapeStyle;
                masterShapeStyle.BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
            if (layoutShapeStyle) {
                Styles.Style[Styles.Id] = layoutShapeStyle;
                layoutShapeStyle.BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
            if (slideShapeStyle) {
                Styles.Style[Styles.Id] = slideShapeStyle;
                slideShapeStyle.BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
            if (this.style && this.style.fontRef) {
                var refStyle = new CStyle("refStyle", null, null, null);
                refStyle.ParaPr = {};
                refStyle.TextPr = {};
                switch (this.style.fontRef.idx) {
                case fntStyleInd_major:
                    refStyle.TextPr.FontFamily = {
                        Name: getFontInfo("+mj-lt")(theme.themeElements.fontScheme)
                    };
                    break;
                case fntStyleInd_minor:
                    refStyle.TextPr.FontFamily = {
                        Name: getFontInfo("+mn-lt")(theme.themeElements.fontScheme)
                    };
                    break;
                default:
                    break;
                }
                if (this.style.fontRef.Color != null && this.style.fontRef.Color.color != null) {
                    var unifill = new CUniFill();
                    unifill.fill = new CSolidFill();
                    unifill.fill.color = this.style.fontRef.Color;
                    refStyle.TextPr.unifill = unifill;
                } else {
                    refStyle.TextPr.unifill = null;
                }
                Styles.Style[Styles.Id] = refStyle;
                refStyle.BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
            return Styles;
        }
        if (typeof bTablesStyleId === "number") {
            if (presentation !== null && typeof presentation === "object") {
                if (Array.isArray(presentation.globalTableStyles) && presentation.globalTableStyles[bTablesStyleId] instanceof CStyle) {
                    Styles.Style[Styles.Id] = presentation.globalTableStyles[bTablesStyleId];
                    ++Styles.Id;
                }
            }
        }
        return Styles;
    },
    Get_StartPage_Absolute: function () {
        return this.parent.num;
    },
    Get_PageContentStartPos: function () {
        if (this.parent.kind == SLIDE_KIND) {
            return this.parent.Layout.Master.presentation.Get_PageContentStartPos(this.parent.num);
        }
        return {
            X: this.pH + this.ext.cx,
            XLimit: this.ext.cx,
            Y: this.pV + this.ext.cy,
            YLimit: this.ext.cy,
            MaxTopBorder: 0
        };
    },
    getParagraphParaPr: function () {
        if (this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Set_ApplyToAll === "function" && typeof this.graphicObject.Get_Paragraph_ParaPr === "function") {
            var _ret_para_pr;
            this.graphicObject.Set_ApplyToAll(true);
            _ret_para_pr = this.graphicObject.Get_Paragraph_ParaPr();
            this.graphicObject.Set_ApplyToAll(false);
            return _ret_para_pr;
        }
    },
    getParagraphTextPr: function () {
        if (this.graphicObject !== null && typeof this.graphicObject === "object" && typeof this.graphicObject.Set_ApplyToAll === "function" && typeof this.graphicObject.Get_Paragraph_TextPr === "function") {
            var _ret_para_pr;
            this.graphicObject.Set_ApplyToAll(true);
            _ret_para_pr = this.graphicObject.Get_Paragraph_TextPr();
            this.graphicObject.Set_ApplyToAll(false);
            return _ret_para_pr;
        }
    },
    getTextPr: function () {
        return this.graphicObject.Get_Paragraph_TextPr();
    },
    getParaPr: function () {
        return this.graphicObject.Get_Paragraph_ParaPr();
    },
    hitToHandles: function () {
        return -1;
    },
    hitToAdjustment: function () {
        return {
            hit: false
        };
    },
    setGroup: function (group) {
        History.Add(this, {
            Type: historyitem_SetSpGroup,
            oldPr: this.group,
            newPr: group
        });
        this.group = group;
    },
    Refresh_RecalcData: function () {},
    Undo: function (data) {
        switch (data.Type) {
        case historyitem_SetSetSpPr:
            this.spPr = data.oldPr;
            break;
        case historyitem_SetSetNvSpPr:
            this.nvGraphicFramePr = data.oldPr;
            break;
        case historyitem_SetGraphicObject:
            this.graphicObject = data.oldPr;
            break;
        case historyitem_SetShapeRot:
            this.spPr.xfrm.rot = data.oldRot;
            this.recalcInfo.recalculateTransform = true;
            this.recalcInfo.recalculateTransformText = true;
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
            break;
        case historyitem_SetShapeSetFill:
            if (isRealObject(data.oldFill)) {
                this.spPr.Fill = data.oldFill.createDuplicate();
            } else {
                this.spPr.Fill = null;
            }
            this.recalcInfo.recalculateFill = true;
            this.recalcInfo.recalculateBrush = true;
            this.recalcInfo.recalculateTransparent = true;
            break;
        case historyitem_SetShapeSetLine:
            if (isRealObject(data.oldLine)) {
                this.spPr.ln = data.oldLine.createDuplicate();
            } else {
                this.spPr.ln = null;
            }
            this.recalcInfo.recalculateLine = true;
            this.recalcInfo.recalculatePen = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
            break;
        case historyitem_SetShapeSetGeometry:
            if (isRealObject(data.oldGeometry)) {
                this.spPr.geometry = data.oldGeometry.createDuplicate();
                this.spPr.geometry.Init(5, 5);
            } else {
                this.spPr.geometry = null;
            }
            this.recalcInfo.recalculateGeometry = true;
            break;
        case historyitem_SetShapeBodyPr:
            this.txBody.bodyPr = data.oldBodyPr.createDuplicate();
            this.txBody.recalcInfo.recalculateBodyPr = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_SetSpGroup:
            this.group = data.oldPr;
            break;
        case historyitem_SetShapeParent:
            this.parent = data.Old;
            break;
        }
        if (isRealObject(this.parent) && isRealObject(this.graphicObject) && (Array.isArray(this.graphicObject.Content) && this.graphicObject.Content.length > 0)) {
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        } else {
            delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
        }
    },
    Redo: function (data) {
        switch (data.Type) {
        case historyitem_SetSetSpPr:
            this.spPr = data.newPr;
            break;
        case historyitem_SetSetNvSpPr:
            this.nvGraphicFramePr = data.newPr;
            break;
        case historyitem_SetGraphicObject:
            this.graphicObject = data.newPr;
            if (this.graphicObject && this.graphicObject.Recalc_CompiledPr) {
                this.graphicObject.Recalc_CompiledPr();
            }
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
        case historyitem_SetShapeSetFill:
            if (isRealObject(data.newFill)) {
                this.spPr.Fill = data.newFill.createDuplicate();
            }
            this.recalcInfo.recalculateFill = true;
            this.recalcInfo.recalculateBrush = true;
            this.recalcInfo.recalculateTransparent = true;
            break;
        case historyitem_SetShapeSetLine:
            if (isRealObject(data.newLine)) {
                this.spPr.ln = data.newLine.createDuplicate();
            } else {
                this.spPr.ln = null;
            }
            this.recalcInfo.recalculateLine = true;
            this.recalcInfo.recalculatePen = true;
            break;
        case historyitem_SetShapeSetGeometry:
            if (isRealObject(data.newGeometry)) {
                this.spPr.geometry = data.newGeometry.createDuplicate();
                this.spPr.geometry.Init(5, 5);
            } else {
                this.spPr.geometry = null;
            }
            this.recalcInfo.recalculateGeometry = true;
            break;
        case historyitem_SetShapeBodyPr:
            this.txBody.bodyPr = data.newBodyPr.createDuplicate();
            this.txBody.recalcInfo.recalculateBodyPr = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            break;
        case historyitem_SetSpGroup:
            this.group = data.newPr;
            break;
        case historyitem_SetShapeParent:
            this.parent = data.New;
            break;
        }
        if (isRealObject(this.parent) && isRealObject(this.graphicObject) && (Array.isArray(this.graphicObject.Content) && this.graphicObject.Content.length > 0)) {
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        } else {
            delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_GraphicFrame);
        w.WriteLong(data.Type);
        var bool;
        switch (data.Type) {
        case historyitem_SetSetSpPr:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetSetNvSpPr:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                data.newPr.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetGraphicObject:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                w.WriteString2(data.newPr.Get_Id());
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
        case historyitem_SetShapeSetFill:
            w.WriteBool(isRealObject(data.newFill));
            if (isRealObject(data.newFill)) {
                data.newFill.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetShapeSetLine:
            w.WriteBool(isRealObject(data.newLine));
            if (isRealObject(data.newLine)) {
                data.newLine.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetShapeSetGeometry:
            w.WriteBool(isRealObject(data.newGeometry));
            if (isRealObject(data.newGeometry)) {
                data.newGeometry.Write_ToBinary2(w);
            }
            break;
        case historyitem_SetShapeBodyPr:
            data.newBodyPr.Write_ToBinary2(w);
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
        if (r.GetLong() === historyitem_type_GraphicFrame) {
            switch (r.GetLong()) {
            case historyitem_SetSetSpPr:
                this.spPr = new CSpPr();
                if (r.GetBool()) {
                    this.spPr.Read_FromBinary2(r);
                }
                break;
            case historyitem_SetSetNvSpPr:
                if (r.GetBool()) {
                    this.nvGraphicFramePr = new UniNvPr();
                    this.nvGraphicFramePr.Read_FromBinary2(r);
                } else {
                    this.nvGraphicFramePr = null;
                }
                break;
            case historyitem_SetGraphicObject:
                if (r.GetBool()) {
                    this.graphicObject = g_oTableId.Get_ById(r.GetString2());
                    if (this.graphicObject && this.graphicObject.Recalc_CompiledPr) {
                        this.graphicObject.Recalc_CompiledPr();
                    }
                } else {
                    this.graphicObject = null;
                }
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
            case historyitem_SetShapeSetFill:
                if (r.GetBool()) {
                    this.spPr.Fill = new CUniFill();
                    this.spPr.Fill.Read_FromBinary2(r);
                }
                this.recalcInfo.recalculateFill = true;
                this.recalcInfo.recalculateBrush = true;
                this.recalcInfo.recalculateTransparent = true;
                break;
            case historyitem_SetShapeSetLine:
                if (r.GetBool()) {
                    this.spPr.ln = new CLn();
                    this.spPr.ln.Read_FromBinary2(r);
                }
                this.recalcInfo.recalculateLine = true;
                this.recalcInfo.recalculatePen = true;
                break;
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
            case historyitem_SetShapeBodyPr:
                this.txBody.bodyPr = new CBodyPr();
                this.txBody.bodyPr.Read_FromBinary2(r);
                this.txBody.recalcInfo.recalculateBodyPr = true;
                this.recalcInfo.recalculateContent = true;
                this.recalcInfo.recalculateTransformText = true;
                break;
            case historyitem_SetSpGroup:
                if (r.GetBool()) {
                    this.group = g_oTableId.Get_ById(r.GetString2());
                } else {
                    this.group = null;
                }
                break;
            case historyitem_SetShapeParent:
                if (r.GetBool()) {
                    this.parent = g_oTableId.Get_ById(r.GetString2());
                }
                break;
            }
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
            if (isRealObject(this.parent) && isRealObject(this.graphicObject) && (Array.isArray(this.graphicObject.Content) && this.graphicObject.Content.length > 0)) {
                editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
            } else {
                delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
            }
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