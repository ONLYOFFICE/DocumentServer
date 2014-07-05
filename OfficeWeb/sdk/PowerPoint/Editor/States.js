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
 var STATES_ID_NULL = 0;
var STATES_ID_PRE_ROTATE = 1;
var STATES_ID_ROTATE = 2;
var STATES_ID_PRE_RESIZE = 3;
var STATES_ID_RESIZE = 4;
var STATES_ID_START_TRACK_NEW_SHAPE = 5;
var STATES_ID_BEGIN_TRACK_NEW_SHAPE = 6;
var STATES_ID_TRACK_NEW_SHAPE = 7;
var STATES_ID_PRE_MOVE = 8;
var STATES_ID_MOVE = 9;
var STATES_ID_PRE_CHANGE_ADJ = 16;
var STATES_ID_CHANGE_ADJ = 17;
var STATES_ID_GROUP = 18;
var STATES_ID_PRE_CHANGE_ADJ_IN_GROUP = 19;
var STATES_ID_CHANGE_ADJ_IN_GROUP = 20;
var STATES_ID_PRE_ROTATE_IN_GROUP = 21;
var STATES_ID_ROTATE_IN_GROUP = 22;
var STATES_ID_PRE_RESIZE_IN_GROUP = 23;
var STATES_ID_RESIZE_IN_GROUP = 24;
var STATES_ID_PRE_MOVE_IN_GROUP = 25;
var STATES_ID_MOVE_IN_GROUP = 32;
var STATES_ID_SPLINE_BEZIER = 33;
var STATES_ID_SPLINE_BEZIER33 = 34;
var STATES_ID_SPLINE_BEZIER2 = 35;
var STATES_ID_SPLINE_BEZIER3 = 36;
var STATES_ID_SPLINE_BEZIER4 = 37;
var STATES_ID_SPLINE_BEZIER5 = 38;
var STATES_ID_POLY_LINE_ADD = 39;
var STATES_ID_POLY_LINE_ADD2 = 40;
var STATES_ID_ADD_PPOLY_LINE2 = 41;
var STATES_ID_ADD_PPOLY_LINE22 = 48;
var STATES_ID_ADD_PPOLY_LINE23 = 49;
var STATES_ID_TEXT_ADD = 50;
var STATES_ID_PRE_MOVE_INTERNAL_CHART_OBJECT = 51;
var STATES_ID_MOVE_INTERNAL_CHART_OBJECT = 52;
var STATES_ID_CHART = 53;
var STATES_ID_CHART_TEXT_ADD = 54;
var STATES_ID_TEXT_ADD_IN_GROUP = 55;
var STATES_ID_PRE_MOVE_COMMENT = 56;
var STATES_ID_MOVE_COMMENT = 57;
var STATES_ID_PRE_MOVE_INTERNAL_CHART_OBJECT_GROUP = 64;
var STATES_ID_MOVE_INTERNAL_CHART_OBJECT_GROUP = 65;
var STATES_ID_CHART_GROUP = 66;
var STATES_ID_CHART_GROUP_TEXT_ADD = 67;
var SNAP_DISTANCE = 1.27;
function resetGroupChartSelection(state) {
    if (isRealObject(state)) {
        if (isRealObject(state.chart)) {
            state.chart.resetSelection();
        }
        if (isRealObject(state.group)) {
            state.group.resetSelection();
        }
    }
}
function resetChartSelection(state) {
    if (isRealObject(state)) {
        if (isRealObject(state.chart)) {
            state.chart.resetSelection();
        }
    }
}
function handleSelectedObjects(drawingObjects, drawingObjectsController, e, x, y) {
    var state = drawingObjectsController.State;
    var selected_objects = drawingObjectsController.selectedObjects;
    if (selected_objects.length === 1) {
        var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
        if (hit_to_adj.hit) {
            if (selected_objects[0].canChangeAdjustments()) {
                drawingObjectsController.clearPreTrackObjects();
                if (hit_to_adj.adjPolarFlag === false) {
                    drawingObjectsController.addPreTrackObject(new XYAdjustmentTrack(selected_objects[0], hit_to_adj.adjNum));
                } else {
                    drawingObjectsController.addPreTrackObject(new PolarAdjustmentTrack(selected_objects[0], hit_to_adj.adjNum));
                }
                drawingObjectsController.changeCurrentState(new PreChangeAdjState(drawingObjectsController, drawingObjects, selected_objects[0]));
            }
            resetGroupChartSelection(drawingObjectsController.State);
            return true;
        }
    }
    for (var i = selected_objects.length - 1; i > -1; --i) {
        var hit_to_handles = selected_objects[i].hitToHandles(x, y);
        if (hit_to_handles > -1) {
            if (hit_to_handles === 8) {
                if (!selected_objects[i].canRotate()) {
                    return false;
                }
                drawingObjectsController.clearPreTrackObjects();
                for (var j = 0; j < selected_objects.length; ++j) {
                    if (selected_objects[j].canRotate()) {
                        drawingObjectsController.addPreTrackObject(selected_objects[j].createRotateTrack());
                    }
                }
                drawingObjectsController.changeCurrentState(new PreRotateState(drawingObjectsController, drawingObjects, selected_objects[i]));
            } else {
                if (!selected_objects[i].canResize()) {
                    return;
                }
                drawingObjectsController.clearPreTrackObjects();
                var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                for (var j = 0; j < selected_objects.length; ++j) {
                    if (selected_objects[j].canResize()) {
                        drawingObjectsController.addPreTrackObject(selected_objects[j].createResizeTrack(card_direction));
                    }
                }
                drawingObjectsController.changeCurrentState(new PreResizeState(drawingObjectsController, drawingObjects, selected_objects[i], card_direction));
            }
            resetGroupChartSelection(drawingObjectsController.State);
            return true;
        }
    }
    for (i = selected_objects.length - 1; i > -1; --i) {
        if (selected_objects[i].hitInBoundingRect(x, y)) {
            if (!selected_objects[i].canMove()) {
                return false;
            }
            drawingObjectsController.clearPreTrackObjects();
            for (var j = 0; j < selected_objects.length; ++j) {
                drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
            }
            drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.ShiftKey, e.ctrl, selected_objects[i], true, false));
            resetGroupChartSelection(drawingObjectsController.State);
            return true;
        }
    }
    return false;
}
function handleShapeImage(drawing, drawingObjects, drawingObjectsController, e, x, y, handleState) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    var selected_objects = drawingObjectsController.selectedObjects;
    var old_text_object = drawingObjectsController.State.textObject;
    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
        drawingObjectsController.clearPreTrackObjects();
        var is_selected = drawing.selected;
        if (! (e.CtrlKey || e.ShiftKey) && !is_selected) {
            drawingObjectsController.resetSelection();
        }
        drawing.select(drawingObjectsController);
        if ((old_text_object !== drawing) && (isRealObject(old_text_object) && old_text_object.isEmptyPlaceholder() || drawing.isEmptyPlaceholder())) {
            editor.WordControl.m_oDrawingDocument.OnRecalculatePage(drawingObjects.num, drawingObjects);
            editor.WordControl.m_oDrawingDocument.OnEndRecalculate();
        }
        drawingObjects.OnUpdateOverlay();
        for (var j = 0; j < selected_objects.length; ++j) {
            drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
        }
        resetGroupChartSelection(drawingObjectsController.State);
        drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.ShiftKey, e.ctrl, drawing, is_selected, true));
        return true;
    } else {
        if (hit_in_text_rect) {
            if (e.Button !== g_mouse_button_right || drawingObjectsController.State === handleState || (drawingObjectsController.State.textObject !== drawing) || (e.Button === g_mouse_button_right && drawingObjectsController.State.textObject && drawingObjectsController.State.textObject === drawing && !(drawing.pointInSelectedText(x, y)))) {
                drawingObjectsController.resetSelection();
                drawing.select(drawingObjectsController);
                drawing.selectionSetStart(e, x, y);
                resetGroupChartSelection(drawingObjectsController.State);
                drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjects, drawing));
                if ((old_text_object !== drawing) && (isRealObject(old_text_object) && old_text_object.isEmptyPlaceholder() || drawing.isEmptyPlaceholder())) {
                    editor.WordControl.m_oDrawingDocument.OnRecalculatePage(drawingObjects.num, drawingObjects);
                    editor.WordControl.m_oDrawingDocument.OnEndRecalculate();
                }
                if (e.ClickCount < 2) {
                    drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                }
            }
            return true;
        }
    }
    return false;
}
function handleGroup(drawing, drawingObjects, drawingObjectsController, e, x, y, handleState) {
    var grouped_objects = drawing.getArrGraphicObjects();
    var selected_objects = drawingObjectsController.selectedObjects;
    for (var j = grouped_objects.length - 1; j > -1; --j) {
        var cur_grouped_object = grouped_objects[j];
        if (cur_grouped_object instanceof CShape || cur_grouped_object instanceof CImageShape || (typeof CChartAsGroup != "undefined" && !drawing.selected && cur_grouped_object instanceof CChartAsGroup)) {
            var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
            var hit_in_path = cur_grouped_object.hitInPath(x, y);
            var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
            if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                drawingObjectsController.clearPreTrackObjects();
                var is_selected = drawing.selected;
                if (! (e.CtrlKey || e.ShiftKey) && !is_selected) {
                    drawingObjectsController.resetSelection();
                }
                drawing.select(drawingObjectsController);
                drawingObjects.OnUpdateOverlay();
                for (var j = 0; j < selected_objects.length; ++j) {
                    drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                }
                resetGroupChartSelection(drawingObjectsController.State);
                drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.ShiftKey, e.ctrl, drawing, is_selected, true));
                return true;
            } else {
                if (hit_in_text_rect) {
                    drawingObjectsController.resetSelection();
                    cur_grouped_object.select(drawingObjectsController);
                    grouped_objects[j].select(cur_grouped_object);
                    grouped_objects[j].selectionSetStart(e, x, y);
                    resetGroupChartSelection(drawingObjectsController.State);
                    drawingObjectsController.changeCurrentState(new TextAddInGroup(drawingObjectsController, drawingObjects, drawing, grouped_objects[j]));
                    if (e.ClickCount < 2) {
                        grouped_objects[j].updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                    }
                    return true;
                }
            }
        } else {
            if (typeof CChartAsGroup != "undefined" && cur_grouped_object instanceof CChartAsGroup) {
                if (cur_grouped_object.hitInWorkArea(x, y)) {
                    if (!e.ShiftKey && !e.CtrlKey) {
                        var object_for_move_in_chart = null;
                        if (isRealObject(cur_grouped_object.chartTitle)) {
                            if (cur_grouped_object.chartTitle.hit(x, y)) {
                                object_for_move_in_chart = cur_grouped_object.chartTitle;
                            }
                        }
                        if (isRealObject(cur_grouped_object.hAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                            if (cur_grouped_object.hAxisTitle.hit(x, y)) {
                                object_for_move_in_chart = cur_grouped_object.hAxisTitle;
                            }
                        }
                        if (isRealObject(cur_grouped_object.vAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                            if (cur_grouped_object.vAxisTitle.hit(x, y)) {
                                object_for_move_in_chart = cur_grouped_object.vAxisTitle;
                            }
                        }
                        if (isRealObject(object_for_move_in_chart)) {
                            drawingObjectsController.resetSelection();
                            cur_grouped_object.select(drawingObjectsController);
                            object_for_move_in_chart.select();
                            drawingObjectsController.clearPreTrackObjects();
                            resetGroupChartSelection(drawingObjectsController.State);
                            drawingObjectsController.addPreTrackObject(new MoveTitleInChart(object_for_move_in_chart));
                            drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectGroupState(drawingObjectsController, drawingObjects, x, y, object_for_move_in_chart, drawing));
                            drawingObjects.OnUpdateOverlay();
                            return true;
                        }
                    }
                    drawingObjectsController.clearPreTrackObjects();
                    if (! (e.CtrlKey || e.ShiftKey)) {
                        drawingObjectsController.resetSelection();
                    }
                    drawing.select(drawingObjectsController);
                    drawingObjects.OnUpdateOverlay();
                    for (var j = 0; j < selected_objects.length; ++j) {
                        drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                    }
                    resetGroupChartSelection(drawingObjectsController.State);
                    drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.ShiftKey, e.ctrl, drawing, true, true));
                    return true;
                }
            }
        }
    }
    return false;
}
function handleChart(drawing, drawingObjects, drawingObjectsController, e, x, y, handleState) {
    if (drawing.hitInWorkArea(x, y)) {
        var selected_objects = drawingObjectsController.selectedObjects;
        if (!e.ShiftKey && !e.CtrlKey) {
            var object_for_move_in_chart = null;
            if (isRealObject(drawing.chartTitle)) {
                if (drawing.chartTitle.hit(x, y)) {
                    object_for_move_in_chart = drawing.chartTitle;
                }
            }
            if (isRealObject(drawing.hAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                if (drawing.hAxisTitle.hit(x, y)) {
                    object_for_move_in_chart = drawing.hAxisTitle;
                }
            }
            if (isRealObject(drawing.vAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                if (drawing.vAxisTitle.hit(x, y)) {
                    object_for_move_in_chart = drawing.vAxisTitle;
                }
            }
            if (isRealObject(object_for_move_in_chart)) {
                drawingObjectsController.resetSelection();
                drawing.select(drawingObjectsController);
                object_for_move_in_chart.select();
                drawingObjectsController.clearPreTrackObjects();
                drawingObjectsController.addPreTrackObject(new MoveTitleInChart(object_for_move_in_chart));
                resetGroupChartSelection(drawingObjectsController.State);
                drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(drawingObjectsController, drawingObjects, x, y, object_for_move_in_chart));
                drawingObjects.OnUpdateOverlay();
                return true;
            }
        }
        drawingObjectsController.clearPreTrackObjects();
        var is_selected = drawing.selected;
        if (! (e.CtrlKey || e.ShiftKey) && !is_selected) {
            drawingObjectsController.resetSelection();
        }
        drawing.select(drawingObjectsController);
        drawingObjects.OnUpdateOverlay();
        for (var j = 0; j < selected_objects.length; ++j) {
            drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
        }
        resetGroupChartSelection(drawingObjectsController.State);
        drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.ShiftKey, e.ctrl, drawing, is_selected, true));
        resetGroupChartSelection(drawingObjectsController.State);
        return true;
    }
    return false;
}
function handleTable(drawing, drawingObjects, drawingObjectsController, e, x, y, handleState) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_bounding_rect = drawing.hitInBoundingRect(x, y);
    if (hit_in_bounding_rect || hit_in_inner_area) {
        resetGroupChartSelection(drawingObjectsController.State);
        if (e.CtrlKey && drawingObjectsController.selectedObjects.length > 0) {
            var b_selected = drawing.selected;
            drawing.select(drawingObjectsController);
            for (var j = 0; j < drawingObjectsController.selectedObjects.length; ++j) {
                drawingObjectsController.addPreTrackObject(drawingObjectsController.selectedObjects[j].createMoveTrack());
            }
            drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.ShiftKey, e.CtrlKey, drawing, b_selected, true));
            drawingObjects.OnUpdateOverlay();
            return true;
        } else {
            drawingObjectsController.resetSelection();
            drawing.select(drawingObjectsController);
            if (! (e.Button === g_mouse_button_right) && (!drawing.isTableBorder(x, y) || editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props) === false)) {
                drawing.selectionSetStart(e, x, y);
                drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjects, drawing));
            } else {
                if (e.Button === g_mouse_button_right && drawingObjectsController.State.textObject && drawingObjectsController.State.textObject === drawing && !(drawing.pointInSelectedText(x, y))) {
                    drawing.selectionSetStart(e, x, y);
                    drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjects, drawing));
                }
            }
            drawingObjects.presentation.Document_UpdateSelectionState();
            drawingObjects.OnUpdateOverlay();
            return true;
        }
    }
    return false;
}
function handleShapeImageInGroup(drawing, drawingObjects, drawingObjectsController, group, e, x, y, handleState) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    var group_selected_objects = group.selectedObjects;
    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
        var is_selected = drawing.selected;
        if (! (e.CtrlKey || e.ShiftKey) && !is_selected) {
            group.resetSelection();
        }
        drawing.select(drawingObjectsController);
        drawingObjects.OnUpdateOverlay();
        for (var j = 0; j < group_selected_objects.length; ++j) {
            drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
        }
        resetChartSelection(drawingObjectsController.State);
        drawingObjectsController.changeCurrentState(new PreMoveInGroupState(drawingObjectsController, drawingObjects, group, x, y, e.ShiftKey, e.ctrl, drawing, is_selected));
        drawingObjects.OnUpdateOverlay();
        return true;
    } else {
        if (hit_in_text_rect) {
            drawingObjectsController.resetSelection();
            group.select(drawingObjectsController);
            drawing.select(group);
            drawing.selectionSetStart(e, x, y);
            resetChartSelection(drawingObjectsController.State);
            drawingObjectsController.changeCurrentState(new TextAddInGroup(drawingObjectsController, drawingObjects, group, drawing));
            if (e.ClickCount < 2) {
                drawing.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
            }
            return true;
        }
    }
    return false;
}
function handleSelectedOjectsGroup(drawingObjects, drawingObjectsController, group, e, x, y) {
    var group_selected_objects = group.selectedObjects;
    if (group_selected_objects.length === 1) {
        var hit_to_adj = group_selected_objects[0].hitToAdjustment(x, y);
        if (hit_to_adj.hit) {
            if (group_selected_objects[0].canChangeAdjustments()) {
                if (hit_to_adj.adjPolarFlag === false) {
                    drawingObjectsController.addPreTrackObject(new XYAdjustmentTrack(group_selected_objects[0], hit_to_adj.adjNum));
                } else {
                    drawingObjectsController.addPreTrackObject(new PolarAdjustmentTrack(group_selected_objects[0], hit_to_adj.adjNum));
                }
                drawingObjectsController.changeCurrentState(new PreChangeAdjInGroupState(drawingObjectsController, drawingObjects, group));
            }
            return true;
        }
    }
    for (var i = group_selected_objects.length - 1; i > -1; --i) {
        var hit_to_handles = group_selected_objects[i].hitToHandles(x, y);
        if (hit_to_handles > -1) {
            if (hit_to_handles === 8) {
                if (!group_selected_objects[i].canRotate()) {
                    return false;
                }
                for (var j = 0; j < group_selected_objects.length; ++j) {
                    drawingObjectsController.addPreTrackObject(group_selected_objects[j].createRotateInGroupTrack());
                }
                drawingObjectsController.changeCurrentState(new PreRotateInGroupState(drawingObjectsController, drawingObjects, group, group_selected_objects[i]));
            } else {
                if (!group_selected_objects[i].canResize()) {
                    return true;
                }
                var card_direction = group_selected_objects[i].getCardDirectionByNum(hit_to_handles);
                for (var j = 0; j < group_selected_objects.length; ++j) {
                    drawingObjectsController.addPreTrackObject(group_selected_objects[j].createResizeInGroupTrack(card_direction));
                }
                drawingObjectsController.changeCurrentState(new PreResizeInGroupState(drawingObjectsController, drawingObjects, group, group_selected_objects[i], card_direction));
            }
            return true;
        }
    }
    var hit_to_handles = group.hitToHandles(x, y);
    if (hit_to_handles > -1) {
        if (hit_to_handles === 8) {
            if (!group.canRotate()) {
                return false;
            }
            resetChartSelection(drawingObjectsController.State);
            group.resetSelection(drawingObjectsController);
            drawingObjectsController.addPreTrackObject(group.createRotateTrack());
            drawingObjectsController.changeCurrentState(new PreRotateState(drawingObjectsController, drawingObjects, group));
            return true;
        } else {
            if (!group.canResize()) {
                return false;
            }
            group.resetSelection(drawingObjectsController);
            var card_direction = group.getCardDirectionByNum(hit_to_handles);
            drawingObjectsController.addPreTrackObject(group.createResizeTrack(card_direction));
            drawingObjectsController.changeCurrentState(new PreResizeState(drawingObjectsController, drawingObjects, group, card_direction));
            resetChartSelection(drawingObjectsController.State);
            return true;
        }
    }
    for (i = group_selected_objects.length - 1; i > -1; --i) {
        if (group_selected_objects[i].hitInBoundingRect(x, y)) {
            drawingObjectsController.clearPreTrackObjects();
            for (var j = 0; j < group_selected_objects.length; ++j) {
                drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
            }
            resetChartSelection(drawingObjectsController.State);
            drawingObjectsController.changeCurrentState(new PreMoveInGroupState(drawingObjectsController, drawingObjects, group, x, y, e.ShiftKey, e.CtrlKey, group_selected_objects[i], true));
            return true;
        }
    }
    if (group.hitInBoundingRect(x, y)) {
        resetChartSelection(drawingObjectsController.State);
        group.resetSelection();
        drawingObjectsController.addPreTrackObject(group.createMoveTrack());
        drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.ShiftKey, e.CtrlKey, group, true, false));
        return true;
    }
    return false;
}
function handleChartGroup(drawing, drawingObjects, drawingObjectsController, group, e, x, y) {
    if (drawing.hitInWorkArea(x, y)) {
        var selected_objects = group.selectedObjects;
        if (!e.ShiftKey && !e.CtrlKey) {
            var object_for_move_in_chart = null;
            if (isRealObject(drawing.chartTitle)) {
                if (drawing.chartTitle.hit(x, y)) {
                    object_for_move_in_chart = drawing.chartTitle;
                }
            }
            if (isRealObject(drawing.hAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                if (drawing.hAxisTitle.hit(x, y)) {
                    object_for_move_in_chart = drawing.hAxisTitle;
                }
            }
            if (isRealObject(drawing.vAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                if (drawing.vAxisTitle.hit(x, y)) {
                    object_for_move_in_chart = drawing.vAxisTitle;
                }
            }
            if (isRealObject(object_for_move_in_chart)) {
                resetChartSelection(drawingObjectsController.State);
                drawingObjectsController.resetSelection();
                drawing.resetSelection();
                drawing.select(drawingObjectsController);
                object_for_move_in_chart.select();
                drawingObjectsController.clearPreTrackObjects();
                drawingObjectsController.addPreTrackObject(new MoveTitleInChart(object_for_move_in_chart));
                drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectGroupState(drawingObjectsController, drawingObjects, x, y, object_for_move_in_chart, group));
                drawingObjects.OnUpdateOverlay();
                return true;
            }
        }
        drawingObjectsController.clearPreTrackObjects();
        var is_selected = drawing.selected;
        if (! (e.CtrlKey || e.ShiftKey) && !is_selected) {
            group.resetSelection();
        }
        drawing.resetSelection();
        resetChartSelection(drawingObjectsController.State);
        drawing.select(drawingObjectsController);
        for (var j = 0; j < selected_objects.length; ++j) {
            drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveInGroupTrack());
        }
        drawingObjectsController.changeCurrentState(new PreMoveInGroupState(drawingObjectsController, drawingObjects, group, x, y, e.ShiftKey, e.CtrlKey, drawing, is_selected));
        drawingObjects.OnUpdateOverlay();
        return true;
    }
    return false;
}
function NullState(drawingObjectsController, drawingObjects) {
    this.id = STATES_ID_NULL;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function (e, x, y) {
        this.drawingObjectsController.hideComment();
        for (var i = drawingObjects.slideComments.comments.length - 1; i > -1; --i) {
            drawingObjects.slideComments.comments[i].selected = false;
        }
        for (var i = drawingObjects.slideComments.comments.length - 1; i > -1; --i) {
            if (drawingObjects.slideComments.comments[i].hit(x, y)) {
                drawingObjects.slideComments.comments[i].selected = true;
                this.drawingObjectsController.addPreTrackObject(new MoveComment(drawingObjects.slideComments.comments[i]));
                this.drawingObjectsController.changeCurrentState(new PreMoveCommentState(this.drawingObjectsController, this.drawingObjects, x, y));
                editor.WordControl.m_oDrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
                editor.WordControl.m_oDrawingDocument.OnEndRecalculate();
                return;
            }
        }
        if (handleSelectedObjects(this.drawingObjects, this.drawingObjectsController, e, x, y)) {
            return;
        }
        var selected_objects = this.drawingObjectsController.selectedObjects;
        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for (i = arr_drawing_objects.length - 1; i > -1; --i) {
            var cur_drawing_base = arr_drawing_objects[i];
            var cur_drawing = cur_drawing_base;
            if (cur_drawing.isShape() || cur_drawing.isImage()) {
                if (handleShapeImage(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                    return;
                }
            } else {
                if (cur_drawing.isGroup()) {
                    if (handleGroup(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                        return;
                    }
                } else {
                    if (cur_drawing.isChart()) {
                        if (handleChart(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                            return;
                        }
                    } else {
                        if (cur_drawing.isTable && cur_drawing.isTable()) {
                            if (handleTable(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                                return;
                            }
                        }
                    }
                }
            }
        }
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.stX = x;
        this.drawingObjectsController.stY = y;
        this.drawingObjectsController.selectionRect = {
            x: x,
            y: y,
            w: 0,
            h: 0
        };
        this.drawingObjectsController.changeCurrentState(new TrackSelectionRect(this.drawingObjectsController, this.drawingObjects));
        editor.WordControl.m_oDrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        editor.WordControl.m_oDrawingDocument.OnEndRecalculate();
        this.drawingObjects.OnUpdateOverlay();
        editor.sync_BeginCatchSelectedElements();
        editor.sync_slidePropCallback(drawingObjects);
        editor.sync_EndCatchSelectedElements();
    };
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.Update_CursorType(x, y, e);
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if (selected_objects.length === 1 && selected_objects[0].isShape()) {
            if (isRealNumber(e.charCode)) {
                selected_objects[0].paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, selected_objects[0]));
                this.drawingObjects.showDrawingObjects(true);
                this.drawingObjects.OnUpdateOverlay();
            }
        }
    };
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if (selected_objects.length === 1) {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if (hit_to_adj.hit) {
                if (selected_objects[0].canChangeAdjustments()) {
                    return {
                        objectId: selected_objects[0].Id,
                        cursorType: "crosshair"
                    };
                }
            }
        }
        for (var i = selected_objects.length - 1; i > -1; --i) {
            var hit_to_handles = selected_objects[i].hitToHandles(x, y);
            if (hit_to_handles > -1) {
                if (hit_to_handles === 8) {
                    if (!selected_objects[i].canRotate()) {
                        return null;
                    }
                    return {
                        objectId: selected_objects[i].Id,
                        cursorType: "crosshair"
                    };
                } else {
                    if (!selected_objects[i].canResize()) {
                        return null;
                    }
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    return {
                        objectId: selected_objects[i].Id,
                        cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                    };
                }
            }
        }
        for (i = selected_objects.length - 1; i > -1; --i) {
            if (selected_objects[i].hitInBoundingRect(x, y)) {
                if (!selected_objects[i].canMove()) {
                    return null;
                }
                return {
                    objectId: selected_objects[i].Id,
                    cursorType: "move"
                };
            }
        }
        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for (i = arr_drawing_objects.length - 1; i > -1; --i) {
            var cur_drawing_base = arr_drawing_objects[i];
            if (cur_drawing_base.isGraphicObject()) {
                var cur_drawing = cur_drawing_base.graphicObject;
                if (cur_drawing.isShape() || cur_drawing.isImage()) {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                        return {
                            objectId: cur_drawing.Id,
                            cursorType: "move"
                        };
                    } else {
                        if (hit_in_text_rect) {
                            return {
                                objectId: cur_drawing.Id,
                                cursorType: "move"
                            };
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
                                return {
                                    objectId: cur_drawing.Id,
                                    cursorType: "move"
                                };
                            } else {
                                if (hit_in_text_rect) {
                                    return {
                                        objectId: cur_drawing.Id,
                                        cursorType: "text"
                                    };
                                }
                            }
                        }
                    } else {
                        if (cur_drawing.isChart()) {
                            if (cur_drawing.hitInWorkArea(x, y)) {
                                return {
                                    objectId: cur_drawing.Id,
                                    cursorType: "move"
                                };
                            }
                        }
                    }
                }
            }
        }
        return null;
    };
    this.setCellBackgroundColor = function (color) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellBackgroundColor === "function") {
                selected_objects[i].setCellBackgroundColor(color);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellFontName = function (fontName) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllFontName === "function") {
                selected_objects[i].setCellAllFontName(fontName);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellFontSize = function (fontSize) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllFontSize === "function") {
                selected_objects[i].setCellAllFontSize(fontSize);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellBold = function (isBold) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllBold === "function") {
                selected_objects[i].setCellAllBold(isBold);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellItalic = function (isItalic) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllItalic === "function") {
                selected_objects[i].setCellAllItalic(isItalic);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellUnderline = function (isUnderline) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllUnderline === "function") {
                selected_objects[i].setCellAllUnderline(isUnderline);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellStrikeout = function (isStrikeout) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllStrikeout === "function") {
                selected_objects[i].setCellAllStrikeout(isStrikeout);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellSubscript = function (isSubscript) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllSubscript === "function") {
                selected_objects[i].setCellAllSubscript(isSubscript);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellSuperscript = function (isSuperscript) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllSuperscript === "function") {
                selected_objects[i].setCellAllSuperscript(isSuperscript);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellAlign = function (align) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllAlign === "function") {
                selected_objects[i].setCellAllAlign(align);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellVertAlign = function (align) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllVertAlign === "function") {
                selected_objects[i].setCellAllVertAlign(align);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellTextColor = function (color) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllTextColor === "function") {
                selected_objects[i].setCellAllTextColor(color);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.setCellAngle = function (angle) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].setCellAllAngle === "function") {
                selected_objects[i].setCellAllAngle(angle);
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.increaseFontSize = function () {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].increaseAllFontSize === "function") {
                selected_objects[i].increaseAllFontSize();
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.decreaseFontSize = function () {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = 0; i < selected_objects.length; ++i) {
            if (typeof selected_objects[i].decreaseAllFontSize === "function") {
                selected_objects[i].decreaseAllFontSize();
            }
        }
        this.drawingObjects.showDrawingObjects(true);
    };
    this.insertHyperlink = function (options) {
        if (typeof this.textObject.insertHyperlink === "function") {
            this.textObject.insertHyperlink(options);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
}
function TrackSelectionRect(drawingObjectsController, drawingObjects) {
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function (e, x, y) {
        return;
    };
    this.onMouseMove = function (e, x, y) {
        drawingObjectsController.selectionRect = {
            x: drawingObjectsController.stX,
            y: drawingObjectsController.stY,
            w: x - drawingObjectsController.stX,
            h: y - drawingObjectsController.stY
        };
        editor.WordControl.m_oDrawingDocument.m_oWordControl.OnUpdateOverlay(true);
    };
    this.onMouseUp = function (e, x, y) {
        var _glyph_index;
        var _glyphs_array = this.drawingObjects.cSld.spTree;
        var _glyph, _glyph_transform;
        var _xlt, _ylt, _xrt, _yrt, _xrb, _yrb, _xlb, _ylb;
        var _rect_l = Math.min(this.drawingObjectsController.selectionRect.x, this.drawingObjectsController.selectionRect.x + this.drawingObjectsController.selectionRect.w);
        var _rect_r = Math.max(this.drawingObjectsController.selectionRect.x, this.drawingObjectsController.selectionRect.x + this.drawingObjectsController.selectionRect.w);
        var _rect_t = Math.min(this.drawingObjectsController.selectionRect.y, this.drawingObjectsController.selectionRect.y + this.drawingObjectsController.selectionRect.h);
        var _rect_b = Math.max(this.drawingObjectsController.selectionRect.y, this.drawingObjectsController.selectionRect.y + this.drawingObjectsController.selectionRect.h);
        for (_glyph_index = 0; _glyph_index < _glyphs_array.length; ++_glyph_index) {
            _glyph = _glyphs_array[_glyph_index];
            _glyph_transform = _glyph.transform;
            _xlt = _glyph_transform.TransformPointX(0, 0);
            _ylt = _glyph_transform.TransformPointY(0, 0);
            _xrt = _glyph_transform.TransformPointX(_glyph.extX, 0);
            _yrt = _glyph_transform.TransformPointY(_glyph.extX, 0);
            _xrb = _glyph_transform.TransformPointX(_glyph.extX, _glyph.extY);
            _yrb = _glyph_transform.TransformPointY(_glyph.extX, _glyph.extY);
            _xlb = _glyph_transform.TransformPointX(0, _glyph.extY);
            _ylb = _glyph_transform.TransformPointY(0, _glyph.extY);
            if ((_xlb >= _rect_l && _xlb <= _rect_r) && (_xrb >= _rect_l && _xrb <= _rect_r) && (_xlt >= _rect_l && _xlt <= _rect_r) && (_xrt >= _rect_l && _xrt <= _rect_r) && (_ylb >= _rect_t && _ylb <= _rect_b) && (_yrb >= _rect_t && _yrb <= _rect_b) && (_ylt >= _rect_t && _ylt <= _rect_b) && (_yrt >= _rect_t && _yrt <= _rect_b)) {
                _glyph.select(this.drawingObjectsController);
            }
        }
        this.drawingObjectsController.selectionRect = null;
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        editor.WordControl.m_oDrawingDocument.m_oWordControl.OnUpdateOverlay(true);
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    };
    this.drawSelection = function (drawingDocument) {
        var rect = this.drawingObjectsController.selectionRect;
        drawingDocument.DrawTrackSelectShapes(rect.x, rect.y, rect.w, rect.h);
    };
}
function PreMoveCommentState(drawingObjectsController, drawingObjects, startX, startY) {
    this.id = STATES_ID_PRE_MOVE_COMMENT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        if (this.startX === x && this.startY === y) {
            return;
        }
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new MoveCommentState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };
    this.onMouseUp = function (e, x, y) {
        var Coords = editor.WordControl.m_oDrawingDocument.ConvertCoordsToCursorWR_Comment(this.drawingObjectsController.arrPreTrackObjects[0].comment.x, this.drawingObjectsController.arrPreTrackObjects[0].comment.y, this.drawingObjects.num);
        this.drawingObjectsController.showComment(this.drawingObjectsController.arrPreTrackObjects[0].comment.Get_Id(), Coords.X, Coords.Y);
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: "move"
        };
    };
}
function MoveCommentState(drawingObjectsController, drawingObjects, startX, startY) {
    this.id = STATES_ID_MOVE_COMMENT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjectsController.trackMoveObjects(dx, dy);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_MoveComment, this.drawingObjectsController.arrTrackObjects[0].comment.Get_Id()) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: "move"
        };
    };
}
function PreMoveInternalChartObjectState(drawingObjectsController, drawingObjects, startX, startY, chartElement) {
    this.id = STATES_ID_PRE_MOVE_INTERNAL_CHART_OBJECT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.chartElement = chartElement;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new MoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, this.chartElement));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ChartState(this.drawingObjectsController, this.drawingObjects, this.chartElement.chartGroup));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.chartGroup.transform, 0, 0, this.chartElement.chartGroup.extX, this.chartElement.chartGroup.extY, false);
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.transform, 0, 0, this.chartElement.extX, this.chartElement.extY, false);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectsId: this.chartElement.chartGroup.Id,
            cursorType: "move"
        };
    };
}
function MoveInternalChartObjectState(drawingObjectsController, drawingObjects, startX, startY, chartElement) {
    this.id = STATES_ID_MOVE_INTERNAL_CHART_OBJECT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.chartElement = chartElement;
    this.chart = chartElement.chartGroup;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjectsController.trackMoveObjects(dx, dy);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            editor.WordControl.m_oLogicDocument.Recalculate();
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new ChartState(this.drawingObjectsController, this.drawingObjects, this.chartElement.chartGroup));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.chartGroup.transform, 0, 0, this.chartElement.chartGroup.extX, this.chartElement.chartGroup.extY, false);
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.transform, 0, 0, this.chartElement.extX, this.chartElement.extY, false);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectsId: this.chartElement.chartGroup.Id,
            cursorType: "move"
        };
    };
}
function PreMoveInternalChartObjectGroupState(drawingObjectsController, drawingObjects, startX, startY, chartElement, group) {
    this.id = STATES_ID_PRE_MOVE_INTERNAL_CHART_OBJECT_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.chartElement = chartElement;
    this.group = group;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new MoveInternalChartObjectGroupState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, this.chartElement, this.group));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ChartGroupState(this.drawingObjectsController, this.drawingObjects, this.chartElement.chartGroup, this.group));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.transform, 0, 0, this.group.extX, this.group.extY, this.group.canRotate());
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.chartElement.chartGroup.transform, 0, 0, this.chartElement.chartGroup.extX, this.chartElement.chartGroup.extY, false);
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.transform, 0, 0, this.chartElement.extX, this.chartElement.extY, false);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectsId: this.chartElement.chartGroup.Id,
            cursorType: "move"
        };
    };
}
function MoveInternalChartObjectGroupState(drawingObjectsController, drawingObjects, startX, startY, chartElement, group) {
    this.id = STATES_ID_MOVE_INTERNAL_CHART_OBJECT_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.chartElement = chartElement;
    this.chart = chartElement.chartGroup;
    this.group = group;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjectsController.trackMoveObjects(dx, dy);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            editor.WordControl.m_oLogicDocument.Recalculate();
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new ChartGroupState(this.drawingObjectsController, this.drawingObjects, this.chartElement.chartGroup, this.group));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.transform, 0, 0, this.group.extX, this.group.extY, this.group.canRotate());
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.chartGroup.transform, 0, 0, this.chartElement.chartGroup.extX, this.chartElement.chartGroup.extY, false);
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chartElement.transform, 0, 0, this.chartElement.extX, this.chartElement.extY, false);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectsId: this.chartElement.chartGroup.Id,
            cursorType: "move"
        };
    };
}
function ChartState(drawingObjectsController, drawingObjects, chart) {
    this.id = STATES_ID_CHART;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.chart = chart;
    this.onMouseDown = function (e, x, y) {
        var titles = [];
        titles.push(this.chart.chartTitle);
        titles.push(this.chart.hAxisTitle);
        titles.push(this.chart.vAxisTitle);
        if (!e.CtrlKey) {
            for (var i = 0; i < titles.length; ++i) {
                if (isRealObject(titles[i]) && titles[i].selected && titles[i].hitInBoundingRect(x, y)) {
                    var title = titles[i];
                    for (var j = 0; j < titles.length; ++j) {
                        if (isRealObject(titles[j])) {
                            titles[j].deselect();
                        }
                    }
                    title.select();
                    this.drawingObjectsController.clearPreTrackObjects();
                    this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                    this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, x, y, title));
                    this.drawingObjectsController.updateSelectionState();
                    return;
                }
            }
        }
        if (this.chart.canResize()) {
            var hit_to_handles = this.chart.hitToHandles(x, y);
            if (hit_to_handles > -1 && hit_to_handles < 8) {
                for (var j = 0; j < titles.length; ++j) {
                    if (isRealObject(titles[j])) {
                        titles[j].deselect();
                    }
                }
                this.drawingObjectsController.clearPreTrackObjects();
                var card_direction = this.chart.getCardDirectionByNum(hit_to_handles);
                this.drawingObjectsController.addPreTrackObject(this.chart.createResizeTrack(card_direction));
                this.drawingObjectsController.changeCurrentState(new PreResizeState(this.drawingObjectsController, this.drawingObjects, this.chart, card_direction));
                this.drawingObjectsController.updateSelectionState();
                return;
            }
        }
        if (this.chart.hitInBoundingRect(x, y)) {
            for (var j = 0; j < titles.length; ++j) {
                if (isRealObject(titles[j])) {
                    titles[j].deselect();
                }
            }
            this.drawingObjectsController.clearPreTrackObjects();
            this.drawingObjectsController.addPreTrackObject(this.chart.createMoveTrack());
            this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.ShiftKey, e.CtrlKey, this.chart, true, false));
            this.drawingObjectsController.updateSelectionState();
            return;
        }
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = drawing_bases.length - 1; i > -1; --i) {
            var cur_drawing_base = drawing_bases[i];
            var cur_drawing = cur_drawing_base;
            if (cur_drawing instanceof CShape || cur_drawing instanceof CImageShape) {
                if (handleShapeImage(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                    return;
                }
            } else {
                if (cur_drawing instanceof CGroupShape) {
                    if (handleGroup(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                        return;
                    }
                } else {
                    if (cur_drawing instanceof CGraphicFrame) {
                        if (handleTable(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                            return;
                        }
                    } else {
                        if (cur_drawing.isChart()) {
                            if (cur_drawing === this.chart) {
                                for (var j = 0; j < titles.length; ++j) {
                                    title = titles[j];
                                    if (isRealObject(title)) {
                                        if (!title.selected) {
                                            if (title.hit(x, y)) {
                                                this.chart.resetSelection();
                                                title.select();
                                                this.drawingObjectsController.clearPreTrackObjects();
                                                this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                                                this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, x, y, title));
                                                this.drawingObjectsController.updateSelectionState();
                                                return;
                                            }
                                        } else {
                                            if (title.hit(x, y)) {
                                                if (title.hitInTextRect(x, y)) {
                                                    title.selectionSetStart(e, x, y);
                                                    this.drawingObjectsController.changeCurrentState(new ChartTextAdd(this.drawingObjectsController, this.drawingObjects, this.chart, title));
                                                    if (e.ClickCount < 2) {
                                                        title.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                                                    }
                                                    return;
                                                } else {
                                                    this.drawingObjectsController.clearPreTrackObjects();
                                                    this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                                                    this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(this.drawingObjectsController, this.drawingObjects, x, y, title));
                                                    this.drawingObjectsController.updateSelectionState();
                                                }
                                                return;
                                            }
                                        }
                                    }
                                }
                                if (cur_drawing.hitInWorkArea(x, y)) {
                                    this.drawingObjectsController.clearPreTrackObjects();
                                    var is_selected = cur_drawing.selected;
                                    this.chart.resetSelection();
                                    if (! (e.CtrlKey || e.ShiftKey) && !is_selected) {
                                        this.drawingObjectsController.resetSelection();
                                    }
                                    cur_drawing.select(this.drawingObjectsController);
                                    for (var j = 0; j < selected_objects.length; ++j) {
                                        this.drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
                                    }
                                    this.drawingObjectsController.changeCurrentState(new PreMoveState(this.drawingObjectsController, this.drawingObjects, x, y, e.ShiftKey, e.ctrl, cur_drawing, is_selected, true));
                                    this.drawingObjectsController.updateSelectionState();
                                    return;
                                }
                            } else {
                                if (handleChart(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.chart.resetSelection(this.drawingObjectsController);
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjectsController.updateSelectionState();
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        var selected_title;
        if (this.chart.chartTitle && this.chart.chartTitle.selected) {
            selected_title = this.chart.chartTitle;
        } else {
            if (this.chart.hAxisTitle && this.chart.hAxisTitle.selected) {
                selected_title = this.chart.hAxisTitle;
            } else {
                if (this.chart.vAxisTitle && this.chart.vAxisTitle.selected) {
                    selected_title = this.chart.vAxisTitle;
                }
            }
        }
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.chart.transform, 0, 0, this.chart.extX, this.chart.extY, false);
        if (selected_title) {
            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, selected_title.transform, 0, 0, selected_title.extX, selected_title.extY, false);
        }
    };
    this.isPointInDrawingObjects = function (x, y) {
        var titles = [];
        titles.push(this.chart.chartTitle);
        titles.push(this.chart.hAxisTitle);
        titles.push(this.chart.vAxisTitle);
        if (
        /*e.CtrlKey*/
        true) {
            for (var i = 0; i < titles.length; ++i) {
                if (isRealObject(titles[i]) && titles[i].selected && titles[i].hitInBoundingRect(x, y)) {
                    return {
                        objectId: this.chart.Id,
                        cursorType: "move"
                    };
                }
            }
        }
        if (this.chart.canResize()) {
            var hit_to_handles = this.chart.hitToHandles(x, y);
            if (hit_to_handles > -1 && hit_to_handles < 8) {
                var card_direction = this.chart.getCardDirectionByNum(hit_to_handles);
                return {
                    objectId: this.chart.Id,
                    cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                };
            }
        }
        if (this.chart.hitInBoundingRect(x, y)) {
            return {
                objectId: this.chart.Id,
                cursorType: "move"
            };
        }
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = drawing_bases.length - 1; i > -1; --i) {
            var cur_drawing_base = drawing_bases[i];
            if (cur_drawing_base.isGraphicObject()) {
                var cur_drawing = cur_drawing_base.graphicObject;
                if (cur_drawing.isShape() || cur_drawing.isImage()) {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                        return {
                            objectId: cur_drawing.Id,
                            cursorType: "move"
                        };
                    } else {
                        if (hit_in_text_rect) {
                            return {
                                objectId: cur_drawing.Id,
                                cursorType: "move"
                            };
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
                                return {
                                    objectId: cur_drawing.Id,
                                    cursorType: "move"
                                };
                            } else {
                                if (hit_in_text_rect) {
                                    return {
                                        objectId: cur_drawing.Id,
                                        cursorType: "move"
                                    };
                                }
                            }
                        }
                    } else {
                        if (cur_drawing.isChart()) {
                            if (cur_drawing === this.chart) {
                                for (var j = 0; j < titles.length; ++j) {
                                    var title = titles[j];
                                    if (isRealObject(title)) {
                                        if (!title.selected) {
                                            if (title.hit(x, y)) {
                                                return {
                                                    objectId: this.chart.Id,
                                                    cursorType: "move"
                                                };
                                            }
                                        } else {
                                            if (title.hit(x, y)) {
                                                if (title.hitInTextRect(x, y)) {
                                                    return {
                                                        objectId: this.chart.Id,
                                                        cursorType: "move"
                                                    };
                                                } else {
                                                    return {
                                                        objectId: this.chart.Id,
                                                        cursorType: "move"
                                                    };
                                                }
                                            }
                                        }
                                    }
                                }
                                if (cur_drawing.hitInWorkArea(x, y)) {
                                    return {
                                        objectId: this.chart.Id,
                                        cursorType: "move"
                                    };
                                }
                            } else {
                                if (cur_drawing.hitInWorkArea(x, y)) {
                                    if (!e.ShiftKey && !e.CtrlKey) {
                                        if (isRealObject(cur_drawing.chartLegend)) {}
                                        var object_for_move_in_chart = null;
                                        if (isRealObject(cur_drawing.chartTitle)) {
                                            if (cur_drawing.chartTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.chartTitle;
                                            }
                                        }
                                        if (isRealObject(cur_drawing.hAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                                            if (cur_drawing.hAxisTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.hAxisTitle;
                                            }
                                        }
                                        if (isRealObject(cur_drawing.vAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                                            if (cur_drawing.vAxisTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.vAxisTitle;
                                            }
                                        }
                                        if (isRealObject(object_for_move_in_chart)) {
                                            return {
                                                objectId: this.chart.Id,
                                                cursorType: "move"
                                            };
                                        }
                                        return {
                                            objectId: this.chart.Id,
                                            cursorType: "move"
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    };
}
function ChartTextAdd(drawingObjectsController, drawingObjects, chart, textObject) {
    this.id = STATES_ID_CHART_TEXT_ADD;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.textObject = textObject;
    this.chartState = new ChartState(drawingObjectsController, drawingObjects, chart);
    this.chart = chart;
    this.onMouseDown = function (e, x, y) {
        this.chartState.onMouseDown(e, x, y);
        if (this.drawingObjectsController.State.id !== STATES_ID_CHART_TEXT_ADD || this.drawingObjectsController.State.textObject !== this.textObject) {
            this.chart.recalculate();
            this.drawingObjectsController.updateSelectionState();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (e.IsLocked) {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.onMouseUp = function (e, x, y) {
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
    };
    this.onKeyDown = function (e) {
        var b_prevent_default = false;
        switch (e.keyCode) {
        case 8:
            b_prevent_default = true;
        }
        if (b_prevent_default) {
            e.preventDefault();
        }
    };
    this.onKeyPress = function (e) {
        this.textObject.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
        this.drawingObjects.showDrawingObjects(true);
    };
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.textObject.transform, 0, 0, this.textObject.extX, this.textObject.extY, false);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return this.chartState.isPointInDrawingObjects(x, y);
    };
}
function ChartGroupState(drawingObjectsController, drawingObjects, chart, group) {
    this.id = STATES_ID_CHART_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.chart = chart;
    this.group = group;
    this.onMouseDown = function (e, x, y) {
        var titles = [];
        titles.push(this.chart.chartTitle);
        titles.push(this.chart.hAxisTitle);
        titles.push(this.chart.vAxisTitle);
        if (!e.CtrlKey) {
            for (var i = 0; i < titles.length; ++i) {
                if (isRealObject(titles[i]) && titles[i].selected && titles[i].hitInBoundingRect(x, y)) {
                    var title = titles[i];
                    for (var j = 0; j < titles.length; ++j) {
                        if (isRealObject(titles[j])) {
                            titles[j].deselect();
                        }
                    }
                    title.select();
                    this.drawingObjectsController.clearPreTrackObjects();
                    this.drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                    this.drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectGroupState(this.drawingObjectsController, this.drawingObjects, x, y, title, this.group));
                    this.drawingObjectsController.updateSelectionState();
                    return;
                }
            }
        }
        var group_selected_objects = this.group.selectedObjects;
        if (handleSelectedOjectsGroup(this.drawingObjects, this.drawingObjectsController, this.group, e, x, y)) {
            return;
        }
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (i = drawing_bases.length - 1; i > -1; --i) {
            var cur_drawing_base = drawing_bases[i];
            var cur_drawing = cur_drawing_base;
            if (cur_drawing instanceof CShape || cur_drawing instanceof CImageShape) {
                if (handleShapeImage(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y)) {
                    return;
                }
            } else {
                if (cur_drawing.isTable && cur_drawing.isTable()) {
                    if (handleTable(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                        return;
                    }
                } else {
                    if (typeof CChartAsGroup != "undefined" && cur_drawing instanceof CChartAsGroup) {
                        if (handleChart(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                            return;
                        }
                    } else {
                        if (cur_drawing instanceof CGroupShape) {
                            if (this.group === cur_drawing) {
                                var arr_graphic_objects = this.group.getArrGraphicObjects();
                                for (var s = arr_graphic_objects.length - 1; s > -1; --s) {
                                    var cur_grouped_object = arr_graphic_objects[s];
                                    if (cur_grouped_object instanceof CShape || cur_grouped_object instanceof CImageShape || cur_grouped_object instanceof CGraphicFrame) {
                                        if (handleShapeImageInGroup(cur_grouped_object, this.drawingObjects, this.drawingObjectsController, this.group, e, x, y, this)) {
                                            return;
                                        }
                                    } else {
                                        if (typeof CChartAsGroup != "undefined" && cur_grouped_object instanceof CChartAsGroup) {
                                            if (cur_grouped_object === this.chart) {
                                                var selected_title;
                                                for (var j = 0; j < titles.length; ++j) {
                                                    if (titles[j] && titles[j].selected) {
                                                        selected_title = titles[j];
                                                        break;
                                                    }
                                                }
                                                if (selected_title) {
                                                    if (selected_title.hitInTextRect(x, y)) {
                                                        selected_title.selectionSetStart(e, x, y);
                                                        this.drawingObjectsController.changeCurrentState(new ChartGroupTextAddState(this.drawingObjectsController, this.drawingObjects, this.chart, this.group, selected_title));
                                                        if (e.ClickCount < 2) {
                                                            selected_title.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
                                                        }
                                                        return;
                                                    }
                                                }
                                            }
                                            if (handleChartGroup(cur_grouped_object, this.drawingObjects, this.drawingObjectsController, this.group, e, x, y)) {
                                                return;
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (handleGroup(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.group.resetSelection(this.drawingObjectsController);
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        var selected_title;
        if (this.chart.chartTitle && this.chart.chartTitle.selected) {
            selected_title = this.chart.chartTitle;
        } else {
            if (this.chart.hAxisTitle && this.chart.hAxisTitle.selected) {
                selected_title = this.chart.hAxisTitle;
            } else {
                if (this.chart.vAxisTitle && this.chart.vAxisTitle.selected) {
                    selected_title = this.chart.vAxisTitle;
                }
            }
        }
        drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.transform, 0, 0, this.group.extX, this.group.extY, this.group.canRotate());
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.chart.transform, 0, 0, this.chart.extX, this.chart.extY, false);
        if (selected_title) {
            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, selected_title.transform, 0, 0, selected_title.extX, selected_title.extY, false);
        }
    };
    this.isPointInDrawingObjects = function (x, y) {
        var titles = [];
        titles.push(this.chart.chartTitle);
        titles.push(this.chart.hAxisTitle);
        titles.push(this.chart.vAxisTitle);
        if (
        /*e.CtrlKey*/
        true) {
            for (var i = 0; i < titles.length; ++i) {
                if (isRealObject(titles[i]) && titles[i].selected && titles[i].hitInBoundingRect(x, y)) {
                    return {
                        objectId: this.chart.Id,
                        cursorType: "move"
                    };
                }
            }
        }
        if (this.chart.canResize()) {
            var hit_to_handles = this.chart.hitToHandles(x, y);
            if (hit_to_handles > -1 && hit_to_handles < 8) {
                var card_direction = this.chart.getCardDirectionByNum(hit_to_handles);
                return {
                    objectId: this.chart.Id,
                    cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                };
            }
        }
        if (this.chart.hitInBoundingRect(x, y)) {
            return {
                objectId: this.chart.Id,
                cursorType: "move"
            };
        }
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = drawing_bases.length - 1; i > -1; --i) {
            var cur_drawing_base = drawing_bases[i];
            if (cur_drawing_base.isGraphicObject()) {
                var cur_drawing = cur_drawing_base.graphicObject;
                if (cur_drawing.isShape() || cur_drawing.isImage()) {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                        return {
                            objectId: cur_drawing.Id,
                            cursorType: "move"
                        };
                    } else {
                        if (hit_in_text_rect) {
                            return {
                                objectId: cur_drawing.Id,
                                cursorType: "move"
                            };
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
                                return {
                                    objectId: cur_drawing.Id,
                                    cursorType: "move"
                                };
                            } else {
                                if (hit_in_text_rect) {
                                    return {
                                        objectId: cur_drawing.Id,
                                        cursorType: "move"
                                    };
                                }
                            }
                        }
                    } else {
                        if (cur_drawing.isChart()) {
                            if (cur_drawing === this.chart) {
                                for (var j = 0; j < titles.length; ++j) {
                                    var title = titles[j];
                                    if (isRealObject(title)) {
                                        if (!title.selected) {
                                            if (title.hit(x, y)) {
                                                return {
                                                    objectId: this.chart.Id,
                                                    cursorType: "move"
                                                };
                                            }
                                        } else {
                                            if (title.hit(x, y)) {
                                                if (title.hitInTextRect(x, y)) {
                                                    return {
                                                        objectId: this.chart.Id,
                                                        cursorType: "move"
                                                    };
                                                } else {
                                                    return {
                                                        objectId: this.chart.Id,
                                                        cursorType: "move"
                                                    };
                                                }
                                            }
                                        }
                                    }
                                }
                                if (cur_drawing.hitInWorkArea(x, y)) {
                                    return {
                                        objectId: this.chart.Id,
                                        cursorType: "move"
                                    };
                                }
                            } else {
                                if (cur_drawing.hitInWorkArea(x, y)) {
                                    if (!e.ShiftKey && !e.CtrlKey) {
                                        if (isRealObject(cur_drawing.chartLegend)) {}
                                        var object_for_move_in_chart = null;
                                        if (isRealObject(cur_drawing.chartTitle)) {
                                            if (cur_drawing.chartTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.chartTitle;
                                            }
                                        }
                                        if (isRealObject(cur_drawing.hAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                                            if (cur_drawing.hAxisTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.hAxisTitle;
                                            }
                                        }
                                        if (isRealObject(cur_drawing.vAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                                            if (cur_drawing.vAxisTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.vAxisTitle;
                                            }
                                        }
                                        if (isRealObject(object_for_move_in_chart)) {
                                            return {
                                                objectId: this.chart.Id,
                                                cursorType: "move"
                                            };
                                        }
                                        return {
                                            objectId: this.chart.Id,
                                            cursorType: "move"
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    };
}
function ChartGroupTextAddState(drawingObjectsController, drawingObjects, chart, group, title) {
    this.id = STATES_ID_CHART_GROUP_TEXT_ADD;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.chart = chart;
    this.group = group;
    this.title = title;
    this.textObject = title;
    this.groupState = new ChartGroupState(this.drawingObjectsController, this.drawingObjects, this.chart, this.group);
    this.onMouseDown = function (e, x, y) {
        this.groupState.onMouseDown(e, x, y);
        if (this.drawingObjectsController.State.id !== STATES_ID_CHART_GROUP_TEXT_ADD) {
            this.chart.recalculate();
            editor.WordControl.m_oDrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
            editor.WordControl.m_oDrawingDocument.OnEndRecalculate();
        }
        this.drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
    };
    this.onMouseMove = function (e, x, y) {
        if (e.IsLocked) {
            this.textObject.selectionSetEnd(e, x, y, this.drawingObjects.num);
            this.drawingObjectsController.updateSelectionState();
        }
    };
    this.onMouseUp = function (e, x, y) {
        this.textObject.selectionSetEnd(e, x, y, this.drawingObjects.num);
        this.drawingObjectsController.updateSelectionState();
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.transform, 0, 0, this.group.extX, this.group.extY, this.group.canRotate());
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.chart.transform, 0, 0, this.chart.extX, this.chart.extY, false);
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.title.transform, 0, 0, this.title.extX, this.title.extY, false);
    };
    this.isPointInDrawingObjects = function (x, y) {
        var titles = [];
        titles.push(this.chart.chartTitle);
        titles.push(this.chart.hAxisTitle);
        titles.push(this.chart.vAxisTitle);
        if (
        /*e.CtrlKey*/
        true) {
            for (var i = 0; i < titles.length; ++i) {
                if (isRealObject(titles[i]) && titles[i].selected && titles[i].hitInBoundingRect(x, y)) {
                    return {
                        objectId: this.chart.Id,
                        cursorType: "move"
                    };
                }
            }
        }
        if (this.chart.canResize()) {
            var hit_to_handles = this.chart.hitToHandles(x, y);
            if (hit_to_handles > -1 && hit_to_handles < 8) {
                var card_direction = this.chart.getCardDirectionByNum(hit_to_handles);
                return {
                    objectId: this.chart.Id,
                    cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                };
            }
        }
        if (this.chart.hitInBoundingRect(x, y)) {
            return {
                objectId: this.chart.Id,
                cursorType: "move"
            };
        }
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (var i = drawing_bases.length - 1; i > -1; --i) {
            var cur_drawing_base = drawing_bases[i];
            if (cur_drawing_base.isGraphicObject()) {
                var cur_drawing = cur_drawing_base.graphicObject;
                if (cur_drawing.isShape() || cur_drawing.isImage()) {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                        return {
                            objectId: cur_drawing.Id,
                            cursorType: "move"
                        };
                    } else {
                        if (hit_in_text_rect) {
                            return {
                                objectId: cur_drawing.Id,
                                cursorType: "move"
                            };
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
                                return {
                                    objectId: cur_drawing.Id,
                                    cursorType: "move"
                                };
                            } else {
                                if (hit_in_text_rect) {
                                    return {
                                        objectId: cur_drawing.Id,
                                        cursorType: "move"
                                    };
                                }
                            }
                        }
                    } else {
                        if (cur_drawing.isChart()) {
                            if (cur_drawing === this.chart) {
                                for (var j = 0; j < titles.length; ++j) {
                                    var title = titles[j];
                                    if (isRealObject(title)) {
                                        if (!title.selected) {
                                            if (title.hit(x, y)) {
                                                return {
                                                    objectId: this.chart.Id,
                                                    cursorType: "move"
                                                };
                                            }
                                        } else {
                                            if (title.hit(x, y)) {
                                                if (title.hitInTextRect(x, y)) {
                                                    return {
                                                        objectId: this.chart.Id,
                                                        cursorType: "move"
                                                    };
                                                } else {
                                                    return {
                                                        objectId: this.chart.Id,
                                                        cursorType: "move"
                                                    };
                                                }
                                            }
                                        }
                                    }
                                }
                                if (cur_drawing.hitInWorkArea(x, y)) {
                                    return {
                                        objectId: this.chart.Id,
                                        cursorType: "move"
                                    };
                                }
                            } else {
                                if (cur_drawing.hitInWorkArea(x, y)) {
                                    if (!e.ShiftKey && !e.CtrlKey) {
                                        if (isRealObject(cur_drawing.chartLegend)) {}
                                        var object_for_move_in_chart = null;
                                        if (isRealObject(cur_drawing.chartTitle)) {
                                            if (cur_drawing.chartTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.chartTitle;
                                            }
                                        }
                                        if (isRealObject(cur_drawing.hAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                                            if (cur_drawing.hAxisTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.hAxisTitle;
                                            }
                                        }
                                        if (isRealObject(cur_drawing.vAxisTitle) && !isRealObject(object_for_move_in_chart)) {
                                            if (cur_drawing.vAxisTitle.hit(x, y)) {
                                                object_for_move_in_chart = cur_drawing.vAxisTitle;
                                            }
                                        }
                                        if (isRealObject(object_for_move_in_chart)) {
                                            return {
                                                objectId: this.chart.Id,
                                                cursorType: "move"
                                            };
                                        }
                                        return {
                                            objectId: this.chart.Id,
                                            cursorType: "move"
                                        };
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    };
}
function TextAddState(drawingObjectsController, drawingObjects, textObject) {
    this.id = STATES_ID_TEXT_ADD;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.textObject = textObject;
    this.nullState = new NullState(drawingObjectsController, drawingObjects);
    this.onMouseDown = function (e, x, y) {
        this.nullState.onMouseDown(e, x, y);
        if (this.drawingObjectsController.State.id !== STATES_ID_TEXT_ADD || this.drawingObjectsController.State.textObject !== this.textObject) {
            this.textObject.addTextFlag = false;
            if (this.textObject instanceof CGraphicFrame) {}
            this.drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (e.IsLocked) {
            this.textObject.selectionSetEnd(e, x, y);
            this.drawingObjectsController.updateSelectionState();
            this.drawingObjectsController.slide.OnUpdateOverlay();
            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
        }
    };
    this.onMouseUp = function (e, x, y) {
        if (! (e.Button === g_mouse_button_right && this.textObject.pointInSelectedText(x, y))) {
            this.textObject.selectionSetEnd(e, x, y);
            this.drawingObjectsController.updateSelectionState();
            if (editor.isPaintFormat) {
                var doc = editor.WordControl.m_oLogicDocument;
                if (!editor.isViewMode && this.textObject.paragraphFormatPaste && doc.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                    History.Create_NewPoint();
                    this.textObject.paragraphFormatPaste(doc.CopyTextPr, doc.CopyParaPr, false);
                    editor.sync_PaintFormatCallback(false);
                    doc.Recalculate();
                }
            }
        }
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {
        this.drawingObjects.objectLocker.reset();
        this.drawingObjects.objectLocker.addObjectId(this.textObject.Get_Id());
        var drawingObjects = this.drawingObjects;
        var text_object = this.textObject;
        var callback = function (bLock) {
            if (bLock) {
                History.Create_NewPoint();
                text_object.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                drawingObjects.showDrawingObjects(true);
                text_object.updateSelectionState(drawingObjects.drawingDocument);
            }
        };
        this.drawingObjects.objectLocker.checkObjects(callback);
    };
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.textObject.getTransformMatrix(), 0, 0, this.textObject.extX, this.textObject.extY, false, this.textObject.canRotate());
        this.textObject.drawAdjustments(drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return this.nullState.isPointInDrawingObjects(x, y);
    };
    this.setCellFontName = function (fontName) {
        if (typeof this.textObject.setCellFontName === "function") {
            this.textObject.setCellFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellFontSize = function (fontSize) {
        if (typeof this.textObject.setCellFontSize === "function") {
            this.textObject.setCellFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellBold = function (isBold) {
        if (typeof this.textObject.setCellBold === "function") {
            this.textObject.setCellBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellItalic = function (isItalic) {
        if (typeof this.textObject.setCellItalic === "function") {
            this.textObject.setCellItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellUnderline = function (isUnderline) {
        if (typeof this.textObject.setCellUnderline === "function") {
            this.textObject.setCellUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellStrikeout = function (isStrikeout) {
        if (typeof this.textObject.setCellStrikeout === "function") {
            this.textObject.setCellStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellSubscript = function (isSubscript) {
        if (typeof this.textObject.setCellSubscript === "function") {
            this.textObject.setCellSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellSuperscript = function (isSuperscript) {
        if (typeof this.textObject.setCellSuperscript === "function") {
            this.textObject.setCellSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellAlign = function (align) {
        if (typeof this.textObject.setCellAlign === "function") {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellVertAlign = function (align) {
        if (typeof this.textObject.setCellVertAlign === "function") {
            this.textObject.setCellVertAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellTextColor = function (color) {
        if (typeof this.textObject.setCellTextColor === "function") {
            this.textObject.setCellTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellBackgroundColor = function (color) {
        if (typeof this.textObject.setCellBackgroundColor === "function") {
            this.textObject.setCellBackgroundColor(color);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellAngle = function (angle) {
        if (typeof this.textObject.setCellAngle === "function") {
            this.textObject.setCellAngle(angle);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.increaseFontSize = function () {
        if (typeof this.textObject.increaseFontSize === "function") {
            this.textObject.increaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.decreaseFontSize = function () {
        if (typeof this.textObject.decreaseFontSize === "function") {
            this.textObject.decreaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.insertHyperlink = function (options) {
        if (typeof this.textObject.insertHyperlink === "function") {
            this.textObject.insertHyperlink(options);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
}
function PreRotateState(drawingObjectsController, drawingObjects, majorObject) {
    this.id = STATES_ID_PRE_ROTATE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new RotateState(this.drawingObjectsController, this.drawingObjects, this.majorObject));
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: "crosshair"
        };
    };
}
function RotateState(drawingObjectsController, drawingObjects, majorObject) {
    this.id = STATES_ID_ROTATE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var angle = this.majorObject.getRotateAngle(x, y);
        this.drawingObjectsController.rotateTrackObjects(angle, e);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyPress = function (e) {};
    this.onKeyDown = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: "crosshair"
        };
    };
}
function PreResizeState(drawingObjectsController, drawingObjects, majorObject, cardDirection) {
    this.id = STATES_ID_PRE_RESIZE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ResizeState(this.drawingObjectsController, this.drawingObjects, this.majorObject, this.cardDirection));
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]
        };
    };
}
function ResizeState(drawingObjectsController, drawingObjects, majorObject, cardDirection) {
    this.id = STATES_ID_RESIZE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.handleNum = this.majorObject.getNumByCardDirection(cardDirection);
    this.cardDirection = cardDirection;
    var snap = this.drawingObjects.getSnapArrays();
    this.snapX = snap.snapX;
    this.snapY = snap.snapY;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var point_x, point_y;
        var snap_object_x = GetSnapObject([x], 0, this.snapX);
        var snap_object_y = GetSnapObject([y], 0, this.snapY);
        if (snap_object_x.point !== null) {
            point_x = snap_object_x.point;
        } else {
            point_x = x;
        }
        if (snap_object_y.point !== null) {
            point_y = snap_object_y.point;
        } else {
            point_y = y;
        }
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, point_x, point_y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]
        };
    };
}
function StartTrackNewShapeState(drawingObjectsController, drawingObjects, presetGeom) {
    this.id = STATES_ID_START_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;
    this.onMouseDown = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new BeginTrackNewShapeState(this.drawingObjectsController, this.drawingObjects, this.presetGeom, x, y));
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
}
function BeginTrackNewShapeState(drawingObjectsController, drawingObjects, presetGeom, startX, startY) {
    this.id = STATES_ID_BEGIN_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;
    this.startX = startX;
    this.startY = startY;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.addTrackObject(new NewShapeTrack(this.drawingObjects, this.presetGeom, this.startX, this.startY));
        this.drawingObjectsController.trackNewShape(e, x, y);
        this.drawingObjectsController.changeCurrentState(new TrackNewShapeState(this.drawingObjectsController, this.drawingObjects, this.presetGeom));
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjectsController.resetSelection();
        var presetGeom = this.presetGeom;
        if (presetGeom.indexOf("WithArrow") > -1) {
            presetGeom = presetGeom.substr(0, presetGeom.length - 9);
            this.presetGeom = presetGeom;
            this.arrowsCount = 1;
        }
        if (presetGeom.indexOf("WithTwoArrows") > -1) {
            presetGeom = presetGeom.substr(0, presetGeom.length - 13);
            this.presetGeom = presetGeom;
            this.arrowsCount = 2;
        }
        History.Create_NewPoint();
        var shape = new CShape(null, this.drawingObjects);
        shape.setParent(drawingObjects);
        if (this.presetGeom !== "textRect") {
            shape.initDefault(this.startX, this.startY, 50, 50, false, false, this.presetGeom, this.arrowsCount);
        } else {
            shape.initDefaultTextRect(this.startX, this.startY, 50, 50, false, false);
        }
        shape.select(this.drawingObjects.graphicObjects);
        drawingObjects.shapeAdd(drawingObjects.cSld.spTree.length, shape);
        this.drawingObjects.graphicObjects.State.resultObject = shape;
        if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_AddShape, shape) === false) {
            shape.select(this.drawingObjectsController);
            this.drawingObjects.shapeAdd(this.drawingObjects.cSld.spTree.length, shape);
            if (this.presetGeom != "textRect") {
                this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            } else {
                this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, shape));
            }
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        } else {
            editor.WordControl.m_oLogicDocument.Document_Undo();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        }
        editor.sync_EndAddShape();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onKeyDown = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        var selected_objects = this.drawingObjectsController.selectedObjects;
        if (selected_objects.length === 1) {
            var hit_to_adj = selected_objects[0].hitToAdjustment(x, y);
            if (hit_to_adj.hit) {
                if (selected_objects[0].canChangeAdjustments()) {
                    return {
                        objectId: selected_objects[0].Id,
                        cursorType: "crosshair"
                    };
                }
            }
        }
        for (var i = selected_objects.length - 1; i > -1; --i) {
            var hit_to_handles = selected_objects[i].hitToHandles(x, y);
            if (hit_to_handles > -1) {
                if (hit_to_handles === 8) {
                    if (!selected_objects[i].canRotate()) {
                        return null;
                    }
                    return {
                        objectId: selected_objects[i].Id,
                        cursorType: "crosshair"
                    };
                } else {
                    if (!selected_objects[i].canResize()) {
                        return null;
                    }
                    this.drawingObjectsController.clearPreTrackObjects();
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    for (var j = 0; j < selected_objects.length; ++j) {
                        if (selected_objects[j].canResize()) {
                            this.drawingObjectsController.addPreTrackObject(selected_objects[j].createResizeTrack(card_direction));
                        }
                    }
                    return {
                        objectId: selected_objects[i].Id,
                        cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                    };
                }
            }
        }
        for (i = selected_objects.length - 1; i > -1; --i) {
            if (selected_objects[i].hitInBoundingRect(x, y)) {
                if (!selected_objects[i].canMove()) {
                    return null;
                }
                return {
                    objectId: selected_objects[i].Id,
                    cursorType: "move"
                };
            }
        }
        var arr_drawing_objects = this.drawingObjects.getDrawingObjects();
        for (i = arr_drawing_objects.length - 1; i > -1; --i) {
            var cur_drawing_base = arr_drawing_objects[i];
            if (cur_drawing_base.isGraphicObject()) {
                var cur_drawing = cur_drawing_base.graphicObject;
                if (cur_drawing.isSimpleObject()) {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                        return {
                            objectId: cur_drawing.Id,
                            cursorType: "move"
                        };
                    } else {
                        if (hit_in_text_rect) {}
                    }
                } else {
                    var grouped_objects = cur_drawing.getArrGraphicObjects();
                    for (var j = grouped_objects.length - 1; j > -1; --j) {
                        var cur_grouped_object = grouped_objects[j];
                        var hit_in_inner_area = cur_grouped_object.hitInInnerArea(x, y);
                        var hit_in_path = cur_grouped_object.hitInPath(x, y);
                        var hit_in_text_rect = cur_grouped_object.hitInTextRect(x, y);
                        if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                            return {
                                objectId: cur_drawing.Id,
                                cursorType: "move"
                            };
                        } else {
                            if (hit_in_text_rect) {}
                        }
                    }
                }
            }
        }
        return null;
    };
}
function TrackNewShapeState(drawingObjectsController, drawingObjects, presetGeom) {
    this.id = STATES_ID_TRACK_NEW_SHAPE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.presetGeom = presetGeom;
    this.resultObject = null;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.trackNewShape(e, x, y);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.resetSelection();
        History.Create_NewPoint();
        var shape = this.drawingObjectsController.arrTrackObjects[0].trackEnd();
        if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_AddShape, shape) === false) {
            shape.select(this.drawingObjectsController);
            this.drawingObjects.shapeAdd(this.drawingObjects.cSld.spTree.length, shape);
            if (this.presetGeom != "textRect") {
                this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            } else {
                this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, shape));
            }
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        } else {
            editor.WordControl.m_oLogicDocument.Document_Undo();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        }
        editor.sync_EndAddShape();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
}
function PreMoveState(drawingObjectsController, drawingObjects, startX, startY, shift, ctrl, majorObject, majorObjectIsSelected, bInside) {
    this.id = STATES_ID_PRE_MOVE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.shift = shift;
    this.ctrl = ctrl;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = majorObjectIsSelected;
    this.bInside = bInside;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        if (this.startX === x && this.startY === y) {
            return;
        }
        this.drawingObjectsController.swapTrackObjects();
        var track_objects = this.drawingObjectsController.getTrackObjects();
        var max_x, min_x, max_y, min_y;
        var cur_rect_bounds = track_objects[0].getOriginalBoundsRect();
        max_x = cur_rect_bounds.maxX;
        min_x = cur_rect_bounds.minX;
        max_y = cur_rect_bounds.maxY;
        min_y = cur_rect_bounds.minY;
        for (var i = 0; i < track_objects.length; ++i) {
            cur_rect_bounds = track_objects[i].getOriginalBoundsRect();
            if (max_x < cur_rect_bounds.maxX) {
                max_x = cur_rect_bounds.maxX;
            }
            if (min_x > cur_rect_bounds.minX) {
                min_x = cur_rect_bounds.minX;
            }
            if (max_y < cur_rect_bounds.maxY) {
                max_y = cur_rect_bounds.maxY;
            }
            if (min_y > cur_rect_bounds.minY) {
                min_y = cur_rect_bounds.minY;
            }
        }
        this.drawingObjectsController.changeCurrentState(new MoveState(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, min_x, min_y, max_x - min_x, max_y - min_y, this.majorObject));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };
    this.onMouseUp = function (e, x, y) {
        if (!this.ctrl && !this.shift) {
            if (e.ClickCount > 1) {
                var gr_obj = this.majorObject;
                if (gr_obj.chart) {
                    if (false === editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_Drawing_Props, undefined)) {
                        var graphicObject = gr_obj;
                        graphicObject.chart.themeColors = [];
                        for (var i = 0; i < editor.WordControl.m_oDrawingDocument.GuiControlColorsMap.length; i++) {
                            graphicObject.chart.themeColors.push(editor.WordControl.m_oDrawingDocument.GuiControlColorsMap[i].get_hex());
                        }
                        editor.asc_fireCallback("asc_doubleClickOnChart", graphicObject);
                    }
                }
            }
        }
        this.drawingObjectsController.clearPreTrackObjects();
        if (! (this.majorObject.isGroup() && this.bInside)) {
            if (this.shift || this.ctrl) {
                if (this.majorObjectIsSelected) {
                    this.majorObject.deselect(this.drawingObjectsController);
                }
            }
        } else {
            if (this.majorObjectIsSelected && !(e.Button === g_mouse_button_right)) {
                this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.majorObject));
                this.drawingObjectsController.onMouseDown(e, x, y);
                this.drawingObjectsController.onMouseUp(e, x, y);
                return;
            }
        }
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: "move"
        };
    };
}
function ExtpectDoubleClickState(drawingObjectsController, drawingObjects) {
    this.id = null;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.nullState = new NullState(drawingObjectsController, drawingObjects);
    this.onMouseDown = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        if (e.ClickCount > 1) {
            this.drawingObjects.showChartSettings();
        } else {
            this.drawingObjectsController.onMouseDown(e, x, y);
        }
    };
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjectsController.onMouseUp(e, x, y);
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return this.nullState.isPointInDrawingObjects(x, y);
    };
}
function MoveState(drawingObjectsController, drawingObjects, startX, startY, rectX, rectY, rectW, rectH, majorObject) {
    this.id = STATES_ID_MOVE;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.rectX = rectX;
    this.rectY = rectY;
    this.rectW = rectW;
    this.rectH = rectH;
    this.majorObject = majorObject;
    this.majorTrack = null;
    var snap = this.drawingObjects.getSnapArrays();
    this.snapX = snap.snapX;
    this.snapY = snap.snapY;
    trackSnap = this.drawingObjectsController.getSnapArraysTrackObjects();
    this.trackSnapX = trackSnap.snapX;
    this.trackSnapY = trackSnap.snapY;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        var shiftX = 0,
        shiftY = 0;
        var snapObjectX = GetSnapObject(this.trackSnapX, dx, this.snapX);
        var snapObjectY = GetSnapObject(this.trackSnapY, dy, this.snapY);
        if (snapObjectX.distance !== null) {
            shiftX = snapObjectX.distance;
        }
        if (snapObjectY.distance !== null) {
            shiftY = snapObjectY.distance;
        }
        var result_dx, result_dy;
        if (!e.ShiftKey) {
            result_dx = dx + shiftX;
            result_dy = dy + shiftY;
        } else {
            result_dx = dx + shiftX;
            result_dy = dy + shiftY;
            if (Math.abs(result_dx) > Math.abs(result_dy)) {
                result_dy = 0;
            } else {
                result_dx = 0;
            }
        }
        this.drawingObjectsController.trackMoveObjects(result_dx, result_dy);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!e.CtrlKey) {
            if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
                History.Create_NewPoint();
                this.drawingObjectsController.trackEnd();
                this.drawingObjects.presentation.Recalculate();
                this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
            }
        } else {
            if (!editor.isViewMode) {
                History.Create_NewPoint();
                var t_o = this.drawingObjectsController.arrTrackObjects;
                for (var i = 0; i < t_o.length; ++i) {
                    if (t_o[i].originalObject.copy) {
                        t_o[i].originalObject.deselect(this.drawingObjectsController);
                        var copy = t_o[i].originalObject.copy(this.drawingObjects);
                        copy.setParent(this.drawingObjects);
                        copy.setXfrm(t_o[i].x, t_o[i].y, null, null, null, null, null);
                        this.drawingObjects.addToSpTreeToPos(this.drawingObjects.cSld.spTree.length, copy);
                        copy.select(this.drawingObjectsController);
                    }
                }
                this.drawingObjects.presentation.Recalculate();
                this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
                this.drawingObjects.presentation.DrawingDocument.OnEndRecalculate();
            }
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: "move"
        };
    };
}
function GetSnapObject(trackSnapArr, dist, snapArr) {
    var min_d = null,
    point = null;
    for (var i = 0; i < trackSnapArr.length; ++i) {
        var p = trackSnapArr[i] + dist;
        for (var j = 0; j < snapArr.length; ++j) {
            var d = snapArr[j] - p;
            if (Math.abs(d) < SNAP_DISTANCE) {
                if (point === null) {
                    point = snapArr[j];
                    min_d = d;
                } else {
                    if (Math.abs(d) < Math.abs(min_d)) {
                        min_d = d;
                        point = snapArr[j];
                    }
                }
            }
        }
    }
    return {
        distance: min_d,
        point: point
    };
}
function PreChangeAdjState(drawingObjectsController, drawingObjects, majorObject) {
    this.id = STATES_ID_PRE_CHANGE_ADJ;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjectsController.changeCurrentState(new ChangeAdjState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.majorObject.Id,
            cursorType: "crosshair"
        };
    };
}
function ChangeAdjState(drawingObjectsController, drawingObjects) {
    this.id = STATES_ID_CHANGE_ADJ;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.drawingObjectsController.arrTrackObjects[0].originalShape.Id,
            cursorType: "crosshair"
        };
    };
}
function GroupState(drawingObjectsController, drawingObjects, group) {
    this.id = STATES_ID_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function (e, x, y) {
        var group_selected_objects = this.group.selectedObjects;
        if (handleSelectedOjectsGroup(this.drawingObjects, this.drawingObjectsController, this.group, e, x, y)) {
            return;
        }
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (i = drawing_bases.length - 1; i > -1; --i) {
            var cur_drawing_base = drawing_bases[i];
            var cur_drawing = cur_drawing_base;
            if (cur_drawing instanceof CShape || cur_drawing instanceof CImageShape) {
                if (handleShapeImage(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y)) {
                    return;
                }
            } else {
                if (cur_drawing.isTable && cur_drawing.isTable()) {
                    if (handleTable(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                        return;
                    }
                } else {
                    if (typeof CChartAsGroup != "undefined" && cur_drawing instanceof CChartAsGroup) {
                        if (handleChart(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                            return;
                        }
                    } else {
                        if (cur_drawing instanceof CGroupShape) {
                            if (this.group === cur_drawing) {
                                var arr_graphic_objects = this.group.getArrGraphicObjects();
                                for (var s = arr_graphic_objects.length - 1; s > -1; --s) {
                                    var cur_grouped_object = arr_graphic_objects[s];
                                    if (cur_grouped_object instanceof CShape || cur_grouped_object instanceof CImageShape || cur_grouped_object instanceof CGraphicFrame) {
                                        if (handleShapeImageInGroup(cur_grouped_object, this.drawingObjects, this.drawingObjectsController, this.group, e, x, y, this)) {
                                            return;
                                        }
                                    } else {
                                        if (typeof CChartAsGroup != "undefined" && cur_grouped_object instanceof CChartAsGroup) {
                                            if (handleChartGroup(cur_grouped_object, this.drawingObjects, this.drawingObjectsController, this.group, e, x, y)) {
                                                return;
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (handleGroup(cur_drawing, this.drawingObjects, this.drawingObjectsController, e, x, y, this)) {
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }
        this.group.resetSelection(this.drawingObjectsController);
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {
        var selected_objects = this.group.selectedObjects;
        if (selected_objects.length === 1 && selected_objects[0].isShape()) {
            if (isRealNumber(e.charCode)) {
                selected_objects[0].paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                this.drawingObjectsController.changeCurrentState(new TextAddInGroup(this.drawingObjectsController, this.drawingObjects, this.group, selected_objects[0]));
                this.drawingObjects.showDrawingObjects(true);
                this.drawingObjects.OnUpdateOverlay();
            }
        }
    };
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        var group_selected_objects = this.group.selectedObjects;
        if (group_selected_objects.length === 1) {
            var hit_to_adj = group_selected_objects[0].hitToAdjustment(x, y);
            if (hit_to_adj.hit) {
                return {
                    objectId: this.group.Id,
                    cursorType: "crosshair"
                };
            }
        }
        for (var i = group_selected_objects.length - 1; i > -1; --i) {
            var hit_to_handles = group_selected_objects[i].hitToHandles(x, y);
            if (hit_to_handles > -1) {
                if (hit_to_handles === 8) {
                    if (!group_selected_objects[i].canRotate()) {
                        return null;
                    }
                    return {
                        objectId: this.group.Id,
                        cursorType: "crosshair"
                    };
                } else {
                    if (!group_selected_objects[i].canResize()) {
                        return null;
                    }
                    var card_direction = group_selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    return {
                        objectId: this.group.Id,
                        cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                    };
                }
            }
        }
        var hit_to_handles = this.group.hitToHandles(x, y);
        if (hit_to_handles > -1) {
            if (hit_to_handles === 8) {
                if (!this.group.canRotate()) {
                    return null;
                }
                return {
                    objectId: this.group.Id,
                    cursorType: "crosshair"
                };
            } else {
                var card_direction = this.group.getCardDirectionByNum(hit_to_handles);
                return {
                    objectId: this.group.Id,
                    cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                };
            }
        }
        for (i = group_selected_objects.length - 1; i > -1; --i) {
            if (group_selected_objects[i].hitInBoundingRect(x, y)) {
                return {
                    objectId: this.group.Id,
                    cursorType: "move"
                };
            }
        }
        if (this.group.hitInBoundingRect(x, y)) {
            return {
                objectId: this.group.Id,
                cursorType: "move"
            };
        }
        var drawing_bases = this.drawingObjects.getDrawingObjects();
        var selected_objects = this.drawingObjectsController.selectedObjects;
        for (i = drawing_bases.length - 1; i > -1; --i) {
            var cur_drawing_base = drawing_bases[i];
            if (cur_drawing_base.isGraphicObject()) {
                var cur_drawing = cur_drawing_base.graphicObject;
                if (cur_drawing.isSimpleObject()) {
                    var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                    var hit_in_path = cur_drawing.hitInPath(x, y);
                    var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                        return {
                            objectId: cur_drawing.Id,
                            cursorType: "move"
                        };
                    } else {
                        if (hit_in_text_rect) {
                            return {
                                objectId: cur_drawing.Id,
                                cursorType: "text"
                            };
                        }
                    }
                } else {
                    if (this.group === cur_drawing) {
                        var arr_graphic_objects = this.group.getArrGraphicObjects();
                        for (i = arr_graphic_objects.length - 1; i > -1; --i) {
                            var cur_drawing = arr_graphic_objects[i];
                            var hit_in_inner_area = cur_drawing.hitInInnerArea(x, y);
                            var hit_in_path = cur_drawing.hitInPath(x, y);
                            var hit_in_text_rect = cur_drawing.hitInTextRect(x, y);
                            if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
                                return {
                                    objectId: this.group.Id,
                                    cursorType: "move"
                                };
                            } else {
                                if (hit_in_text_rect) {
                                    return {
                                        objectId: this.group.Id,
                                        cursorType: "text"
                                    };
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
                                return {
                                    objectId: cur_drawing.Id,
                                    cursorType: "move"
                                };
                            } else {
                                if (hit_in_text_rect) {
                                    return {
                                        objectId: cur_drawing.Id,
                                        cursorType: "text"
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
        return null;
    };
}
function TextAddInGroup(drawingObjectsController, drawingObjects, group, textObject) {
    this.id = STATES_ID_TEXT_ADD_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.groupState = new GroupState(drawingObjectsController, drawingObjects, group);
    this.textObject = textObject;
    this.group = group;
    this.onMouseDown = function (e, x, y) {
        this.groupState.onMouseDown(e, x, y);
        if (this.drawingObjectsController.State.id !== STATES_ID_TEXT_ADD || this.drawingObjectsController.State.id !== STATES_ID_TEXT_ADD_IN_GROUP) {
            this.drawingObjectsController.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (e.IsLocked) {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.onMouseUp = function (e, x, y) {
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
    };
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.getTransformMatrix(), 0, 0, this.group.extX, this.group.extY, false, this.group.canRotate());
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.textObject.getTransformMatrix(), 0, 0, this.textObject.extX, this.textObject.extY, false, this.textObject.canRotate());
        this.textObject.drawAdjustments(drawingDocument);
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {
        this.drawingObjects.objectLocker.reset();
        this.drawingObjects.objectLocker.addObjectId(this.group.Get_Id());
        var drawingObjects = this.drawingObjects;
        var text_object = this.textObject;
        var callback = function (bLock) {
            if (bLock) {
                History.Create_NewPoint();
                text_object.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                drawingObjects.showDrawingObjects(true);
                text_object.updateSelectionState(drawingObjects.drawingDocument);
            }
        };
        this.drawingObjects.objectLocker.checkObjects(callback);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return this.groupState.isPointInDrawingObjects(x, y);
    };
    this.setCellFontName = function (fontName) {
        if (typeof this.textObject.setCellFontName === "function") {
            this.textObject.setCellFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellFontSize = function (fontSize) {
        if (typeof this.textObject.setCellFontSize === "function") {
            this.textObject.setCellFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellBold = function (isBold) {
        if (typeof this.textObject.setCellBold === "function") {
            this.textObject.setCellBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellItalic = function (isItalic) {
        if (typeof this.textObject.setCellItalic === "function") {
            this.textObject.setCellItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellUnderline = function (isUnderline) {
        if (typeof this.textObject.setCellUnderline === "function") {
            this.textObject.setCellUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellStrikeout = function (isStrikeout) {
        if (typeof this.textObject.setCellStrikeout === "function") {
            this.textObject.setCellStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellSubscript = function (isSubscript) {
        if (typeof this.textObject.setCellSubscript === "function") {
            this.textObject.setCellSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellSuperscript = function (isSuperscript) {
        if (typeof this.textObject.setCellSuperscript === "function") {
            this.textObject.setCellSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellAlign = function (align) {
        if (typeof this.textObject.setCellAlign === "function") {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellVertAlign = function (align) {
        if (typeof this.textObject.setCellVertAlign === "function") {
            this.textObject.setCellVertAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellTextColor = function (color) {
        if (typeof this.textObject.setCellTextColor === "function") {
            this.textObject.setCellTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.setCellBackgroundColor = function (color) {
        if (typeof this.textObject.setCellBackgroundColor === "function") {
            this.textObject.setCellBackgroundColor(color);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellAngle = function (angle) {
        if (typeof this.textObject.setCellAngle === "function") {
            this.textObject.setCellAngle(angle);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.increaseFontSize = function () {
        if (typeof this.textObject.increaseFontSize === "function") {
            this.textObject.increaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.decreaseFontSize = function () {
        if (typeof this.textObject.decreaseFontSize === "function") {
            this.textObject.decreaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
    this.insertHyperlink = function (options) {
        if (typeof this.textObject.insertHyperlink === "function") {
            this.textObject.insertHyperlink(options);
            this.textObject.updateSelectionState(editor.WordControl.m_oLogicDocument.DrawingDocument);
        }
    };
}
function PreMoveInGroupState(drawingObjectsController, drawingObjects, group, startX, startY, ShiftKey, CtrlKey, majorObject, majorObjectIsSelected) {
    this.id = STATES_ID_PRE_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    this.ShiftKey = ShiftKey;
    this.CtrlKey = CtrlKey;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = majorObjectIsSelected;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        var track_objects = this.drawingObjectsController.getTrackObjects();
        var max_x, min_x, max_y, min_y;
        var cur_rect_bounds = track_objects[0].getOriginalBoundsRect();
        max_x = cur_rect_bounds.maxX;
        min_x = cur_rect_bounds.minX;
        max_y = cur_rect_bounds.maxY;
        min_y = cur_rect_bounds.minY;
        for (var i = 0; i < track_objects.length; ++i) {
            cur_rect_bounds = track_objects[i].getOriginalBoundsRect();
            if (max_x < cur_rect_bounds.maxX) {
                max_x = cur_rect_bounds.maxX;
            }
            if (min_x > cur_rect_bounds.minX) {
                min_x = cur_rect_bounds.minX;
            }
            if (max_y < cur_rect_bounds.maxY) {
                max_y = cur_rect_bounds.maxY;
            }
            if (min_y > cur_rect_bounds.minY) {
                min_y = cur_rect_bounds.minY;
            }
        }
        this.drawingObjectsController.changeCurrentState(new MoveInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.startX, this.startY, min_x, min_y, max_x - min_x, max_y - min_y));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.clearPreTrackObjects();
        if (this.shift || this.ctrl) {
            if (this.majorObjectIsSelected) {
                this.majorObject.deselect(this.drawingObjectsController);
            }
        }
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: "move"
        };
    };
}
function MoveInGroupState(drawingObjectsController, drawingObjects, group, startX, startY, rectX, rectY, rectW, rectH) {
    this.id = STATES_ID_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    this.rectX = rectX;
    this.rectY = rectY;
    this.rectW = rectW;
    this.rectH = rectH;
    var snap = this.drawingObjects.getSnapArrays();
    this.snapX = snap.snapX;
    this.snapY = snap.snapY;
    trackSnap = this.drawingObjectsController.getSnapArraysTrackObjects();
    this.trackSnapX = trackSnap.snapX;
    this.trackSnapY = trackSnap.snapY;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        var shiftX = 0,
        shiftY = 0;
        var snapObjectX = GetSnapObject(this.trackSnapX, dx, this.snapX);
        var snapObjectY = GetSnapObject(this.trackSnapY, dy, this.snapY);
        if (snapObjectX.distance !== null) {
            shiftX = snapObjectX.distance;
        }
        if (snapObjectY.distance !== null) {
            shiftY = snapObjectY.distance;
        }
        var result_dx, result_dy;
        if (!e.ShiftKey) {
            result_dx = dx + shiftX;
            result_dy = dy + shiftY;
        } else {
            result_dx = dx + shiftX;
            result_dy = dy + shiftY;
            if (Math.abs(result_dx) > Math.abs(result_dy)) {
                result_dy = 0;
            } else {
                result_dx = 0;
            }
        }
        this.drawingObjectsController.trackMoveObjects(result_dx, result_dy);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            if (!e.CtrlKey) {
                History.Create_NewPoint();
                this.group.normalize();
                this.drawingObjectsController.trackEnd();
                this.group.updateCoordinatesAfterInternalResize();
            } else {
                History.Create_NewPoint();
                var t_o = this.drawingObjectsController.arrTrackObjects;
                this.group.normalize();
                for (var i = 0; i < t_o.length; ++i) {
                    if (t_o[i].originalObject.copy) {
                        t_o[i].originalObject.deselect(this.drawingObjectsController);
                        var copy = t_o[i].originalObject.copy();
                        copy.setParent(this.drawingObjects);
                        copy.setXfrm(t_o[i].x, t_o[i].y, null, null, null, null, null);
                        copy.setGroup(t_o[i].originalObject.group);
                        t_o[i].originalObject.group.addToSpTree(t_o[i].originalObject.group.spTree.length, copy);
                        copy.select(this.drawingObjectsController);
                    }
                }
                this.group.updateCoordinatesAfterInternalResize();
                this.group.recalcAll();
                editor.WordControl.m_oLogicDocument.recalcMap[this.group.Get_Id()] = this.group;
                this.drawingObjects.presentation.Recalculate();
                this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
                this.drawingObjects.presentation.DrawingDocument.OnEndRecalculate();
            }
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: "move"
        };
    };
}
function PreChangeAdjInGroupState(drawingObjectsController, drawingObjects, group) {
    this.id = STATES_ID_PRE_CHANGE_ADJ_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjectsController.changeCurrentState(new ChangeAdjInGroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: "crosshair"
        };
    };
}
function ChangeAdjInGroupState(drawingObjectsController, drawingObjects, group) {
    this.id = STATES_ID_CHANGE_ADJ_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.trackAdjObject(x, y);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: "crosshair"
        };
    };
}
function PreRotateInGroupState(drawingObjectsController, drawingObjects, group, majorObject) {
    this.id = STATES_ID_PRE_ROTATE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new RotateInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.majorObject));
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: "crosshair"
        };
    };
}
function RotateInGroupState(drawingObjectsController, drawingObjects, group, majorObject) {
    this.id = STATES_ID_ROTATE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var angle = this.majorObject.getRotateAngle(x, y);
        this.drawingObjectsController.rotateTrackObjects(angle, e);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            group.normalize();
            group.updateCoordinatesAfterInternalResize();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: "crosshair"
        };
    };
}
function PreResizeInGroupState(drawingObjectsController, drawingObjects, group, majorObject, cardDirection) {
    this.id = STATES_ID_PRE_RESIZE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ResizeInGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.majorObject, this.majorObject.getNumByCardDirection(this.cardDirection), this.cardDirection));
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]
        };
    };
}
function ResizeInGroupState(drawingObjectsController, drawingObjects, group, majorObject, handleNum, cardDirection) {
    this.id = STATES_ID_RESIZE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.handleNum = handleNum;
    this.cardDirection = cardDirection;
    var snap = this.drawingObjects.getSnapArrays();
    this.snapX = snap.snapX;
    this.snapY = snap.snapY;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var point_x, point_y;
        var snap_object_x = GetSnapObject([x], 0, this.snapX);
        var snap_object_y = GetSnapObject([y], 0, this.snapY);
        if (snap_object_x.point !== null) {
            point_x = snap_object_x.point;
        } else {
            point_x = x;
        }
        if (snap_object_y.point !== null) {
            point_y = snap_object_y.point;
        } else {
            point_y = y;
        }
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, point_x, point_y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        if (!editor.isViewMode && this.drawingObjects.presentation.Document_Is_SelectionLocked(changestype_Drawing_Props) === false) {
            History.Create_NewPoint();
            this.drawingObjectsController.trackEnd();
            group.normalize();
            group.updateCoordinatesAfterInternalResize();
            this.drawingObjects.presentation.Recalculate();
            this.drawingObjects.presentation.DrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, this.group));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[this.cardDirection]
        };
    };
}
function SplineBezierState(drawingObjectsController, drawingObjects) {
    this.id = STATES_ID_SPLINE_BEZIER;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function (e, x, y) {
        this.drawingObjectsController.clearTrackObjects();
        var spline = new Spline(this.drawingObjects);
        this.drawingObjectsController.addTrackObject(spline);
        spline.addPathCommand(new SplineCommandMoveTo(x, y));
        this.drawingObjectsController.changeCurrentState(new SplineBezierState33(this.drawingObjectsController, this.drawingObjects, x, y, spline));
        this.drawingObjectsController.resetSelection();
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, X, Y, pageIndex) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function SplineBezierState33(drawingObjectsController, drawingObjects, startX, startY, spline) {
    this.id = STATES_ID_SPLINE_BEZIER33;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        if (this.startX === x && this.startY === y) {
            return;
        }
        this.spline.addPathCommand(new SplineCommandLineTo(x, y));
        this.drawingObjectsController.changeCurrentState(new SplineBezierState2(this.drawingObjectsController, this.drawingObjects, this.startX, this.startY, this.spline));
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function SplineBezierState2(drawingObjectsController, drawingObjects, startX, startY, spline) {
    this.id = STATES_ID_SPLINE_BEZIER2;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;
    this.onMouseDown = function (e, x, y) {
        if (e.ClickCount >= 2) {
            History.Create_NewPoint();
            var sp = this.spline.createShape(null, this.drawingObjects);
            var p = editor.WordControl.m_oLogicDocument;
            if (p.Document_Is_SelectionLocked(changestype_AddShape, sp) === false) {
                this.drawingObjects.addToSpTreeToPos(this.drawingObjects.cSld.spTree.length, sp);
                p.Recalculate();
            } else {
                History.Undo();
            }
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            editor.sync_EndAddShape();
        }
    };
    this.onMouseMove = function (e, x, y) {
        this.spline.path[1].changeLastPoint(x, y);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new SplineBezierState3(this.drawingObjectsController, this.drawingObjects, x, y, this.spline));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function SplineBezierState3(drawingObjectsController, drawingObjects, startX, startY, spline) {
    this.id = STATES_ID_SPLINE_BEZIER3;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.spline = spline;
    this.startX = startX;
    this.startY = startY;
    this.onMouseDown = function (e, x, y) {
        if (e.ClickCount >= 2) {
            History.Create_NewPoint();
            var sp = this.spline.createShape(this.drawingObjects);
            var p = editor.WordControl.m_oLogicDocument;
            if (p.Document_Is_SelectionLocked(changestype_AddShape, sp) === false) {
                this.drawingObjects.addToSpTreeToPos(this.drawingObjects.cSld.spTree.length, sp);
                p.Recalculate();
            } else {
                History.Undo();
            }
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            editor.sync_EndAddShape();
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (x === this.startX && y === this.startY) {
            return;
        }
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        var spline = this.spline;
        x0 = spline.path[0].x;
        y0 = spline.path[0].y;
        x3 = spline.path[1].x;
        y3 = spline.path[1].y;
        x6 = x;
        y6 = y;
        var vx = (x6 - x0) / 6;
        var vy = (y6 - y0) / 6;
        x2 = x3 - vx;
        y2 = y3 - vy;
        x4 = x3 + vx;
        y4 = y3 + vy;
        x1 = (x0 + x2) * 0.5;
        y1 = (y0 + y2) * 0.5;
        x5 = (x4 + x6) * 0.5;
        y5 = (y4 + y6) * 0.5;
        spline.path.length = 1;
        spline.path.push(new SplineCommandBezier(x1, y1, x2, y2, x3, y3));
        spline.path.push(new SplineCommandBezier(x4, y4, x5, y5, x6, y6));
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new SplineBezierState4(this.drawingObjectsController, this.drawingObjects, this.spline));
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function SplineBezierState4(drawingObjectsController, drawingObjects, spline) {
    this.id = STATES_ID_SPLINE_BEZIER4;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.spline = spline;
    this.onMouseDown = function (e, x, y) {
        if (e.ClickCount >= 2) {
            History.Create_NewPoint();
            var sp = this.spline.createShape(this.drawingObjects);
            var p = editor.WordControl.m_oLogicDocument;
            if (p.Document_Is_SelectionLocked(changestype_AddShape, sp) === false) {
                this.drawingObjects.addToSpTreeToPos(this.drawingObjects.cSld.spTree.length, sp);
                p.Recalculate();
            } else {
                History.Undo();
            }
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            editor.sync_EndAddShape();
        }
    };
    this.onMouseMove = function (e, x, y) {
        var spline = this.spline;
        var lastCommand = spline.path[spline.path.length - 1];
        var preLastCommand = spline.path[spline.path.length - 2];
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        if (spline.path[spline.path.length - 3].id == 0) {
            x0 = spline.path[spline.path.length - 3].x;
            y0 = spline.path[spline.path.length - 3].y;
        } else {
            x0 = spline.path[spline.path.length - 3].x3;
            y0 = spline.path[spline.path.length - 3].y3;
        }
        x3 = preLastCommand.x3;
        y3 = preLastCommand.y3;
        x6 = x;
        y6 = y;
        var vx = (x6 - x0) / 6;
        var vy = (y6 - y0) / 6;
        x2 = x3 - vx;
        y2 = y3 - vy;
        x4 = x3 + vx;
        y4 = y3 + vy;
        x5 = (x4 + x6) * 0.5;
        y5 = (y4 + y6) * 0.5;
        if (spline.path[spline.path.length - 3].id == 0) {
            preLastCommand.x1 = (x0 + x2) * 0.5;
            preLastCommand.y1 = (y0 + y2) * 0.5;
        }
        preLastCommand.x2 = x2;
        preLastCommand.y2 = y2;
        preLastCommand.x3 = x3;
        preLastCommand.y3 = y3;
        lastCommand.x1 = x4;
        lastCommand.y1 = y4;
        lastCommand.x2 = x5;
        lastCommand.y2 = y5;
        lastCommand.x3 = x6;
        lastCommand.y3 = y6;
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new SplineBezierState5(this.drawingObjectsController, this.drawingObjects, x, y, this.spline));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function SplineBezierState5(drawingObjectsController, drawingObjects, startX, startY, spline) {
    this.id = STATES_ID_SPLINE_BEZIER5;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.spline = spline;
    this.onMouseDown = function (e, x, y) {
        if (e.ClickCount >= 2) {
            History.Create_NewPoint();
            var sp = this.spline.createShape(this.drawingObjects);
            var p = editor.WordControl.m_oLogicDocument;
            if (p.Document_Is_SelectionLocked(changestype_AddShape, sp) === false) {
                this.drawingObjects.addToSpTreeToPos(this.drawingObjects.cSld.spTree.length, sp);
                p.Recalculate();
            } else {
                History.Undo();
            }
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            editor.sync_EndAddShape();
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (x === this.startX && y === this.startY) {
            return;
        }
        var spline = this.spline;
        var lastCommand = spline.path[spline.path.length - 1];
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        if (spline.path[spline.path.length - 2].id == 0) {
            x0 = spline.path[spline.path.length - 2].x;
            y0 = spline.path[spline.path.length - 2].y;
        } else {
            x0 = spline.path[spline.path.length - 2].x3;
            y0 = spline.path[spline.path.length - 2].y3;
        }
        x3 = lastCommand.x3;
        y3 = lastCommand.y3;
        x6 = x;
        y6 = y;
        var vx = (x6 - x0) / 6;
        var vy = (y6 - y0) / 6;
        x2 = x3 - vx;
        y2 = y3 - vy;
        x1 = (x2 + x1) * 0.5;
        y1 = (y2 + y1) * 0.5;
        x4 = x3 + vx;
        y4 = y3 + vy;
        x5 = (x4 + x6) * 0.5;
        y5 = (y4 + y6) * 0.5;
        if (spline.path[spline.path.length - 2].id == 0) {
            lastCommand.x1 = x1;
            lastCommand.y1 = y1;
        }
        lastCommand.x2 = x2;
        lastCommand.y2 = y2;
        spline.path.push(new SplineCommandBezier(x4, y4, x5, y5, x6, y6));
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new SplineBezierState4(this.drawingObjectsController, this.drawingObjects, this.spline));
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function PolyLineAddState(drawingObjectsController, drawingObjects) {
    this.id = STATES_ID_POLY_LINE_ADD;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function (e, x, y) {
        var polyline = new PolyLine(this.drawingObjects);
        polyline.arrPoint.push({
            x: x,
            y: y
        });
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.addTrackObject(polyline);
        this.drawingObjects.OnUpdateOverlay();
        var _min_distance = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
        this.drawingObjectsController.changeCurrentState(new PolyLineAddState2(this.drawingObjectsController, this.drawingObjects, _min_distance, polyline));
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function PolyLineAddState2(drawingObjectsController, drawingObjects, minDistance, polyline) {
    this.id = STATES_ID_POLY_LINE_ADD2;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.minDistance = minDistance;
    this.polyline = polyline;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var _last_point = this.polyline.arrPoint[this.polyline.arrPoint.length - 1];
        var dx = x - _last_point.x;
        var dy = y - _last_point.y;
        if (Math.sqrt(dx * dx + dy * dy) >= this.minDistance) {
            this.polyline.arrPoint.push({
                x: x,
                y: y
            });
            this.drawingObjects.OnUpdateOverlay();
        }
    };
    this.onMouseUp = function (e, x, y) {
        if (this.polyline.arrPoint.length > 1) {
            History.Create_NewPoint();
            var sp = this.polyline.createShape();
            var p = editor.WordControl.m_oLogicDocument;
            if (p.Document_Is_SelectionLocked(changestype_AddShape, sp) === false) {
                this.drawingObjects.addToSpTreeToPos(this.drawingObjects.cSld.spTree.length, sp);
                p.Recalculate();
            } else {
                History.Undo();
            }
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        editor.sync_EndAddShape();
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function AddPolyLine2State(drawingObjectsController, drawingObjects) {
    this.id = STATES_ID_ADD_PPOLY_LINE2;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function (e, x, y) {
        this.drawingObjectsController.resetSelection();
        this.drawingObjects.OnUpdateOverlay();
        var polyline = new PolyLine(this.drawingObjects);
        polyline.arrPoint.push({
            x: x,
            y: y
        });
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjectsController.addTrackObject(polyline);
        this.drawingObjectsController.changeCurrentState(new AddPolyLine2State2(this.drawingObjectsController, this.drawingObjects, x, y, polyline));
    };
    this.onMouseMove = function (AutoShapes, e, X, Y) {};
    this.onMouseUp = function (AutoShapes, e, X, Y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function AddPolyLine2State2(drawingObjectsController, drawingObjects, x, y, polyline) {
    this.id = STATES_ID_ADD_PPOLY_LINE22;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.X = x;
    this.Y = y;
    this.polyline = polyline;
    this.onMouseDown = function (e, x, y) {
        if (e.ClickCount > 1) {
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (this.X !== x || this.Y !== y) {
            this.polyline.arrPoint.push({
                x: x,
                y: y
            });
            this.drawingObjectsController.changeCurrentState(new AddPolyLine2State3(this.drawingObjectsController, this.drawingObjects, this.polyline));
        }
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function AddPolyLine2State3(drawingObjectsController, drawingObjects, polyline) {
    this.id = STATES_ID_ADD_PPOLY_LINE23;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.minDistance = editor.WordControl.m_oDrawingDocument.GetMMPerDot(1);
    this.polyline = polyline;
    this.onMouseDown = function (e, x, y) {
        this.polyline.arrPoint.push({
            x: x,
            y: y
        });
        if (e.ClickCount > 1) {
            History.Create_NewPoint();
            var sp = this.polyline.createShape();
            var p = editor.WordControl.m_oLogicDocument;
            if (p.Document_Is_SelectionLocked(changestype_AddShape, sp) === false) {
                this.drawingObjects.addToSpTreeToPos(this.drawingObjects.cSld.spTree.length, sp);
                p.Recalculate();
            } else {
                History.Undo();
            }
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            editor.sync_EndAddShape();
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (e.which > 0 && e.type === "mousemove") {
            this.polyline.arrPoint[this.polyline.arrPoint.length - 1] = {
                x: x,
                y: y
            };
        } else {
            var _last_point = this.polyline.arrPoint[this.polyline.arrPoint.length - 1];
            var dx = x - _last_point.x;
            var dy = y - _last_point.y;
            if (Math.sqrt(dx * dx + dy * dy) >= this.minDistance) {
                this.polyline.arrPoint.push({
                    x: x,
                    y: y
                });
            }
        }
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return null;
    };
    this.drawSelection = function (drawingDocument) {};
}
function CheckObjectLine(obj) {
    return (obj instanceof CShape && obj.spPr.geometry && obj.spPr.geometry.preset === "line");
}
function DrawDefaultSelection(drawingObjectsController, drawingDocument) {
    var selected_objects = drawingObjectsController.selectedObjects;
    for (var i = 0; i < selected_objects.length; ++i) {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, selected_objects[i].getTransformMatrix(), 0, 0, selected_objects[i].extX, selected_objects[i].extY, CheckObjectLine(selected_objects[i]), selected_objects[i].canRotate());
    }
    if (selected_objects.length === 1) {
        selected_objects[0].drawAdjustments(drawingDocument);
    }
}
function DrawGroupSelection(group, drawingDocument) {
    drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, group.getTransformMatrix(), 0, 0, group.extX, group.extY, false, group.canRotate());
    var group_selected_objects = group.selectedObjects;
    for (var i = 0; i < group_selected_objects.length; ++i) {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, group_selected_objects[i].getTransformMatrix(), 0, 0, group_selected_objects[i].extX, group_selected_objects[i].extY, CheckObjectLine(group_selected_objects[i]), group_selected_objects[i].canRotate());
    }
    if (group_selected_objects.length === 1) {
        group_selected_objects[0].drawAdjustments(drawingDocument);
    }
}
function CompareGroups(a, b) {
    if (!isRealObject(a.group) && !isRealObject(b.group)) {
        return 0;
    }
    if (!isRealObject(a.group)) {
        return 1;
    }
    if (!isRealObject(b.group)) {
        return -1;
    }
    var count1 = 0;
    var cur_group = a.group;
    while (isRealObject(cur_group)) {
        ++count1;
        cur_group = cur_group.group;
    }
    var count2 = 0;
    cur_group = b.group;
    while (isRealObject(cur_group)) {
        ++count2;
        cur_group = cur_group.group;
    }
    return count1 - count2;
}