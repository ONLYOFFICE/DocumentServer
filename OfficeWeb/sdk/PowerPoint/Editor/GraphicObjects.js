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
 function CGraphicObjects(slide) {
    this.slide = slide;
    this.State = new NullState(this, this.slide);
    this.selectedObjects = [];
    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];
    this.selectionRect = null;
}
CGraphicObjects.prototype = {
    showComment: function (id, x, y) {
        editor.sync_HideComment();
        editor.sync_ShowComment(id, x, y);
    },
    hideComment: function () {
        editor.sync_HideComment();
    },
    resetSelectionState: function () {
        if (isRealObject(this.State.group)) {
            var selected_objects = this.State.group.selectedObjects;
            var count = selected_objects.length;
            while (count > 0) {
                var old_gr = this.State.group.selectedObjects[0].group;
                this.State.group.selectedObjects[0].group = this.State.group;
                var sp = this.State.group.selectedObjects[0].deselect();
                sp.group = old_gr;
                --count;
            }
        }
        var count = this.selectedObjects.length;
        while (count > 0) {
            var old_gr = this.selectedObjects[0].group;
            this.selectedObjects[0].group = null;
            var obj = this.selectedObjects[0].deselect(this);
            obj.group = old_gr;
            --count;
        }
        for (var i = 0; i < this.slide.comments.length; ++i) {
            this.slide.comments[i].selected = false;
        }
        this.changeCurrentState(new NullState(this, this.slide));
    },
    resetSelection: function () {
        var count = this.selectedObjects.length;
        while (count > 0) {
            this.selectedObjects[0].deselect(this);
            --count;
        }
    },
    Select_All: function () {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            case STATES_ID_CHART_TEXT_ADD:
            case STATES_ID_CHART_GROUP_TEXT_ADD:
            if (this.State.textObject.txBody) {
                this.State.textObject.txBody.content.Select_All();
            } else {
                if (this.State.textObject instanceof CGraphicFrame) {
                    this.State.textObject.graphicObject.Select_All();
                }
            }
            break;
        case STATES_ID_NULL:
            this.resetSelection();
            for (var i = 0; i < this.slide.cSld.spTree.length; ++i) {
                this.slide.cSld.spTree[i].select(this);
            }
            break;
        }
        editor.WordControl.OnUpdateOverlay();
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        var b_rulers = false;
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            case STATES_ID_CHART_TEXT_ADD:
            case STATES_ID_CHART_GROUP_TEXT_ADD:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                History.Create_NewPoint();
                this.State.textObject.paragraphAdd(paraItem, bRecalculate);
            }
            break;
        case STATES_ID_NULL:
            if (paraItem.Type === para_TextPr) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false) {
                    History.Create_NewPoint();
                    for (var i = 0; i < this.selectedObjects.length; ++i) {
                        if (typeof this.selectedObjects[i].applyAllTextProps === "function") {
                            this.selectedObjects[i].applyAllTextProps(paraItem);
                        }
                    }
                }
            } else {
                if (this.selectedObjects.length === 1) {
                    if (!CheckObjectLine(this.selectedObjects[0]) && typeof this.selectedObjects[0].paragraphAdd === "function") {
                        if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                            History.Create_NewPoint();
                            if (this.selectedObjects[0].Cursor_MoveToEndPos) {
                                this.selectedObjects[0].Cursor_MoveToEndPos();
                            }
                            this.selectedObjects[0].paragraphAdd(paraItem, bRecalculate);
                            this.changeCurrentState(new TextAddState(this, this.slide, this.selectedObjects[0]));
                            b_rulers = true;
                        }
                    }
                }
            }
            break;
        case STATES_ID_GROUP:
            if (paraItem.Type === para_TextPr) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false) {
                    History.Create_NewPoint();
                    for (var i = 0; i < this.State.group.selectedObjects.length; ++i) {
                        if (typeof this.State.group.selectedObjects[i].applyAllTextProps === "function") {
                            this.State.group.selectedObjects[i].applyAllTextProps(paraItem);
                        }
                    }
                }
            } else {
                if (this.State.group.selectedObjects.length === 1) {
                    if (typeof this.State.group.selectedObjects[0].paragraphAdd === "function") {
                        if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                            History.Create_NewPoint();
                            this.State.group.selectedObjects[0].paragraphAdd(paraItem, bRecalculate);
                            this.changeCurrentState(new TextAddInGroup(this, this.slide, this.State.group, this.State.group.selectedObjects[0]));
                            b_rulers = true;
                        }
                    }
                }
            }
            break;
        }
        editor.WordControl.m_oLogicDocument.Recalculate();
        if (b_rulers) {
            editor.WordControl.m_oLogicDocument.Document_UpdateRulersState();
        }
    },
    Paragraph_ClearFormatting: function () {
        if (this.State.textObject && this.State.textObject.Paragraph_ClearFormatting) {
            this.State.textObject.Paragraph_ClearFormatting();
        }
    },
    Update_CursorType: function (x, y, e) {
        var drawingDocument = editor.WordControl.m_oLogicDocument.DrawingDocument;
        switch (this.State.id) {
        case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            case STATES_ID_CHART_GROUP_TEXT_ADD:
            case STATES_ID_CHART_GROUP:
            var group_selected_objects = this.State.group.selectedObjects;
            if (group_selected_objects.length === 1) {
                var hit_to_adj = group_selected_objects[0].hitToAdjustment(x, y);
                if (hit_to_adj.hit) {
                    drawingDocument.SetCursorType("crosshair");
                    return;
                }
            }
            for (var i = group_selected_objects.length - 1; i > -1; --i) {
                var hit_to_handles = group_selected_objects[i].hitToHandles(x, y);
                if (hit_to_handles > -1) {
                    if (hit_to_handles === 8) {
                        drawingDocument.SetCursorType("crosshair");
                    } else {
                        if (!group_selected_objects[i].canResize()) {
                            drawingDocument.SetCursorType("default");
                            return;
                        }
                        var card_direction = group_selected_objects[i].getCardDirectionByNum(hit_to_handles);
                        drawingDocument.SetCursorType(CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]);
                    }
                    return;
                }
            }
            var hit_to_handles = this.State.group.hitToHandles(x, y);
            if (hit_to_handles > -1) {
                if (hit_to_handles === 8) {
                    drawingDocument.SetCursorType("crosshair");
                } else {
                    if (!this.State.group.canResize()) {
                        drawingDocument.SetCursorType("default");
                        return;
                    }
                    var card_direction = this.State.group.getCardDirectionByNum(hit_to_handles);
                    drawingDocument.SetCursorType(CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]);
                }
            }
            for (i = group_selected_objects.length - 1; i > -1; --i) {
                if (group_selected_objects[i].hitInBoundingRect(x, y)) {
                    drawingDocument.SetCursorType("move");
                }
            }
            if (this.State.group.hitInBoundingRect(x, y)) {
                drawingDocument.SetCursorType("move");
                return;
            }
            var drawing_bases = this.slide.getDrawingObjects();
            var selected_objects = this.selectedObjects;
            for (i = drawing_bases.length - 1; i > -1; --i) {
                var cur_drawing_base = drawing_bases[i];
                var cur_drawing = cur_drawing_base;
                if (cur_drawing.isSimpleObject()) {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                        drawingDocument.SetCursorType("move");
                    } else {
                        if (hit_in_text_rect) {
                            drawingDocument.SetCursorType("text");
                        }
                    }
                } else {
                    if (this.State.group === cur_drawing) {
                        var arr_graphic_objects = this.State.group.getArrGraphicObjects();
                        for (var s = arr_graphic_objects.length - 1; s > -1; --s) {
                            if (this.State.id === STATES_ID_CHART_GROUP_TEXT_ADD || this.State.id === STATES_ID_CHART_GROUP) {
                                if (arr_graphic_objects[s] === this.State.chart) {
                                    var selected_title;
                                    var titles = [];
                                    titles.push(this.State.chart.chartTitle);
                                    titles.push(this.State.chart.hAxisTitle);
                                    titles.push(this.State.chart.vAxisTitle);
                                    for (var j = 0; j < titles.length; ++j) {
                                        if (titles[j] && titles[j].selected) {
                                            selected_title = titles[j];
                                            break;
                                        }
                                    }
                                    if (selected_title) {
                                        if (selected_title.hitInTextRect(x, y)) {
                                            drawingDocument.SetCursorType("text");
                                            return;
                                        }
                                    }
                                }
                            }
                            var cur_grouped_object = arr_graphic_objects[s];
                            var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                            var hit_in_path = cur_grouped_object.hitInPath(x, y);
                            var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                            if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                                drawingDocument.SetCursorType("move");
                                return;
                            } else {
                                if (hit_in_text_rect) {
                                    drawingDocument.SetCursorType("text");
                                    return;
                                }
                            }
                        }
                    } else {
                        var grouped_objects = cur_drawing.getArrGraphicObjects();
                        for (var j = grouped_objects.length - 1; j > -1; --j) {
                            var cur_grouped_object = grouped_objects[j];
                            var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                            var hit_in_path = cur_grouped_object.hitInPath(x, y);
                            var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                            if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                                drawingDocument.SetCursorType("move");
                                return;
                            } else {
                                if (hit_in_text_rect) {
                                    drawingDocument.SetCursorType("text");
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            drawingDocument.SetCursorType("default");
            break;
        case STATES_ID_MOVE:
            case STATES_ID_MOVE_COMMENT:
            case STATES_ID_MOVE_IN_GROUP:
            case STATES_ID_MOVE_INTERNAL_CHART_OBJECT:
            drawingDocument.SetCursorType("move");
            break;
        case STATES_ID_ROTATE:
            case STATES_ID_ROTATE_IN_GROUP:
            drawingDocument.SetCursorType("crosshair");
            break;
        case STATES_ID_RESIZE:
            case STATES_ID_RESIZE_IN_GROUP:
            drawingDocument.SetCursorType(CURSOR_TYPES_BY_CARD_DIRECTION[this.State.cardDirection]);
            break;
        default:
            var b_chart_state = this.State.id === STATES_ID_CHART || this.State.id === STATES_ID_CHART_TEXT_ADD;
            var selected_objects = this.selectedObjects;
            if (selected_objects.length === 1) {
                var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
                if (hit_to_adj.hit) {
                    if (selected_objects[0].canChangeAdjustments()) {
                        drawingDocument.SetCursorType("crosshair");
                        selected_objects[0].sendMouseData();
                    }
                    return;
                }
            }
            for (var i = selected_objects.length - 1; i > -1; --i) {
                var hit_to_handles = selected_objects[i].hitToHandles(x, y);
                if (hit_to_handles > -1) {
                    if (hit_to_handles === 8) {
                        if (!selected_objects[i].canRotate()) {
                            return;
                        }
                        selected_objects[0].sendMouseData();
                        drawingDocument.SetCursorType("crosshair");
                    } else {
                        if (!selected_objects[i].canResize()) {
                            return;
                        }
                        var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                        drawingDocument.SetCursorType(CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]);
                        selected_objects[i].sendMouseData();
                    }
                    return;
                }
            }
            for (i = selected_objects.length - 1; i > -1; --i) {
                if (selected_objects[i].hitInBoundingRect(x, y)) {
                    if (!selected_objects[i].canMove()) {
                        return;
                    }
                    drawingDocument.SetCursorType("move");
                    selected_objects[i].sendMouseData();
                    return;
                }
            }
            var arr_drawing_objects = this.slide.getDrawingObjects();
            for (i = arr_drawing_objects.length - 1; i > -1; --i) {
                var cur_drawing_base = arr_drawing_objects[i];
                var cur_drawing = cur_drawing_base;
                if (cur_drawing.isShape() || cur_drawing.isImage()) {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                        drawingDocument.SetCursorType("move");
                        cur_drawing.sendMouseData();
                        return;
                    } else {
                        if (hit_in_text_rect) {
                            cur_drawing.updateCursorType(x, y, e);
                            cur_drawing.sendMouseData();
                            return;
                        }
                    }
                } else {
                    if (cur_drawing.isGroup()) {
                        var grouped_objects = cur_drawing.getArrGraphicObjects();
                        for (var j = grouped_objects.length - 1; j > -1; --j) {
                            var cur_grouped_object = grouped_objects[j];
                            var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                            var hit_in_path = cur_grouped_object.hitInPath(x, y);
                            var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                            if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                                cur_drawing.sendMouseData();
                                drawingDocument.SetCursorType("move");
                                return;
                            } else {
                                if (hit_in_text_rect) {
                                    cur_drawing.sendMouseData();
                                    if (grouped_objects[j].txBody) {
                                        grouped_objects[j].txBody.updateCursorType(x, y, e);
                                    } else {
                                        grouped_objects[j].updateCursorType(x, y, e);
                                    }
                                    return;
                                }
                            }
                        }
                    } else {
                        if (cur_drawing.isChart()) {
                            if (cur_drawing.hitInWorkArea(x, y)) {
                                if (b_chart_state && cur_drawing === this.State.chart) {
                                    var titles = [];
                                    titles.push(this.State.chart.chartTitle);
                                    titles.push(this.State.chart.hAxisTitle);
                                    titles.push(this.State.chart.vAxisTitle);
                                    for (var j = 0; j < titles.length; ++j) {
                                        var title = titles[j];
                                        if (isRealObject(title)) {
                                            if (!title.selected) {
                                                if (title.hit(x, y)) {
                                                    cur_drawing.sendMouseData();
                                                    drawingDocument.SetCursorType("move");
                                                    return;
                                                }
                                            } else {
                                                if (title.hit(x, y)) {
                                                    if (title.hitInTextRect(x, y)) {
                                                        cur_drawing.sendMouseData();
                                                        drawingDocument.SetCursorType("text");
                                                    } else {
                                                        cur_drawing.sendMouseData();
                                                        drawingDocument.SetCursorType("move");
                                                    }
                                                    return;
                                                }
                                            }
                                        }
                                    }
                                    if (cur_drawing.hitInWorkArea(x, y)) {
                                        cur_drawing.sendMouseData();
                                        drawingDocument.SetCursorType("move");
                                        return;
                                    }
                                }
                                drawingDocument.SetCursorType("move");
                                cur_drawing.sendMouseData();
                                return;
                            }
                        } else {
                            if (cur_drawing.isTable && cur_drawing.isTable()) {
                                var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                                var hit_in_bounding_rect = cur_drawing.hitInBoundingRect(x, y);
                                if (hit_in_bounding_rect || hit_in_inner_area) {
                                    if (hit_in_bounding_rect) {
                                        cur_drawing.sendMouseData();
                                        drawingDocument.SetCursorType("move");
                                        return;
                                    } else {
                                        cur_drawing.updateCursorType(x, y, e);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            drawingDocument.SetCursorType("default");
            break;
        }
    },
    setParagraphAlign: function (val) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                this.State.textObject.setParagraphAlign(val);
            }
            break;
        case STATES_ID_NULL:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false) {
                for (var i = 0; i < this.selectedObjects.length; ++i) {
                    if (typeof this.selectedObjects[i].applyAllAlign === "function") {
                        this.selectedObjects[i].applyAllAlign(val);
                    }
                }
            }
            break;
        }
    },
    setParagraphTabs: function (val) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                this.State.textObject.setParagraphTabs(val);
            }
            break;
        case STATES_ID_NULL:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false) {
                for (var i = 0; i < this.selectedObjects.length; ++i) {
                    if (typeof this.selectedObjects[i].applyAllSpacing === "function") {
                        this.selectedObjects[i].applyAllSpacing(val);
                    }
                }
            }
            break;
        }
    },
    setParagraphSpacing: function (val) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                this.State.textObject.setParagraphSpacing(val);
            }
            break;
        case STATES_ID_NULL:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false) {
                for (var i = 0; i < this.selectedObjects.length; ++i) {
                    if (typeof this.selectedObjects[i].applyAllSpacing === "function") {
                        this.selectedObjects[i].applyAllSpacing(val);
                    }
                }
            }
            break;
        }
    },
    setParagraphIndent: function (val) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                this.State.textObject.setParagraphIndent(val);
            }
            break;
        case STATES_ID_NULL:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false) {
                for (var i = 0; i < this.selectedObjects.length; ++i) {
                    if (typeof this.selectedObjects[i].applyAllIndent === "function") {
                        this.selectedObjects[i].applyAllIndent(val);
                    }
                }
            }
            break;
        }
    },
    setParagraphNumbering: function (val) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                this.State.textObject.setParagraphNumbering(val);
            }
            break;
        case STATES_ID_NULL:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false) {
                for (var i = 0; i < this.selectedObjects.length; ++i) {
                    if (typeof this.selectedObjects[i].applyAllNumbering === "function") {
                        this.selectedObjects[i].applyAllNumbering(val);
                    }
                }
            }
            break;
        }
    },
    Paragraph_IncDecFontSize: function (val) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                this.State.textObject.Paragraph_IncDecFontSize(val);
            }
            break;
        case STATES_ID_NULL:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Text_Props) === false) {
                for (var i = 0; i < this.selectedObjects.length; ++i) {
                    if (typeof this.selectedObjects[i].Paragraph_IncDecFontSizeAll === "function") {
                        this.selectedObjects[i].Paragraph_IncDecFontSizeAll(val);
                    }
                }
            }
            break;
        }
    },
    Set_ImageProps: function (Props) {},
    getSelectedArraysByTypes: function () {
        var selected_objects = this.selectedObjects;
        var tables = [],
        charts = [],
        shapes = [],
        images = [],
        groups = [];
        for (var i = 0; i < selected_objects.length; ++i) {
            var selected_object = selected_objects[i];
            if (typeof selected_object.isTable === "function" && selected_object.isTable()) {
                tables.push(selected_object);
            } else {
                if (typeof selected_object.isChart === "function" && selected_object.isChart()) {
                    charts.push(selected_object);
                } else {
                    if (selected_object.isShape()) {
                        shapes.push(selected_object);
                    } else {
                        if (selected_object.isImage()) {
                            images.push(selected_object);
                        } else {
                            if (typeof selected_object.isGroup === "function" && selected_object.isGroup()) {
                                groups.push(selected_object);
                            }
                        }
                    }
                }
            }
        }
        return {
            tables: tables,
            charts: charts,
            shapes: shapes,
            images: images,
            groups: groups
        };
    },
    setTableProps: function (props) {
        if (this.selectedObjects.length === 1 && this.selectedObjects[0].isTable && this.selectedObjects[0].isTable()) {
            this.selectedObjects[0].Set_Props(props);
        }
    },
    Document_UpdateInterfaceState: function () {
        var text_props = null,
        para_props = null,
        shape_props = null,
        image_props = null,
        chart_props = null,
        table_props = null;
        var selected_objects = this.selectedObjects;
        var by_types = this.getSelectedArraysByTypes();
        switch (this.State.id) {
        case null:
            break;
        default:
            if (this.State.group instanceof CGroupShape) {
                by_types = this.State.group.getSelectedArraysByTypes();
            }
            var images = by_types.images;
            for (var i = 0; i < images.length; ++i) {
                var _cur_image_prop = images[i].getImageProps();
                if (_cur_image_prop !== null) {
                    if (image_props === null) {
                        image_props = _cur_image_prop;
                    } else {
                        image_props = CompareImageProperties(image_props, _cur_image_prop);
                    }
                }
            }
            var shapes = by_types.shapes;
            for (var i = 0; i < shapes.length; ++i) {
                var _current_object = shapes[i];
                var _cur_shape_prop = {
                    type: _current_object.getPresetGeom(),
                    fill: _current_object.getFill(),
                    stroke: _current_object.getStroke(),
                    canChangeArrows: _current_object.canChangeArrows(),
                    IsLocked: !(_current_object.Lock.Type === locktype_None || _current_object.Lock.Type === locktype_Mine),
                    verticalTextAlign: _current_object.txBody ? _current_object.txBody.getCompiledBodyPr().anchor : undefined,
                    paddings: _current_object.getPaddings(),
                    w: _current_object.extX,
                    h: _current_object.extY,
                    canFill: !_current_object.spPr.geometry || _current_object.spPr.geometry.canFill()
                };
                if (shape_props === null) {
                    shape_props = _cur_shape_prop;
                } else {
                    shape_props = CompareShapeProperties(shape_props, _cur_shape_prop);
                    shape_props.verticalTextAlign = undefined;
                }
                var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                if (_current_object.Lock.Is_Locked() && _cur_paragraph_para_pr) {
                    _cur_paragraph_para_pr.Locked = true;
                }
                if (_cur_paragraph_para_pr != null) {
                    if (para_props === null) {
                        para_props = _cur_paragraph_para_pr;
                    } else {
                        para_props = para_props.Compare(_cur_paragraph_para_pr);
                    }
                }
                var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                if (_cur_paragraph_text_pr != null) {
                    if (text_props === null) {
                        text_props = _cur_paragraph_text_pr;
                    } else {
                        text_props = text_props.Compare(_cur_paragraph_text_pr);
                    }
                }
            }
            var groups = by_types.groups;
            for (var i = 0; i < groups.length; ++i) {
                var cur_group = groups[i];
                var arr_by_types = cur_group.getArraysByTypes();
                var images = arr_by_types.images;
                for (var j = 0; j < images.length; ++j) {
                    var _cur_image_prop = images[j].getImageProps();
                    if (_cur_image_prop !== null) {
                        if (image_props === null) {
                            image_props = _cur_image_prop;
                        } else {
                            image_props = CompareImageProperties(image_props, _cur_image_prop);
                        }
                    }
                }
                var shapes = arr_by_types.shapes;
                for (var j = 0; j < shapes.length; ++j) {
                    var _current_object = shapes[j];
                    var _cur_shape_prop = {
                        type: _current_object.getPresetGeom(),
                        fill: _current_object.getFill(),
                        stroke: _current_object.getStroke(),
                        canChangeArrows: _current_object.canChangeArrows(),
                        IsLocked: cur_group.Lock.Is_Locked(),
                        verticalTextAlign: _current_object.txBody ? _current_object.txBody.getCompiledBodyPr().anchor : undefined,
                        paddings: _current_object.getPaddings(),
                        w: _current_object.extX,
                        h: _current_object.extY,
                        canFill: !_current_object.spPr.geometry || _current_object.spPr.geometry.canFill()
                    };
                    if (shape_props === null) {
                        shape_props = _cur_shape_prop;
                    } else {
                        shape_props = CompareShapeProperties(shape_props, _cur_shape_prop);
                        shape_props.verticalTextAlign = undefined;
                    }
                    var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                    if (_cur_paragraph_para_pr != null) {
                        if (para_props === null) {
                            para_props = _cur_paragraph_para_pr;
                        } else {
                            para_props = para_props.Compare(_cur_paragraph_para_pr);
                        }
                    }
                    var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                    if (_cur_paragraph_text_pr != null) {
                        if (text_props === null) {
                            text_props = _cur_paragraph_text_pr;
                        } else {
                            text_props = text_props.Compare(_cur_paragraph_text_pr);
                        }
                    }
                }
                var charts = arr_by_types.charts;
                for (var j = 0; j < charts.length; ++j) {
                    if (!isRealObject(chart_props)) {
                        chart_props = {
                            fromGroup: true
                        };
                        chart_props.ChartProperties = charts[j].chart;
                        chart_props.Width = charts[j].extX;
                        chart_props.Height = charts[j].extY;
                    } else {
                        chart_props.chart = null;
                        chart_props.severalCharts = true;
                        if (chart_props.severalChartTypes !== true) {
                            if (! (chart_props.ChartProperties.type === charts[j].chart.type && chart_props.ChartProperties.subType === charts[j].chart.subType)) {
                                chart_props.severalChartTypes = true;
                            }
                        }
                        if (chart_props.severalChartStyles !== true) {
                            if (chart_props.ChartProperties.styleId !== charts[j].chart.styleId) {
                                chart_props.severalChartStyles = true;
                            }
                        }
                        if (chart_props.Width !== charts[j].extX || chart_props.Height !== charts[j].extY) {
                            chart_props.Width = null;
                            chart_props.Height = null;
                        }
                    }
                }
                if (image_props) {
                    if (cur_group.Lock.Is_Locked()) {
                        image_props.IsLocked = true;
                    }
                }
                if (shape_props) {
                    if (cur_group.Lock.Is_Locked()) {
                        shape_props.IsLocked = true;
                    }
                }
                if (para_props) {
                    if (cur_group.Lock.Is_Locked()) {
                        para_props.Locked = true;
                    }
                }
                if (chart_props) {
                    if (cur_group.Lock.Is_Locked()) {
                        cur_group.Locked = true;
                    }
                }
            }
            var tables = by_types.tables;
            if (tables.length === 1) {
                editor.sync_TblPropCallback(tables[0].graphicObject.Get_Props());
                this.slide.presentation.DrawingDocument.CheckTableStyles(tables[0].graphicObject.Get_TableLook(), tables[0]);
            }
            for (var i = 0; i < tables.length; ++i) {
                var _cur_paragraph_para_pr = tables[i].getParagraphParaPr();
                if (_cur_paragraph_para_pr != null) {
                    if (para_props === null) {
                        para_props = _cur_paragraph_para_pr;
                    } else {
                        para_props = para_props.Compare(_cur_paragraph_para_pr);
                    }
                }
                var _cur_paragraph_text_pr = tables[0].getParagraphTextPr();
                if (_cur_paragraph_text_pr != null) {
                    if (text_props === null) {
                        text_props = _cur_paragraph_text_pr;
                    } else {
                        text_props = text_props.Compare(_cur_paragraph_text_pr);
                    }
                }
            }
            var charts = by_types.charts;
            for (var i = 0; i < charts.length; ++i) {
                if (!isRealObject(chart_props)) {
                    chart_props = {
                        fromGroup: this.State.id === STATES_ID_GROUP || this.State.id === STATES_ID_TEXT_ADD_IN_GROUP
                    };
                    chart_props.ChartProperties = charts[i].chart;
                    chart_props.Width = charts[i].extX;
                    chart_props.Height = charts[i].extY;
                } else {
                    chart_props.chart = null;
                    chart_props.severalCharts = true;
                    if (chart_props.severalChartTypes !== true) {
                        if (! (chart_props.ChartProperties.type === charts[i].chart.type && chart_props.ChartProperties.subType === charts[i].chart.subType)) {
                            chart_props.severalChartTypes = true;
                        }
                    }
                    if (chart_props.severalChartStyles !== true) {
                        if (chart_props.ChartProperties.styleId !== charts[i].chart.styleId) {
                            chart_props.severalChartStyles = true;
                        }
                    }
                    if (chart_props.Width !== charts[i].extX || chart_props.Height !== charts[i].extY) {
                        chart_props.Width = null;
                        chart_props.Height = null;
                    }
                }
            }
            break;
        }
        editor.sync_slidePropCallback(this.slide);
        if (this.State.id === STATES_ID_TEXT_ADD || this.State.id === STATES_ID_TEXT_ADD_IN_GROUP || this.State.id === STATES_ID_CHART_TEXT_ADD || this.State.id === STATES_ID_CHART_GROUP_TEXT_ADD) {
            if (image_props !== null) {
                editor.sync_ImgPropCallback(image_props);
            }
            if (shape_props !== null) {
                editor.sync_shapePropCallback(shape_props);
            }
            if (chart_props) {
                editor.sync_ImgPropCallback(chart_props);
            }
            this.State.textObject.updateInterfaceTextState();
        } else {
            if (para_props != null) {
                editor.UpdateParagraphProp(para_props);
                editor.sync_PrLineSpacingCallBack(para_props.Spacing);
                if (selected_objects.length === 1) {
                    if ("undefined" != typeof(para_props.Tabs) && null != para_props.Tabs) {
                        editor.Update_ParaTab(Default_Tab_Stop, para_props.Tabs);
                    }
                }
            } else {
                var _empty_para_pr = {
                    Ind: {
                        Left: UnknownValue,
                        Right: UnknownValue,
                        FirstLine: UnknownValue
                    },
                    Jc: UnknownValue,
                    Spacing: {
                        Line: UnknownValue,
                        LineRule: UnknownValue,
                        Before: UnknownValue,
                        After: UnknownValue,
                        AfterAutoSpacing: UnknownValue,
                        BeforeAutoSpacing: UnknownValue
                    },
                    PageBreakBefore: UnknownValue,
                    KeepLines: UnknownValue,
                    ContextualSpacing: UnknownValue,
                    Shd: UnknownValue,
                    StyleId: -1,
                    NumPr: null,
                    Brd: {
                        Between: null,
                        Bottom: null,
                        Left: null,
                        Right: null
                    },
                    ListType: {
                        Type: -1,
                        SubType: -1
                    }
                };
                editor.sync_ParaSpacingLine(_empty_para_pr.Spacing);
                editor.Update_ParaInd(_empty_para_pr.Ind);
                editor.sync_PrAlignCallBack(_empty_para_pr.Jc);
                editor.sync_ParaStyleName(_empty_para_pr.StyleName);
                editor.sync_ListType(_empty_para_pr.ListType);
            }
            if (text_props != null) {
                if (text_props.Bold === undefined) {
                    text_props.Bold = false;
                }
                if (text_props.Italic === undefined) {
                    text_props.Italic = false;
                }
                if (text_props.Underline === undefined) {
                    text_props.Underline = false;
                }
                if (text_props.Strikeout === undefined) {
                    text_props.Strikeout = false;
                }
                if (text_props.FontFamily === undefined) {
                    text_props.FontFamily = {
                        Index: 0,
                        Name: ""
                    };
                }
                if (text_props.FontSize === undefined) {
                    text_props.FontSize = "";
                }
                editor.UpdateTextPr(text_props);
            } else {
                var _empty_text_pr = {
                    Bold: false,
                    Italic: false,
                    Underline: false,
                    Strikeout: false,
                    FontSize: "",
                    FontFamily: {
                        Index: 0,
                        Name: ""
                    },
                    VertAlign: vertalign_Baseline,
                    Color: {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    HighLight: highlight_None
                };
                editor.UpdateTextPr(_empty_text_pr);
            }
            if (image_props !== null) {
                editor.sync_ImgPropCallback(image_props);
            }
            if (shape_props !== null) {
                editor.sync_shapePropCallback(shape_props);
            }
            if (chart_props) {
                editor.sync_ImgPropCallback(chart_props);
            }
        }
        editor.sync_VerticalTextAlign(this.getVerticalAlign());
    },
    Get_Paragraph_ParaPr: function () {
        var text_props = null,
        para_props = null,
        shape_props = null,
        image_props = null,
        chart_props = null,
        table_props = null;
        var selected_objects = this.selectedObjects;
        var by_types = this.getSelectedArraysByTypes();
        switch (this.State.id) {
        case STATES_ID_NULL:
            var shapes = by_types.shapes;
            for (var i = 0; i < shapes.length; ++i) {
                var _current_object = shapes[i];
                var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                if (_current_object.Lock.Is_Locked() && _cur_paragraph_para_pr) {
                    _cur_paragraph_para_pr.Locked = true;
                }
                if (_cur_paragraph_para_pr != null) {
                    if (para_props === null) {
                        para_props = _cur_paragraph_para_pr;
                    } else {
                        para_props = para_props.Compare(_cur_paragraph_para_pr);
                    }
                }
                var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                if (_cur_paragraph_text_pr != null) {
                    if (text_props === null) {
                        text_props = _cur_paragraph_text_pr;
                    } else {
                        text_props = text_props.Compare(_cur_paragraph_text_pr);
                    }
                }
            }
            var groups = by_types.groups;
            for (var i = 0; i < groups.length; ++i) {
                var cur_group = groups[i];
                var arr_by_types = cur_group.getArraysByTypes();
                var shapes = arr_by_types.shapes;
                for (var j = 0; j < shapes.length; ++j) {
                    var _current_object = shapes[j];
                    var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                    if (_cur_paragraph_para_pr != null) {
                        if (para_props === null) {
                            para_props = _cur_paragraph_para_pr;
                        } else {
                            para_props = para_props.Compare(_cur_paragraph_para_pr);
                        }
                    }
                    var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                    if (_cur_paragraph_text_pr != null) {
                        if (text_props === null) {
                            text_props = _cur_paragraph_text_pr;
                        } else {
                            text_props = text_props.Compare(_cur_paragraph_text_pr);
                        }
                    }
                }
                if (para_props) {
                    if (cur_group.Lock.Is_Locked()) {
                        para_props.Locked = true;
                    }
                }
            }
            var tables = by_types.tables;
            if (tables.length === 1) {
                this.slide.presentation.DrawingDocument.CheckTableStyles(tables[0].graphicObject.Get_TableLook(), tables[0]);
                var _cur_paragraph_para_pr = tables[0].getParagraphParaPr();
                if (_cur_paragraph_para_pr != null) {
                    if (para_props === null) {
                        para_props = _cur_paragraph_para_pr;
                    } else {
                        para_props = para_props.Compare(_cur_paragraph_para_pr);
                    }
                }
                var _cur_paragraph_text_pr = tables[0].getParagraphTextPr();
                if (_cur_paragraph_text_pr != null) {
                    if (text_props === null) {
                        text_props = _cur_paragraph_text_pr;
                    } else {
                        text_props = text_props.Compare(_cur_paragraph_text_pr);
                    }
                }
            }
            break;
        case STATES_ID_TEXT_ADD:
            return this.State.textObject.getParaPr();
            break;
        }
        return para_props ? para_props : new CParaPr();
    },
    Get_Paragraph_TextPr: function () {
        var text_props = null,
        para_props = null,
        shape_props = null,
        image_props = null,
        chart_props = null,
        table_props = null;
        var selected_objects = this.selectedObjects;
        var by_types = this.getSelectedArraysByTypes();
        switch (this.State.id) {
        case STATES_ID_NULL:
            var shapes = by_types.shapes;
            for (var i = 0; i < shapes.length; ++i) {
                var _current_object = shapes[i];
                var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                if (_current_object.Lock.Is_Locked() && _cur_paragraph_para_pr) {
                    _cur_paragraph_para_pr.Locked = true;
                }
                if (_cur_paragraph_para_pr != null) {
                    if (para_props === null) {
                        para_props = _cur_paragraph_para_pr;
                    } else {
                        para_props = para_props.Compare(_cur_paragraph_para_pr);
                    }
                }
                var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                if (_cur_paragraph_text_pr != null) {
                    if (text_props === null) {
                        text_props = _cur_paragraph_text_pr;
                    } else {
                        text_props = text_props.Compare(_cur_paragraph_text_pr);
                    }
                }
            }
            var groups = by_types.groups;
            for (var i = 0; i < groups.length; ++i) {
                var cur_group = groups[i];
                var arr_by_types = cur_group.getArraysByTypes();
                var shapes = arr_by_types.shapes;
                for (var j = 0; j < shapes.length; ++j) {
                    var _current_object = shapes[j];
                    var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                    if (_cur_paragraph_para_pr != null) {
                        if (para_props === null) {
                            para_props = _cur_paragraph_para_pr;
                        } else {
                            para_props = para_props.Compare(_cur_paragraph_para_pr);
                        }
                    }
                    var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                    if (_cur_paragraph_text_pr != null) {
                        if (text_props === null) {
                            text_props = _cur_paragraph_text_pr;
                        } else {
                            text_props = text_props.Compare(_cur_paragraph_text_pr);
                        }
                    }
                }
                if (para_props) {
                    if (cur_group.Lock.Is_Locked()) {
                        para_props.Locked = true;
                    }
                }
            }
            var tables = by_types.tables;
            if (tables.length === 1) {
                this.slide.presentation.DrawingDocument.CheckTableStyles(tables[0].graphicObject.Get_TableLook(), tables[0]);
                var _cur_paragraph_para_pr = tables[0].getParagraphParaPr();
                if (_cur_paragraph_para_pr != null) {
                    if (para_props === null) {
                        para_props = _cur_paragraph_para_pr;
                    } else {
                        para_props = para_props.Compare(_cur_paragraph_para_pr);
                    }
                }
                var _cur_paragraph_text_pr = tables[0].getParagraphTextPr();
                if (_cur_paragraph_text_pr != null) {
                    if (text_props === null) {
                        text_props = _cur_paragraph_text_pr;
                    } else {
                        text_props = text_props.Compare(_cur_paragraph_text_pr);
                    }
                }
            }
            break;
        case STATES_ID_TEXT_ADD:
            return this.State.textObject.getTextPr();
            break;
        }
        return text_props ? text_props : new CParaPr();
    },
    getPropsArrays: function () {
        var text_props = null,
        para_props = null,
        shape_props = null,
        image_props = null,
        chart_props = null,
        table_props = null;
        var selected_objects = this.selectedObjects;
        var by_types = this.getSelectedArraysByTypes();
        switch (this.State.id) {
        case STATES_ID_NULL:
            var images = by_types.images;
            for (var i = 0; i < images.length; ++i) {
                var _cur_image_prop = images[i].getImageProps();
                if (_cur_image_prop !== null) {
                    if (image_props === null) {
                        image_props = _cur_image_prop;
                    } else {
                        image_props = CompareImageProperties(image_props, _cur_image_prop);
                    }
                }
            }
            var shapes = by_types.shapes;
            for (var i = 0; i < shapes.length; ++i) {
                var _current_object = shapes[i];
                var _cur_shape_prop = {
                    type: _current_object.getPresetGeom(),
                    fill: _current_object.getFill(),
                    stroke: _current_object.getStroke(),
                    canChangeArrows: _current_object.canChangeArrows()
                };
                if (shape_props === null) {
                    shape_props = _cur_shape_prop;
                } else {
                    shape_props = CompareShapeProperties(shape_props, _cur_shape_prop);
                }
                var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                if (_cur_paragraph_para_pr != null) {
                    if (para_props === null) {
                        para_props = _cur_paragraph_para_pr;
                    } else {
                        para_props = para_props.Compare(_cur_paragraph_para_pr);
                    }
                }
                var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                if (_cur_paragraph_text_pr != null) {
                    if (text_props === null) {
                        text_props = _cur_paragraph_text_pr;
                    } else {
                        text_props = text_props.Compare(_cur_paragraph_text_pr);
                    }
                }
            }
            var groups = by_types.groups;
            for (var i = 0; i < groups.length; ++i) {
                var cur_group = groups[i];
                var arr_by_types = cur_group.getArraysByTypes();
                var images = cur_group.images;
                for (var i = 0; i < images.length; ++i) {
                    var _cur_image_prop = images[i].getImageProps();
                    if (_cur_image_prop !== null) {
                        if (image_props === null) {
                            image_props = _cur_image_prop;
                        } else {
                            image_props = CompareImageProperties(image_props, _cur_image_prop);
                        }
                    }
                }
                var shapes = cur_group.shapes;
                for (var i = 0; i < shapes.length; ++i) {
                    var _current_object = shapes[i];
                    var _cur_shape_prop = {
                        type: _current_object.getPresetGeom(),
                        fill: _current_object.getFill(),
                        stroke: _current_object.getStroke(),
                        canChangeArrows: _current_object.canChangeArrows()
                    };
                    if (shape_props === null) {
                        shape_props = _cur_shape_prop;
                    } else {
                        shape_props = CompareShapeProperties(shape_props, _cur_shape_prop);
                    }
                    var _cur_paragraph_para_pr = _current_object.getParagraphParaPr();
                    if (_cur_paragraph_para_pr != null) {
                        if (para_props === null) {
                            para_props = _cur_paragraph_para_pr;
                        } else {
                            para_props = para_props.Compare(_cur_paragraph_para_pr);
                        }
                    }
                    var _cur_paragraph_text_pr = _current_object.getParagraphTextPr();
                    if (_cur_paragraph_text_pr != null) {
                        if (text_props === null) {
                            text_props = _cur_paragraph_text_pr;
                        } else {
                            text_props = text_props.Compare(_cur_paragraph_text_pr);
                        }
                    }
                }
            }
            break;
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.updateInterfaceTextState();
            break;
        }
        if (text_props != null) {
            if (text_props.Bold === undefined) {
                text_props.Bold = false;
            }
            if (text_props.Italic === undefined) {
                text_props.Italic = false;
            }
            if (text_props.Underline === undefined) {
                text_props.Underline = false;
            }
            if (text_props.Strikeout === undefined) {
                text_props.Strikeout = false;
            }
            if (text_props.FontFamily === undefined) {
                text_props.FontFamily = {
                    Index: 0,
                    Name: ""
                };
            }
            if (text_props.FontSize === undefined) {
                text_props.FontSize = "";
            }
            editor.UpdateTextPr(text_props);
        } else {}
        return {
            textPr: text_props,
            paraPr: para_props,
            shapePr: shape_props,
            imagePr: image_props,
            chartPr: chart_props,
            tablePr: table_props
        };
    },
    getVerticalAlign: function () {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (this.State.textObject && this.State.textObject && this.State.textObject instanceof CShape) {
                if (this.State.textObject.txBody && this.State.textObject.txBody.compiledBodyPr && typeof(this.State.textObject.txBody.compiledBodyPr.anchor) == "number") {
                    return this.State.textObject.txBody.compiledBodyPr.anchor;
                }
            }
            return null;
        default:
            var _result_align = null;
            var _cur_align;
            var _shapes = this.State.group ? this.State.group.selectedObjects : this.selectedObjects;
            var _shape_index;
            var _shape;
            for (_shape_index = 0; _shape_index < _shapes.length; ++_shape_index) {
                _shape = _shapes[_shape_index];
                if (_shape.selected) {
                    if (_shape instanceof CShape) {
                        if (_shape.txBody && _shape.txBody.compiledBodyPr && typeof(_shape.txBody.compiledBodyPr.anchor) == "number") {
                            _cur_align = _shape.txBody.compiledBodyPr.anchor;
                            if (_result_align === null) {
                                _result_align = _cur_align;
                            } else {
                                if (_result_align !== _cur_align) {
                                    return null;
                                }
                            }
                        } else {
                            return null;
                        }
                    }
                    if (_shape instanceof CGroupShape) {
                        _cur_align = _shape.calculateCompiledVerticalAlign();
                        if (_cur_align === null) {
                            return null;
                        }
                        if (_result_align === null) {
                            _result_align = _cur_align;
                        } else {
                            if (_result_align !== _cur_align) {
                                return null;
                            }
                        }
                    }
                }
            }
            return _result_align;
        }
        return null;
    },
    setVerticalAlign: function (align) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (this.State.textObject && this.State.textObject) {
                this.State.textObject.setVerticalAlign(align);
            }
            return null;
        case STATES_ID_NULL:
            var _result_align = null;
            var _shapes = this.selectedObjects;
            var _shape_index;
            var _shape;
            for (_shape_index = 0; _shape_index < _shapes.length; ++_shape_index) {
                _shape = _shapes[_shape_index];
                if (_shape.selected) {
                    if (typeof _shape.setVerticalAlign === "function") {
                        _shape.setVerticalAlign(align);
                    }
                }
            }
            return _result_align;
        }
    },
    getChartObject: function () {
        if (! (this.State.group instanceof CGroupShape)) {
            var by_types = this.getSelectedArraysByTypes();
            if (by_types.charts.length === 1) {
                if (by_types.groups.length === 0) {
                    return by_types.charts[0];
                }
                if (by_types.groups.length > 0) {
                    for (var i = 0; i < by_types.groups.length; ++i) {
                        var group_by_types = by_types.groups[i].getArraysByTypes();
                        if (group_by_types.charts.length > 0) {
                            break;
                        }
                    }
                    if (i === by_types.groups.length) {
                        return by_types.charts[0];
                    }
                }
            } else {
                if (by_types.charts.length === 0 && by_types.groups.length > 0) {
                    var chart_for_ret;
                    for (var i = 0; i < by_types.groups.length; ++i) {
                        var group_by_types = by_types.groups[i].getArraysByTypes();
                        if (group_by_types.charts.length === 1) {
                            if (!chart_for_ret) {
                                chart_for_ret = group_by_types.charts[0];
                            } else {
                                break;
                            }
                        } else {
                            if (group_by_types.charts.length > 1) {
                                break;
                            }
                        }
                    }
                    if (chart_for_ret) {
                        return chart_for_ret;
                    }
                }
            }
        } else {
            var by_types = this.State.group.getSelectedArraysByTypes();
            if (by_types.charts.length === 1) {
                return by_types.charts[0];
            }
        }
        History.TurnOff();
        var ret = new CChartAsGroup();
        ret.setAscChart(new asc_CChart());
        var options = {};
        options.slide = this.slide;
        options.layout = this.slide.Layout;
        options.master = this.slide.Layout.Master;
        options.theme = this.slide.Layout.Master.Theme;
        editor.chartStyleManager.init(options);
        var presentation = editor.WordControl.m_oLogicDocument;
        var chart_width = 0.264583 * c_oAscChartDefines.defaultChartWidth;
        var chart_height = 0.264583 * c_oAscChartDefines.defaultChartHeight;
        ret.chart.initDefault();
        ret.setChart(ret.chart);
        ret.spPr.xfrm.offX = (presentation.Width - chart_width) / 2;
        ret.spPr.xfrm.offY = (presentation.Height - chart_height) / 2;
        ret.spPr.xfrm.extX = chart_width;
        ret.spPr.xfrm.extY = chart_height;
        History.TurnOn();
        return ret;
    },
    redrawCharts: function () {
        if (! (typeof CChartAsGroup != "undefined")) {
            return;
        }
        var sp_tree = this.slide.cSld.spTree;
        for (var i = 0; i < sp_tree.length; ++i) {
            var sp = sp_tree[i];
            if (typeof(CChartAsGroup) != "undefined" && sp instanceof CChartAsGroup) {
                sp.recalculate();
            }
            if (sp instanceof CGroupShape) {
                var arr_g_o = sp.arrGraphicObjects;
                for (var j = 0; j < arr_g_o.length; ++j) {
                    var cur_group_sp = arr_g_o[j];
                    if (typeof(CChartAsGroup) != "undefined" && cur_group_sp instanceof CChartAsGroup) {
                        cur_group_sp.recalculate();
                    }
                }
            }
        }
    },
    Hyperlink_CanAdd: function (bCheck) {
        if (this.State.textObject && this.State.textObject.Hyperlink_CanAdd) {
            return this.State.textObject.Hyperlink_CanAdd(bCheck);
        }
        return false;
    },
    Hyperlink_Check: function (bCheck) {
        if (this.State.textObject && this.State.textObject.Hyperlink_Check) {
            return this.State.textObject.Hyperlink_Check(bCheck);
        }
        return bCheck === false ? null : false;
    },
    Hyperlink_Add: function (HyperProps) {
        if (this.State.textObject && this.State.textObject.Hyperlink_Add) {
            this.State.textObject.Hyperlink_Add(HyperProps);
        }
    },
    Hyperlink_Modify: function (HyperProps) {
        if (this.State.textObject && this.State.textObject.Hyperlink_Modify) {
            this.State.textObject.Hyperlink_Modify(HyperProps);
        }
    },
    Hyperlink_Remove: function () {
        if (this.State.textObject && this.State.textObject.Hyperlink_Remove) {
            this.State.textObject.Hyperlink_Remove();
        }
    },
    Get_SelectedText: function (bClearText) {
        if (this.State.textObject && this.State.textObject.Get_SelectedText) {
            return this.State.textObject.Get_SelectedText(bClearText);
        }
        return null;
    },
    shapeApply: function (properties) {
        switch (this.State.id) {
        case STATES_ID_NULL:
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            var selectedObjects = this.State.id === STATES_ID_NULL || this.State.id === STATES_ID_TEXT_ADD ? this.selectedObjects : this.State.group.selectedObjects;
            for (var i = 0; i < selectedObjects.length; ++i) {
                if (properties.type != undefined && properties.type != -1 && typeof selectedObjects[i].changePresetGeom === "function") {
                    selectedObjects[i].changePresetGeom(properties.type);
                }
                if (properties.fill && typeof selectedObjects[i].changeFill === "function") {
                    selectedObjects[i].changeFill(properties.fill);
                }
                if (properties.stroke && typeof selectedObjects[i].changeLine === "function") {
                    selectedObjects[i].changeLine(properties.stroke);
                }
                if (properties.paddings && typeof selectedObjects[i].setPaddings === "function") {
                    selectedObjects[i].setPaddings(properties.paddings);
                }
            }
            if (typeof properties.verticalTextAlign === "number") {
                if (this.State.id === STATES_ID_TEXT_ADD) {
                    if (typeof this.State.textObject.setVerticalAlign === "function") {
                        this.State.textObject.setVerticalAlign(properties.verticalTextAlign);
                    }
                }
                if (this.State.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                    if (typeof this.State.setVerticalAlign === "function") {
                        this.State.textObject.setVerticalAlign(properties.verticalTextAlign);
                    }
                }
            }
            if (isRealNumber(properties.w) && isRealNumber(properties.h)) {
                for (var i = 0; i < selectedObjects.length; ++i) {
                    if (this.State.group) {
                        this.State.group.normalize();
                    }
                    if (selectedObjects[i].setXfrm) {
                        selectedObjects[i].setXfrm(null, null, properties.w, properties.h, null, null, null);
                    }
                    if (this.State.group) {
                        this.State.group.updateCoordinatesAfterInternalResize();
                    }
                }
            }
            break;
        }
        editor.WordControl.m_oLogicDocument.Recalculate();
    },
    setImageProps: function (properties) {
        switch (this.State.id) {
        case STATES_ID_NULL:
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            var selectedObjects = this.State.id === STATES_ID_NULL || this.State.id === STATES_ID_TEXT_ADD ? this.selectedObjects : this.State.group.selectedObjects;
            for (var i = 0; i < selectedObjects.length; ++i) {
                if (properties.type != undefined && properties.type != -1 && typeof selectedObjects[i].changePresetGeom === "function") {
                    selectedObjects[i].changePresetGeom(properties.type);
                }
                if (properties.fill && typeof selectedObjects[i].changeFill === "function") {
                    selectedObjects[i].changeFill(properties.fill);
                }
                if (properties.stroke && typeof selectedObjects[i].changeLine === "function") {
                    selectedObjects[i].changeLine(properties.stroke);
                }
                if (properties.paddings && typeof selectedObjects[i].setPaddings === "function") {
                    selectedObjects[i].setPaddings(properties.paddings);
                }
            }
            if (typeof properties.verticalTextAlign === "number") {
                if (this.State.id === STATES_ID_TEXT_ADD) {
                    if (typeof this.State.textObject.setVerticalAlign === "function") {
                        this.State.textObject.setVerticalAlign(properties.verticalTextAlign);
                    }
                }
                if (this.State.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                    if (typeof this.State.setVerticalAlign === "function") {
                        this.State.textObject.setVerticalAlign(properties.verticalTextAlign);
                    }
                }
            }
            if (this.State.id !== STATES_ID_GROUP && this.State.id !== STATES_ID_TEXT_ADD_IN_GROUP && isRealNumber(properties.w) && isRealNumber(properties.h)) {
                for (var i = 0; i < selectedObjects.length; ++i) {
                    if (selectedObjects[i].setXfrm) {
                        selectedObjects[i].setXfrm(null, null, properties.w, properties.h, null, null, null);
                    }
                }
            }
            break;
        }
        editor.WordControl.m_oLogicDocument.Recalculate();
    },
    imageApply: function (properties) {
        switch (this.State.id) {
        case STATES_ID_NULL:
            case STATES_ID_GROUP:
            case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            var selectedObjects = this.State.id === STATES_ID_NULL || this.State.id === STATES_ID_TEXT_ADD ? this.selectedObjects : this.State.group.selectedObjects;
            if (isRealNumber(properties.Width) && isRealNumber(properties.Height)) {
                if (this.State.group) {
                    this.State.group.normalize();
                }
                for (var i = 0; i < selectedObjects.length; ++i) {
                    if (selectedObjects[i].isImage && selectedObjects[i].isImage() && selectedObjects[i].setXfrm) {
                        selectedObjects[i].setXfrm(null, null, properties.Width, properties.Height, null, null, null);
                    }
                }
                if (this.State.group) {
                    this.State.group.updateCoordinatesAfterInternalResize();
                }
            }
            var pos = properties.Position;
            if (pos && isRealNumber(pos.X) && isRealNumber(pos.X)) {
                if (this.State.group) {
                    this.State.group.normalize();
                }
                for (var i = 0; i < selectedObjects.length; ++i) {
                    if (selectedObjects[i].isImage && selectedObjects[i].isImage() && selectedObjects[i].setXfrm) {
                        selectedObjects[i].setXfrm(pos.X, pos.Y, null, null, null, null, null);
                    }
                }
                if (this.State.group) {
                    this.State.group.updateCoordinatesAfterInternalResize();
                }
            }
            if (typeof properties.ImageUrl === "string") {
                for (var i = 0; i < selectedObjects.length; ++i) {
                    if (selectedObjects[i].isImage && selectedObjects[i].isImage() && selectedObjects[i].setBlipFill) {
                        var b_f = selectedObjects[i].blipFill.createDuplicate();
                        b_f.fill.RasterImageId = properties.ImageUrl;
                        selectedObjects[i].setBlipFill(b_f);
                    }
                }
            }
            break;
        }
    },
    chartApply: function (properties) {
        var selectedObjects = (this.State.group instanceof CGroupShape) ? this.State.group.selectedObjects : this.selectedObjects;
        if (this.State.group) {
            this.State.group.normalize();
        }
        for (var i = 0; i < selectedObjects.length; ++i) {
            if (selectedObjects[i] instanceof CGroupShape) {
                selectedObjects[i].normalize();
            }
            selectedObjects[i].setDiagram(properties);
            if (selectedObjects[i] instanceof CGroupShape) {
                selectedObjects[i].updateCoordinatesAfterInternalResize();
            }
        }
        if (this.State.group) {
            this.State.group.updateCoordinatesAfterInternalResize();
        }
    },
    canGroup: function () {
        if (this.selectedObjects.length < 2) {
            return false;
        }
        for (var i = 0; i < this.selectedObjects.length; ++i) {
            if (typeof this.selectedObjects[i].isTable === "function" && this.selectedObjects[i].isTable()) {
                return false;
            }
            if (this.selectedObjects[i].isPlaceholder()) {
                return false;
            }
        }
        return true;
    },
    canUnGroup: function () {
        for (var i = 0; i < this.selectedObjects.length; ++i) {
            if (this.selectedObjects[i].isGroup()) {
                return true;
            }
        }
        return false;
    },
    Add_FlowImage: function (W, H, Img) {
        var image = new CImageShape(this.slide);
        var blipFill = new CUniFill();
        blipFill.fill = new CBlipFill();
        blipFill.fill.RasterImageId = Img;
        image.setBlipFill(blipFill);
        image.setGeometry(CreateGeometry("rect"));
        image.spPr.geometry.Init(5, 5);
        image.setXfrm((this.slide.presentation.Width - W) / 2, (this.slide.presentation.Height - H) / 2, W, H, null, null, null);
        if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_AddShape, image) === false) {
            this.resetSelectionState();
            image.select(this);
            this.slide.addToSpTreeToPos(this.slide.cSld.spTree.length, image);
            editor.WordControl.m_oLogicDocument.recalcMap[image.Id] = image;
        }
    },
    groupShapes: function (drawingBase) {
        var sp_tree = this.slide.cSld.spTree;
        var grouped_objects = [];
        for (var i = 0; i < sp_tree.length; ++i) {
            if (sp_tree[i].selected) {
                grouped_objects.push(sp_tree[i]);
            }
        }
        this.slide.removeSelectedObjects();
        var max_x, min_x, max_y, min_y;
        var bounds = grouped_objects[0].getBoundsInGroup();
        max_x = bounds.maxX;
        max_y = bounds.maxY;
        min_x = bounds.minX;
        min_y = bounds.minY;
        for (i = 1; i < grouped_objects.length; ++i) {
            bounds = grouped_objects[i].getBoundsInGroup();
            if (max_x < bounds.maxX) {
                max_x = bounds.maxX;
            }
            if (max_y < bounds.maxY) {
                max_y = bounds.maxY;
            }
            if (min_x > bounds.minX) {
                min_x = bounds.minX;
            }
            if (min_y > bounds.minY) {
                min_y = bounds.minY;
            }
        }
        var group = new CGroupShape(this.slide);
        group.setOffset(min_x, min_y);
        group.setExtents(max_x - min_x, max_y - min_y);
        group.setChildExtents(max_x - min_x, max_y - min_y);
        group.setChildOffset(0, 0);
        for (i = 0; i < grouped_objects.length; ++i) {
            group.addToSpTree(group.spTree.length, grouped_objects[i]);
            grouped_objects[i].setOffset(grouped_objects[i].x - min_x, grouped_objects[i].y - min_y);
            grouped_objects[i].setGroup(group);
        }
        group.recalcAll();
        group.select(this);
        this.slide.addToSpTreeToPos(this.slide.cSld.spTree.length, group);
    },
    unGroup: function () {
        var selected_objects = this.selectedObjects;
        var ungrouped_objects = [];
        for (var i = 0; i < selected_objects.length; ++i) {
            if (selected_objects[i].isGroup() && selected_objects[i].canUnGroup()) {
                ungrouped_objects.push(selected_objects[i]);
            }
        }
        if (this.State.group) {
            this.State.group.resetSelection();
        }
        var arr_ungrouped_objects = [];
        var drawing_bases = this.slide.cSld.spTree;
        for (i = 0; i < ungrouped_objects.length; ++i) {
            var cur_group = ungrouped_objects[i];
            var start_position = null;
            for (var j = 0; j < drawing_bases.length; ++j) {
                if (drawing_bases[j] === cur_group) {
                    start_position = j;
                    break;
                }
            }
            var ungrouped_sp_tree = ungrouped_objects[i].getUnGroupedSpTree();
            for (var j = 0; j < ungrouped_sp_tree.length; ++j) {
                ungrouped_sp_tree[j].recalcAll();
                this.slide.addToSpTreeToPos(start_position + j, ungrouped_sp_tree[j]);
                arr_ungrouped_objects.push(ungrouped_sp_tree[j]);
            }
        }
        for (var i = 0; i < this.slide.cSld.spTree.length; ++i) {
            if (this.slide.cSld.spTree[i].selected && !(this.slide.cSld.spTree[i] instanceof CGroupShape)) {
                this.slide.cSld.spTree[i].deselect(this);
            }
        }
        this.slide.removeSelectedObjects();
        this.resetSelectionState();
        for (var i = 0; i < arr_ungrouped_objects.length; ++i) {
            arr_ungrouped_objects[i].select(this);
        }
    },
    startSearchText: function (str, scanForward, bNullState) {
        if (typeof(str) != "string") {
            return null;
        }
        if (scanForward === undefined) {
            scanForward = true;
        }
        var _cur_glyph_num;
        var _arr_sel_states = null;
        var NumSelected = this.selectedObjects.length;
        var ArrGlyph = this.slide.cSld.spTree;
        if (this.State.id == STATES_ID_NULL || bNullState === true) {
            if (NumSelected == 0 || NumSelected == ArrGlyph.length || bNullState) {
                if (scanForward == true) {
                    for (_cur_glyph_num = 0; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num) {
                        if ((_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null) {
                            return _arr_sel_states[0];
                        }
                    }
                } else {
                    for (_cur_glyph_num = ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num) {
                        if ((_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null) {
                            return _arr_sel_states[_arr_sel_states.length - 1];
                        }
                    }
                }
                return null;
            } else {
                if (scanForward == true) {
                    for (_cur_glyph_num = 0; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num) {
                        if (ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null) {
                            return _arr_sel_states[0];
                        }
                    }
                    for (_cur_glyph_num = 0; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num) {
                        if (!ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null) {
                            return _arr_sel_states[0];
                        }
                    }
                } else {
                    for (_cur_glyph_num = ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num) {
                        if (ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null) {
                            return _arr_sel_states[_arr_sel_states.length - 1];
                        }
                    }
                    for (_cur_glyph_num = ArrGlyph.length - 1; _cur_glyph_num > -1; --_cur_glyph_num) {
                        if (!ArrGlyph[_cur_glyph_num].selected && (_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null) {
                            return _arr_sel_states[_arr_sel_states.length - 1];
                        }
                    }
                }
                return null;
            }
        } else {
            if (this.State.id == STATES_ID_TEXT_ADD || this.State.id === STATES_ID_TEXT_ADD_IN_GROUP) {
                var _cur_doc_content;
                _cur_glyph_num = 0;
                var obj = this.State.id == STATES_ID_TEXT_ADD ? this.State.textObject : this.State.group;
                if (obj && (_cur_doc_content = obj.getCurDocumentContent()) != null) {
                    for (_cur_glyph_num = 0; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num) {
                        if (ArrGlyph[_cur_glyph_num] == obj) {
                            break;
                        }
                    }
                    if (_cur_glyph_num < ArrGlyph.length) {
                        if ((_arr_sel_states = obj.getSearchResults(str, _cur_glyph_num)) != null) {
                            var b_table = obj instanceof CGraphicFrame;
                            var b_group = obj instanceof CGroupShape;
                            var _cur_pos_doc, _cur_pos_par, cur_row, cur_cell, cur_shape;
                            var _pos_sel_state;
                            var _tmp_sel_state;
                            var _prev_sel_state;
                            if (scanForward == true) {
                                if (!_cur_doc_content.Selection.Use) {
                                    _cur_pos_doc = _cur_doc_content.CurPos.ContentPos;
                                    _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].CurPos.ContentPos;
                                } else {
                                    _cur_pos_doc = _cur_doc_content.Selection.EndPos;
                                    _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].Selection.EndPos;
                                }
                                if (obj instanceof CGraphicFrame && obj.graphicObject instanceof CTable) {
                                    var table = obj.graphicObject;
                                    for (var i = 0; i < table.Content.length; ++i) {
                                        var row = table.Content[i];
                                        for (var j = 0; j < row.Content.length; ++j) {
                                            if (table.CurCell === row.Content[j]) {
                                                cur_row = i;
                                                cur_cell = j;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (b_group) {
                                    for (var t = 0; t < obj.arrGraphicObjects.length; ++t) {
                                        if (obj.arrGraphicObjects[t] === this.State.textObject) {
                                            cur_shape = t;
                                            break;
                                        }
                                    }
                                }
                                for (_pos_sel_state = 0; _pos_sel_state < _arr_sel_states.length; ++_pos_sel_state) {
                                    _tmp_sel_state = _arr_sel_states[_pos_sel_state];
                                    if (_tmp_sel_state.textSelectionState != undefined) {
                                        var _text_sel_state = _tmp_sel_state.textSelectionState;
                                        if (b_table && isRealNumber(cur_row) && isRealNumber(cur_cell)) {
                                            if (_text_sel_state[_text_sel_state.length - 1].CurCell.Row > cur_row) {
                                                return _arr_sel_states[_pos_sel_state];
                                            }
                                            if (_text_sel_state[_text_sel_state.length - 1].CurCell.Row === cur_row) {
                                                if (_text_sel_state[_text_sel_state.length - 1].CurCell.Cell > cur_cell) {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                                if (_text_sel_state[_text_sel_state.length - 1].CurCell.Cell === cur_cell) {
                                                    var ind1 = 2;
                                                    if (_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos > _cur_pos_doc) {
                                                        return _arr_sel_states[_pos_sel_state];
                                                    }
                                                    if (_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos == _cur_pos_doc) {
                                                        if (_text_sel_state[_text_sel_state.length - ind1 - 1][0][0].Selection.StartPos >= _cur_pos_par) {
                                                            return _arr_sel_states[_pos_sel_state];
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            if (b_group && isRealNumber(cur_shape)) {
                                                if (_tmp_sel_state.shapeIndex > cur_shape) {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                                if (_tmp_sel_state.shapeIndex === cur_shape) {
                                                    var ind1 = 1;
                                                    if (_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos > _cur_pos_doc) {
                                                        return _arr_sel_states[_pos_sel_state];
                                                    }
                                                    if (_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos == _cur_pos_doc) {
                                                        if (_text_sel_state[_text_sel_state.length - ind1 - 1][0][0].Selection.StartPos >= _cur_pos_par) {
                                                            return _arr_sel_states[_pos_sel_state];
                                                        }
                                                    }
                                                }
                                            } else {
                                                var ind1 = 1;
                                                if (_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos > _cur_pos_doc) {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                                if (_text_sel_state[_text_sel_state.length - ind1].Selection.StartPos == _cur_pos_doc) {
                                                    if (_text_sel_state[_text_sel_state.length - ind1 - 1][0][0].Selection.StartPos >= _cur_pos_par) {
                                                        return _arr_sel_states[_pos_sel_state];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    _prev_sel_state = _tmp_sel_state;
                                }
                                for (++_cur_glyph_num; _cur_glyph_num < ArrGlyph.length; ++_cur_glyph_num) {
                                    if ((_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null) {
                                        return _arr_sel_states[0];
                                    }
                                }
                            } else {
                                if (obj instanceof CGraphicFrame && obj.graphicObject instanceof CTable) {
                                    var table = obj.graphicObject;
                                    for (var i = 0; i < table.Content.length; ++i) {
                                        var row = table.Content[i];
                                        for (var j = 0; j < row.Content.length; ++j) {
                                            if (table.CurCell === row.Content[j]) {
                                                cur_row = i;
                                                cur_cell = j;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if (b_group) {
                                    for (var t = 0; t < obj.arrGraphicObjects.length; ++t) {
                                        if (obj.arrGraphicObjects[t] === this.State.textObject) {
                                            cur_shape = t;
                                            break;
                                        }
                                    }
                                }
                                if (!_cur_doc_content.Selection.Use) {
                                    _cur_pos_doc = _cur_doc_content.CurPos.ContentPos;
                                    _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].CurPos.ContentPos;
                                } else {
                                    _cur_pos_doc = _cur_doc_content.Selection.StartPos;
                                    _cur_pos_par = _cur_doc_content.Content[_cur_pos_doc].Selection.StartPos;
                                }
                                for (_pos_sel_state = _arr_sel_states.length - 1; _pos_sel_state > -1; --_pos_sel_state) {
                                    _tmp_sel_state = _arr_sel_states[_pos_sel_state];
                                    if (_tmp_sel_state.textSelectionState != undefined) {
                                        _text_sel_state = _tmp_sel_state.textSelectionState;
                                        if (b_table && isRealNumber(cur_row) && isRealNumber(cur_cell)) {
                                            if (_text_sel_state[_text_sel_state.length - 1].CurCell.Row < cur_row) {
                                                return _arr_sel_states[_pos_sel_state];
                                            }
                                            if (_text_sel_state[_text_sel_state.length - 1].CurCell.Row === cur_row) {
                                                if (_text_sel_state[_text_sel_state.length - 1].CurCell.Cell < cur_cell) {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                                if (_text_sel_state[_text_sel_state.length - 1].CurCell.Cell === cur_cell) {
                                                    var ind1 = 2;
                                                    if (_text_sel_state[_text_sel_state.length - ind1].Selection.EndPos < _cur_pos_doc) {
                                                        return _arr_sel_states[_pos_sel_state];
                                                    }
                                                    if (_text_sel_state[_text_sel_state.length - ind1].Selection.EndPos == _cur_pos_doc) {
                                                        if (_text_sel_state[_text_sel_state.length - ind1 - 1][0][0].Selection.EndPos <= _cur_pos_par) {
                                                            return _arr_sel_states[_pos_sel_state];
                                                        }
                                                    }
                                                }
                                            }
                                        } else {
                                            if (b_group && isRealNumber(cur_shape)) {
                                                if (_tmp_sel_state.shapeIndex < cur_shape) {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                                if (_tmp_sel_state.shapeIndex === cur_shape) {
                                                    var ind1 = 1;
                                                    if (_text_sel_state[_text_sel_state.length - ind1].Selection.EndPos < _cur_pos_doc) {
                                                        return _arr_sel_states[_pos_sel_state];
                                                    }
                                                    if (_text_sel_state[_text_sel_state.length - ind1].Selection.EndPos == _cur_pos_doc) {
                                                        if (_text_sel_state[_text_sel_state.length - ind1 - 1][0][0].Selection.EndPos <= _cur_pos_par) {
                                                            return _arr_sel_states[_pos_sel_state];
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (_text_sel_state[_text_sel_state.length - 1].Selection.EndPos < _cur_pos_doc) {
                                                    return _arr_sel_states[_pos_sel_state];
                                                }
                                                if (_text_sel_state[_text_sel_state.length - 1].Selection.EndPos == _cur_pos_doc) {
                                                    if (_text_sel_state[_text_sel_state.length - 2][0][0].Selection.EndPos <= _cur_pos_par) {
                                                        return _arr_sel_states[_pos_sel_state];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    _prev_sel_state = _tmp_sel_state;
                                }
                                for (--_cur_glyph_num; _cur_glyph_num > -1; --_cur_glyph_num) {
                                    if ((_arr_sel_states = ArrGlyph[_cur_glyph_num].getSearchResults(str, _cur_glyph_num)) != null) {
                                        return _arr_sel_states[_arr_sel_states.length - 1];
                                    }
                                }
                            }
                        }
                        return null;
                    }
                }
            }
        }
        return null;
    },
    addChart: function (binary) {
        var chart = new CChartAsGroup(this.slide);
        chart.initFromBinary(binary);
        var p = editor.WordControl.m_oLogicDocument;
        var pos_x = (p.Width - chart.spPr.xfrm.extX) / 2;
        var pos_y = (p.Height - chart.spPr.xfrm.extY) / 2;
        if (isRealNumber(pos_x) && isRealNumber(pos_y)) {
            chart.setXfrm(pos_x, pos_y, null, null, null, null, null);
        }
        var font_map = {};
        chart.getAllFonts(font_map);
        var aPrepareFonts = [];
        for (var i in font_map) {
            aPrepareFonts.push(new CFont(i, 0, "", 0));
        }
        var oThis = this;
        var paste_callback = function () {
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_AddShape, chart) === false) {
                oThis.slide.addToSpTreeToPos(oThis.slide.cSld.spTree.length, chart);
                editor.WordControl.m_oLogicDocument.recalcMap[chart.Id] = chart;
                editor.WordControl.m_oLogicDocument.Recalculate();
            }
        };
        editor.pre_Paste(aPrepareFonts, [], paste_callback);
    },
    editChart: function (binary) {
        switch (this.State.id) {
        case STATES_ID_GROUP:
            var seleted_objects = this.State.group.selectedObjects;
            if (typeof CChartAsGroup != "undefined" && selected_objects.length === 1 && selected_objects[0] instanceof CChartAsGroup) {
                selected_objects[0].initFromBinary(binary);
                this.State.group.updateCoordinatesAfterInternalResize();
                editor.WordControl.m_oLogicDocument.recalcMap[this.State.group.Id] = this.State.group;
            }
            break;
        case STATES_ID_NULL:
            if (this.selectedObjects.length === 1 && this.selectedObjects[0].chart) {
                this.selectedObjects[0].initFromBinary(binary);
                editor.WordControl.m_oLogicDocument.recalcMap[this.selectedObjects[0].Id] = this.selectedObjects[0];
            }
            break;
        }
    },
    addNewParagraph: function (bRecalc) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                History.Create_NewPoint();
                this.State.textObject.addNewParagraph(bRecalc);
            }
            break;
        }
    },
    Cursor_MoveLeft: function (AddToSelect, Word) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveLeft(AddToSelect, Word);
            break;
        case STATES_ID_NULL:
            if (editor.isViewMode === false) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    var selected_objects = this.selectedObjects;
                    if (selected_objects.length > 0) {
                        History.Create_NewPoint();
                        var shift;
                        if (Word) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                        } else {
                            if (!AddToSelect) {
                                shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                            }
                        }
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var new_x = selected_objects[i].x - shift;
                            var new_y = selected_objects[i].y;
                            selected_objects[i].setXfrm(new_x, new_y);
                        }
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                    }
                }
            }
            break;
        case STATES_ID_GROUP:
            if (editor.isViewMode === false) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    var selected_objects = this.State.group.selectedObjects;
                    if (selected_objects.length > 0) {
                        History.Create_NewPoint();
                        var shift;
                        if (Word) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                        } else {
                            if (!AddToSelect) {
                                shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                            }
                        }
                        var invert_group_transform = global_MatrixTransformer.Invert(this.State.group.transform);
                        this.State.group.normalize();
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var rel_transform = selected_objects[i].transform.CreateDublicate();
                            global_MatrixTransformer.MultiplyAppend(rel_transform, invert_group_transform);
                            rel_transform.tx = 0;
                            rel_transform.ty = 0;
                            var dx = rel_transform.TransformPointX(-shift, 0);
                            var dy = rel_transform.TransformPointY(-shift, 0);
                            var new_x = selected_objects[i].x + dx;
                            var new_y = selected_objects[i].y + dy;
                            selected_objects[i].setXfrm(new_x, new_y);
                        }
                        this.State.group.updateCoordinatesAfterInternalResize();
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                    }
                }
            }
            break;
        }
    },
    Cursor_MoveRight: function (AddToSelect, Word) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveRight(AddToSelect, Word);
            break;
        case STATES_ID_NULL:
            if (editor.isViewMode === false) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    var selected_objects = this.selectedObjects;
                    if (selected_objects.length > 0) {
                        History.Create_NewPoint();
                        var shift;
                        if (Word) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                        } else {
                            if (!AddToSelect) {
                                shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                            }
                        }
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var new_x = selected_objects[i].x + shift;
                            var new_y = selected_objects[i].y;
                            selected_objects[i].setXfrm(new_x, new_y);
                        }
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                    }
                }
            }
            break;
        case STATES_ID_GROUP:
            if (editor.isViewMode === false) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    var selected_objects = this.State.group.selectedObjects;
                    if (selected_objects.length > 0) {
                        History.Create_NewPoint();
                        var shift;
                        if (Word) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                        } else {
                            if (!AddToSelect) {
                                shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                            }
                        }
                        var invert_group_transform = global_MatrixTransformer.Invert(this.State.group.transform);
                        this.State.group.normalize();
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var rel_transform = selected_objects[i].transform.CreateDublicate();
                            global_MatrixTransformer.MultiplyAppend(rel_transform, invert_group_transform);
                            rel_transform.tx = 0;
                            rel_transform.ty = 0;
                            var dx = rel_transform.TransformPointX(shift, 0);
                            var dy = rel_transform.TransformPointY(shift, 0);
                            var new_x = selected_objects[i].x + dx;
                            var new_y = selected_objects[i].y + dy;
                            selected_objects[i].setXfrm(new_x, new_y);
                        }
                        this.State.group.updateCoordinatesAfterInternalResize();
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                    }
                }
            }
            break;
        }
    },
    Cursor_MoveUp: function (AddToSelect) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveUp(AddToSelect);
            break;
        case STATES_ID_NULL:
            if (editor.isViewMode === false) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    var selected_objects = this.selectedObjects;
                    if (selected_objects.length > 0) {
                        History.Create_NewPoint();
                        var shift;
                        if (global_mouseEvent.CtrlKey) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                        } else {
                            if (!AddToSelect) {
                                shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                            }
                        }
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var new_x = selected_objects[i].x;
                            var new_y = selected_objects[i].y - shift;
                            selected_objects[i].setXfrm(new_x, new_y);
                        }
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                    }
                }
            }
            break;
        case STATES_ID_GROUP:
            if (editor.isViewMode === false) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    var selected_objects = this.State.group.selectedObjects;
                    if (selected_objects.length > 0) {
                        History.Create_NewPoint();
                        var shift;
                        if (global_mouseEvent.CtrlKey) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                        } else {
                            if (!AddToSelect) {
                                shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                            }
                        }
                        var invert_group_transform = global_MatrixTransformer.Invert(this.State.group.transform);
                        this.State.group.normalize();
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var rel_transform = selected_objects[i].transform.CreateDublicate();
                            global_MatrixTransformer.MultiplyAppend(rel_transform, invert_group_transform);
                            rel_transform.tx = 0;
                            rel_transform.ty = 0;
                            var dx = rel_transform.TransformPointX(0, -shift);
                            var dy = rel_transform.TransformPointY(0, -shift);
                            var new_x = selected_objects[i].x + dx;
                            var new_y = selected_objects[i].y + dy;
                            selected_objects[i].setXfrm(new_x, new_y);
                        }
                        this.State.group.updateCoordinatesAfterInternalResize();
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                    }
                }
            }
            break;
        }
    },
    Cursor_MoveDown: function (AddToSelect) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveDown(AddToSelect);
            break;
        case STATES_ID_NULL:
            if (editor.isViewMode === false) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    var selected_objects = this.selectedObjects;
                    if (selected_objects.length > 0) {
                        History.Create_NewPoint();
                        var shift;
                        if (global_mouseEvent.CtrlKey) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                        } else {
                            if (!AddToSelect) {
                                shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                            }
                        }
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var new_x = selected_objects[i].x;
                            var new_y = selected_objects[i].y + shift;
                            selected_objects[i].setXfrm(new_x, new_y);
                        }
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                    }
                }
            }
            break;
        case STATES_ID_GROUP:
            if (editor.isViewMode === false) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    var selected_objects = this.State.group.selectedObjects;
                    if (selected_objects.length > 0) {
                        History.Create_NewPoint();
                        var shift;
                        if (global_mouseEvent.CtrlKey) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                        } else {
                            if (!AddToSelect) {
                                shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                            }
                        }
                        var invert_group_transform = global_MatrixTransformer.Invert(this.State.group.transform);
                        this.State.group.normalize();
                        for (var i = 0; i < selected_objects.length; ++i) {
                            var rel_transform = selected_objects[i].transform.CreateDublicate();
                            global_MatrixTransformer.MultiplyAppend(rel_transform, invert_group_transform);
                            rel_transform.tx = 0;
                            rel_transform.ty = 0;
                            var dx = rel_transform.TransformPointX(0, shift);
                            var dy = rel_transform.TransformPointY(0, shift);
                            var new_x = selected_objects[i].x + dx;
                            var new_y = selected_objects[i].y + dy;
                            selected_objects[i].setXfrm(new_x, new_y);
                        }
                        this.State.group.updateCoordinatesAfterInternalResize();
                        editor.WordControl.m_oLogicDocument.Recalculate();
                        editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                    }
                }
            }
            break;
        }
    },
    Cursor_MoveEndOfLine: function (AddToSelect) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveEndOfLine(AddToSelect);
            break;
        }
    },
    Cursor_MoveStartOfLine: function (AddToSelect) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveStartOfLine(AddToSelect);
            break;
        }
    },
    Cursor_MoveAt: function (X, Y, AddToSelect) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveAt(X, Y, AddToSelect);
            break;
        }
    },
    Cursor_MoveToCell: function (bNext) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveLeft(AddToSelect, Word);
            break;
        case STATES_ID_NULL:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                var selected_objects = this.selectedObjects;
                if (selected_objects.length > 0) {
                    History.Create_NewPoint();
                    var shift;
                    if (Word) {
                        shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                    } else {
                        if (!AddToSelect) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                        }
                    }
                    for (var i = 0; i < selected_objects.length; ++i) {
                        var new_x = selected_objects[i].x - shift;
                        var new_y = selected_objects[i].y;
                        selected_objects[i].setXfrm(new_x, new_y);
                    }
                    editor.WordControl.m_oLogicDocument.Recalculate();
                    editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                }
            }
            break;
        case STATES_ID_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                var selected_objects = this.State.group.selectedObjects;
                if (selected_objects.length > 0) {
                    History.Create_NewPoint();
                    var shift;
                    if (Word) {
                        shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
                    } else {
                        if (!AddToSelect) {
                            shift = editor.WordControl.m_oDrawingDocument.GetMMPerDot(5);
                        }
                    }
                    var invert_group_transform = global_MatrixTransformer.Invert(this.State.group.transform);
                    this.State.group.normalize();
                    for (var i = 0; i < selected_objects.length; ++i) {
                        var rel_transform = selected_objects[i].transform.CreateDublicate();
                        global_MatrixTransformer.MultiplyAppend(rel_transform, invert_group_transform);
                        rel_transform.tx = 0;
                        rel_transform.ty = 0;
                        var dx = rel_transform.TransformPointX(-shift, 0);
                        var dy = rel_transform.TransformPointY(-shift, 0);
                        var new_x = selected_objects[i].x + dx;
                        var new_y = selected_objects[i].y + dy;
                        selected_objects[i].setXfrm(new_x, new_y);
                    }
                    this.State.group.updateCoordinatesAfterInternalResize();
                    editor.WordControl.m_oLogicDocument.Recalculate();
                    editor.WordControl.m_oLogicDocument.Document_UpdateUndoRedoState();
                }
            }
            break;
        }
    },
    Cursor_MoveToStartPos: function () {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveToStartPos();
            break;
        }
    },
    Cursor_MoveToEndPos: function () {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            this.State.textObject.Cursor_MoveToEndPos();
            break;
        }
    },
    remove: function (Count, bOnlyText, bRemoveOnlySelection) {
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            case STATES_ID_TEXT_ADD_IN_GROUP:
            case STATES_ID_CHART_GROUP_TEXT_ADD:
            case STATES_ID_CHART_TEXT_ADD:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                History.Create_NewPoint();
                this.State.textObject.remove(Count, bOnlyText, bRemoveOnlySelection);
                if (this.State.textObject.recalculate) {
                    this.State.textObject.recalculate();
                }
                this.updateSelectionState();
            }
            break;
        case STATES_ID_CHART:
            case STATES_ID_CHART_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                History.Create_NewPoint();
                var chart = this.State.chart;
                if (chart.chartTitle && chart.chartTitle.selected) {
                    chart.addTitle(null);
                    g_oTableId.m_bTurnOff = true;
                    var copy_asc_chart = new asc_CChart(chart.chart);
                    g_oTableId.m_bTurnOff = false;
                    copy_asc_chart.header.asc_setTitle("");
                    chart.setAscChart(copy_asc_chart);
                } else {
                    if (chart.hAxisTitle && chart.hAxisTitle.selected) {
                        chart.addXAxis(null);
                        g_oTableId.m_bTurnOff = true;
                        var copy_asc_chart = new asc_CChart(chart.chart);
                        g_oTableId.m_bTurnOff = false;
                        copy_asc_chart.xAxis.asc_setTitle("");
                        chart.setAscChart(copy_asc_chart);
                    } else {
                        if (chart.vAxisTitle && chart.vAxisTitle.selected) {
                            chart.addYAxis(null);
                            g_oTableId.m_bTurnOff = true;
                            var copy_asc_chart = new asc_CChart(chart.chart);
                            g_oTableId.m_bTurnOff = false;
                            copy_asc_chart.yAxis.asc_setTitle("");
                            chart.setAscChart(copy_asc_chart);
                        }
                    }
                }
            }
            break;
        case STATES_ID_NULL:
            if (this.selectedObjects.length > 0) {
                if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint();
                    this.slide.removeSelectedObjects();
                }
            } else {
                if (this.slide.slideComments) {
                    var comments = this.slide.slideComments.comments;
                    for (var i = 0; i < comments.length; ++i) {
                        if (comments[i].selected) {
                            if (false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_MoveComment, comments[i].Id)) {
                                editor.WordControl.m_oLogicDocument.Create_NewHistoryPoint();
                                editor.WordControl.m_oLogicDocument.Remove_Comment(comments[i].Id, true);
                            }
                            break;
                        }
                    }
                }
            }
            break;
        case STATES_ID_GROUP:
            if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                History.Create_NewPoint();
                var state = this.State;
                var group = state.group;
                var selected_objects = [];
                for (var i = 0; i < group.selectedObjects.length; ++i) {
                    selected_objects.push(group.selectedObjects[i]);
                }
                if (selected_objects.length === group.arrGraphicObjects.length) {
                    this.slide.removeSelectedObjects();
                    break;
                }
                group.resetSelection();
                var groups = [];
                for (i = 0; i < selected_objects.length; ++i) {
                    var parent_group = selected_objects[i].group;
                    parent_group.removeFromSpTree(selected_objects[i].Get_Id());
                    for (var j = 0; j < groups.length; ++j) {
                        if (groups[i] === parent_group) {
                            break;
                        }
                    }
                    if (j === groups.length) {
                        groups.push(parent_group);
                    }
                }
                groups.sort(CompareGroups);
                for (i = 0; i < groups.length; ++i) {
                    var parent_group = groups[i];
                    if (parent_group !== group) {
                        if (parent_group.spTree.length === 0) {
                            parent_group.group.removeFromSpTree(parent_group.Get_Id());
                        }
                        if (parent_group.spTree.length === 1) {
                            var sp = parent_group.spTree[0];
                            sp.setRotate(normalizeRotate(isRealNumber(sp.spPr.xfrm.rot) ? sp.spPr.xfrm.rot : 0 + isRealNumber(parent_group.spPr.xfrm.rot) ? parent_group.spPr.xfrm.rot : 0));
                            sp.setFlips(sp.spPr.xfrm.flipH === true ? !(parent_group.spPr.xfrm.flipH === true) : parent_group.spPr.xfrm.flipH === true, sp.spPr.xfrm.flipV === true ? !(parent_group.spPr.xfrm.flipV === true) : parent_group.spPr.xfrm.flipV === true);
                            sp.setOffset(sp.spPr.xfrm.x + parent_group.spPr.xfrm.x, sp.spPr.xfrm.y + parent_group.spPr.xfrm.y);
                            parent_group.group.swapGraphicObject(parent_group.Get_Id(), sp.Get_Id());
                        }
                    } else {
                        switch (parent_group.spTree.length) {
                        case 0:
                            this.slide.removeFromSpTreeById(parent_group.Get_Id());
                            break;
                        case 1:
                            this.resetSelectionState();
                            var sp = parent_group.spTree[0];
                            sp.setRotate(normalizeRotate(isRealNumber(sp.spPr.xfrm.rot) ? sp.spPr.xfrm.rot : 0 + isRealNumber(parent_group.spPr.xfrm.rot) ? parent_group.spPr.xfrm.rot : 0));
                            sp.setFlips(sp.spPr.xfrm.flipH === true ? !(parent_group.spPr.xfrm.flipH === true) : parent_group.spPr.xfrm.flipH === true, sp.spPr.xfrm.flipV === true ? !(parent_group.spPr.xfrm.flipV === true) : parent_group.spPr.xfrm.flipV === true);
                            sp.setOffset(sp.spPr.xfrm.offX + parent_group.spPr.xfrm.offX, sp.spPr.xfrm.offY + parent_group.spPr.xfrm.offY);
                            sp.setGroup(null);
                            var pos = this.slide.removeFromSpTreeById(parent_group.Get_Id());
                            this.slide.addToSpTreeToPos(pos, sp);
                            sp.select(this);
                            break;
                        default:
                            this.resetSelectionState();
                            parent_group.normalize();
                            parent_group.updateCoordinatesAfterInternalResize();
                            parent_group.select(this);
                            parent_group.recalculate();
                            break;
                        }
                    }
                }
            }
            break;
        }
    },
    getSelectionState: function () {
        var s = {};
        switch (this.State.id) {
        case STATES_ID_TEXT_ADD:
            s.id = STATES_ID_TEXT_ADD;
            s.textObject = this.State.textObject;
            s.textSelectionState = this.State.textObject.getTextSelectionState();
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            s.id = STATES_ID_TEXT_ADD_IN_GROUP;
            s.group = this.State.group;
            s.textObject = this.State.textObject;
            s.textSelectionState = this.State.textObject.getTextSelectionState();
            break;
        case STATES_ID_GROUP:
            case STATES_ID_CHANGE_ADJ_IN_GROUP:
            case STATES_ID_ROTATE_IN_GROUP:
            case STATES_ID_RESIZE_IN_GROUP:
            case STATES_ID_MOVE_IN_GROUP:
            s.id = STATES_ID_GROUP;
            s.group = this.State.group;
            s.selectedObjects = [];
            for (var i = 0; i < this.State.group.selectedObjects.length; ++i) {
                s.selectedObjects.push(this.State.group.selectedObjects[i]);
            }
            break;
        case STATES_ID_CHART_TEXT_ADD:
            s.id = STATES_ID_CHART_TEXT_ADD;
            s.chart = this.State.chart;
            s.textObject = this.State.textObject;
            s.textSelectionState = this.State.textObject.getTextSelectionState();
            break;
        case STATES_ID_CHART:
            case STATES_ID_MOVE_INTERNAL_CHART_OBJECT:
            s.id = STATES_ID_CHART;
            s.chart = this.State.chart;
            var selected_title;
            var chart = this.State.chart;
            if (chart.chartTitle && chart.chartTitle.selected) {
                selected_title = chart.chartTitle;
            } else {
                if (chart.hAxisTitle && chart.hAxisTitle.selected) {
                    selected_title = chart.hAxisTitle;
                } else {
                    if (chart.vAxisTitle && chart.vAxisTitle.selected) {
                        selected_title = chart.vAxisTitle;
                    }
                }
            }
            s.selectedTitle = selected_title;
            break;
        case STATES_ID_MOVE_INTERNAL_CHART_OBJECT_GROUP:
            case STATES_ID_CHART_GROUP:
            s.id = STATES_ID_CHART_GROUP;
            s.chart = this.State.chart;
            s.group = this.State.group;
            var chart = this.State.chart;
            if (chart.chartTitle && chart.chartTitle.selected) {
                selected_title = chart.chartTitle;
            } else {
                if (chart.hAxisTitle && chart.hAxisTitle.selected) {
                    selected_title = chart.hAxisTitle;
                } else {
                    if (chart.vAxisTitle && chart.vAxisTitle.selected) {
                        selected_title = chart.vAxisTitle;
                    }
                }
            }
            s.selectedTitle = selected_title;
            break;
        case STATES_ID_CHART_GROUP_TEXT_ADD:
            s.id = STATES_ID_CHART_GROUP_TEXT_ADD;
            s.chart = this.State.chart;
            s.group = this.State.group;
            s.title = this.State.title;
            s.textSelectionState = this.State.title.getTextSelectionState();
            break;
        default:
            s.id = STATES_ID_NULL;
            s.selectedObjects = [];
            for (var i = 0; i < this.selectedObjects.length; ++i) {
                s.selectedObjects.push(this.selectedObjects[i]);
            }
            break;
        }
        return s;
    },
    setSelectionState: function (s) {
        this.resetSelectionState();
        switch (s.id) {
        case STATES_ID_TEXT_ADD:
            s.textObject.select(this);
            s.textObject.addTextFlag = true;
            s.textObject.setTextSelectionState(s.textSelectionState);
            this.changeCurrentState(new TextAddState(this, this.slide, s.textObject));
            break;
        case STATES_ID_TEXT_ADD_IN_GROUP:
            s.group.select(this);
            s.textObject.addTextFlag = true;
            s.textObject.select(s.group);
            s.textObject.setTextSelectionState(s.textSelectionState);
            this.changeCurrentState(new TextAddInGroup(this, this.slide, s.group, s.textObject));
            break;
        case STATES_ID_GROUP:
            s.group.select(this);
            for (var i = 0; i < s.selectedObjects.length; ++i) {
                s.selectedObjects[i].select(s.group);
            }
            this.changeCurrentState(new GroupState(this, this.slide, s.group));
            break;
        case STATES_ID_CHART_TEXT_ADD:
            s.chart.select(this);
            s.textObject.select();
            s.textObject.setTextSelectionState(s.textSelectionState);
            this.changeCurrentState(new ChartTextAdd(this, this.slide, s.chart, s.textObject));
            break;
        case STATES_ID_CHART:
            s.chart.select(this);
            if (s.selectedTitle) {
                s.selectedTitle.select();
            }
            this.changeCurrentState(new ChartState(this, this.slide, s.chart));
            break;
        case STATES_ID_CHART_GROUP:
            s.group.select(this);
            s.chart.select(this);
            if (s.selectedTitle) {
                s.selectedTitle.select();
            }
            this.changeCurrentState(new ChartGroupState(this, this.slide, s.chart, s.group));
            break;
        case STATES_ID_CHART_GROUP_TEXT_ADD:
            s.group.select(this);
            s.chart.select(this);
            s.title.select();
            s.title.setTextSelectionState(s.textSelectionState);
            this.changeCurrentState(new ChartGroupTextAddState(this, this.slide, s.chart, s.group, s.title));
            break;
        default:
            for (var i = 0; i < s.selectedObjects.length; ++i) {
                s.selectedObjects[i].select(this);
            }
            break;
        }
    },
    recalculateCurPos: function () {
        if (isRealObject(this.State.textObject)) {
            this.State.textObject.recalculateCurPos();
        }
    },
    onMouseDown: function (e, x, y) {
        this.State.onMouseDown(e, x, y);
        editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
        editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
    },
    onMouseDown2: function (e, x, y) {
        this.State.onMouseDown(e, x, y);
    },
    onMouseMove: function (e, x, y) {
        this.State.onMouseMove(e, x, y);
    },
    onMouseUp: function (e, x, y) {
        this.State.onMouseUp(e, x, y);
        editor.asc_fireCallback("asc_onCanGroup", this.canGroup());
        editor.asc_fireCallback("asc_onCanUnGroup", this.canUnGroup());
    },
    onMouseUp2: function (e, x, y) {
        this.State.onMouseUp(e, x, y);
        this.slide.presentation.Document_UpdateInterfaceState();
        if (this.selectedObjects.length > 0) {
            var _data = new CContextMenuData();
            _data.Type = c_oAscContextMenuTypes.Main;
            _data.X_abs = e.X;
            _data.Y_abs = e.Y;
            editor.sync_ContextMenuCallback(_data);
        }
    },
    updateCursorType: function (e, x, y) {
        this.State.updateCursorType(e, x, y);
    },
    updateSelectionState: function () {
        if (isRealObject(this.State.textObject)) {
            this.State.textObject.updateSelectionState();
        } else {
            this.slide.presentation.DrawingDocument.UpdateTargetTransform(null);
            this.slide.presentation.DrawingDocument.TargetEnd();
            this.slide.presentation.DrawingDocument.SelectEnabled(false);
            this.slide.presentation.DrawingDocument.SelectClear();
            this.slide.presentation.DrawingDocument.SelectShow();
        }
    },
    changeCurrentState: function (newState) {
        this.State = newState;
    },
    clearPreTrackObjects: function () {
        this.arrPreTrackObjects.length = 0;
    },
    addPreTrackObject: function (preTrackObject) {
        this.arrPreTrackObjects.push(preTrackObject);
    },
    clearTrackObjects: function () {
        this.arrTrackObjects.length = 0;
    },
    getSnapArraysTrackObjects: function () {
        var snapX = [],
        snapY = [];
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            if (this.arrTrackObjects[i].originalObject && this.arrTrackObjects[i].originalObject.getSnapArrays) {
                this.arrTrackObjects[i].originalObject.getSnapArrays(snapX, snapY);
            }
        }
        return {
            snapX: snapX,
            snapY: snapY
        };
    },
    addTrackObject: function (trackObject) {
        this.arrTrackObjects.push(trackObject);
    },
    swapTrackObjects: function () {
        this.clearTrackObjects();
        for (var i = 0; i < this.arrPreTrackObjects.length; ++i) {
            this.addTrackObject(this.arrPreTrackObjects[i]);
        }
        this.clearPreTrackObjects();
    },
    getTrackObjects: function () {
        return this.arrTrackObjects;
    },
    rotateTrackObjects: function (angle, e) {
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            this.arrTrackObjects[i].track(angle, e);
        }
    },
    trackNewShape: function (e, x, y) {
        this.arrTrackObjects[0].track(e, x, y);
    },
    trackMoveObjects: function (dx, dy) {
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            this.arrTrackObjects[i].track(dx, dy);
        }
    },
    trackAdjObject: function (x, y) {
        if (this.arrTrackObjects.length > 0) {
            this.arrTrackObjects[0].track(x, y);
        }
    },
    trackResizeObjects: function (kd1, kd2, e) {
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            this.arrTrackObjects[i].track(kd1, kd2, e);
        }
    },
    trackEnd: function () {
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            this.arrTrackObjects[i].trackEnd();
        }
    },
    drawSelect: function (drawingDocument) {
        this.State.drawSelection(drawingDocument);
    },
    DrawOnOverlay: function (overlay) {
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            this.arrTrackObjects[i].draw(overlay);
        }
    },
    drawTracks: function (overlay) {},
    hitToBoundsRect: function (x, y) {
        return false;
    }
};
function isRealObject(object) {
    return object !== null && typeof object === "object";
}
function isRealNumber(number) {
    return typeof number === "number" && !isNaN(number);
}
function isRealBool(bool) {
    return bool === true || bool === false;
}