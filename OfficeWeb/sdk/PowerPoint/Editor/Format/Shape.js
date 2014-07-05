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
 var DEFAULT_CURSOR_TYPES = [];
DEFAULT_CURSOR_TYPES[0] = "n-resize";
DEFAULT_CURSOR_TYPES[1] = "ne-resize";
DEFAULT_CURSOR_TYPES[2] = "e-resize";
DEFAULT_CURSOR_TYPES[3] = "se-resize";
DEFAULT_CURSOR_TYPES[4] = "s-resize";
DEFAULT_CURSOR_TYPES[5] = "sw-resize";
DEFAULT_CURSOR_TYPES[6] = "w-resize";
DEFAULT_CURSOR_TYPES[7] = "nw-resize";
var DRAWING_OBJECT_TYPE_SHAPE = 0;
var DRAWING_OBJECT_TYPE_IMAGE = 1;
var DRAWING_OBJECT_TYPE_CHART = 2;
var DRAWING_OBJECT_TYPE_GROUP = 3;
var eps = 7;
var left_top = 0,
top = 1,
right_top = 2,
right = 3,
right_bottom = 4,
bottom = 5,
left_bottom = 6,
left = 7;
var adj = 0,
handle = 1,
move = 2;
var xy = 0,
polar = 1;
var N = 0,
NE = 1,
E = 2,
SE = 3,
S = 4,
SW = 5,
W = 6,
NW = 7,
ROT = 8,
MOVE = 9;
var min_size = 10;
var min_size2 = 3;
var phType_body = 0,
phType_chart = 1,
phType_clipArt = 2,
phType_ctrTitle = 3,
phType_dgm = 4,
phType_dt = 5,
phType_ftr = 6,
phType_hdr = 7,
phType_media = 8,
phType_obj = 9,
phType_pic = 10,
phType_sldImg = 11,
phType_sldNum = 12,
phType_subTitle = 13,
phType_tbl = 14,
phType_title = 15;
var szPh_full = 0,
szPh_half = 1,
szPh_quarter = 2;
var OR_PH_HOR = 0;
var OR_PH_VER = 1;
var CUSTOM_PROMPTS = [];
var TYPE_SLIDE_MASTER = 0;
var TYPE_SLIDE_LAYOUT = 1;
var TYPE_SLIDE = 3;
var MIN_SHAPE_DIST = 5.08;
var CARD_DIRECTION_N = 0;
var CARD_DIRECTION_NE = 1;
var CARD_DIRECTION_E = 2;
var CARD_DIRECTION_SE = 3;
var CARD_DIRECTION_S = 4;
var CARD_DIRECTION_SW = 5;
var CARD_DIRECTION_W = 6;
var CARD_DIRECTION_NW = 7;
var CURSOR_TYPES_BY_CARD_DIRECTION = [];
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_N] = "n-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NE] = "ne-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_E] = "e-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SE] = "se-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_S] = "s-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_SW] = "sw-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_W] = "w-resize";
CURSOR_TYPES_BY_CARD_DIRECTION[CARD_DIRECTION_NW] = "nw-resize";
function CShape(parent) {
    this.group = null;
    this.drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
    this.spLocks = null;
    this.useBgFill = null;
    this.nvSpPr = new UniNvPr();
    this.spPr = new CSpPr();
    this.style = null;
    this.txBody = null;
    this.x = null;
    this.y = null;
    this.extX = null;
    this.extY = null;
    this.rot = null;
    this.flipH = null;
    this.flipV = null;
    this.transform = new CMatrix();
    this.invertTransform = null;
    this.transformText = new CMatrix();
    this.invertTransformText = null;
    this.transformText2 = new CMatrix();
    this.invertTransformText2 = null;
    this.cursorTypes = [];
    this.brush = null;
    this.pen = null;
    this.selected = false;
    this.recalcInfo = {
        recalculateContent: true,
        recalculateBrush: true,
        recalculatePen: true,
        recalculateTransform: true,
        recalculateTransformText: true,
        recalculateCursorTypes: true,
        recalculateGeometry: true,
        recalculateStyle: true,
        recalculateFill: true,
        recalculateLine: true,
        recalculateShapeHierarchy: true,
        recalculateTransparent: true,
        recalculateGroupHierarchy: true,
        recalculateTextStyles: [true, true, true, true, true, true, true, true, true]
    };
    this.groupHierarchy = [];
    this.compiledStyle = null;
    this.compiledLine = null;
    this.compiledFill = null;
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
CShape.prototype = {
    getAllImages: function (images) {
        if (this.spPr.Fill && this.spPr.Fill.fill instanceof CBlipFill && typeof this.spPr.Fill.fill.RasterImageId === "string") {
            images[_getFullImageSrc(this.spPr.Fill.fill.RasterImageId)] = true;
        }
    },
    recalcAll: function () {
        this.recalcInfo = {
            recalculateContent: true,
            recalculateBrush: true,
            recalculatePen: true,
            recalculateTransform: true,
            recalculateTransformText: true,
            recalculateCursorTypes: true,
            recalculateGeometry: true,
            recalculateStyle: true,
            recalculateFill: true,
            recalculateLine: true,
            recalculateShapeHierarchy: true,
            recalculateTransparent: true,
            recalculateGroupHierarchy: true,
            recalculateTextStyles: [true, true, true, true, true, true, true, true, true]
        };
        if (this.txBody) {
            this.txBody.recalcAll();
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    recalcAllColors: function () {
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateBrush = true;
        this.recalcInfo.recalculatePen = true;
        this.recalcInfo.recalculateStyle = true;
        this.recalcInfo.recalculateFill = true;
        this.recalcInfo.recalculateLine = true;
        this.recalcInfo.recalculateShapeHierarchy = true;
        this.recalcInfo.recalculateTextStyles = [true, true, true, true, true, true, true, true, true];
        if (this.txBody) {
            this.txBody.recalcColors();
        }
    },
    Get_Id: function () {
        return this.Id;
    },
    getType: function () {
        return DRAWING_OBJECT_TYPE_SHAPE;
    },
    getAllFonts: function (fonts) {
        if (this.txBody) {
            this.txBody.content.Document_Get_AllFontNames(fonts);
            delete fonts["+mj-lt"];
            delete fonts["+mn-lt"];
            delete fonts["+mj-ea"];
            delete fonts["+mn-ea"];
            delete fonts["+mj-cs"];
            delete fonts["+mn-cs"];
        }
    },
    initDefault: function (x, y, extX, extY, flipH, flipV, presetGeom, arrowsCount) {
        this.setXfrm(x, y, extX, extY, 0, flipH, flipV);
        this.setPresetGeometry(presetGeom);
        this.setDefaultStyle();
        if (arrowsCount === 1 || arrowsCount === 2) {
            switch (arrowsCount) {
            case 1:
                var ln = new CLn();
                ln.tailEnd = new EndArrow();
                ln.tailEnd.type = LineEndType.Arrow;
                ln.tailEnd.len = LineEndSize.Mid;
                break;
            case 2:
                var ln = new CLn();
                ln.tailEnd = new EndArrow();
                ln.tailEnd.type = LineEndType.Arrow;
                ln.tailEnd.len = LineEndSize.Mid;
                ln.headEnd = new EndArrow();
                ln.headEnd.type = LineEndType.Arrow;
                ln.headEnd.len = LineEndSize.Mid;
                break;
            }
            this.setLine(ln);
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    Hyperlink_CanAdd: function (bCheck) {
        if (this.txBody) {
            return this.txBody.content.Hyperlink_CanAdd(bCheck);
        }
        return false;
    },
    Hyperlink_Check: function (bCheck) {
        if (this.txBody) {
            return this.txBody.content.Hyperlink_Check(bCheck);
        }
        return false;
    },
    Hyperlink_Add: function (HyperProps) {
        if (this.txBody) {
            this.txBody.content.Hyperlink_Add(HyperProps);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Hyperlink_Modify: function (HyperProps) {
        if (this.txBody) {
            this.txBody.content.Hyperlink_Modify(HyperProps);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Hyperlink_Remove: function () {
        if (this.txBody) {
            this.txBody.content.Hyperlink_Remove();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Get_SelectedText: function (bClearText) {
        if (this.txBody) {
            return this.txBody.content.Get_SelectedText(bClearText);
        }
        return null;
    },
    pointInSelectedText: function (x, y) {
        if (this.txBody) {
            var tx = this.invertTransformText.TransformPointX(x, y);
            var ty = this.invertTransformText.TransformPointY(x, y);
            return this.txBody.content.Selection_Check(tx, ty, this.parent.num);
        }
        return false;
    },
    getTextPr: function () {
        if (this.txBody) {
            return this.txBody.content.Get_Paragraph_TextPr();
        }
        return new CTextPr();
    },
    getParaPr: function () {
        if (this.txBody) {
            return this.txBody.content.Get_Paragraph_ParaPr();
        }
        return new CParaPr();
    },
    Paragraph_ClearFormatting: function () {
        if (this.txBody) {
            return this.txBody.content.Paragraph_ClearFormatting();
        }
    },
    initDefaultTextRect: function (x, y, extX, extY, flipH, flipV) {
        this.setXfrm(x, y, extX, extY, 0, flipH, flipV);
        this.setPresetGeometry("rect");
        this.setDefaultTextRectStyle();
        var uni_fill = new CUniFill();
        uni_fill.fill = (new CSolidFill());
        uni_fill.fill.color = (new CUniColor());
        uni_fill.fill.color.color = (new CSchemeColor());
        uni_fill.fill.color.color.id = (12);
        this.setFill(uni_fill);
        var ln = new CLn();
        ln.w = (6350);
        ln.Fill = new CUniFill();
        ln.Fill.fill = (new CSolidFill());
        ln.Fill.fill.color = (new CUniColor());
        ln.Fill.fill.color.color = (new CPrstColor());
        ln.Fill.fill.color.color.id = ("black");
        this.setLine(ln);
        this.setTextBody(new CTextBody(this));
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
    setUniFill: function (fill) {
        this.spPr.Fill = fill;
    },
    setUniLine: function (ln) {
        this.spPr.ln = ln;
    },
    setPresetGeometry: function (preset) {
        var old_geometry = this.spPr.geometry;
        this.spPr.geometry = CreateGeometry(preset);
        this.spPr.geometry.Init(5, 5);
        History.Add(this, {
            Type: historyitem_SetShapeSetGeometry,
            oldGeometry: old_geometry,
            newGeometry: this.spPr.geometry
        });
    },
    setDefaultStyle: function () {
        this.setStyle(CreateDefaultShapeStyle());
    },
    setDefaultTextRectStyle: function () {
        this.setStyle(CreateDefaultTextRectStyle());
    },
    isShape: function () {
        return true;
    },
    isImage: function () {
        return false;
    },
    isChart: function () {
        return false;
    },
    isGroup: function () {
        return false;
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
            this.recalcInfo.recalculateShapeHierarchy = false;
        }
        return this.compiledHierarchy;
    },
    getCompiledStyle: function () {
        if (this.recalcInfo.recalculateStyle) {
            this.compiledStyle = null;
            if (this.isPlaceholder()) {
                if (isRealObject(this.style)) {
                    this.compiledStyle = this.style.createDuplicate();
                } else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].style)) {
                            this.compiledStyle = hierarchy[i].style.createDuplicate();
                            break;
                        }
                    }
                }
            } else {
                if (isRealObject(this.style)) {
                    this.compiledStyle = this.style.createDuplicate();
                }
            }
            if (isRealObject(this.compiledStyle)) {
                var parents = this.getParentObjects();
                if (isRealObject(this.compiledStyle.fillRef) && isRealObject(this.compiledStyle.fillRef.Color)) {
                    this.compiledStyle.fillRef.Color.Calculate(parents.theme, parents.slide, parents.layout, parents.master);
                }
                if (isRealObject(this.compiledStyle.lnRef) && isRealObject(this.compiledStyle.lnRef.Color)) {
                    this.compiledStyle.lnRef.Color.Calculate(parents.theme, parents.slide, parents.layout, parents.master);
                }
                if (isRealObject(this.compiledStyle.fontRef) && isRealObject(this.compiledStyle.fontRef.Color)) {
                    this.compiledStyle.fontRef.Color.Calculate(parents.theme, parents.slide, parents.layout, parents.master);
                }
            }
            this.recalcInfo.recalculateStyle = false;
        }
        return this.compiledStyle;
    },
    getPaddings: function () {
        var paddings = null;
        var shape = this;
        if (shape.txBody) {
            var body_pr = shape.txBody.bodyPr;
            paddings = new CPaddings();
            if (typeof body_pr.lIns === "number") {
                paddings.Left = body_pr.lIns;
            } else {
                paddings.Left = 2.54;
            }
            if (typeof body_pr.tIns === "number") {
                paddings.Top = body_pr.tIns;
            } else {
                paddings.Top = 1.27;
            }
            if (typeof body_pr.rIns === "number") {
                paddings.Right = body_pr.rIns;
            } else {
                paddings.Right = 2.54;
            }
            if (typeof body_pr.bIns === "number") {
                paddings.Bottom = body_pr.bIns;
            } else {
                paddings.Bottom = 1.27;
            }
        }
        return paddings;
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
    getCompiledFill: function () {
        if (this.recalcInfo.recalculateFill) {
            this.compiledFill = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealObject(this.spPr.Fill.fill)) {
                if (this.spPr.Fill.fill instanceof CGradFill && this.spPr.Fill.fill.colors.length === 0) {
                    History.TurnOff();
                    var parent_objects = this.getParentObjects();
                    var theme = parent_objects.theme;
                    var fmt_scheme = theme.themeElements.fmtScheme;
                    var fill_style_lst = fmt_scheme.fillStyleLst;
                    for (var i = fill_style_lst.length - 1; i > -1; --i) {
                        if (fill_style_lst[i] && fill_style_lst[i].fill instanceof CGradFill) {
                            this.spPr.Fill = fill_style_lst[i].createDuplicate();
                            break;
                        }
                    }
                    History.TurnOn();
                }
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
            this.recalcInfo.recalculateFill = false;
        }
        return this.compiledFill;
    },
    getMargins: function () {
        if (this.txBody) {
            return this.txBody.getMargins();
        } else {
            return null;
        }
    },
    Document_UpdateRulersState: function (margins) {
        if (this.txBody && this.txBody.content) {
            this.txBody.content.Document_UpdateRulersState(this.parent.num, this.getMargins());
        }
    },
    getCompiledLine: function () {
        if (this.recalcInfo.recalculateLine) {
            this.compiledLine = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.ln) && isRealObject(this.spPr.ln)) {
                this.compiledLine = this.spPr.ln.createDuplicate();
            } else {
                if (isRealObject(this.group)) {
                    var group_compiled_line = this.group.getCompiledLine();
                    if (isRealObject(group_compiled_line) && isRealObject(group_compiled_line.fill)) {
                        this.compiledLine = group_compiled_line.createDuplicate();
                    } else {
                        var hierarchy = this.getHierarchy();
                        for (var i = 0; i < hierarchy.length; ++i) {
                            if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.ln)) {
                                this.compiledLine = hierarchy[i].spPr.ln.createDuplicate();
                                break;
                            }
                        }
                    }
                } else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.ln)) {
                            this.compiledLine = hierarchy[i].spPr.ln.createDuplicate();
                            break;
                        }
                    }
                }
            }
            this.recalcInfo.recalculateLine = false;
        }
        return this.compiledLine;
    },
    getCompiledTransparent: function () {
        if (this.recalcInfo.recalculateTransparent) {
            this.compiledTransparent = null;
            if (isRealObject(this.spPr) && isRealObject(this.spPr.Fill) && isRealNumber(this.spPr.Fill.transparent)) {
                this.compiledTransparent = this.spPr.Fill.transparent;
            } else {
                if (isRealObject(this.group)) {
                    var group_transparent = this.group.getCompiledTransparent();
                    if (isRealNumber(group_transparent)) {
                        this.compiledTransparent = group_transparent;
                    } else {
                        var hierarchy = this.getHierarchy();
                        for (var i = 0; i < hierarchy.length; ++i) {
                            if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealNumber(hierarchy[i].spPr.Fill.transparent)) {
                                this.compiledTransparent = this.spPr.Fill.transparent;
                                break;
                            }
                        }
                    }
                } else {
                    var hierarchy = this.getHierarchy();
                    for (var i = 0; i < hierarchy.length; ++i) {
                        if (isRealObject(hierarchy[i]) && isRealObject(hierarchy[i].spPr) && isRealObject(hierarchy[i].spPr.Fill) && isRealNumber(hierarchy[i].spPr.Fill.transparent)) {
                            this.compiledTransparent = this.spPr.Fill.transparent;
                            break;
                        }
                    }
                }
            }
            this.recalcInfo.recalculateTransparent = false;
        }
        return this.compiledTransparent;
    },
    isPlaceholder: function () {
        return isRealObject(this.nvSpPr) && isRealObject(this.nvSpPr.nvPr) && isRealObject(this.nvSpPr.nvPr.ph);
    },
    setNvSpPr: function (pr) {
        History.Add(this, {
            Type: historyitem_SetSetNvSpPr,
            oldPr: this.nvSpPr,
            newPr: pr
        });
        this.nvSpPr = pr;
        if (this.parent && pr && pr.cNvPr && isRealNumber(pr.cNvPr.id)) {
            if (pr.cNvPr.id > this.parent.maxId) {
                this.parent.maxId = pr.cNvPr.id + 1;
            }
        }
    },
    setTextBody: function (txBody) {
        History.Add(this, {
            Type: historyitem_SetTextBody,
            oldPr: this.txBody,
            newPr: txBody
        });
        this.txBody = txBody;
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
    setGroup: function (group) {
        History.Add(this, {
            Type: historyitem_SetSpGroup,
            oldPr: this.group,
            newPr: group
        });
        this.group = group;
    },
    getPlaceholderType: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.type : null;
    },
    getPlaceholderIndex: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.idx : null;
    },
    getPhType: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.type : null;
    },
    getPhIndex: function () {
        return this.isPlaceholder() ? this.nvSpPr.nvPr.ph.idx : null;
    },
    recalculateContent: function () {
        if (this.txBody) {
            this.txBody.calculateContent();
        }
    },
    setTextVerticalAlign: function (align) {
        if (this.txBody) {
            this.txBody.bodyPr.anchor = align;
            this.recalculateContent();
            this.recalculateTransformText();
        }
    },
    setPaddings: function (paddings) {
        if (paddings) {
            if (this.txBody) {
                var old_body_pr = this.txBody.bodyPr.createDuplicate();
                if (isRealNumber(paddings.Left)) {
                    this.txBody.bodyPr.lIns = paddings.Left;
                }
                if (isRealNumber(paddings.Top)) {
                    this.txBody.bodyPr.tIns = paddings.Top;
                }
                if (isRealNumber(paddings.Right)) {
                    this.txBody.bodyPr.rIns = paddings.Right;
                }
                if (isRealNumber(paddings.Bottom)) {
                    this.txBody.bodyPr.bIns = paddings.Bottom;
                }
                var new_body_pr = this.txBody.bodyPr.createDuplicate();
                History.Add(this, {
                    Type: historyitem_SetShapeBodyPr,
                    oldBodyPr: old_body_pr,
                    newBodyPr: new_body_pr
                });
                this.txBody.recalcInfo.recalculateBodyPr = true;
                this.recalculateContent();
                this.recalculateTransformText();
            }
        }
    },
    setBodyPr: function (bodyPr) {
        var old_body_pr = this.txBody.bodyPr;
        this.txBody.bodyPr = bodyPr;
        var new_body_pr = this.txBody.bodyPr.createDuplicate();
        History.Add(this, {
            Type: historyitem_SetShapeBodyPr,
            oldBodyPr: old_body_pr,
            newBodyPr: new_body_pr
        });
        this.txBody.recalcInfo.recalculateBodyPr = true;
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
        if (this.recalcInfo.recalculateGeometry) {
            this.recalculateGeometry();
            this.recalcInfo.recalculateGeometry = false;
        }
        if (this.recalcInfo.recalculateContent) {
            if (this.txBody) {
                this.txBody.recalcInfo.recalculateContent2 = true;
            }
            this.recalculateContent();
        }
        if (this.recalcInfo.recalculateTransformText) {
            this.recalculateTransformText();
        }
        if (this.recalcInfo.recalculateCursorTypes) {
            this.recalculateCursorTypes();
            this.recalcInfo.recalculateCursorTypes = false;
        }
    },
    recalculateTransformText: function () {
        if (this.txBody === null) {
            return;
        }
        this.transformText.Reset();
        var _text_transform = this.transformText;
        var _shape_transform = this.transform;
        var _body_pr = this.txBody.getBodyPr();
        var _content_height = this.txBody.getSummaryHeight();
        var _l, _t, _r, _b;
        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        } else {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = this.extX - _body_pr.rIns;
            _b = this.extY - _body_pr.bIns;
        }
        if (_l >= _r) {
            var _c = (_l + _r) * 0.5;
            _l = _c - 0.01;
            _r = _c + 0.01;
        }
        if (_t >= _b) {
            _c = (_t + _b) * 0.5;
            _t = _c - 0.01;
            _b = _c + 0.01;
        }
        _t_x_lt = _shape_transform.TransformPointX(_l, _t);
        _t_y_lt = _shape_transform.TransformPointY(_l, _t);
        _t_x_rt = _shape_transform.TransformPointX(_r, _t);
        _t_y_rt = _shape_transform.TransformPointY(_r, _t);
        _t_x_lb = _shape_transform.TransformPointX(_l, _b);
        _t_y_lb = _shape_transform.TransformPointY(_l, _b);
        _t_x_rb = _shape_transform.TransformPointX(_r, _b);
        _t_y_rb = _shape_transform.TransformPointY(_r, _b);
        var _dx_t, _dy_t;
        _dx_t = _t_x_rt - _t_x_lt;
        _dy_t = _t_y_rt - _t_y_lt;
        var _dx_lt_rb, _dy_lt_rb;
        _dx_lt_rb = _t_x_rb - _t_x_lt;
        _dy_lt_rb = _t_y_rb - _t_y_lt;
        var _vertical_shift;
        var _text_rect_height = _b - _t;
        var _text_rect_width = _r - _l;
        if (_body_pr.upright === false) {
            if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                if (true) {
                    switch (_body_pr.anchor) {
                    case 0:
                        _vertical_shift = _text_rect_height - _content_height;
                        break;
                    case 1:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 2:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 3:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 4:
                        _vertical_shift = 0;
                        break;
                    }
                } else {
                    _vertical_shift = 0;
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                    var alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                } else {
                    alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI - alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                }
            } else {
                if (true) {
                    switch (_body_pr.anchor) {
                    case 0:
                        _vertical_shift = _text_rect_width - _content_height;
                        break;
                    case 1:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 2:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 3:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 4:
                        _vertical_shift = 0;
                        break;
                    }
                } else {
                    _vertical_shift = 0;
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                var _alpha;
                _alpha = Math.atan2(_dy_t, _dx_t);
                if (_body_pr.vert === nVertTTvert) {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 0.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                    } else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                    }
                } else {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 1.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lb, _t_y_lb);
                    } else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rb, _t_y_rb);
                    }
                }
            }
        } else {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();
            var _hc = this.extX * 0.5;
            var _vc = this.extY * 0.5;
            var _transformed_shape_xc = this.transform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.transform.TransformPointY(_hc, _vc);
            var _content_width, content_height2;
            if ((_full_rotate >= 0 && _full_rotate < Math.PI * 0.25) || (_full_rotate > 3 * Math.PI * 0.25 && _full_rotate < 5 * Math.PI * 0.25) || (_full_rotate > 7 * Math.PI * 0.25 && _full_rotate < 2 * Math.PI)) {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                } else {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                }
            } else {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                } else {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
            }
            if (true) {
                switch (_body_pr.anchor) {
                case 0:
                    _vertical_shift = content_height2 - _content_height;
                    break;
                case 1:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 2:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 3:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 4:
                    _vertical_shift = 0;
                    break;
                }
            } else {
                _vertical_shift = 0;
            }
            var _text_rect_xc = _l + (_r - _l) * 0.5;
            var _text_rect_yc = _t + (_b - _t) * 0.5;
            var _vx = _text_rect_xc - _hc;
            var _vy = _text_rect_yc - _vc;
            var _transformed_text_xc, _transformed_text_yc;
            if (!_full_flip.flipH) {
                _transformed_text_xc = _transformed_shape_xc + _vx;
            } else {
                _transformed_text_xc = _transformed_shape_xc - _vx;
            }
            if (!_full_flip.flipV) {
                _transformed_text_yc = _transformed_shape_yc + _vy;
            } else {
                _transformed_text_yc = _transformed_shape_yc - _vy;
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if (_body_pr.vert === nVertTTvert) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            if (_body_pr.vert === nVertTTvert270) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, _transformed_text_xc - _content_width * 0.5, _transformed_text_yc - content_height2 * 0.5);
            var body_pr = this.bodyPr;
            var l_ins = typeof body_pr.lIns === "number" ? body_pr.lIns : 2.54;
            var t_ins = typeof body_pr.tIns === "number" ? body_pr.tIns : 1.27;
            var r_ins = typeof body_pr.rIns === "number" ? body_pr.rIns : 2.54;
            var b_ins = typeof body_pr.bIns === "number" ? body_pr.bIns : 1.27;
            this.clipRect = {
                x: -l_ins,
                y: -_vertical_shift - t_ins,
                w: this.contentWidth + (r_ins + l_ins),
                h: this.contentHeight + (b_ins + t_ins)
            };
        }
        this.invertTransformText = global_MatrixTransformer.Invert(this.transformText);
        this.recalculateTransformText2();
    },
    recalculateTransformText2: function () {
        if (this.txBody === null) {
            return;
        }
        if (!this.txBody.content2) {
            return;
        }
        this.transformText2.Reset();
        var _text_transform = this.transformText2;
        var _shape_transform = this.transform;
        var _body_pr = this.txBody.getBodyPr();
        var _content_height = this.txBody.getSummaryHeight2();
        var _l, _t, _r, _b;
        var _t_x_lt, _t_y_lt, _t_x_rt, _t_y_rt, _t_x_lb, _t_y_lb, _t_x_rb, _t_y_rb;
        if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
            var _rect = this.spPr.geometry.rect;
            _l = _rect.l + _body_pr.lIns;
            _t = _rect.t + _body_pr.tIns;
            _r = _rect.r - _body_pr.rIns;
            _b = _rect.b - _body_pr.bIns;
        } else {
            _l = _body_pr.lIns;
            _t = _body_pr.tIns;
            _r = this.extX - _body_pr.rIns;
            _b = this.extY - _body_pr.bIns;
        }
        if (_l >= _r) {
            var _c = (_l + _r) * 0.5;
            _l = _c - 0.01;
            _r = _c + 0.01;
        }
        if (_t >= _b) {
            _c = (_t + _b) * 0.5;
            _t = _c - 0.01;
            _b = _c + 0.01;
        }
        _t_x_lt = _shape_transform.TransformPointX(_l, _t);
        _t_y_lt = _shape_transform.TransformPointY(_l, _t);
        _t_x_rt = _shape_transform.TransformPointX(_r, _t);
        _t_y_rt = _shape_transform.TransformPointY(_r, _t);
        _t_x_lb = _shape_transform.TransformPointX(_l, _b);
        _t_y_lb = _shape_transform.TransformPointY(_l, _b);
        _t_x_rb = _shape_transform.TransformPointX(_r, _b);
        _t_y_rb = _shape_transform.TransformPointY(_r, _b);
        var _dx_t, _dy_t;
        _dx_t = _t_x_rt - _t_x_lt;
        _dy_t = _t_y_rt - _t_y_lt;
        var _dx_lt_rb, _dy_lt_rb;
        _dx_lt_rb = _t_x_rb - _t_x_lt;
        _dy_lt_rb = _t_y_rb - _t_y_lt;
        var _vertical_shift;
        var _text_rect_height = _b - _t;
        var _text_rect_width = _r - _l;
        if (_body_pr.upright === false) {
            if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                if (true) {
                    switch (_body_pr.anchor) {
                    case 0:
                        _vertical_shift = _text_rect_height - _content_height;
                        break;
                    case 1:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 2:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 3:
                        _vertical_shift = (_text_rect_height - _content_height) * 0.5;
                        break;
                    case 4:
                        _vertical_shift = 0;
                        break;
                    }
                } else {
                    _vertical_shift = 0;
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                    var alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, -alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                } else {
                    alpha = Math.atan2(_dy_t, _dx_t);
                    global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI - alpha);
                    global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                }
            } else {
                if (true) {
                    switch (_body_pr.anchor) {
                    case 0:
                        _vertical_shift = _text_rect_width - _content_height;
                        break;
                    case 1:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 2:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 3:
                        _vertical_shift = (_text_rect_width - _content_height) * 0.5;
                        break;
                    case 4:
                        _vertical_shift = 0;
                        break;
                    }
                } else {
                    _vertical_shift = 0;
                }
                global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
                var _alpha;
                _alpha = Math.atan2(_dy_t, _dx_t);
                if (_body_pr.vert === nVertTTvert) {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 0.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rt, _t_y_rt);
                    } else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lt, _t_y_lt);
                    }
                } else {
                    if (_dx_lt_rb * _dy_t - _dy_lt_rb * _dx_t <= 0) {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -_alpha - Math.PI * 1.5);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_lb, _t_y_lb);
                    } else {
                        global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5 - _alpha);
                        global_MatrixTransformer.TranslateAppend(_text_transform, _t_x_rb, _t_y_rb);
                    }
                }
            }
            if (isRealObject(this.spPr.geometry) && isRealObject(this.spPr.geometry.rect)) {
                var rect = this.spPr.geometry.rect;
                this.clipRect = {
                    x: rect.l,
                    y: rect.t,
                    w: rect.r - rect.l,
                    h: rect.b - rect.t
                };
            } else {
                this.clipRect = {
                    x: 0,
                    y: 0,
                    w: this.extX,
                    h: this.extY
                };
            }
        } else {
            var _full_rotate = this.getFullRotate();
            var _full_flip = this.getFullFlip();
            var _hc = this.extX * 0.5;
            var _vc = this.extY * 0.5;
            var _transformed_shape_xc = this.transform.TransformPointX(_hc, _vc);
            var _transformed_shape_yc = this.transform.TransformPointY(_hc, _vc);
            var _content_width, content_height2;
            if ((_full_rotate >= 0 && _full_rotate < Math.PI * 0.25) || (_full_rotate > 3 * Math.PI * 0.25 && _full_rotate < 5 * Math.PI * 0.25) || (_full_rotate > 7 * Math.PI * 0.25 && _full_rotate < 2 * Math.PI)) {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                } else {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                }
            } else {
                if (! (_body_pr.vert === nVertTTvert || _body_pr.vert === nVertTTvert270)) {
                    _content_width = _b - _t;
                    content_height2 = _r - _l;
                } else {
                    _content_width = _r - _l;
                    content_height2 = _b - _t;
                }
            }
            if (true) {
                switch (_body_pr.anchor) {
                case 0:
                    _vertical_shift = content_height2 - _content_height;
                    break;
                case 1:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 2:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 3:
                    _vertical_shift = (content_height2 - _content_height) * 0.5;
                    break;
                case 4:
                    _vertical_shift = 0;
                    break;
                }
            } else {
                _vertical_shift = 0;
            }
            var _text_rect_xc = _l + (_r - _l) * 0.5;
            var _text_rect_yc = _t + (_b - _t) * 0.5;
            var _vx = _text_rect_xc - _hc;
            var _vy = _text_rect_yc - _vc;
            var _transformed_text_xc, _transformed_text_yc;
            if (!_full_flip.flipH) {
                _transformed_text_xc = _transformed_shape_xc + _vx;
            } else {
                _transformed_text_xc = _transformed_shape_xc - _vx;
            }
            if (!_full_flip.flipV) {
                _transformed_text_yc = _transformed_shape_yc + _vy;
            } else {
                _transformed_text_yc = _transformed_shape_yc - _vy;
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, 0, _vertical_shift);
            if (_body_pr.vert === nVertTTvert) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 0.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            if (_body_pr.vert === nVertTTvert270) {
                global_MatrixTransformer.TranslateAppend(_text_transform, -_content_width * 0.5, -content_height2 * 0.5);
                global_MatrixTransformer.RotateRadAppend(_text_transform, -Math.PI * 1.5);
                global_MatrixTransformer.TranslateAppend(_text_transform, _content_width * 0.5, content_height2 * 0.5);
            }
            global_MatrixTransformer.TranslateAppend(_text_transform, _transformed_text_xc - _content_width * 0.5, _transformed_text_yc - content_height2 * 0.5);
            var body_pr = this.bodyPr;
            var l_ins = typeof body_pr.lIns === "number" ? body_pr.lIns : 2.54;
            var t_ins = typeof body_pr.tIns === "number" ? body_pr.tIns : 1.27;
            var r_ins = typeof body_pr.rIns === "number" ? body_pr.rIns : 2.54;
            var b_ins = typeof body_pr.bIns === "number" ? body_pr.bIns : 1.27;
            this.clipRect = {
                x: -l_ins,
                y: -_vertical_shift - t_ins,
                w: this.contentWidth + (r_ins + l_ins),
                h: this.contentHeight + (b_ins + t_ins)
            };
        }
        this.invertTransformText2 = global_MatrixTransformer.Invert(this.transformText2);
    },
    copy: function (sp) {
        if (! (sp instanceof CShape)) {
            sp = new CShape();
        }
        sp.setSpPr(this.spPr.createDuplicate());
        sp.setStyle(this.style);
        if (this.nvSpPr) {
            sp.setNvSpPr(this.nvSpPr.createDuplicate());
        }
        if (isRealObject(this.txBody)) {
            var txBody = new CTextBody(sp);
            this.txBody.copy(txBody);
            sp.setTextBody(txBody);
            sp.setBodyPr(this.txBody.bodyPr);
        }
        return sp;
    },
    copy2: function (sp) {
        sp.setSpPr(this.spPr.createDuplicate());
        sp.setStyle(this.style);
        sp.setNvSpPr(this.nvSpPr);
        if (isRealObject(this.txBody)) {
            var txBody = new CTextBody(sp);
            this.txBody.copy(txBody);
            sp.setTextBody(txBody);
            sp.setBodyPr(this.txBody.bodyPr);
            sp.txBody.content.Set_ApplyToAll(true);
            sp.txBody.content.Remove(-1, true, true, false);
            sp.txBody.content.Set_ApplyToAll(false);
        }
    },
    Get_Styles: function (level) {
        if (this.recalcInfo.recalculateTextStyles[level]) {
            this.recalculateTextStyles(level);
            this.recalcInfo.recalculateTextStyles[level] = false;
        }
        return this.compiledStyles[level];
    },
    Set_CurrentElement: function () {},
    recalculateTextStyles: function (level) {
        var parent_objects = this.getParentObjects();
        var default_style = new CStyle("defaultStyle", null, null, null);
        if (isRealObject(parent_objects.presentation.defaultTextStyle) && isRealObject(parent_objects.presentation.defaultTextStyle.levels[level])) {
            var default_ppt_style = parent_objects.presentation.defaultTextStyle.levels[level];
            default_style.ParaPr = default_ppt_style.pPr.Copy();
            default_style.TextPr = default_ppt_style.rPr.Copy();
        }
        var master_style = new CStyle("masterStyele", null, null, null);
        if (isRealObject(parent_objects.master.txStyles)) {
            var master_ppt_styles;
            if (this.isPlaceholder()) {
                switch (this.getPlaceholderType()) {
                case phType_ctrTitle:
                    case phType_title:
                    master_ppt_styles = parent_objects.master.txStyles.titleStyle;
                    break;
                case phType_body:
                    case phType_subTitle:
                    case phType_obj:
                    case null:
                    master_ppt_styles = parent_objects.master.txStyles.bodyStyle;
                    break;
                default:
                    master_ppt_styles = parent_objects.master.txStyles.otherStyle;
                    break;
                }
            } else {
                master_ppt_styles = parent_objects.master.txStyles.otherStyle;
            }
            if (isRealObject(master_ppt_styles) && isRealObject(master_ppt_styles.levels[level])) {
                var master_ppt_style = master_ppt_styles.levels[level];
                master_style.ParaPr = master_ppt_style.pPr.Copy();
                master_style.TextPr = master_ppt_style.rPr.Copy();
            }
        }
        var hierarchy = this.getHierarchy();
        var hierarchy_styles = [];
        for (var i = 0; i < hierarchy.length; ++i) {
            var hierarchy_shape = hierarchy[i];
            if (isRealObject(hierarchy_shape) && isRealObject(hierarchy_shape.txBody) && isRealObject(hierarchy_shape.txBody.lstStyle) && isRealObject(hierarchy_shape.txBody.lstStyle.levels) && isRealObject(hierarchy_shape.txBody.lstStyle.levels[level])) {
                var hierarchy_ppt_style = hierarchy_shape.txBody.lstStyle.levels[level];
                var hierarchy_style = new CStyle("hierarchyStyle" + i, null, null, null);
                hierarchy_style.ParaPr = hierarchy_ppt_style.pPr.Copy();
                hierarchy_style.TextPr = hierarchy_ppt_style.rPr.Copy();
                hierarchy_styles.push(hierarchy_style);
            }
        }
        var ownStyle;
        if (isRealObject(this.txBody) && isRealObject(this.txBody.lstStyle[level])) {
            ownStyle = new CStyle("ownStyle", null, null, null);
            var own_ppt_style = this.txBody.lstStyle[level];
            ownStyle.ParaPr = own_ppt_style.pPr.Copy();
            ownStyle.TextPr = own_ppt_style.rPr.Copy();
        }
        var shape_text_style;
        if (isRealObject(this.style) && isRealObject(this.style.fontRef)) {
            shape_text_style = new CStyle("shapeTextStyle", null, null, null);
            switch (this.style.fontRef.idx) {
            case fntStyleInd_major:
                shape_text_style.TextPr.FontFamily = {
                    Name: getFontInfo("+mj-lt")(parent_objects.theme.themeElements.fontScheme)
                };
                break;
            case fntStyleInd_minor:
                shape_text_style.TextPr.FontFamily = {
                    Name: getFontInfo("+mn-lt")(parent_objects.theme.themeElements.fontScheme)
                };
                break;
            default:
                break;
            }
            if (this.style.fontRef.Color != null && this.style.fontRef.Color.color != null) {
                var unifill = new CUniFill();
                unifill.fill = new CSolidFill();
                unifill.fill.color = this.style.fontRef.Color;
                shape_text_style.TextPr.unifill = unifill;
            } else {
                shape_text_style.TextPr.unifill = null;
            }
        }
        var Styles = new CStyles();
        var isPlaceholder = this.isPlaceholder();
        if (isPlaceholder) {
            if (default_style) {
                Styles.Style[Styles.Id] = default_style;
                default_style.BasedOn = null;
                ++Styles.Id;
            }
            if (master_style) {
                Styles.Style[Styles.Id] = master_style;
                master_style.BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
        } else {
            if (master_style) {
                Styles.Style[Styles.Id] = master_style;
                master_style.BasedOn = null;
                ++Styles.Id;
            }
            if (default_style) {
                Styles.Style[Styles.Id] = default_style;
                default_style.BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
        }
        for (var i = hierarchy_styles.length - 1; i > -1; --i) {
            if (hierarchy_styles[i]) {
                Styles.Style[Styles.Id] = hierarchy_styles[i];
                hierarchy_styles[i].BasedOn = Styles.Id - 1;
                ++Styles.Id;
            }
        }
        if (shape_text_style) {
            Styles.Style[Styles.Id] = shape_text_style;
            shape_text_style.BasedOn = Styles.Id - 1;
            ++Styles.Id;
        }
        this.compiledStyles[level] = Styles;
        return Styles;
    },
    recalculateBrush: function () {
        var compiled_style = this.getCompiledStyle();
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var parents = this.getParentObjects();
        if (isRealObject(parents.theme) && isRealObject(compiled_style) && isRealObject(compiled_style.fillRef)) {
            RGBA = compiled_style.fillRef.Color.RGBA;
            this.brush = parents.theme.getFillStyle(compiled_style.fillRef.idx);
            if (isRealObject(this.brush)) {
                if (isRealObject(compiled_style.fillRef.Color.color) && isRealObject(this.brush) && isRealObject(this.brush.fill) && this.brush.fill.type === FILL_TYPE_SOLID) {
                    this.brush.fill.color = compiled_style.fillRef.Color.createDuplicate();
                }
            } else {
                this.brush = new CUniFill();
            }
        } else {
            this.brush = new CUniFill();
        }
        this.brush.merge(this.getCompiledFill());
        this.brush.transparent = this.getCompiledTransparent();
        this.brush.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
    },
    recalculatePen: function () {
        var compiled_style = this.getCompiledStyle();
        var RGBA = {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        };
        var parents = this.getParentObjects();
        if (isRealObject(parents.theme) && isRealObject(compiled_style) && isRealObject(compiled_style.lnRef)) {
            RGBA = compiled_style.lnRef.Color.RGBA;
            this.pen = parents.theme.getLnStyle(compiled_style.lnRef.idx);
            if (isRealObject(this.pen)) {
                if (isRealObject(compiled_style.lnRef.Color.color) && isRealObject(this.pen) && isRealObject(this.pen.Fill) && isRealObject(this.pen.Fill.fill) && this.pen.Fill.fill.type === FILL_TYPE_SOLID) {
                    this.pen.Fill.fill.color = compiled_style.lnRef.Color.createDuplicate();
                }
            } else {
                this.pen = new CLn();
            }
        } else {
            this.pen = new CLn();
        }
        this.pen.merge(this.getCompiledLine());
        this.pen.calculate(parents.theme, parents.slide, parents.layout, parents.master, RGBA);
    },
    isEmptyPlaceholder: function () {
        if (this.isPlaceholder()) {
            if (this.nvSpPr.nvPr.ph.type == phType_title || this.nvSpPr.nvPr.ph.type == phType_ctrTitle || this.nvSpPr.nvPr.ph.type == phType_body || this.nvSpPr.nvPr.ph.type == phType_subTitle || this.nvSpPr.nvPr.ph.type == null || this.nvSpPr.nvPr.ph.type == phType_dt || this.nvSpPr.nvPr.ph.type == phType_ftr || this.nvSpPr.nvPr.ph.type == phType_hdr || this.nvSpPr.nvPr.ph.type == phType_sldNum || this.nvSpPr.nvPr.ph.type == phType_sldImg) {
                if (this.txBody) {
                    if (this.txBody.content) {
                        return this.txBody.content.Is_Empty();
                    }
                    return true;
                }
                return true;
            }
            if (this.nvSpPr.nvPr.ph.type == phType_chart || this.nvSpPr.nvPr.ph.type == phType_media) {
                return true;
            }
            if (this.nvSpPr.nvPr.ph.type == phType_pic) {
                var _b_empty_text = true;
                if (this.txBody) {
                    if (this.txBody.content) {
                        _b_empty_text = this.txBody.content.Is_Empty();
                    }
                }
                return (_b_empty_text && (this.brush == null || this.brush.fill == null));
            }
        } else {
            return false;
        }
    },
    changeSize: function (kw, kh) {
        if (this.spPr.xfrm.isNotNull()) {
            var xfrm = this.spPr.xfrm;
            this.setOffset(xfrm.offX * kw, xfrm.offY * kh);
            this.setExtents(xfrm.extX * kw, xfrm.extY * kh);
        }
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
    updateInterfaceTextState: function () {
        var _b_no_change_indent;
        if (this.isPlaceholder()) {
            var _ph_type = this.getPhType();
            _b_no_change_indent = _ph_type === phType_title || _ph_type === phType_ctrTitle || _ph_type === phType_chart || _ph_type === phType_pic || _ph_type === phType_clipArt || _ph_type === phType_dgm || _ph_type === phType_dgm;
        } else {
            _b_no_change_indent = false;
        }
        if (this.txBody !== null && typeof this.txBody === "object") {
            if (this.txBody.content !== null && typeof this.txBody.content === "object") {
                var _content = this.txBody.content;
                if (typeof _content.Document_UpdateInterfaceState === "function") {
                    _content.Document_UpdateInterfaceState();
                }
                if (typeof _content.canIncreaseIndent === "function" && _b_no_change_indent === false) {
                    editor.asc_fireCallback("asc_canIncreaseIndent", _content.canIncreaseIndent(true));
                    editor.asc_fireCallback("asc_canDecreaseIndent", _content.canIncreaseIndent(false));
                    return;
                }
            }
        }
        editor.asc_fireCallback("asc_canIncreaseIndent", false);
        editor.asc_fireCallback("asc_canDecreaseIndent", false);
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
    getRotateTrackObject: function () {
        return new RotateTrackShape(this);
    },
    getResizeTrackObject: function (cardDirection) {
        return new CResizeShapeTrack(this, cardDirection);
    },
    getCardDirection: function (num) {},
    getAngle: function (x, y) {
        var px = this.invertTransform.TransformPointX(x, y);
        var py = this.invertTransform.TransformPointY(x, y);
        return Math.PI * 0.5 + Math.atan2(px - this.extX * 0.5, py - this.extY * 0.5);
    },
    recalculateCursorTypes: function () {
        var transform_matrix = this.getTransformMatrix();
        var transform = this.getTransformMatrix();
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
    drawAdjustments: function (drawingDocument) {
        if (isRealObject(this.spPr.geometry)) {
            this.spPr.geometry.drawAdjustments(drawingDocument, this.transform);
        }
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
        this.addTextFlag = false;
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
    getGroupHierarchy: function () {
        if (this.recalcInfo.recalculateGroupHierarchy) {
            this.groupHierarchy = [];
            if (isRealObject(this.group)) {
                var parent_group_hierarchy = this.group.getGroupHierarchy();
                for (var i = 0; i < parent_group_hierarchy.length; ++i) {
                    this.groupHierarchy.push(parent_group_hierarchy[i]);
                }
                this.groupHierarchy.push(this.group);
            }
            this.recalcInfo.recalculateGroupHierarchy = false;
        }
        return this.groupHierarchy;
    },
    hitToAdj: function (x, y) {
        if (isRealObject(this.spPr.geometry)) {
            var px, py;
            px = this.invertTransform.TransformPointX(x, y);
            py = this.invertTransform.TransformPointY(x, y);
            return this.spPr.geometry.hitToAdj(px, py);
        }
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
            return this.spPr.geometry.hitInPath(this.drawingDocument.CanvasHitContext, px, py);
        }
        return false;
    },
    hitToInnerArea: function (x, y) {
        if (isRealObject(this.spPr.geometry)) {
            var px = this.invertTransform.TransformPointX(x, y);
            var py = this.invertTransform.TransformPointY(x, y);
            return this.spPr.geometry.hitInInnerArea(this.drawingDocument.CanvasHitContext, px, py);
        }
        return false;
    },
    hitToTextRect: function (x, y) {
        if (isRealObject(this.txBody)) {
            var px = this.invertTransformText.TransformPointX(x, y);
            var py = this.invertTransformText.TransformPointY(x, y);
            return this.txBody.hitToRect(px, py);
        }
        return false;
    },
    hitToBoundsRect: function (x, y) {
        return false;
    },
    hitInTextRect: function (x, y) {
        if (isRealObject(this.txBody)) {
            var t_x, t_y;
            t_x = this.invertTransformText.TransformPointX(x, y);
            t_y = this.invertTransformText.TransformPointY(x, y);
            return t_x > 0 && t_x < this.txBody.contentWidth && t_y > 0 && t_y < this.txBody.contentHeight;
        }
        return false;
    },
    setAdjustmentValue: function (ref1, value1, ref2, value2) {
        if (isRealObject(this.spPr.geometry)) {
            var old_geometry = this.spPr.geometry.createDuplicate();
            this.spPr.geometry.setGuideValue(ref1, value1);
            this.spPr.geometry.setGuideValue(ref2, value2);
            var new_geometry = this.spPr.geometry.createDuplicate();
            History.Add(this, {
                Type: historyitem_SetShapeSetGeometry,
                oldGeometry: old_geometry,
                newGeometry: new_geometry
            });
            this.recalcInfo.recalculateGeometry = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    updateCursorType: function (x, y, e) {
        var tx = this.invertTransformText.TransformPointX(x, y);
        var ty = this.invertTransformText.TransformPointY(x, y);
        var page_num = this.parent instanceof Slide ? this.parent.num : 0;
        this.txBody.content.Update_CursorType(tx, ty, page_num);
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
    selectionSetStart: function (e, x, y, slideIndex) {
        if (isRealObject(this.txBody)) {
            this.addTextFlag = true;
            var tx, ty;
            tx = this.invertTransformText.TransformPointX(x, y);
            ty = this.invertTransformText.TransformPointY(x, y);
            this.txBody.content.Selection_SetStart(tx, ty, 0, e);
            this.txBody.content.RecalculateCurPos();
        }
    },
    selectionSetEnd: function (e, x, y, slideIndex) {
        if (isRealObject(this.txBody)) {
            var tx, ty;
            tx = this.invertTransformText.TransformPointX(x, y);
            ty = this.invertTransformText.TransformPointY(x, y);
            this.txBody.content.Selection_SetEnd(tx, ty, 0, e);
        }
    },
    updateSelectionState: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.updateSelectionState(this.parent.presentation.DrawingDocument);
        } else {
            this.parent.presentation.DrawingDocument.UpdateTargetTransform(null);
            this.parent.presentation.DrawingDocument.TargetEnd();
            this.parent.presentation.DrawingDocument.SelectEnabled(false);
            this.parent.presentation.DrawingDocument.SelectClear();
            this.parent.presentation.DrawingDocument.SelectShow();
        }
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
    getBase64Img: function () {
        return ShapeToImageConverter(this, this.pageIndex).ImageUrl;
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        if (!isRealObject(this.txBody)) {
            this.setTextBody(new CTextBody(this));
            this.recalculateContent();
        }
        this.addTextFlag = true;
        this.txBody.content.Paragraph_Add(paraItem, false);
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    addNewParagraph: function () {
        if (!isRealObject(this.txBody)) {
            this.addTextBody(new CTextBody(this));
            this.recalculateContent();
        } else {
            this.txBody.content.Add_NewParagraph(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            this.txBody.bRecalculateNumbering = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    paragraphFormatPaste: function (CopyTextPr, CopyParaPr, Bool) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Paragraph_Format_Paste(CopyTextPr, CopyParaPr, Bool);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    setParagraphAlign: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphAlign(val);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    applyAllAlign: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Set_ParagraphAlign(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    setParagraphSpacing: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphSpacing(val);
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    setParagraphTabs: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphTabs(val);
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    applyAllSpacing: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Set_ParagraphSpacing(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    setParagraphNumbering: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphNumbering(val);
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    applyAllNumbering: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Set_ParagraphNumbering(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    setParagraphIndent: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ParagraphIndent(val);
            this.txBody.bRecalculateNumbering = true;
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    applyAllIndent: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Set_ParagraphIndent(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Paragraph_IncDecFontSize: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Paragraph_IncDecFontSize(val);
            this.txBody.content.RecalculateCurPos();
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Paragraph_IncDecFontSizeAll: function (val) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Paragraph_IncDecFontSize(val);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    Cursor_MoveToStartPos: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveToStartPos();
            this.txBody.content.RecalculateCurPos();
        }
    },
    Cursor_MoveToEndPos: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveToEndPos();
            this.txBody.content.RecalculateCurPos();
        }
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveLeft(AddToSelect, Word);
            this.txBody.content.RecalculateCurPos();
        }
    },
    Cursor_MoveRight: function (AddToSelect, Word) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveRight(AddToSelect, Word);
            this.txBody.content.RecalculateCurPos();
        }
    },
    Cursor_MoveUp: function (AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveUp(AddToSelect);
            this.txBody.content.RecalculateCurPos();
        }
    },
    Cursor_MoveDown: function (AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveDown(AddToSelect);
            this.txBody.content.RecalculateCurPos();
        }
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveEndOfLine(AddToSelect);
            this.txBody.content.RecalculateCurPos();
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveStartOfLine(AddToSelect);
            this.txBody.content.RecalculateCurPos();
        }
    },
    Cursor_MoveAt: function (X, Y, AddToSelect) {
        if (isRealObject(this.txBody)) {
            this.txBody.content.Cursor_MoveAt(X, Y, AddToSelect);
            this.txBody.content.RecalculateCurPos();
        }
    },
    addTextBody: function (txBody) {},
    recalculateCurPos: function () {
        if (isRealObject(this.txBody)) {
            this.txBody.content.RecalculateCurPos();
        }
    },
    onParagraphChanged: function () {
        this.recalcInfo.recalculateContent = true;
        this.recalcInfo.recalculateTransformText = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    isSimpleObject: function () {
        return true;
    },
    getCurDocumentContent: function () {
        if (this.txBody) {
            return this.txBody.content;
        }
    },
    getSearchResults: function (str, ownNum) {
        var documentContentSelectionStates = this.txBody ? this.txBody.getSearchResults(str) : [];
        if (documentContentSelectionStates.length > 0) {
            var arrSelSt = [];
            for (var i = 0; i < documentContentSelectionStates.length; ++i) {
                var s = {};
                if (!isRealObject(this.group)) {
                    s.id = STATES_ID_TEXT_ADD;
                    s.textObject = this;
                    s.textSelectionState = documentContentSelectionStates[i];
                } else {
                    s.id = STATES_ID_TEXT_ADD_IN_GROUP;
                    var group = this.group;
                    while (group.group) {
                        group = group.group;
                    }
                    s.group = group;
                    s.textObject = this;
                    s.textSelectionState = documentContentSelectionStates[i];
                }
                arrSelSt.push(s);
            }
            return arrSelSt;
        } else {
            return null;
        }
    },
    draw: function (graphics) {
        if (graphics.IsSlideBoundsCheckerType === true) {
            graphics.transform3(this.transform);
            if (null == this.geometry || !graphics.IsShapeNeedBounds(this.spPr.geometry.preset)) {
                graphics._s();
                graphics._m(0, 0);
                graphics._l(this.extX, 0);
                graphics._l(this.extX, this.extY);
                graphics._l(0, this.extY);
                graphics._e();
            } else {
                this.geometry.check_bounds(graphics);
            }
            if (this.txBody) {
                graphics.SetIntegerGrid(false);
                var transform_text;
                if ((!this.txBody.content || this.txBody.content.Is_Empty()) && this.txBody.content2 != null && !this.addTextFlag && (this.isEmptyPlaceholder ? this.isEmptyPlaceholder() : false) && this.transformText2) {
                    transform_text = this.transformText2;
                } else {
                    if (this.txBody.content) {
                        transform_text = this.transformText;
                    }
                }
                graphics.transform3(transform_text);
                this.txBody.draw(graphics);
                graphics.SetIntegerGrid(true);
            }
            graphics.reset();
            return;
        }
        if (this.geometry || this.style || (this.brush && this.brush.fill) || (this.pen && this.pen.Fill && this.pen.Fill.fill)) {
            graphics.SetIntegerGrid(false);
            graphics.transform3(this.transform, false);
            var shape_drawer = new CShapeDrawer();
            shape_drawer.fromShape2(this, graphics, this.spPr.geometry);
            shape_drawer.draw(this.spPr.geometry);
        }
        if (this.isEmptyPlaceholder() && graphics.IsNoDrawingEmptyPlaceholder !== true) {
            if (graphics.m_oContext !== undefined && graphics.IsTrack === undefined && !this.addTextFlag) {
                if (global_MatrixTransformer.IsIdentity2(this.transform)) {
                    graphics.transform3(this.transform, false);
                    var tr = graphics.m_oFullTransform;
                    graphics.SetIntegerGrid(true);
                    var _x = tr.TransformPointX(0, 0);
                    var _y = tr.TransformPointY(0, 0);
                    var _r = tr.TransformPointX(this.extX, this.extY);
                    var _b = tr.TransformPointY(this.extX, this.extY);
                    graphics.m_oContext.lineWidth = 1;
                    graphics.p_color(127, 127, 127, 255);
                    graphics._s();
                    editor.WordControl.m_oDrawingDocument.AutoShapesTrack.AddRectDashClever(graphics.m_oContext, _x >> 0, _y >> 0, _r >> 0, _b >> 0, 2, 2);
                    graphics.ds();
                } else {
                    graphics.transform3(this.transform, false);
                    var tr = graphics.m_oFullTransform;
                    graphics.SetIntegerGrid(true);
                    var _r = this.extX;
                    var _b = this.extY;
                    var x1 = tr.TransformPointX(0, 0) >> 0;
                    var y1 = tr.TransformPointY(0, 0) >> 0;
                    var x2 = tr.TransformPointX(_r, 0) >> 0;
                    var y2 = tr.TransformPointY(_r, 0) >> 0;
                    var x3 = tr.TransformPointX(0, _b) >> 0;
                    var y3 = tr.TransformPointY(0, _b) >> 0;
                    var x4 = tr.TransformPointX(_r, _b) >> 0;
                    var y4 = tr.TransformPointY(_r, _b) >> 0;
                    graphics.m_oContext.lineWidth = 1;
                    graphics.p_color(127, 127, 127, 255);
                    graphics._s();
                    editor.WordControl.m_oDrawingDocument.AutoShapesTrack.AddRectDash(graphics.m_oContext, x1, y1, x2, y2, x3, y3, x4, y4, 3, 1);
                    graphics.ds();
                }
            } else {
                graphics.SetIntegerGrid(false);
                graphics.p_width(70);
                graphics.transform3(this.transform, false);
                graphics.p_color(0, 0, 0, 255);
                graphics._s();
                graphics._m(0, 0);
                graphics._l(this.extX, 0);
                graphics._l(this.extX, this.extY);
                graphics._l(0, this.extY);
                graphics._z();
                graphics.ds();
                graphics.SetIntegerGrid(true);
            }
        }
        if (this.txBody) {
            graphics.SetIntegerGrid(false);
            var transform_text;
            if ((!this.txBody.content || this.txBody.content.Is_Empty()) && this.txBody.content2 != null && !this.addTextFlag && (this.isEmptyPlaceholder ? this.isEmptyPlaceholder() : false) && this.transformText2) {
                transform_text = this.transformText2;
            } else {
                if (this.txBody.content) {
                    transform_text = this.transformText;
                }
            }
            graphics.transform3(transform_text);
            this.txBody.draw(graphics);
            if (graphics.FreeFont !== undefined) {
                graphics.FreeFont();
            }
            graphics.SetIntegerGrid(true);
        }
        graphics.transform3(this.transform);
        graphics.SetIntegerGrid(false);
        if (locktype_None != this.Lock.Get_Type()) {
            graphics.DrawLockObjectRect(this.Lock.Get_Type(), 0, 0, this.extX, this.extY);
        }
        graphics.reset();
        graphics.SetIntegerGrid(true);
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
    getRectForGrouping: function () {},
    getInvertTransform: function () {
        if (this.recalcInfo.recalculateTransform) {
            this.recalculateTransform();
            this.recalcInfo.recalculateTransform = true;
        }
        return this.invertTransform;
    },
    getFullOffset: function () {
        if (!isRealObject(this.group)) {
            return {
                offX: this.x,
                offY: this.y
            };
        }
        var group_offset = this.group.getFullOffset();
        return {
            offX: this.x + group_offset.offX,
            offY: this.y + group_offset.offY
        };
    },
    getPresetGeom: function () {
        if (this.spPr.geometry != null) {
            return this.spPr.geometry.preset;
        } else {
            return null;
        }
    },
    getFill: function () {
        return this.brush;
    },
    getStroke: function () {
        return this.pen;
    },
    canChangeArrows: function () {
        if (this.spPr.geometry == null) {
            return false;
        }
        var _path_list = this.spPr.geometry.pathLst;
        var _path_index;
        var _path_command_index;
        var _path_command_arr;
        for (_path_index = 0; _path_index < _path_list.length; ++_path_index) {
            _path_command_arr = _path_list[_path_index].ArrPathCommandInfo;
            for (_path_command_index = 0; _path_command_index < _path_command_arr.length; ++_path_command_index) {
                if (_path_command_arr[_path_command_index].id == 5) {
                    break;
                }
            }
            if (_path_command_index == _path_command_arr.length) {
                return true;
            }
        }
        return false;
    },
    getParagraphParaPr: function () {
        if (this.txBody && this.txBody.content) {
            var _result;
            this.txBody.content.Set_ApplyToAll(true);
            _result = this.txBody.content.Get_Paragraph_ParaPr();
            this.txBody.content.Set_ApplyToAll(false);
            return _result;
        }
        return null;
    },
    getParagraphTextPr: function () {
        if (this.txBody && this.txBody.content) {
            var _result;
            this.txBody.content.Set_ApplyToAll(true);
            _result = this.txBody.content.Get_Paragraph_TextPr();
            this.txBody.content.Set_ApplyToAll(false);
            return _result;
        }
        return null;
    },
    setVerticalAlign: function (align) {
        if (this.txBody) {
            var old_body_pr = this.txBody.bodyPr.createDuplicate();
            this.txBody.bodyPr.anchor = align;
            this.txBody.recalcInfo.recalculateBodyPr = true;
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
            var new_body_pr = this.txBody.bodyPr.createDuplicate();
            History.Add(this, {
                Type: historyitem_SetShapeBodyPr,
                oldBodyPr: old_body_pr,
                newBodyPr: new_body_pr
            });
            this.txBody.recalcInfo.recalculateBodyPr = true;
            this.recalculateContent();
            this.recalculateTransformText();
        }
    },
    changePresetGeom: function (sPreset) {
        var _final_preset;
        var _old_line;
        var _new_line;
        if (this.spPr.ln == null) {
            _old_line = null;
        } else {
            _old_line = this.spPr.ln.createDuplicate();
        }
        switch (sPreset) {
        case "lineWithArrow":
            _final_preset = "line";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            break;
        case "lineWithTwoArrows":
            _final_preset = "line";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            _new_line.headEnd = new EndArrow();
            _new_line.headEnd.type = LineEndType.Arrow;
            _new_line.headEnd.len = LineEndSize.Mid;
            _new_line.headEnd.w = LineEndSize.Mid;
            break;
        case "bentConnector5WithArrow":
            _final_preset = "bentConnector5";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            break;
        case "bentConnector5WithTwoArrows":
            _final_preset = "bentConnector5";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            _new_line.headEnd = new EndArrow();
            _new_line.headEnd.type = LineEndType.Arrow;
            _new_line.headEnd.len = LineEndSize.Mid;
            _new_line.headEnd.w = LineEndSize.Mid;
            break;
        case "curvedConnector3WithArrow":
            _final_preset = "curvedConnector3";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            break;
        case "curvedConnector3WithTwoArrows":
            _final_preset = "curvedConnector3";
            _arrow_flag = true;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = new EndArrow();
            _new_line.tailEnd.type = LineEndType.Arrow;
            _new_line.tailEnd.len = LineEndSize.Mid;
            _new_line.tailEnd.w = LineEndSize.Mid;
            _new_line.headEnd = new EndArrow();
            _new_line.headEnd.type = LineEndType.Arrow;
            _new_line.headEnd.len = LineEndSize.Mid;
            _new_line.headEnd.w = LineEndSize.Mid;
            break;
        default:
            _final_preset = sPreset;
            if (_old_line == null) {
                _new_line = new CLn();
            } else {
                _new_line = this.spPr.ln.createDuplicate();
            }
            _new_line.tailEnd = null;
            _new_line.headEnd = null;
            break;
        }
        var old_geometry = isRealObject(this.spPr.geometry) ? this.spPr.geometry : null;
        if (_final_preset != null) {
            this.spPr.geometry = CreateGeometry(_final_preset);
            this.spPr.geometry.Init(100, 100);
        } else {
            this.spPr.geometry = null;
        }
        var new_geometry = isRealObject(this.spPr.geometry) ? this.spPr.geometry : null;
        if ((!this.brush || !this.brush.fill) && (!this.pen || !this.pen.Fill || !this.pen.Fill.fill)) {
            var new_line2 = new CLn();
            new_line2.Fill = new CUniFill();
            new_line2.Fill.fill = new CSolidFill();
            new_line2.Fill.fill.color = new CUniColor();
            new_line2.Fill.fill.color.color = new CSchemeColor();
            new_line2.Fill.fill.color.color.id = 0;
            if (isRealObject(_new_line)) {
                new_line2.merge(_new_line);
            }
            this.setLine(new_line2);
        } else {
            this.setLine(_new_line);
        }
        History.Add(this, {
            Type: historyitem_SetShapeSetGeometry,
            oldGeometry: old_geometry,
            newGeometry: new_geometry
        });
        this.recalcInfo.recalculateGeometry = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
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
    changeFill: function (unifill) {
        var old_fill = this.spPr.Fill ? this.spPr.Fill.createDuplicate() : null;
        if (this.spPr.Fill == null) {
            this.spPr.Fill = new CUniFill();
        }
        this.spPr.Fill = CorrectUniFill(unifill, this.spPr.Fill);
        var new_fill = this.spPr.Fill.createDuplicate();
        History.Add(this, {
            Type: historyitem_SetShapeSetFill,
            oldFill: old_fill,
            newFill: new_fill
        });
        this.recalcInfo.recalculateFill = true;
        this.recalcInfo.recalculateBrush = true;
        this.recalcInfo.recalculateTransparent = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setFill: function (fill) {
        var old_fill = this.spPr.Fill;
        this.spPr.Fill = fill;
        var new_fill = this.spPr.Fill.createDuplicate();
        History.Add(this, {
            Type: historyitem_SetShapeSetFill,
            oldFill: old_fill,
            newFill: new_fill
        });
    },
    changeLine: function (line) {
        var old_line = this.spPr.ln ? this.spPr.ln.createDuplicate() : null;
        if (!isRealObject(this.spPr.ln)) {
            this.spPr.ln = new CLn();
        }
        this.spPr.ln = CorrectUniStroke(line, this.spPr.ln);
        var new_line = this.spPr.ln.createDuplicate();
        History.Add(this, {
            Type: historyitem_SetShapeSetLine,
            oldLine: old_line,
            newLine: new_line
        });
        this.recalcInfo.recalculateLine = true;
        this.recalcInfo.recalculatePen = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    setLine: function (line) {
        var old_line = this.spPr.ln;
        var new_line = line;
        this.spPr.ln = line;
        History.Add(this, {
            Type: historyitem_SetShapeSetLine,
            oldLine: old_line,
            newLine: new_line
        });
        this.recalcInfo.recalculateLine = true;
        this.recalcInfo.recalculatePen = true;
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
    },
    transformPointRelativeShape: function (x, y) {
        var _horizontal_center = this.extX * 0.5;
        var _vertical_enter = this.extY * 0.5;
        var _sin = Math.sin(this.rot);
        var _cos = Math.cos(this.rot);
        var _temp_x = x - (-_horizontal_center * _cos + _vertical_enter * _sin + this.x + _horizontal_center);
        var _temp_y = y - (-_horizontal_center * _sin - _vertical_enter * _cos + this.y + _vertical_enter);
        var _relative_x = _temp_x * _cos + _temp_y * _sin;
        var _relative_y = -_temp_x * _sin + _temp_y * _cos;
        if (this.absFlipH) {
            _relative_x = this.extX - _relative_x;
        }
        if (this.absFlipV) {
            _relative_y = this.extY - _relative_y;
        }
        return {
            x: _relative_x,
            y: _relative_y
        };
    },
    hitToAdjustment: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitToAdj(t_x, t_y, this.getParentObjects().presentation.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE));
        }
        return {
            hit: false,
            adjPolarFlag: null,
            adjNum: null
        };
    },
    hitToHandles: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var t_x, t_y;
        t_x = invert_transform.TransformPointX(x, y);
        t_y = invert_transform.TransformPointY(x, y);
        var radius = this.getParentObjects().presentation.DrawingDocument.GetMMPerDot(TRACK_CIRCLE_RADIUS);
        var check_line = CheckObjectLine(this);
        var sqr_x = t_x * t_x,
        sqr_y = t_y * t_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 0;
        }
        var hc = this.extX * 0.5;
        var dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line) {
            return 1;
        }
        dist_x = t_x - this.extX;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line) {
            return 2;
        }
        var vc = this.extY * 0.5;
        var dist_y = t_y - vc;
        sqr_y = dist_y * dist_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line) {
            return 3;
        }
        dist_y = t_y - this.extY;
        sqr_y = dist_y * dist_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius) {
            return 4;
        }
        dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line) {
            return 5;
        }
        dist_x = t_x;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line) {
            return 6;
        }
        dist_y = t_y - vc;
        sqr_y = dist_y * dist_y;
        if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line) {
            return 7;
        }
        var rotate_distance = this.getParentObjects().presentation.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE);
        dist_y = t_y + rotate_distance;
        sqr_y = dist_y * dist_y;
        dist_x = t_x - hc;
        sqr_x = dist_x * dist_x;
        if (Math.sqrt(sqr_x + sqr_y) < radius && !check_line) {
            return 8;
        }
        return -1;
    },
    hit: function (x, y) {
        return this.hitInInnerArea(x, y) || this.hitInPath(x, y) || this.hitInTextRect(x, y);
    },
    hitInPath: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        if (isRealObject(this.spPr.geometry)) {
            return this.spPr.geometry.hitInPath(this.getParentObjects().presentation.DrawingDocument.CanvasHitContext, x_t, y_t);
        } else {
            return this.hitInBoundingRect(x, y);
        }
        return false;
    },
    hitInInnerArea: function (x, y) {
        if (this.brush != null && this.brush.fill != null && this.brush.fill.type != FILL_TYPE_NOFILL) {
            var invert_transform = this.getInvertTransform();
            var x_t = invert_transform.TransformPointX(x, y);
            var y_t = invert_transform.TransformPointY(x, y);
            if (isRealObject(this.spPr.geometry)) {
                return this.spPr.geometry.hitInInnerArea(this.getParentObjects().presentation.DrawingDocument.CanvasHitContext, x_t, y_t);
            }
            return x_t > 0 && x_t < this.extX && y_t > 0 && y_t < this.extY;
        }
        return false;
    },
    hitInBoundingRect: function (x, y) {
        var invert_transform = this.getInvertTransform();
        var x_t = invert_transform.TransformPointX(x, y);
        var y_t = invert_transform.TransformPointY(x, y);
        var _hit_context = this.getParentObjects().presentation.DrawingDocument.CanvasHitContext;
        return ! (CheckObjectLine(this)) && (HitInLine(_hit_context, x_t, y_t, 0, 0, this.extX, 0) || HitInLine(_hit_context, x_t, y_t, this.extX, 0, this.extX, this.extY) || HitInLine(_hit_context, x_t, y_t, this.extX, this.extY, 0, this.extY) || HitInLine(_hit_context, x_t, y_t, 0, this.extY, 0, 0) || HitInLine(_hit_context, x_t, y_t, this.extX * 0.5, 0, this.extX * 0.5, -this.getParentObjects().presentation.DrawingDocument.GetMMPerDot(TRACK_DISTANCE_ROTATE)));
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
        return !this.isPlaceholder();
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
    applyAllTextProps: function (textPr) {
        if (this.txBody) {
            this.txBody.content.Set_ApplyToAll(true);
            this.txBody.content.Paragraph_Add(textPr);
            this.txBody.content.Set_ApplyToAll(false);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        if (this.txBody) {
            this.txBody.content.Remove(Count, bOnlyText, bRemoveOnlySelection);
            this.recalcInfo.recalculateContent = true;
            this.recalcInfo.recalculateTransformText = true;
            editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        }
    },
    getTextSelectionState: function () {
        if (this.txBody) {
            return this.txBody.content.Get_SelectionState();
        }
        return [];
    },
    setTextSelectionState: function (s) {
        if (this.txBody) {
            this.txBody.content.Set_SelectionState(s, s.length - 1);
        }
    },
    Refresh_RecalcData: function () {},
    Undo: function (data) {
        switch (data.Type) {
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
        case historyitem_SetSetNvSpPr:
            this.nvSpPr = data.oldPr;
            break;
        case historyitem_SetSetSpPr:
            this.spPr = data.oldPr;
            break;
        case historyitem_SetSetStyle:
            this.style = data.oldPr;
            break;
        case historyitem_SetTextBody:
            this.txBody = data.oldPr;
            break;
        case historyitem_SetSpGroup:
            this.group = data.oldPr;
            break;
        case historyitem_SetShapeParent:
            this.parent = data.Old;
            break;
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        if (!this.parent) {
            delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
        }
    },
    Redo: function (data) {
        switch (data.Type) {
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
        case historyitem_SetSetNvSpPr:
            this.nvSpPr = data.newPr;
            break;
        case historyitem_SetSetSpPr:
            this.spPr = data.newPr;
            break;
        case historyitem_SetSetStyle:
            this.style = data.newPr;
            break;
        case historyitem_SetTextBody:
            this.txBody = data.newPr;
            break;
        case historyitem_SetSpGroup:
            this.group = data.newPr;
            break;
        case historyitem_SetShapeParent:
            this.parent = data.New;
            break;
        }
        editor.WordControl.m_oLogicDocument.recalcMap[this.Id] = this;
        if (!this.parent) {
            delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
        }
    },
    Save_Changes: function (data, w) {
        w.WriteLong(historyitem_type_Shape);
        w.WriteLong(data.Type);
        var bool;
        switch (data.Type) {
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
        case historyitem_SetTextBody:
            w.WriteBool(isRealObject(data.newPr));
            if (isRealObject(data.newPr)) {
                w.WriteString2(data.newPr.Get_Id());
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
                if (this.spPr.Fill && this.spPr.Fill.fill instanceof CBlipFill && typeof this.spPr.Fill.fill.RasterImageId === "string") {
                    CollaborativeEditing.Add_NewImage(this.spPr.Fill.fill.RasterImageId);
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
            case historyitem_SetSetNvSpPr:
                if (r.GetBool()) {
                    this.nvSpPr = new UniNvPr();
                    this.nvSpPr.Read_FromBinary2(r);
                } else {
                    this.nvSpPr = null;
                }
                break;
            case historyitem_SetSetSpPr:
                this.spPr = new CSpPr();
                if (r.GetBool()) {
                    this.spPr.Read_FromBinary2(r);
                }
                break;
            case historyitem_SetSetStyle:
                if (r.GetBool()) {
                    this.style = new CShapeStyle();
                    this.style.Read_FromBinary2(r);
                } else {
                    this.style = null;
                }
                break;
            case historyitem_SetTextBody:
                if (r.GetBool()) {
                    this.txBody = g_oTableId.Get_ById(r.GetString2());
                } else {
                    this.txBody = null;
                }
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
            if (!this.parent) {
                delete editor.WordControl.m_oLogicDocument.recalcMap[this.Id];
            }
        }
    },
    Write_ToBinary2: function (w) {
        w.WriteLong(historyitem_type_Shape);
        w.WriteString2(this.Id);
    },
    Read_FromBinary2: function (r) {
        this.Id = r.GetString2();
    },
    Load_LinkData: function (linkData) {
        this.parent = g_oTableId.Get_ById(linkData.parent);
    }
};
function CreateBinaryReader(szSrc, offset, srcLen) {
    var nWritten = 0;
    var index = -1 + offset;
    var dst_len = "";
    for (; index < srcLen;) {
        index++;
        var _c = szSrc.charCodeAt(index);
        if (_c == ";".charCodeAt(0)) {
            index++;
            break;
        }
        dst_len += String.fromCharCode(_c);
    }
    var dstLen = parseInt(dst_len);
    if (isNaN(dstLen)) {
        return null;
    }
    var pointer = g_memory.Alloc(dstLen);
    var stream = new FT_Stream2(pointer.data, dstLen);
    stream.obj = pointer.obj;
    var dstPx = stream.data;
    if (window.chrome) {
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = DecodeBase64Char(szSrc.charCodeAt(index++));
                if (nCh == -1) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    } else {
        var p = b64_decode;
        while (index < srcLen) {
            var dwCurr = 0;
            var i;
            var nBits = 0;
            for (i = 0; i < 4; i++) {
                if (index >= srcLen) {
                    break;
                }
                var nCh = p[szSrc.charCodeAt(index++)];
                if (nCh == undefined) {
                    i--;
                    continue;
                }
                dwCurr <<= 6;
                dwCurr |= nCh;
                nBits += 6;
            }
            dwCurr <<= 24 - nBits;
            for (i = 0; i < nBits / 8; i++) {
                dstPx[nWritten++] = ((dwCurr & 16711680) >>> 16);
                dwCurr <<= 8;
            }
        }
    }
    return stream;
}