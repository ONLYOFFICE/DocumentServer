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
var STATES_ID_EXPECT_DOUBLE_CLICK = 56;
var STATES_ID_PRE_MOVE_CHART_TITLE_GROUP = 57;
var STATES_ID_MOVE_CHART_TITLE_GROUP = 64;
var STATES_ID_CHART_GROUP = 65;
var STATES_ID_CHART_TEXT_GROUP = 66;
var ADD_SHAPE_ID_MAP = {};
ADD_SHAPE_ID_MAP[STATES_ID_START_TRACK_NEW_SHAPE] = true;
ADD_SHAPE_ID_MAP[STATES_ID_BEGIN_TRACK_NEW_SHAPE] = true;
ADD_SHAPE_ID_MAP[STATES_ID_TRACK_NEW_SHAPE] = true;
ADD_SHAPE_ID_MAP[STATES_ID_SPLINE_BEZIER] = true;
ADD_SHAPE_ID_MAP[STATES_ID_SPLINE_BEZIER33] = true;
ADD_SHAPE_ID_MAP[STATES_ID_SPLINE_BEZIER2] = true;
ADD_SHAPE_ID_MAP[STATES_ID_SPLINE_BEZIER3] = true;
ADD_SHAPE_ID_MAP[STATES_ID_SPLINE_BEZIER5] = true;
ADD_SHAPE_ID_MAP[STATES_ID_POLY_LINE_ADD] = true;
ADD_SHAPE_ID_MAP[STATES_ID_POLY_LINE_ADD2] = true;
ADD_SHAPE_ID_MAP[STATES_ID_ADD_PPOLY_LINE2] = true;
ADD_SHAPE_ID_MAP[STATES_ID_ADD_PPOLY_LINE22] = true;
ADD_SHAPE_ID_MAP[STATES_ID_ADD_PPOLY_LINE23] = true;
var TRACK_SHAPE_MAP = {};
TRACK_SHAPE_MAP[STATES_ID_ROTATE] = true;
TRACK_SHAPE_MAP[STATES_ID_RESIZE] = true;
TRACK_SHAPE_MAP[STATES_ID_MOVE] = true;
TRACK_SHAPE_MAP[STATES_ID_CHANGE_ADJ] = true;
TRACK_SHAPE_MAP[STATES_ID_CHANGE_ADJ_IN_GROUP] = true;
TRACK_SHAPE_MAP[STATES_ID_ROTATE_IN_GROUP] = true;
TRACK_SHAPE_MAP[STATES_ID_RESIZE_IN_GROUP] = true;
TRACK_SHAPE_MAP[STATES_ID_MOVE_IN_GROUP] = true;
TRACK_SHAPE_MAP[STATES_ID_MOVE_INTERNAL_CHART_OBJECT] = true;
TRACK_SHAPE_MAP[STATES_ID_MOVE_CHART_TITLE_GROUP] = true;
function CheckIdSatetShapeAdd(id) {
    return ADD_SHAPE_ID_MAP[id] === true;
}
function CheckIdTrackState(id) {
    return CheckIdSatetShapeAdd(id) || (TRACK_SHAPE_MAP[id] === true);
}
var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
function handleSelectedObjects(drawingObjectsController, drawingObjects, e, x, y) {
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
                    return false;
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
            drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.shiftKey, e.ctrl, selected_objects[i], true, false));
            return true;
        }
    }
}
function handleSelectedObjectsCursorType(drawingObjectsController, drawingObjects, e, x, y) {
    var selected_objects = drawingObjectsController.selectedObjects;
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
                if (selected_objects[i].canRotate()) {
                    return {
                        objectId: selected_objects[i].Id,
                        cursorType: "crosshair"
                    };
                }
            } else {
                if (selected_objects[i].canResize()) {
                    var card_direction = selected_objects[i].getCardDirectionByNum(hit_to_handles);
                    return {
                        objectId: selected_objects[i].Id,
                        cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                    };
                }
            }
        }
    }
    for (i = selected_objects.length - 1; i > -1; --i) {
        if (selected_objects[i].hitInBoundingRect(x, y)) {
            if (selected_objects[i].canMove()) {
                return {
                    objectId: selected_objects[i].Id,
                    cursorType: "move"
                };
            }
        }
    }
}
function handleShapeImage(drawing, drawingObjects, drawingObjectsController, e, x, y) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
        drawingObjectsController.clearPreTrackObjects();
        var is_selected = drawing.selected;
        if (! (e.ctrlKey || e.shiftKey) && !is_selected) {
            drawingObjectsController.resetSelection();
        }
        drawing.select(drawingObjectsController);
        var selected_objects = drawingObjectsController.selectedObjects;
        for (var j = 0; j < selected_objects.length; ++j) {
            drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
        }
        drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.shiftKey, e.ctrl, drawing, is_selected, true));
        return true;
    } else {
        if (hit_in_text_rect) {
            drawingObjectsController.resetSelection();
            drawing.select(drawingObjectsController);
            drawing.selectionSetStart(e, x, y);
            drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjects, drawing));
            if (e.ClickCount < 2) {
                drawing.updateSelectionState(drawingObjects.drawingDocument);
            }
            drawingObjects.OnUpdateOverlay();
            return true;
        }
    }
    return false;
}
function handleShapeImageCursorType(drawing, drawingObjects, drawingObjectsController, e, x, y) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
        return {
            objectId: drawing.Id,
            cursorType: "move"
        };
    } else {
        if (hit_in_text_rect) {
            return {
                objectId: drawing.Id,
                cursorType: "text",
                hyperlink: hit_in_text_rect
            };
        }
    }
    return null;
}
function handleGroupedShapeImage(drawing, group, drawingObjects, drawingObjectsController, e, x, y) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
        drawingObjectsController.clearPreTrackObjects();
        var is_selected = group.selected;
        if (! (e.ctrlKey || e.shiftKey) && !is_selected) {
            drawingObjectsController.resetSelection();
        }
        group.select(drawingObjectsController);
        drawingObjects.OnUpdateOverlay();
        var selected_objects = drawingObjectsController.selectedObjects;
        for (var j = 0; j < selected_objects.length; ++j) {
            drawingObjectsController.addPreTrackObject(selected_objects[j].createMoveTrack());
        }
        drawingObjectsController.changeCurrentState(new PreMoveState(drawingObjectsController, drawingObjects, x, y, e.shiftKey, e.ctrl, group, is_selected, true));
        return true;
    } else {
        if (hit_in_text_rect) {
            drawingObjectsController.resetSelection();
            group.select(drawingObjectsController);
            drawing.select(drawingObjectsController);
            drawing.selectionSetStart(e, x, y);
            drawingObjectsController.changeCurrentState(new TextAddInGroup(drawingObjectsController, drawingObjects, group, drawing));
            if (e.ClickCount < 2) {
                drawing.updateSelectionState(drawingObjects.drawingDocument);
            }
            drawingObjects.OnUpdateOverlay();
            return true;
        }
    }
}
function handleGroupedShapeImageCursorType(drawing, group, drawingObjects, drawingObjectsController, e, x, y) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
        return {
            objectId: group.Id,
            cursorType: "move"
        };
    } else {
        if (hit_in_text_rect) {
            return {
                objectId: group.Id,
                cursorType: "text",
                hyperlink: hit_in_text_rect
            };
        }
    }
    return null;
}
function handleGroup(drawing, drawingObjects, drawingObjectsController, e, x, y) {
    var grouped_objects = drawing.getArrGraphicObjects();
    for (var j = grouped_objects.length - 1; j > -1; --j) {
        if (handleGroupedShapeImage(grouped_objects[j], drawing, drawingObjects, drawingObjectsController, e, x, y)) {
            return true;
        }
    }
    return false;
}
function handleGroupCursorType(drawing, drawingObjects, drawingObjectsController, e, x, y) {
    var grouped_objects = drawing.getArrGraphicObjects();
    for (var j = grouped_objects.length - 1; j > -1; --j) {
        var cursor_object = handleGroupedShapeImageCursorType(grouped_objects[j], drawing, drawingObjects, drawingObjectsController, e, x, y);
        if (cursor_object) {
            return cursor_object;
        }
    }
    return null;
}
function handleChart(drawing, drawingObjects, drawingObjectsController, e, x, y) {
    if (drawing.hitInWorkArea(x, y)) {
        if (!e.shiftKey && !e.ctrlKey) {
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
                drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(drawingObjectsController, drawingObjects, x, y, object_for_move_in_chart, drawing));
                drawingObjects.OnUpdateOverlay();
                drawingObjectsController.updateSelectionState(drawingObjects.drawingDocument);
                return true;
            }
        }
    }
    return handleShapeImage(drawing, drawingObjects, drawingObjectsController, e, x, y);
}
function handleChartCursorType(drawing, drawingObjects, drawingObjectsController, e, x, y) {
    if (drawing.hitInWorkArea(x, y)) {
        if (!e.shiftKey && !e.ctrlKey) {
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
                return {
                    objectId: drawing.Id,
                    cursorType: "move"
                };
            }
        }
    }
    return handleShapeImageCursorType(drawing, drawingObjects, drawingObjectsController, e, x, y);
}
function handleCurrentGroup(drawing, drawingObjects, drawingObjectsController, e, x, y) {
    var arr_graphic_objects = drawing.getArrGraphicObjects();
    for (var i = arr_graphic_objects.length - 1; i > -1; --i) {
        var cur_drawing = arr_graphic_objects[i];
        if (cur_drawing instanceof CShape || cur_drawing instanceof CImageShape) {
            if (handleShapeImageInCurrentGroup(cur_drawing, drawing, drawingObjects, drawingObjectsController, e, x, y)) {
                return true;
            }
        }
        if (typeof CChartAsGroup != "undefined" && cur_drawing instanceof CChartAsGroup) {
            if (handleChartInCurrentGroup(cur_drawing, drawing, drawingObjects, drawingObjectsController, e, x, y)) {
                return true;
            }
        }
    }
    return false;
}
function handleCurrentGroupCursorType(drawing, drawingObjects, drawingObjectsController, e, x, y) {
    var arr_graphic_objects = drawing.getArrGraphicObjects();
    for (var i = arr_graphic_objects.length - 1; i > -1; --i) {
        var cur_drawing = arr_graphic_objects[i];
        if (cur_drawing instanceof CShape || cur_drawing instanceof CImageShape) {
            var cursor_type = handleShapeImageInCurrentGroupCursorType(cur_drawing, drawing, drawingObjects, drawingObjectsController, e, x, y);
            if (cursor_type) {
                return cursor_type;
            }
        }
        if (typeof CChartAsGroup != "undefined" && cur_drawing instanceof CChartAsGroup) {
            var cursor_type = handleChartInCurrentGroupCursorType(cur_drawing, drawing, drawingObjects, drawingObjectsController, e, x, y);
            if (cursor_type) {
                return cursor_type;
            }
        }
    }
    return null;
}
function handleShapeImageInCurrentGroup(drawing, group, drawingObjects, drawingObjectsController, e, x, y) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
        var is_selected = drawing.selected;
        if (! (e.ctrlKey || e.shiftKey) && !is_selected) {
            group.resetSelection();
        }
        drawing.select(drawingObjectsController);
        drawingObjects.OnUpdateOverlay();
        var group_selected_objects = group.selectedObjects;
        for (var j = 0; j < group_selected_objects.length; ++j) {
            drawingObjectsController.addPreTrackObject(group_selected_objects[j].createMoveInGroupTrack());
        }
        drawingObjectsController.changeCurrentState(new PreMoveInGroupState(drawingObjectsController, drawingObjects, group, x, y, e.shiftKey, e.ctrl, drawing, is_selected));
        drawingObjects.OnUpdateOverlay();
        return true;
    } else {
        if (hit_in_text_rect) {
            drawingObjectsController.resetSelection();
            group.select(drawingObjectsController);
            drawing.select(group);
            drawing.selectionSetStart(e, x, y);
            drawingObjectsController.changeCurrentState(new TextAddInGroup(drawingObjectsController, drawingObjects, group, drawing));
            if (e.ClickCount < 2) {
                drawing.updateSelectionState(drawingObjects.drawingDocument);
            }
            return true;
        }
    }
}
function handleShapeImageInCurrentGroupCursorType(drawing, group, drawingObjects, drawingObjectsController, e, x, y) {
    var hit_in_inner_area = drawing.hitInInnerArea(x, y);
    var hit_in_path = drawing.hitInPath(x, y);
    var hit_in_text_rect = drawing.hitInTextRect(x, y);
    if (hit_in_inner_area && !hit_in_text_rect || hit_in_path) {
        return {
            objectId: group.Id,
            cursorType: "move"
        };
    } else {
        if (hit_in_text_rect) {
            return {
                objectId: group.Id,
                cursorType: "text",
                hyperlink: hit_in_text_rect
            };
        }
    }
    return null;
}
function handleChartInCurrentGroup(drawing, group, drawingObjects, drawingObjectsController, e, x, y) {
    if (drawing.hitInWorkArea(x, y)) {
        if (!e.shiftKey && !e.ctrlKey) {
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
                group.resetSelection();
                drawing.select(drawingObjectsController);
                object_for_move_in_chart.select();
                drawingObjectsController.clearPreTrackObjects();
                drawingObjectsController.addPreTrackObject(new MoveTitleInChart(object_for_move_in_chart));
                drawingObjectsController.changeCurrentState(new PreMoveChartTitleGroup(drawingObjectsController, drawingObjects, group, drawing, object_for_move_in_chart, x, y));
                drawingObjects.OnUpdateOverlay();
                drawingObjectsController.updateSelectionState(drawingObjects.drawingDocument);
                return true;
            }
        }
    }
    return handleShapeImageInCurrentGroup(drawing, group, drawingObjects, drawingObjectsController, e, x, y);
}
function handleChartInCurrentGroupCursorType(drawing, group, drawingObjects, drawingObjectsController, e, x, y) {
    if (drawing.hitInWorkArea(x, y)) {
        if (!e.shiftKey && !e.ctrlKey) {
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
                return {
                    objectId: group.Id,
                    cursorType: "move"
                };
            }
        }
    }
    return handleShapeImageInCurrentGroupCursorType(drawing, group, drawingObjects, drawingObjectsController, e, x, y);
}
function handleSelectedObjectsGroup(group, drawingObjects, drawingObjectsController, e, x, y) {
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
                    return;
                }
                for (var j = 0; j < group_selected_objects.length; ++j) {
                    drawingObjectsController.addPreTrackObject(group_selected_objects[j].createRotateInGroupTrack());
                }
                drawingObjectsController.changeCurrentState(new PreRotateInGroupState(drawingObjectsController, drawingObjects, group, group_selected_objects[i]));
            } else {
                if (!group_selected_objects[i].canResize()) {
                    return false;
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
    return handleSelectedObjects(drawingObjectsController, drawingObjects, e, x, y);
}
function handleSelectedObjectsGroupCursorType(group, drawingObjects, drawingObjectsController, e, x, y) {
    var group_selected_objects = group.selectedObjects;
    if (group_selected_objects.length === 1) {
        var hit_to_adj = group_selected_objects[0].hitToAdjustment(x, y);
        if (hit_to_adj.hit) {
            return {
                objectId: group.Id,
                cursorType: "crosshair"
            };
        }
    }
    for (var i = group_selected_objects.length - 1; i > -1; --i) {
        var hit_to_handles = group_selected_objects[i].hitToHandles(x, y);
        if (hit_to_handles > -1) {
            if (hit_to_handles === 8) {
                return {
                    objectId: group.Id,
                    cursorType: "crosshair"
                };
            } else {
                var card_direction = group_selected_objects[i].getCardDirectionByNum(hit_to_handles);
                return {
                    objectId: group.Id,
                    cursorType: CURSOR_TYPES_BY_CARD_DIRECTION[card_direction]
                };
            }
        }
    }
    return handleSelectedObjectsCursorType(drawingObjectsController, drawingObjects, e, x, y);
}
function handleGroupState(drawingObjects, drawingObjectsController, group, e, x, y) {
    if (handleSelectedObjectsGroup(group, drawingObjects, drawingObjectsController, e, x, y)) {
        return true;
    }
    var drawing_bases = drawingObjects.getDrawingObjects();
    var selected_objects = drawingObjectsController.selectedObjects;
    for (var i = drawing_bases.length - 1; i > -1; --i) {
        var cur_drawing_base = drawing_bases[i];
        var cur_drawing = cur_drawing_base.graphicObject;
        if (cur_drawing.isShape() || cur_drawing.isImage()) {
            if (handleShapeImage(cur_drawing, drawingObjects, drawingObjectsController, e, x, y)) {
                return true;
            }
        } else {
            if (cur_drawing.isChart()) {
                if (handleChart(cur_drawing, drawingObjects, drawingObjectsController, e, x, y)) {
                    return true;
                }
            } else {
                if (cur_drawing.isGroup()) {
                    if (group === cur_drawing) {
                        if (handleCurrentGroup(group, drawingObjects, drawingObjectsController, e, x, y)) {
                            return true;
                        }
                    } else {
                        if (handleGroup(cur_drawing, drawingObjects, drawingObjectsController, e, x, y)) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    group.resetSelection(drawingObjectsController);
    drawingObjectsController.resetSelection();
    drawingObjectsController.changeCurrentState(new NullState(drawingObjectsController, drawingObjects));
    drawingObjects.OnUpdateOverlay();
    return false;
}
function handleGroupStateCursorType(drawingObjects, drawingObjectsController, group, e, x, y) {
    var cursor_type = handleSelectedObjectsGroupCursorType(group, drawingObjects, drawingObjectsController, e, x, y);
    if (cursor_type) {
        return cursor_type;
    }
    var drawing_bases = drawingObjects.getDrawingObjects();
    var selected_objects = drawingObjectsController.selectedObjects;
    for (var i = drawing_bases.length - 1; i > -1; --i) {
        var cur_drawing_base = drawing_bases[i];
        var cur_drawing = cur_drawing_base.graphicObject;
        if (cur_drawing.isShape() || cur_drawing.isImage()) {
            cursor_type = handleShapeImageCursorType(cur_drawing, drawingObjects, drawingObjectsController, e, x, y);
            if (cursor_type) {
                return cursor_type;
            }
        } else {
            if (cur_drawing.isChart()) {
                cursor_type = handleChartCursorType(cur_drawing, drawingObjects, drawingObjectsController, e, x, y);
                if (cursor_type) {
                    return cursor_type;
                }
            } else {
                if (cur_drawing.isGroup()) {
                    if (group === cur_drawing) {
                        cursor_type = handleCurrentGroupCursorType(group, drawingObjects, drawingObjectsController, e, x, y);
                        if (cursor_type) {
                            return cursor_type;
                        }
                    } else {
                        cursor_type = handleGroupCursorType(cur_drawing, drawingObjects, drawingObjectsController, e, x, y);
                        if (cursor_type) {
                            return cursor_type;
                        }
                    }
                }
            }
        }
    }
    return null;
}
function handleCurrentChart(chart, drawingObjects, drawingObjectsController, e, x, y) {
    var titles = chart.getTitlesArray();
    if (!e.ctrlKey) {
        for (var i = 0; i < titles.length; ++i) {
            var title = titles[i];
            var hit_in_text = title.hitInTextRect(x, y);
            if (hit_in_text && title.selected) {
                drawingObjectsController.changeCurrentState(new ChartTextAdd(drawingObjectsController, drawingObjects, chart, title));
                title.selectionSetStart(e, x, y);
                if (e.ClickCount < 2) {
                    title.updateSelectionState(drawingObjects.drawingDocument);
                }
                drawingObjects.OnUpdateOverlay();
                return true;
            } else {
                if (hit_in_text || title.hitInInnerArea(x, y) || title.hitInPath(x, y)) {
                    chart.resetSelection();
                    title.select();
                    drawingObjectsController.clearPreTrackObjects();
                    drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                    drawingObjectsController.changeCurrentState(new PreMoveInternalChartObjectState(drawingObjectsController, drawingObjects, x, y, title, chart));
                    drawingObjects.OnUpdateOverlay();
                    drawingObjectsController.updateSelectionState(drawingObjects.drawingDocument);
                    return true;
                }
            }
        }
    }
    return false;
}
function handleCurrentChartCursorType(chart, drawingObjects, drawingObjectsController, e, x, y) {
    var titles = chart.getTitlesArray();
    if (!e.ctrlKey) {
        for (var i = 0; i < titles.length; ++i) {
            var title = titles[i];
            var hit_in_text = title.hitInTextRect(x, y);
            if (hit_in_text && title.selected) {
                return {
                    objectId: chart.Id,
                    cursorType: "text"
                };
            } else {
                if (hit_in_text || title.hitInInnerArea(x, y) || title.hitInPath(x, y)) {
                    return {
                        objectId: chart.Id,
                        cursorType: "move"
                    };
                }
            }
        }
    }
    return null;
}
function handleCurrentChartInGroup(chart, group, drawingObjects, drawingObjectsController, e, x, y) {
    var titles = chart.getTitlesArray();
    if (!e.ctrlKey) {
        for (var i = 0; i < titles.length; ++i) {
            var title = titles[i];
            var hit_in_text = title.hitInTextRect(x, y);
            if (hit_in_text && title.selected) {
                drawingObjectsController.changeCurrentState(new ChartTextAddGroup(drawingObjectsController, drawingObjects, group, chart, title));
                title.selectionSetStart(e, x, y);
                if (e.ClickCount < 2) {
                    title.updateSelectionState(drawingObjects.drawingDocument);
                }
                drawingObjects.OnUpdateOverlay();
                return true;
            } else {
                if (hit_in_text || title.hitInInnerArea(x, y) || title.hitInPath(x, y)) {
                    chart.resetSelection();
                    title.select();
                    drawingObjectsController.clearPreTrackObjects();
                    drawingObjectsController.addPreTrackObject(new MoveTitleInChart(title));
                    drawingObjectsController.changeCurrentState(new PreMoveChartTitleGroup(drawingObjectsController, drawingObjects, group, chart, title, x, y));
                    drawingObjects.OnUpdateOverlay();
                    drawingObjectsController.updateSelectionState(drawingObjects.drawingDocument);
                    return true;
                }
            }
        }
    }
    return false;
}
function handleCurrentChartInGroupCursorType(chart, group, drawingObjects, drawingObjectsController, e, x, y) {
    var titles = chart.getTitlesArray();
    if (!e.ctrlKey) {
        for (var i = 0; i < titles.length; ++i) {
            var title = titles[i];
            var hit_in_text = title.hitInTextRect(x, y);
            if (hit_in_text && title.selected) {
                return {
                    objectId: group.Id,
                    cursorType: "text"
                };
            } else {
                if (hit_in_text || title.hitInInnerArea(x, y) || title.hitInPath(x, y)) {
                    return {
                        objectId: group.Id,
                        cursorType: "move"
                    };
                }
            }
        }
    }
    return null;
}
function handleNullState(drawingObjectsController, drawingObjects, e, x, y) {
    if (handleSelectedObjects(drawingObjectsController, drawingObjects, e, x, y)) {
        return true;
    }
    var selected_objects = drawingObjectsController.selectedObjects;
    var arr_drawing_objects = drawingObjects.getDrawingObjects();
    for (var i = arr_drawing_objects.length - 1; i > -1; --i) {
        var cur_drawing_base = arr_drawing_objects[i];
        if (cur_drawing_base.isGraphicObject()) {
            var cur_drawing = cur_drawing_base.graphicObject;
            if (cur_drawing.isShape() || cur_drawing.isImage()) {
                if (handleShapeImage(cur_drawing, drawingObjects, drawingObjectsController, e, x, y)) {
                    return true;
                }
            } else {
                if (cur_drawing.isGroup()) {
                    if (handleGroup(cur_drawing, drawingObjects, drawingObjectsController, e, x, y)) {
                        return true;
                    }
                } else {
                    if (cur_drawing.isChart()) {
                        if (handleChart(cur_drawing, drawingObjects, drawingObjectsController, e, x, y)) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    drawingObjectsController.resetSelection();
    drawingObjectsController.changeCurrentState(new NullState(drawingObjectsController, drawingObjects));
    drawingObjectsController.updateSelectionState();
    drawingObjects.OnUpdateOverlay();
}
function handleNullStateCursorType(drawingObjectsController, drawingObjects, e, x, y) {
    var e = {};
    var cursor_type = handleSelectedObjectsCursorType(drawingObjectsController, drawingObjects, e, x, y);
    if (cursor_type) {
        return cursor_type;
    }
    var selected_objects = drawingObjectsController.selectedObjects;
    var arr_drawing_objects = drawingObjects.getDrawingObjects();
    for (var i = arr_drawing_objects.length - 1; i > -1; --i) {
        var cur_drawing_base = arr_drawing_objects[i];
        if (cur_drawing_base.isGraphicObject()) {
            var cur_drawing = cur_drawing_base.graphicObject;
            if (cur_drawing.isShape() || cur_drawing.isImage()) {
                cursor_type = handleShapeImageCursorType(cur_drawing, drawingObjects, drawingObjectsController, e, x, y);
                if (cursor_type) {
                    return cursor_type;
                }
            } else {
                if (cur_drawing.isGroup()) {
                    cursor_type = handleGroupCursorType(cur_drawing, drawingObjects, drawingObjectsController, e, x, y);
                    if (cursor_type) {
                        return cursor_type;
                    }
                } else {
                    if (cur_drawing.isChart()) {
                        cursor_type = handleChartCursorType(cur_drawing, drawingObjects, drawingObjectsController, e, x, y);
                        if (cursor_type) {
                            return cursor_type;
                        }
                    }
                }
            }
        }
    }
    return null;
}
function NullState(drawingObjectsController, drawingObjects) {
    this.id = STATES_ID_NULL;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.onMouseDown = function (e, x, y) {
        handleNullState(this.drawingObjectsController, this.drawingObjects, e, x, y);
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(this.drawingObjectsController, e);
        var b_prevent_default = false;
        var selected_objects = this.drawingObjectsController.selectedObjects;
        switch (e.keyCode) {
        case 9:
            var a_drawing_bases = this.drawingObjects.getDrawingObjects();
            if (!e.shiftKey) {
                var last_selected = null,
                last_selected_index = null;
                for (var i = a_drawing_bases.length - 1; i > -1; --i) {
                    if (a_drawing_bases[i].graphicObject.selected) {
                        last_selected = a_drawing_bases[i].graphicObject;
                        last_selected_index = i;
                        break;
                    }
                }
                if (isRealObject(last_selected)) {
                    b_prevent_default = true;
                    this.drawingObjectsController.resetSelection();
                    if (!last_selected.isGroup() || last_selected.arrGraphicObjects.length === 0) {
                        if (last_selected_index < a_drawing_bases.length - 1) {
                            a_drawing_bases[last_selected_index + 1].graphicObject.select(this.drawingObjectsController);
                        } else {
                            a_drawing_bases[0].graphicObject.select(this.drawingObjectsController);
                        }
                    } else {
                        last_selected.select(this.drawingObjectsController);
                        last_selected.arrGraphicObjects[0].select(last_selected);
                        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, last_selected));
                    }
                }
            } else {
                var first_selected = null,
                first_selected_index = null;
                for (var i = 0; i < a_drawing_bases.length; ++i) {
                    if (a_drawing_bases[i].graphicObject.selected) {
                        first_selected = a_drawing_bases[i].graphicObject;
                        first_selected_index = i;
                        break;
                    }
                }
                if (isRealObject(first_selected)) {
                    b_prevent_default = true;
                    this.drawingObjectsController.resetSelection();
                    if (!first_selected.isGroup() || first_selected.arrGraphicObjects.length === 0) {
                        if (first_selected_index > 0) {
                            a_drawing_bases[first_selected_index - 1].graphicObject.select(this.drawingObjectsController);
                        } else {
                            a_drawing_bases[a_drawing_bases.length - 1].graphicObject.select(this.drawingObjectsController);
                        }
                    } else {
                        first_selected.select(this.drawingObjectsController);
                        first_selected.arrGraphicObjects[first_selected.arrGraphicObjects.length - 1].select(first_selected);
                        this.drawingObjectsController.changeCurrentState(new GroupState(this.drawingObjectsController, this.drawingObjects, first_selected));
                    }
                }
            }
            this.drawingObjects.OnUpdateOverlay();
            break;
        case 46:
            case 8:
            History.Create_NewPoint();
            DeleteSelectedObjects(this.drawingObjectsController);
            this.drawingObjects.showDrawingObjects(true);
            b_prevent_default = true;
        }
        if (b_prevent_default) {
            e.preventDefault();
        }
    };
    this.onKeyPress = function (e) {
        if (! (e.metaKey && window.USER_AGENT_SAFARI_MACOS)) {
            var selected_objects = this.drawingObjectsController.selectedObjects;
            if (selected_objects.length === 1 && selected_objects[0].isShape()) {
                this.drawingObjects.objectLocker.reset();
                this.drawingObjects.objectLocker.addObjectId(selected_objects[0].Get_Id());
                var drawingObjects = this.drawingObjects;
                var text_object = selected_objects[0];
                var callback = function (bLock) {
                    if (bLock) {
                        History.Create_NewPoint();
                        var sp = text_object;
                        if (sp && sp.txBody && sp.txBody.content && sp.txBody.content.Cursor_MoveToEndPos) {
                            sp.txBody.content.Cursor_MoveToEndPos();
                        }
                        text_object.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                        drawingObjects.showDrawingObjects(true);
                        text_object.updateSelectionState(drawingObjects.drawingDocument);
                        drawingObjects.controller.changeCurrentState(new TextAddState(drawingObjects.controller, drawingObjects, text_object));
                    }
                };
                this.drawingObjects.objectLocker.checkObjects(callback);
            }
        }
    };
    this.drawSelection = function (drawingDocument) {
        DrawDefaultSelection(this.drawingObjectsController, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return handleNullStateCursorType(this.drawingObjectsController, this.drawingObjects, {},
        x, y);
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
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.removeHyperlink = function () {
        if (typeof this.textObject.removeHyperlink === "function") {
            this.textObject.removeHyperlink();
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
}
function PreMoveInternalChartObjectState(drawingObjectsController, drawingObjects, startX, startY, chartElement, chart) {
    this.id = STATES_ID_PRE_MOVE_INTERNAL_CHART_OBJECT;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.chartElement = chartElement;
    this.chart = chart;
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
            objectId: this.chartElement.chartGroup.Id,
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
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjectsController.trackMoveObjects(dx, dy);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        var track_objects = this.drawingObjectsController.arrTrackObjects;
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        if (!isViewMode) {
            this.drawingObjects.objectLocker.addObjectId(this.chartElement.chartGroup.Get_Id());
            var track_objects2 = [];
            for (var i = 0; i < track_objects.length; ++i) {
                track_objects2.push(track_objects[i]);
            }
            var drawingObjects = this.drawingObjects;
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint();
                    track_objects2[0].trackEnd();
                    drawingObjects.showDrawingObjects(true);
                }
            };
            this.drawingObjects.objectLocker.checkObjects(callback);
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
function ChartState(drawingObjectsController, drawingObjects, chart) {
    this.id = STATES_ID_CHART;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.chart = chart;
    this.onMouseDown = function (e, x, y) {
        if (handleCurrentChart(this.chart, this.drawingObjects, this.drawingObjectsController, e, x, y)) {
            return true;
        }
        handleNullState(this.drawingObjectsController, this.drawingObjects, e, x, y);
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(this.drawingObjectsController, e);
    };
    this.onKeyPress = function (e) {
        if (! (e.metaKey && window.USER_AGENT_SAFARI_MACOS)) {
            var selected_title = this.chart.getSelectedTitle();
            if (selected_title) {
                this.drawingObjects.objectLocker.reset();
                this.drawingObjects.objectLocker.addObjectId(this.chart.Get_Id());
                var drawingObjects = this.drawingObjects;
                var text_object = selected_title;
                var chart = this.chart;
                var callback = function (bLock) {
                    if (bLock) {
                        History.Create_NewPoint();
                        drawingObjects.controller.changeCurrentState(new ChartTextAdd(drawingObjects.controller, drawingObjects, chart, text_object));
                        var sp = text_object;
                        if (sp && sp.txBody && sp.txBody.content && sp.txBody.content.Cursor_MoveToEndPos) {
                            sp.txBody.content.Cursor_MoveToEndPos();
                        }
                        text_object.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                        drawingObjects.showDrawingObjects(true);
                        drawingObjects.controller.updateSelectionState(drawingObjects.drawingDocument);
                        drawingObjects.OnUpdateOverlay();
                    }
                };
                this.drawingObjects.objectLocker.checkObjects(callback);
            }
        }
    };
    this.drawSelection = function (drawingDocument) {
        DrawChartSelection(this.chart, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        var e = {};
        var cursor_type = handleCurrentChartCursorType(this.chart, this.drawingObjects, this.drawingObjectsController, e, x, y);
        if (cursor_type) {
            return cursor_type;
        }
        return handleNullStateCursorType(this.drawingObjectsController, this.drawingObjects, e, x, y);
    };
    this.getSelectTitle = function () {
        var chart = this.chart;
        if (chart.chartTitle && chart.chartTitle.selected) {
            return chart.chartTitle;
        }
        if (chart.hAxisTitle && chart.hAxisTitle.selected) {
            return chart.hAxisTitle;
        }
        if (chart.vAxisTitle && chart.vAxisTitle.selected) {
            return chart.vAxisTitle;
        }
        return null;
    };
    this.setCellFontName = function (fontName) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllFontName === "function") {
            title.setCellAllFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellAlign = function (align) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllAlign === "function") {
            title.setCellAllAlign(align);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellFontSize = function (fontSize) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllFontSize === "function") {
            title.setCellAllFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellBold = function (isBold) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllBold === "function") {
            title.setCellAllBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellItalic = function (isItalic) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllItalic === "function") {
            title.setCellAllItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellUnderline = function (isUnderline) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllUnderline === "function") {
            title.setCellAllUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellStrikeout = function (isStrikeout) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllStrikeout === "function") {
            title.setCellAllStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellSubscript = function (isSubscript) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllSubscript === "function") {
            title.setCellAllSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellSuperscript = function (isSuperscript) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllSuperscript === "function") {
            title.setCellAllSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.setCellTextColor = function (color) {
        var title = this.getSelectTitle();
        if (title && typeof title.setCellAllTextColor === "function") {
            title.setCellAllTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.increaseFontSize = function () {
        var title = this.getSelectTitle();
        if (title && typeof title.increaseAllFontSize === "function") {
            title.increaseAllFontSize();
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.decreaseFontSize = function () {
        var title = this.getSelectTitle();
        if (title && typeof title.decreaseAllFontSize === "function") {
            title.decreaseAllFontSize();
            this.drawingObjects.showDrawingObjects(true);
        }
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
        this.drawingObjects.OnUpdateOverlay();
        if (this.drawingObjectsController.curState.id !== STATES_ID_CHART_TEXT_ADD || this.drawingObjectsController.curState.textObject !== this.textObject) {
            this.chart.recalculate();
            this.drawingObjects.showDrawingObjects(true);
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (e.isLocked && e.type === "mousemove") {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.onMouseUp = function (e, x, y) {
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
    };
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(this.drawingObjectsController, e);
    };
    this.onKeyPress = function (e) {
        if (! (e.metaKey && window.USER_AGENT_SAFARI_MACOS)) {
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(this.chart.Get_Id());
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
        }
    };
    this.drawSelection = function (drawingDocument) {
        DrawChartTextSelection(this.chart, this.textObject, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return this.chartState.isPointInDrawingObjects(x, y);
    };
    this.setCellFontName = function (fontName) {
        if (typeof this.textObject.setCellFontName === "function") {
            this.textObject.setCellFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellFontSize = function (fontSize) {
        if (typeof this.textObject.setCellFontSize === "function") {
            this.textObject.setCellFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellBold = function (isBold) {
        if (typeof this.textObject.setCellBold === "function") {
            this.textObject.setCellBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellItalic = function (isItalic) {
        if (typeof this.textObject.setCellItalic === "function") {
            this.textObject.setCellItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellAlign = function (align) {
        if (typeof this.textObject.setCellAlign === "function") {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellUnderline = function (isUnderline) {
        if (typeof this.textObject.setCellUnderline === "function") {
            this.textObject.setCellUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellStrikeout = function (isStrikeout) {
        if (typeof this.textObject.setCellStrikeout === "function") {
            this.textObject.setCellStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellSubscript = function (isSubscript) {
        if (typeof this.textObject.setCellSubscript === "function") {
            this.textObject.setCellSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellSuperscript = function (isSuperscript) {
        if (typeof this.textObject.setCellSuperscript === "function") {
            this.textObject.setCellSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellAlign = function (align) {
        if (typeof this.textObject.setCellAlign === "function") {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellVertAlign = function (align) {
        if (typeof this.textObject.setCellVertAlign === "function") {
            this.textObject.setCellVertAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.drawingObjectsController.recalculateCurPos();
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellTextColor = function (color) {
        if (typeof this.textObject.setCellTextColor === "function") {
            this.textObject.setCellTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
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
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.increaseFontSize = function () {
        if (typeof this.textObject.increaseFontSize === "function") {
            this.textObject.increaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.decreaseFontSize = function () {
        if (typeof this.textObject.decreaseFontSize === "function") {
            this.textObject.decreaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
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
        if (this.drawingObjectsController.curState.id !== STATES_ID_TEXT_ADD || this.drawingObjectsController.curState.id !== STATES_ID_TEXT_ADD_IN_GROUP) {
            this.drawingObjectsController.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (e.isLocked && e.type === "mousemove") {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.onMouseUp = function (e, x, y) {
        if (e.button === 2) {
            var invert_text_transform = this.textObject.invertTransformText;
            var tx = invert_text_transform.TransformPointX(x, y);
            var ty = invert_text_transform.TransformPointY(x, y);
            if (this.textObject.txBody.content.Selection_Check(tx, ty, 0)) {
                return;
            }
        }
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
    };
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(drawingObjectsController, e);
    };
    this.onKeyPress = function (e) {
        if (! (e.metaKey && window.USER_AGENT_SAFARI_MACOS)) {
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
        }
    };
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.textObject.getTransform(), 0, 0, this.textObject.extX, this.textObject.extY, false, this.textObject.canRotate ? this.textObject.canRotate() : false);
        this.textObject.drawAdjustments(drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        var cursorInfo = this.nullState.isPointInDrawingObjects(x, y);
        return cursorInfo;
    };
    this.setCellFontName = function (fontName) {
        if (typeof this.textObject.setCellFontName === "function") {
            this.textObject.setCellFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellFontSize = function (fontSize) {
        if (typeof this.textObject.setCellFontSize === "function") {
            this.textObject.setCellFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellBold = function (isBold) {
        if (typeof this.textObject.setCellBold === "function") {
            this.textObject.setCellBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellItalic = function (isItalic) {
        if (typeof this.textObject.setCellItalic === "function") {
            this.textObject.setCellItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellUnderline = function (isUnderline) {
        if (typeof this.textObject.setCellUnderline === "function") {
            this.textObject.setCellUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellStrikeout = function (isStrikeout) {
        if (typeof this.textObject.setCellStrikeout === "function") {
            this.textObject.setCellStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellSubscript = function (isSubscript) {
        if (typeof this.textObject.setCellSubscript === "function") {
            this.textObject.setCellSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellSuperscript = function (isSuperscript) {
        if (typeof this.textObject.setCellSuperscript === "function") {
            this.textObject.setCellSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellAlign = function (align) {
        if (typeof this.textObject.setCellAlign === "function") {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellVertAlign = function (align) {
        if (typeof this.textObject.setCellVertAlign === "function") {
            this.textObject.setCellVertAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
            this.drawingObjectsController.recalculateCurPos();
        }
    };
    this.setCellTextColor = function (color) {
        if (typeof this.textObject.setCellTextColor === "function") {
            this.textObject.setCellTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
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
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.increaseFontSize = function () {
        if (typeof this.textObject.increaseFontSize === "function") {
            this.textObject.increaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.decreaseFontSize = function () {
        if (typeof this.textObject.decreaseFontSize === "function") {
            this.textObject.decreaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.insertHyperlink = function (options) {
        if (typeof this.textObject.insertHyperlink === "function") {
            this.textObject.insertHyperlink(options);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.removeHyperlink = function () {
        if (typeof this.textObject.removeHyperlink === "function") {
            this.textObject.removeHyperlink();
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
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
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        var arr_track_objects = [];
        for (var i = 0; i < this.drawingObjectsController.arrTrackObjects.length; ++i) {
            arr_track_objects.push(this.drawingObjectsController.arrTrackObjects[i]);
        }
        if (!isViewMode) {
            var worksheet = this.drawingObjects.getWorksheet();
            this.drawingObjects.objectLocker.reset();
            var track_objects = this.drawingObjectsController.arrTrackObjects;
            for (i = 0; i < track_objects.length; ++i) {
                this.drawingObjects.objectLocker.addObjectId(track_objects[i].originalObject.Get_Id());
            }
            var track_objects2 = [];
            for (i = 0; i < track_objects.length; ++i) {
                track_objects2.push(track_objects[i]);
            }
            var drawingObjects = this.drawingObjects;
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint();
                    for (var i = 0; i < track_objects2.length; ++i) {
                        track_objects2[i].trackEnd();
                    }
                    drawingObjects.showDrawingObjects(true);
                }
            };
            this.drawingObjects.objectLocker.checkObjects(callback);
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
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, x, y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        var worksheet = this.drawingObjects.getWorksheet();
        this.drawingObjects.objectLocker.reset();
        var track_objects = this.drawingObjectsController.arrTrackObjects;
        if (!isViewMode) {
            for (var i = 0; i < track_objects.length; ++i) {
                this.drawingObjects.objectLocker.addObjectId(track_objects[i].originalObject.Get_Id());
            }
            var track_objects2 = [];
            for (i = 0; i < track_objects.length; ++i) {
                track_objects2.push(track_objects[i]);
            }
            var drawingObjects = this.drawingObjects;
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint();
                    for (var i = 0; i < track_objects2.length; ++i) {
                        track_objects2[i].trackEnd();
                    }
                    drawingObjects.showDrawingObjects(true);
                    drawingObjects.sendGraphicObjectProps();
                }
            };
            this.drawingObjects.objectLocker.checkObjects(callback);
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
        asc["editor"].asc_endAddShape();
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
        this.drawingObjectsController.trackEnd();
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        if (this.presetGeom != "textRect") {
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        } else {
            if (isRealObject(this.resultObject)) {
                this.drawingObjectsController.changeCurrentState(new TextAddState(this.drawingObjectsController, this.drawingObjects, this.resultObject));
            }
        }
        this.drawingObjects.objectLocker.reset();
        this.drawingObjects.objectLocker.addObjectId(this.resultObject.Get_Id());
        this.drawingObjects.objectLocker.checkObjects(function (bLock) {});
        asc["editor"].asc_endAddShape();
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
            var gr_obj = this.majorObject;
            if (gr_obj.isChart()) {
                this.drawingObjectsController.changeCurrentState(new ExtpectDoubleClickState(this.drawingObjectsController, this.drawingObjects, gr_obj, x, y));
                return;
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
            if (this.majorObjectIsSelected && e.button !== 2) {
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
function ExtpectDoubleClickState(drawingObjectsController, drawingObjects, chart, x, y) {
    this.id = STATES_ID_EXPECT_DOUBLE_CLICK;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.nullState = new NullState(drawingObjectsController, drawingObjects);
    this.chart = chart;
    this.x = x;
    this.y = y;
    this.onMouseDown = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        if (e.ClickCount > 1 && (this.chart.lockType === c_oAscLockTypes.kLockTypeNone || this.chart.lockType === c_oAscLockTypes.kLockTypeMine)) {
            this.drawingObjects.showChartSettings();
        } else {
            this.drawingObjectsController.onMouseDown(e, x, y);
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (this.x === x && this.y === y) {
            return;
        }
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        this.drawingObjectsController.onMouseUp(e, x, y);
    };
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(this.drawingObjectsController, e);
    };
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
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        var check_position = this.drawingObjects.checkGraphicObjectPosition(this.rectX + dx, this.rectY + dy, this.rectW, this.rectH);
        this.drawingObjectsController.trackMoveObjects(dx + check_position.x, dy + check_position.y);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        var worksheet = this.drawingObjects.getWorksheet();
        var track_objects = this.drawingObjectsController.arrTrackObjects;
        var ctrlKey = e.ctrlKey;
        var track_objects2 = [];
        for (i = 0; i < track_objects.length; ++i) {
            track_objects2.push(track_objects[i]);
        }
        if (!isViewMode) {
            if (!ctrlKey) {
                this.drawingObjects.objectLocker.reset();
                for (var i = 0; i < track_objects.length; ++i) {
                    this.drawingObjects.objectLocker.addObjectId(track_objects[i].originalObject.Get_Id());
                }
                var drawingObjects = this.drawingObjects;
                var callback = function (bLock) {
                    if (bLock) {
                        History.Create_NewPoint();
                        for (var i = 0; i < track_objects2.length; ++i) {
                            track_objects2[i].trackEnd();
                        }
                        drawingObjects.showDrawingObjects(true);
                    }
                };
                this.drawingObjects.objectLocker.checkObjects(callback);
            } else {
                if (!asc["editor"].isChartEditor) {
                    this.drawingObjectsController.resetSelection();
                    History.Create_NewPoint();
                    for (var i = 0; i < track_objects2.length; ++i) {
                        var copy = track_objects2[i].originalObject.copy(track_objects2[i].x, track_objects2[i].y);
                        copy.select(this.drawingObjects.controller);
                        copy.addToDrawingObjects();
                    }
                }
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
        var worksheet = this.drawingObjects.getWorksheet();
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        if (!isViewMode) {
            this.drawingObjects.objectLocker.reset();
            var track_objects = this.drawingObjectsController.arrTrackObjects;
            for (var i = 0; i < track_objects.length; ++i) {
                this.drawingObjects.objectLocker.addObjectId(track_objects[i].originalShape.Get_Id());
            }
            var track_objects2 = [];
            for (i = 0; i < track_objects.length; ++i) {
                track_objects2.push(track_objects[i]);
            }
            var drawingObjects = this.drawingObjects;
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint();
                    for (var i = 0; i < track_objects2.length; ++i) {
                        track_objects2[i].trackEnd();
                    }
                    drawingObjects.showDrawingObjects(true);
                }
            };
            this.drawingObjects.objectLocker.checkObjects(callback);
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
        return handleGroupState(this.drawingObjects, this.drawingObjectsController, this.group, e, x, y);
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {};
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(this.drawingObjectsController, e);
    };
    this.onKeyPress = function (e) {
        if (! (e.metaKey && window.USER_AGENT_SAFARI_MACOS)) {
            var selected_objects = this.group.selectedObjects;
            if (selected_objects.length === 1 && selected_objects[0].isShape()) {
                if (isRealNumber(e.charCode)) {
                    var sp = selected_objects[0];
                    if (sp && sp.txBody && sp.txBody.content && sp.txBody.content.Cursor_MoveToEndPos) {
                        sp.txBody.content.Cursor_MoveToEndPos();
                    }
                    selected_objects[0].paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                    this.drawingObjectsController.changeCurrentState(new TextAddInGroup(this.drawingObjectsController, this.drawingObjects, this.group, selected_objects[0]));
                    this.drawingObjects.showDrawingObjects(true);
                    this.drawingObjects.OnUpdateOverlay();
                }
            }
        }
    };
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
    };
    this.isPointInDrawingObjects = function (x, y) {
        return handleGroupStateCursorType(this.drawingObjects, this.drawingObjectsController, this.group, {},
        x, y);
    };
}
function ChartGroupState(drawingObjectsController, drawingObjects, group, chart) {
    this.id = STATES_ID_CHART_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.chart = chart;
    this.onMouseDown = function (e, x, y) {
        if (handleCurrentChartInGroup(this.chart, this.group, this.drawingObjects, this.drawingObjectsController, e, x, y)) {
            return true;
        }
        return handleGroupState(this.drawingObjects, this.drawingObjectsController, this.group, e, x, y);
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {};
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
        var title = this.chart.getSelectedTitle();
        if (title) {
            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, title.transform, 0, 0, title.extX, title.extY, false, false);
        }
    };
    this.isPointInDrawingObjects = function (x, y) {
        var e = {};
        var cursor_type = handleCurrentChartInGroupCursorType(this.chart, this.group, this.drawingObjects, this.drawingObjectsController, e, x, y);
        if (cursor_type) {
            return cursor_type;
        }
        return handleGroupStateCursorType(this.drawingObjects, this.drawingObjectsController, this.group, e, x, y);
    };
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(this.drawingObjectsController, e);
    };
    this.onKeyPress = function (e) {
        if (! (e.metaKey && window.USER_AGENT_SAFARI_MACOS)) {
            var selected_title = this.chart.getSelectedTitle();
            if (selected_title) {
                this.drawingObjects.objectLocker.reset();
                this.drawingObjects.objectLocker.addObjectId(this.chart.Get_Id());
                var drawingObjects = this.drawingObjects;
                var text_object = selected_title;
                var chart = this.chart;
                var group = this.group;
                var callback = function (bLock) {
                    if (bLock) {
                        History.Create_NewPoint();
                        drawingObjects.controller.changeCurrentState(new ChartTextAddGroup(drawingObjects.controller, drawingObjects, group, chart, selected_title));
                        var sp = text_object;
                        if (sp && sp.txBody && sp.txBody.content && sp.txBody.content.Cursor_MoveToEndPos) {
                            sp.txBody.content.Cursor_MoveToEndPos();
                        }
                        text_object.paragraphAdd(new ParaText(String.fromCharCode(e.charCode)));
                        drawingObjects.showDrawingObjects(true);
                        drawingObjects.controller.updateSelectionState(drawingObjects.drawingDocument);
                        drawingObjects.OnUpdateOverlay();
                    }
                };
                this.drawingObjects.objectLocker.checkObjects(callback);
            }
        }
    };
}
function ChartTextAddGroup(drawingObjectsController, drawingObjects, group, chart, textObject) {
    this.id = STATES_ID_CHART_TEXT_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.chart = chart;
    this.title = textObject;
    this.textObject = textObject;
    this.chartGroupState = new ChartGroupState(drawingObjectsController, drawingObjects, group, chart);
    this.onMouseDown = function (e, x, y) {
        this.chartGroupState.onMouseDown(e, x, y);
        if (this.title !== this.drawingObjectsController.curState.title) {
            this.chart.recalculate();
            this.drawingObjects.showDrawingObjects(true);
        }
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseMove = function (e, x, y) {
        if (e.isLocked && e.type === "mousemove") {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.onMouseUp = function (e, x, y) {
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
    };
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(this.drawingObjectsController, e);
    };
    this.onKeyPress = function (e) {
        if (! (e.metaKey && window.USER_AGENT_SAFARI_MACOS)) {
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(this.chart.Get_Id());
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
        }
    };
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.title.transform, 0, 0, this.title.extX, this.title.extY, false, false);
    };
    this.isPointInDrawingObjects = function (x, y) {
        this.chartGroupState.isPointInDrawingObjects(x, y);
    };
    this.setCellFontName = function (fontName) {
        if (typeof this.textObject.setCellFontName === "function") {
            this.textObject.setCellFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellFontSize = function (fontSize) {
        if (typeof this.textObject.setCellFontSize === "function") {
            this.textObject.setCellFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellBold = function (isBold) {
        if (typeof this.textObject.setCellBold === "function") {
            this.textObject.setCellBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellItalic = function (isItalic) {
        if (typeof this.textObject.setCellItalic === "function") {
            this.textObject.setCellItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellAlign = function (align) {
        if (typeof this.textObject.setCellAlign === "function") {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellUnderline = function (isUnderline) {
        if (typeof this.textObject.setCellUnderline === "function") {
            this.textObject.setCellUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellStrikeout = function (isStrikeout) {
        if (typeof this.textObject.setCellStrikeout === "function") {
            this.textObject.setCellStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellSubscript = function (isSubscript) {
        if (typeof this.textObject.setCellSubscript === "function") {
            this.textObject.setCellSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellSuperscript = function (isSuperscript) {
        if (typeof this.textObject.setCellSuperscript === "function") {
            this.textObject.setCellSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellAlign = function (align) {
        if (typeof this.textObject.setCellAlign === "function") {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellVertAlign = function (align) {
        if (typeof this.textObject.setCellVertAlign === "function") {
            this.textObject.setCellVertAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.drawingObjectsController.recalculateCurPos();
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellTextColor = function (color) {
        if (typeof this.textObject.setCellTextColor === "function") {
            this.textObject.setCellTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
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
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.increaseFontSize = function () {
        if (typeof this.textObject.increaseFontSize === "function") {
            this.textObject.increaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.decreaseFontSize = function () {
        if (typeof this.textObject.decreaseFontSize === "function") {
            this.textObject.decreaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
}
function PreMoveChartTitleGroup(drawingObjectsController, drawingObjects, group, chart, title, startX, startY) {
    this.id = STATES_ID_PRE_MOVE_CHART_TITLE_GROUP;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.startX = startX;
    this.startY = startY;
    this.group = group;
    this.chart = chart;
    this.title = title;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        if (this.startX === x && this.startY === y) {
            return;
        }
        this.drawingObjectsController.swapTrackObjects();
        this.drawingObjectsController.changeCurrentState(new MoveChartTitleGroup(this.drawingObjectsController, this.drawingObjects, this.group, this.chart, this.title, this.startX, this.startY));
        this.drawingObjectsController.onMouseMove(e, x, y);
    };
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.clearPreTrackObjects();
        this.drawingObjectsController.changeCurrentState(new ChartGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.chart));
    };
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
        var title = this.chart.getSelectedTitle();
        if (title) {
            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, title.transform, 0, 0, title.extX, title.extY, false, false);
        }
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: "move"
        };
    };
}
function MoveChartTitleGroup(drawingObjectsController, drawingObjects, group, chart, title, startX, startY) {
    this.id = STATES_ID_MOVE_CHART_TITLE_GROUP;
    this.drawingObjects = drawingObjects;
    this.drawingObjectsController = drawingObjectsController;
    this.startX = startX;
    this.startY = startY;
    this.group = group;
    this.chart = chart;
    this.title = title;
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var tx = this.chart.invertTransform.TransformPointX(x, y);
        var ty = this.chart.invertTransform.TransformPointY(x, y);
        this.drawingObjectsController.trackMoveObjects(x - this.startX, y - this.startY);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        var worksheet = this.drawingObjects.getWorksheet();
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        if (!isViewMode) {
            this.drawingObjects.objectLocker.reset();
            var track_objects = this.drawingObjectsController.arrTrackObjects;
            for (var i = 0; i < track_objects.length; ++i) {
                this.drawingObjects.objectLocker.addObjectId(this.group.Get_Id());
            }
            var track_objects2 = [];
            for (i = 0; i < track_objects.length; ++i) {
                track_objects2.push(track_objects[i]);
            }
            var drawingObjects = this.drawingObjects;
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint();
                    for (var i = 0; i < track_objects2.length; ++i) {
                        track_objects2[i].trackEnd();
                    }
                    drawingObjects.showDrawingObjects(true);
                }
            };
            this.drawingObjects.objectLocker.checkObjects(callback);
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new ChartGroupState(this.drawingObjectsController, this.drawingObjects, this.group, this.chart));
    };
    this.drawSelection = function (drawingDocument) {
        DrawGroupSelection(this.group, drawingDocument);
        var title = this.chart.getSelectedTitle();
        if (title) {
            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, title.transform, 0, 0, title.extX, title.extY, false, false);
        }
    };
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: this.group.Id,
            cursorType: "move"
        };
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
        if (this.drawingObjectsController.curState.id !== STATES_ID_TEXT_ADD || this.drawingObjectsController.curState.id !== STATES_ID_TEXT_ADD_IN_GROUP) {
            this.drawingObjectsController.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (e.isLocked && e.type === "mousemove") {
            this.textObject.selectionSetEnd(e, x, y);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.onMouseUp = function (e, x, y) {
        this.textObject.selectionSetEnd(e, x, y);
        this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
    };
    this.drawSelection = function (drawingDocument) {
        drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.group.getTransform(), 0, 0, this.group.extX, this.group.extY, false, this.group.canRotate());
        drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.textObject.getTransform(), 0, 0, this.textObject.extX, this.textObject.extY, false, this.textObject.canRotate());
        this.textObject.drawAdjustments(drawingDocument);
    };
    this.onKeyDown = function (e) {
        return DefaultKeyDownHandle(drawingObjectsController, e);
    };
    this.onKeyPress = function (e) {
        if (! (e.metaKey && window.USER_AGENT_SAFARI_MACOS)) {
            var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
            if (!isViewMode) {
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
            }
        }
    };
    this.isPointInDrawingObjects = function (x, y) {
        return this.groupState.isPointInDrawingObjects(x, y);
    };
    this.setCellFontName = function (fontName) {
        if (typeof this.textObject.setCellFontName === "function") {
            this.textObject.setCellFontName(fontName);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellFontSize = function (fontSize) {
        if (typeof this.textObject.setCellFontSize === "function") {
            this.textObject.setCellFontSize(fontSize);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellBold = function (isBold) {
        if (typeof this.textObject.setCellBold === "function") {
            this.textObject.setCellBold(isBold);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellItalic = function (isItalic) {
        if (typeof this.textObject.setCellItalic === "function") {
            this.textObject.setCellItalic(isItalic);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellUnderline = function (isUnderline) {
        if (typeof this.textObject.setCellUnderline === "function") {
            this.textObject.setCellUnderline(isUnderline);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellStrikeout = function (isStrikeout) {
        if (typeof this.textObject.setCellStrikeout === "function") {
            this.textObject.setCellStrikeout(isStrikeout);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellSubscript = function (isSubscript) {
        if (typeof this.textObject.setCellSubscript === "function") {
            this.textObject.setCellSubscript(isSubscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellSuperscript = function (isSuperscript) {
        if (typeof this.textObject.setCellSuperscript === "function") {
            this.textObject.setCellSuperscript(isSuperscript);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellAlign = function (align) {
        if (typeof this.textObject.setCellAlign === "function") {
            this.textObject.setCellAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.setCellVertAlign = function (align) {
        if (typeof this.textObject.setCellVertAlign === "function") {
            this.textObject.setCellVertAlign(align);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
            this.drawingObjectsController.recalculateCurPos();
        }
    };
    this.setCellTextColor = function (color) {
        if (typeof this.textObject.setCellTextColor === "function") {
            this.textObject.setCellTextColor(color);
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
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
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.increaseFontSize = function () {
        if (typeof this.textObject.increaseFontSize === "function") {
            this.textObject.increaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.decreaseFontSize = function () {
        if (typeof this.textObject.decreaseFontSize === "function") {
            this.textObject.decreaseFontSize();
            this.drawingObjects.showDrawingObjects(true);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.insertHyperlink = function (options) {
        if (typeof this.textObject.insertHyperlink === "function") {
            this.textObject.insertHyperlink(options);
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
    this.removeHyperlink = function () {
        if (typeof this.textObject.removeHyperlink === "function") {
            this.textObject.removeHyperlink();
            this.textObject.updateSelectionState(this.drawingObjects.drawingDocument);
        }
    };
}
function PreMoveInGroupState(drawingObjectsController, drawingObjects, group, startX, startY, shiftKey, ctrlKey, majorObject, majorObjectIsSelected) {
    this.id = STATES_ID_PRE_MOVE_IN_GROUP;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    this.shiftKey = shiftKey;
    this.ctrlKey = ctrlKey;
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
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        var check_position = this.drawingObjects.checkGraphicObjectPosition(this.rectX + dx, this.rectY + dy, this.rectW, this.rectH);
        this.drawingObjectsController.trackMoveObjects(dx + check_position.x, dy + check_position.y);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        var worksheet = this.drawingObjects.getWorksheet();
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        var o_this = this;
        var ctrlKey = e.ctrlKey;
        if (!isViewMode) {
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(this.group.Get_Id());
            var track_objects2 = [];
            for (var i = 0; i < this.drawingObjectsController.arrTrackObjects.length; ++i) {
                track_objects2.push(this.drawingObjectsController.arrTrackObjects[i]);
            }
            var drawingObjects = this.drawingObjects;
            var group = this.group;
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint();
                    History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateUndo, null, null, new UndoRedoDataGraphicObjects(group.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                    if (!ctrlKey) {
                        for (var i = 0; i < track_objects2.length; ++i) {
                            track_objects2[i].trackEnd();
                        }
                        group.normalize();
                        group.updateCoordinatesAfterInternalResize();
                    } else {
                        for (var i = 0; i < track_objects2.length; ++i) {
                            var track_object = track_objects2[i];
                            var original_object = track_object.originalObject;
                            var scale_scale_coefficients = original_object.group.getResultScaleCoefficients();
                            var xfrm = original_object.group.spPr.xfrm;
                            var pos_x = track_object.x / scale_scale_coefficients.cx + xfrm.chOffX;
                            var pos_y = track_object.y / scale_scale_coefficients.cy + xfrm.chOffY;
                            var copy = original_object.copy(pos_x, pos_y);
                            original_object.group.addToSpTree(copy);
                            original_object.deselect(o_this.drawingObjectsController);
                            copy.select(o_this.drawingObjectsController);
                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateAfterInit, null, null, new UndoRedoDataGraphicObjects(copy.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                        }
                        group.normalize();
                        group.updateCoordinatesAfterInternalResize();
                    }
                    History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateRedo, null, null, new UndoRedoDataGraphicObjects(group.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                    group.recalculate();
                    drawingObjects.showDrawingObjects(true);
                }
            };
            this.drawingObjects.objectLocker.checkObjects(callback);
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
        var worksheet = this.drawingObjects.getWorksheet();
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        if (!isViewMode) {
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(this.group.Get_Id());
            var track_objects2 = [];
            for (var i = 0; i < this.drawingObjectsController.arrTrackObjects.length; ++i) {
                track_objects2.push(this.drawingObjectsController.arrTrackObjects[i]);
            }
            var drawingObjects = this.drawingObjects;
            var group = this.group;
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint();
                    for (var i = 0; i < track_objects2.length; ++i) {
                        track_objects2[i].trackEnd();
                    }
                    group.recalculateTransform();
                    drawingObjects.showDrawingObjects(true);
                }
            };
            this.drawingObjects.objectLocker.checkObjects(callback);
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
        var worksheet = this.drawingObjects.getWorksheet();
        this.drawingObjects.objectLocker.reset();
        var isViewMode = this.drawingObjectsController.drawingObjects.isViewerMode();
        if (!isViewMode) {
            this.drawingObjects.objectLocker.addObjectId(this.group.Get_Id());
            var track_objects2 = [];
            for (var i = 0; i < this.drawingObjectsController.arrTrackObjects.length; ++i) {
                track_objects2.push(this.drawingObjectsController.arrTrackObjects[i]);
            }
            var drawingObjects = this.drawingObjects;
            var group = this.group;
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint();
                    History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateUndo, null, null, new UndoRedoDataGraphicObjects(group.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                    for (var i = 0; i < track_objects2.length; ++i) {
                        track_objects2[i].trackEnd();
                    }
                    group.normalize();
                    group.updateCoordinatesAfterInternalResize();
                    History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateRedo, null, null, new UndoRedoDataGraphicObjects(group.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                    group.recalculateTransform();
                    drawingObjects.showDrawingObjects(true);
                }
            };
            this.drawingObjects.objectLocker.checkObjects(callback);
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
    this.onMouseDown = function (e, x, y) {};
    this.onMouseMove = function (e, x, y) {
        var resize_coefficients = this.majorObject.getResizeCoefficients(this.handleNum, x, y);
        this.drawingObjectsController.trackResizeObjects(resize_coefficients.kd1, resize_coefficients.kd2, e);
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseUp = function (e, x, y) {
        var worksheet = this.drawingObjects.getWorksheet();
        this.drawingObjects.objectLocker.reset();
        this.drawingObjects.objectLocker.addObjectId(this.group.Get_Id());
        var track_objects2 = [];
        for (var i = 0; i < this.drawingObjectsController.arrTrackObjects.length; ++i) {
            track_objects2.push(this.drawingObjectsController.arrTrackObjects[i]);
        }
        var drawingObjects = this.drawingObjects;
        var group = this.group;
        var callback = function (bLock) {
            if (bLock) {
                History.Create_NewPoint();
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateUndo, null, null, new UndoRedoDataGraphicObjects(group.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                for (var i = 0; i < track_objects2.length; ++i) {
                    track_objects2[i].trackEnd();
                }
                group.normalize();
                group.updateCoordinatesAfterInternalResize();
                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_GroupRecalculateRedo, null, null, new UndoRedoDataGraphicObjects(group.Get_Id(), new UndoRedoDataGOSingleProp(null, null)));
                group.recalculateTransform();
                drawingObjects.showDrawingObjects(true);
            }
        };
        this.drawingObjects.objectLocker.checkObjects(callback);
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
        this.drawingObjectsController.resetSelection();
        this.drawingObjectsController.changeCurrentState(new SplineBezierState33(this.drawingObjectsController, this.drawingObjects, x, y, spline));
        this.drawingObjects.OnUpdateOverlay();
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, X, Y, pageIndex) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
            var shape = this.spline.createShape(null, this.drawingObjects);
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(shape.Get_Id());
            this.drawingObjects.objectLocker.checkObjects(function (bLock) {});
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
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
            var shape = this.spline.createShape(this.drawingObjects);
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(shape.Get_Id());
            this.drawingObjects.objectLocker.checkObjects(function (bLock) {});
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
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
            var shape = this.spline.createShape(this.drawingObjects);
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(shape.Get_Id());
            this.drawingObjects.objectLocker.checkObjects(function (bLock) {});
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
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
            var shape = this.spline.createShape(this.drawingObjects);
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(shape.Get_Id());
            this.drawingObjects.objectLocker.checkObjects(function (bLock) {});
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
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
        var _min_distance = this.drawingObjects.convertMetric(1, 0, 3);
        this.drawingObjectsController.changeCurrentState(new PolyLineAddState2(this.drawingObjectsController, this.drawingObjects, _min_distance, polyline));
    };
    this.onMouseMove = function (e, x, y) {};
    this.onMouseUp = function (e, x, y) {
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
            var shape = this.polyline.createShape();
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(shape.Get_Id());
            this.drawingObjects.objectLocker.checkObjects(function (bLock) {});
        }
        this.drawingObjectsController.clearTrackObjects();
        this.drawingObjects.OnUpdateOverlay();
        this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
    };
    this.onKeyDown = function (e) {};
    this.onKeyPress = function (e) {};
    this.isPointInDrawingObjects = function (x, y) {
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
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
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
    };
    this.drawSelection = function (drawingDocument) {};
}
function AddPolyLine2State3(drawingObjectsController, drawingObjects, polyline) {
    this.id = STATES_ID_ADD_PPOLY_LINE23;
    this.drawingObjectsController = drawingObjectsController;
    this.drawingObjects = drawingObjects;
    this.minDistance = this.drawingObjects.convertMetric(1, 0, 3);
    this.polyline = polyline;
    this.onMouseDown = function (e, x, y) {
        this.polyline.arrPoint.push({
            x: x,
            y: y
        });
        if (e.ClickCount > 1) {
            History.Create_NewPoint();
            var shape = this.polyline.createShape();
            this.drawingObjects.objectLocker.reset();
            this.drawingObjects.objectLocker.addObjectId(shape.Get_Id());
            this.drawingObjects.objectLocker.checkObjects(function (bLock) {});
            this.drawingObjectsController.clearTrackObjects();
            this.drawingObjects.OnUpdateOverlay();
            this.drawingObjectsController.changeCurrentState(new NullState(this.drawingObjectsController, this.drawingObjects));
        }
    };
    this.onMouseMove = function (e, x, y) {
        if (e.isLocked && e.type === "mousemove") {
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
        return {
            objectId: "1_1",
            cursorType: "crosshair"
        };
    };
    this.drawSelection = function (drawingDocument) {};
}
function CheckLineDrawingObject(drawingObject) {
    return drawingObject instanceof CShape && drawingObject.spPr.geometry && drawingObject.spPr.geometry.preset === "line";
}
function DrawDefaultSelection(drawingObjectsController, drawingDocument) {
    var selected_objects = drawingObjectsController.selectedObjects;
    for (var i = 0; i < selected_objects.length; ++i) {
        var canRotate = selected_objects[i].canRotate ? selected_objects[i].canRotate() : false;
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, selected_objects[i].getTransform(), 0, 0, selected_objects[i].extX, selected_objects[i].extY, CheckLineDrawingObject(selected_objects[i]), canRotate);
    }
    if (selected_objects.length === 1) {
        selected_objects[0].drawAdjustments(drawingDocument);
    }
}
function DrawGroupSelection(group, drawingDocument) {
    var canRotate = group.canRotate ? group.canRotate() : false;
    drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, group.getTransform(), 0, 0, group.extX, group.extY, false, canRotate);
    var group_selected_objects = group.selectedObjects;
    for (var i = 0; i < group_selected_objects.length; ++i) {
        var canRotate = group_selected_objects[i].canRotate ? group_selected_objects[i].canRotate() : false;
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, group_selected_objects[i].getTransform(), 0, 0, group_selected_objects[i].extX, group_selected_objects[i].extY, false, canRotate);
    }
    if (group_selected_objects.length === 1) {
        group_selected_objects[0].drawAdjustments(drawingDocument);
    }
}
function DrawChartSelection(chart, drawingDocument) {
    var canRotate = false;
    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, chart.getTransform(), 0, 0, chart.extX, chart.extY, false, canRotate);
    if (chart.chartTitle && chart.chartTitle.selected) {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, chart.chartTitle.transform, 0, 0, chart.chartTitle.extX, chart.chartTitle.extY, false, canRotate);
    }
    if (chart.hAxisTitle && chart.hAxisTitle.selected) {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, chart.hAxisTitle.transform, 0, 0, chart.hAxisTitle.extX, chart.hAxisTitle.extY, false, canRotate);
    }
    if (chart.vAxisTitle && chart.vAxisTitle.selected) {
        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, chart.vAxisTitle.transform, 0, 0, chart.vAxisTitle.extX, chart.vAxisTitle.extY, false, canRotate);
    }
}
function DrawChartTextSelection(chart, textObject, drawingDocument) {
    var canRotate = false;
    drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, chart.getTransform(), 0, 0, chart.extX, chart.extY, false, canRotate);
    drawingDocument.DrawTrack(TYPE_TRACK_TEXT, textObject.transform, 0, 0, textObject.extX, textObject.extY, false, canRotate);
}
function DefaultKeyDownHandle(drawingObjectsController, e) {
    var bRetValue = false;
    var state = drawingObjectsController.curState;
    var isViewMode = drawingObjectsController.drawingObjects.isViewerMode();
    if (e.keyCode == 8 && false === isViewMode) {
        drawingObjectsController.remove(-1);
        bRetValue = true;
    } else {
        if (e.keyCode == 9 && false === isViewMode) {
            switch (state.id) {
            case STATES_ID_TEXT_ADD:
                case STATES_ID_TEXT_ADD_IN_GROUP:
                case STATES_ID_CHART_TEXT_ADD:
                drawingObjectsController.drawingObjects.objectLocker.reset();
                if (state.id === STATES_ID_TEXT_ADD) {
                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.textObject.Get_Id());
                } else {
                    if (state.id === STATES_ID_CHART_TEXT_ADD) {
                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.chart.Get_Id());
                    } else {
                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());
                    }
                }
                var selection_state = drawingObjectsController.getSelectionState();
                var callback = function (bLock) {
                    if (bLock) {
                        History.Create_NewPoint();
                        drawingObjectsController.resetSelectionState2();
                        drawingObjectsController.setSelectionState(selection_state);
                        state.textObject.paragraphAdd(new ParaTab());
                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                        state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                    }
                };
                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                bRetValue = true;
                break;
            case STATES_ID_NULL:
                case STATES_ID_EXPECT_DOUBLE_CLICK:
                var a_drawing_bases = drawingObjectsController.drawingObjects.getDrawingObjects();
                if (!e.shiftKey) {
                    var last_selected = null,
                    last_selected_index = null;
                    for (var i = a_drawing_bases.length - 1; i > -1; --i) {
                        if (a_drawing_bases[i].graphicObject.selected) {
                            last_selected = a_drawing_bases[i].graphicObject;
                            last_selected_index = i;
                            break;
                        }
                    }
                    if (isRealObject(last_selected)) {
                        bRetValue = true;
                        drawingObjectsController.resetSelection();
                        if (!last_selected.isGroup() || last_selected.arrGraphicObjects.length === 0) {
                            if (last_selected_index < a_drawing_bases.length - 1) {
                                a_drawing_bases[last_selected_index + 1].graphicObject.select(drawingObjectsController);
                            } else {
                                a_drawing_bases[0].graphicObject.select(drawingObjectsController);
                            }
                        } else {
                            last_selected.select(drawingObjectsController);
                            last_selected.arrGraphicObjects[0].select(last_selected);
                            drawingObjectsController.changeCurrentState(new GroupState(drawingObjectsController, drawingObjectsController.drawingObjects, last_selected));
                        }
                    }
                } else {
                    var first_selected = null,
                    first_selected_index = null;
                    for (var i = 0; i < a_drawing_bases.length; ++i) {
                        if (a_drawing_bases[i].graphicObject.selected) {
                            first_selected = a_drawing_bases[i].graphicObject;
                            first_selected_index = i;
                            break;
                        }
                    }
                    if (isRealObject(first_selected)) {
                        bRetValue = true;
                        drawingObjectsController.resetSelection();
                        if (first_selected_index > 0) {
                            a_drawing_bases[first_selected_index - 1].graphicObject.select(drawingObjectsController);
                        } else {
                            a_drawing_bases[a_drawing_bases.length - 1].graphicObject.select(drawingObjectsController);
                        }
                    }
                }
                drawingObjectsController.drawingObjects.OnUpdateOverlay();
                break;
            case STATES_ID_GROUP:
                var group = state.group;
                var arr_graphic_objects = group.arrGraphicObjects;
                if (!e.shiftKey) {
                    for (var i = arr_graphic_objects.length - 1; i > -1; --i) {
                        if (arr_graphic_objects[i].selected) {
                            break;
                        }
                    }
                    group.resetSelection();
                    if (i < arr_graphic_objects.length - 1) {
                        arr_graphic_objects[i + 1].select(group);
                    } else {
                        drawingObjectsController.resetSelectionState();
                        var a_drawing_bases = drawingObjectsController.drawingObjects.getDrawingObjects();
                        for (var i = 0; i < a_drawing_bases.length; ++i) {
                            if (a_drawing_bases.graphicObject === group) {
                                break;
                            }
                        }
                        if (i < a_drawing_bases.length) {
                            a_drawing_bases[i + 1].graphicObject.select(drawingObjectsController);
                        } else {
                            a_drawing_bases[0].graphicObject.select(drawingObjectsController);
                        }
                    }
                } else {
                    for (var i = 0; i < arr_graphic_objects.length; ++i) {
                        if (arr_graphic_objects[i].selected) {
                            break;
                        }
                    }
                    group.resetSelection();
                    if (i > 0) {
                        arr_graphic_objects[i - 1].select(group);
                    } else {
                        drawingObjectsController.resetSelectionState();
                        group.select(drawingObjectsController);
                    }
                }
                drawingObjectsController.drawingObjects.OnUpdateOverlay();
                break;
            }
        } else {
            if (e.keyCode == 13 && false === isViewMode) {
                switch (state.id) {
                case STATES_ID_NULL:
                    case STATES_ID_EXPECT_DOUBLE_CLICK:
                    if (drawingObjectsController.selectedObjects.length === 1 && drawingObjectsController.selectedObjects[0].isShape()) {
                        drawingObjectsController.drawingObjects.objectLocker.reset();
                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[0].Get_Id());
                        var selection_state = drawingObjectsController.getSelectionState();
                        var callback = function (bLock) {
                            if (bLock) {
                                History.Create_NewPoint();
                                drawingObjectsController.resetSelectionState2();
                                drawingObjectsController.setSelectionState(selection_state);
                                var sp = drawingObjectsController.selectedObjects[0];
                                if (sp && sp.txBody && sp.txBody.content && sp.txBody.content.Cursor_MoveToEndPos) {
                                    sp.txBody.content.Cursor_MoveToEndPos();
                                }
                                drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjectsController.drawingObjects, sp));
                                if (isRealObject(sp.txBody)) {
                                    sp.txBody.content.Select_All();
                                } else {
                                    sp.addTextBody(new CTextBody(sp));
                                    sp.calculateContent();
                                    sp.calculateTransformTextMatrix();
                                }
                                sp.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                            }
                        };
                        drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                    }
                    bRetValue = true;
                    break;
                case STATES_ID_TEXT_ADD:
                    case STATES_ID_TEXT_ADD_IN_GROUP:
                    case STATES_ID_CHART_TEXT_ADD:
                    drawingObjectsController.drawingObjects.objectLocker.reset();
                    if (state.id === STATES_ID_TEXT_ADD) {
                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.curState.textObject.Get_Id());
                    } else {
                        if (state.id === STATES_ID_CHART_TEXT_ADD) {
                            drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.chart.Get_Id());
                        } else {
                            drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.curState.group.Get_Id());
                        }
                    }
                    var selection_state = drawingObjectsController.getSelectionState();
                    var callback = function (bLock) {
                        if (bLock) {
                            History.Create_NewPoint();
                            drawingObjectsController.resetSelectionState2();
                            drawingObjectsController.setSelectionState(selection_state);
                            var state = drawingObjectsController.curState;
                            state.textObject.addNewParagraph();
                            state.textObject.calculateContent();
                            state.textObject.calculateTransformTextMatrix();
                            drawingObjectsController.drawingObjects.showDrawingObjects(true);
                            state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        }
                    };
                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                    bRetValue = true;
                    break;
                }
                bRetValue = true;
            } else {
                if (e.keyCode == 27) {
                    switch (state.id) {
                    case STATES_ID_NULL:
                        case STATES_ID_EXPECT_DOUBLE_CLICK:
                        var ws = drawingObjectsController.drawingObjects.getWorksheet();
                        var isChangeSelectionShape = ws._checkSelectionShape();
                        if (isChangeSelectionShape) {
                            ws._drawSelection();
                            ws._updateSelectionNameAndInfo();
                        }
                        bRetValue = true;
                        break;
                    case STATES_ID_TEXT_ADD:
                        case STATES_ID_TEXT_ADD_IN_GROUP:
                        case STATES_ID_CHART_TEXT_ADD:
                        state.textObject.txBody.content.Selection_Remove();
                        drawingObjectsController.changeCurrentState(new NullState(drawingObjectsController, drawingObjectsController.drawingObjects));
                        drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                        bRetValue = true;
                        break;
                    }
                } else {
                    if (e.keyCode == 32 && false === isViewMode) {
                        switch (state.id) {
                        case STATES_ID_TEXT_ADD:
                            case STATES_ID_TEXT_ADD_IN_GROUP:
                            case STATES_ID_CHART_TEXT_ADD:
                            if (!e.ctrlKey) {
                                drawingObjectsController.drawingObjects.objectLocker.reset();
                                if (state.id === STATES_ID_TEXT_ADD) {
                                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.curState.textObject.Get_Id());
                                } else {
                                    if (state.id === STATES_ID_CHART_TEXT_ADD) {
                                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.chart.Get_Id());
                                    } else {
                                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.curState.group.Get_Id());
                                    }
                                }
                                var selection_state = drawingObjectsController.getSelectionState();
                                var callback = function (bLock) {
                                    if (bLock) {
                                        History.Create_NewPoint();
                                        drawingObjectsController.resetSelectionState2();
                                        drawingObjectsController.setSelectionState(selection_state);
                                        var state = drawingObjectsController.curState;
                                        state.textObject.paragraphAdd(new ParaSpace(1));
                                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                        state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                    }
                                };
                                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                            }
                            break;
                        case STATES_ID_GROUP:
                            if (!e.ctrlKey && state.group.selectedObjects.length === 1 && state.group.selectedObjects instanceof CShape) {
                                drawingObjectsController.drawingObjects.objectLocker.reset();
                                drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());
                                var selection_state = drawingObjectsController.getSelectionState();
                                var callback = function (bLock) {
                                    if (bLock) {
                                        History.Create_NewPoint();
                                        drawingObjectsController.resetSelectionState2();
                                        drawingObjectsController.setSelectionState(selection_state);
                                        var state = drawingObjectsController.curState;
                                        var sp = state.group.selectedObjects[0];
                                        if (sp && sp.txBody && sp.txBody.content && sp.txBody.content.Cursor_MoveToEndPos) {
                                            sp.txBody.content.Cursor_MoveToEndPos();
                                        }
                                        state.group.selectedObjects[0].paragraphAdd(new ParaSpace(1));
                                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                        drawingObjectsController.changeCurrentState(new TextAddInGroup(drawingObjectsController, drawingObjectsController.drawingObjects, state.group, state.group.selectedObjects[0]));
                                        drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                    }
                                };
                                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                            }
                            break;
                        case STATES_ID_NULL:
                            case STATES_ID_EXPECT_DOUBLE_CLICK:
                            if (drawingObjectsController.selectedObjects.length === 1 && drawingObjectsController.selectedObjects[0].isShape() && !e.ctrlKey) {
                                drawingObjectsController.drawingObjects.objectLocker.reset();
                                drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[0].Get_Id());
                                var selection_state = drawingObjectsController.getSelectionState();
                                var callback = function (bLock) {
                                    if (bLock) {
                                        History.Create_NewPoint();
                                        drawingObjectsController.resetSelectionState2();
                                        drawingObjectsController.setSelectionState(selection_state);
                                        var sp = drawingObjectsController.selectedObjects[0];
                                        if (sp && sp.txBody && sp.txBody.content && sp.txBody.content.Cursor_MoveToEndPos) {
                                            sp.txBody.content.Cursor_MoveToEndPos();
                                        }
                                        drawingObjectsController.selectedObjects[0].paragraphAdd(new ParaSpace(1));
                                        drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjectsController.drawingObjects, drawingObjectsController.selectedObjects[0]));
                                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                        drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                    }
                                };
                                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                            }
                            break;
                        default:
                            break;
                        }
                        bRetValue = true;
                    } else {
                        if (e.keyCode == 33) {} else {
                            if (e.keyCode == 34) {} else {
                                if (e.keyCode == 35) {
                                    switch (state.id) {
                                    case STATES_ID_TEXT_ADD:
                                        case STATES_ID_TEXT_ADD_IN_GROUP:
                                        case STATES_ID_CHART_TEXT_ADD:
                                        if (e.ctrlKey) {
                                            state.textObject.txBody.content.Cursor_MoveToEndPos();
                                            drawingObjectsController.updateSelectionState();
                                        } else {
                                            state.textObject.txBody.content.Cursor_MoveEndOfLine(e.shiftKey);
                                            drawingObjectsController.updateSelectionState();
                                        }
                                        break;
                                    }
                                    bRetValue = true;
                                } else {
                                    if (e.keyCode == 36) {
                                        switch (state.id) {
                                        case STATES_ID_TEXT_ADD:
                                            case STATES_ID_TEXT_ADD_IN_GROUP:
                                            case STATES_ID_CHART_TEXT_ADD:
                                            if (e.ctrlKey) {
                                                state.textObject.txBody.content.Cursor_MoveToStartPos();
                                                drawingObjectsController.updateSelectionState();
                                            } else {
                                                state.textObject.txBody.content.Cursor_MoveStartOfLine(e.shiftKey);
                                                drawingObjectsController.updateSelectionState();
                                            }
                                            break;
                                        }
                                        bRetValue = true;
                                    } else {
                                        if (e.keyCode == 37) {
                                            switch (state.id) {
                                            case STATES_ID_NULL:
                                                case STATES_ID_EXPECT_DOUBLE_CLICK:
                                                drawingObjectsController.drawingObjects.objectLocker.reset();
                                                for (var i = 0; i < drawingObjectsController.selectedObjects.length; ++i) {
                                                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[i].Get_Id());
                                                }
                                                var selection_state = drawingObjectsController.getSelectionState();
                                                var callback = function (bLock) {
                                                    if (bLock) {
                                                        History.Create_NewPoint();
                                                        drawingObjectsController.resetSelectionState2();
                                                        drawingObjectsController.setSelectionState(selection_state);
                                                        var state = drawingObjectsController.curState;
                                                        for (var i = 0; i < drawingObjectsController.selectedObjects.length; ++i) {
                                                            var xfrm = drawingObjectsController.selectedObjects[i].spPr.xfrm;
                                                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                                                            var x = xfrm.offX - 3;
                                                            var y = xfrm.offY;
                                                            var offset = drawingObjectsController.drawingObjects.checkGraphicObjectPosition(x, y, xfrm.extX, xfrm.extY);
                                                            x += offset.x;
                                                            y += offset.y;
                                                            drawingObjectsController.selectedObjects[i].setPosition(x, y);
                                                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                                                            drawingObjectsController.selectedObjects[i].recalculateTransform();
                                                            drawingObjectsController.selectedObjects[i].calculateTransformTextMatrix();
                                                        }
                                                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                    }
                                                };
                                                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                bRetValue = true;
                                                break;
                                            case STATES_ID_GROUP:
                                                drawingObjectsController.drawingObjects.objectLocker.reset();
                                                drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.curState.group.Get_Id());
                                                var selection_state = drawingObjectsController.getSelectionState();
                                                var callback = function (bLock) {
                                                    if (bLock) {
                                                        History.Create_NewPoint();
                                                        drawingObjectsController.resetSelectionState2();
                                                        drawingObjectsController.setSelectionState(selection_state);
                                                        var state = drawingObjectsController.curState;
                                                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                                                        for (var i = 0; i < state.group.selectedObjects.length; ++i) {
                                                            var xfrm = state.group.selectedObjects[i].spPr.xfrm;
                                                            state.group.selectedObjects[i].setPosition(xfrm.offX - 3, xfrm.offY);
                                                        }
                                                        state.group.normalize();
                                                        state.group.updateCoordinatesAfterInternalResize();
                                                        state.group.recalculate();
                                                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                                                        drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                    }
                                                };
                                                drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                bRetValue = true;
                                                break;
                                            case STATES_ID_TEXT_ADD:
                                                case STATES_ID_TEXT_ADD_IN_GROUP:
                                                case STATES_ID_CHART_TEXT_ADD:
                                                state.textObject.txBody.content.Cursor_MoveLeft(e.shiftKey, e.ctrlKey);
                                                drawingObjectsController.recalculateCurPos();
                                                drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                                break;
                                            }
                                            bRetValue = true;
                                        } else {
                                            if (e.keyCode == 38) {
                                                switch (state.id) {
                                                case STATES_ID_NULL:
                                                    case STATES_ID_EXPECT_DOUBLE_CLICK:
                                                    drawingObjectsController.drawingObjects.objectLocker.reset();
                                                    for (var i = 0; i < drawingObjectsController.selectedObjects.length; ++i) {
                                                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[i].Get_Id());
                                                    }
                                                    var selection_state = drawingObjectsController.getSelectionState();
                                                    var callback = function (bLock) {
                                                        if (bLock) {
                                                            History.Create_NewPoint();
                                                            drawingObjectsController.resetSelectionState2();
                                                            drawingObjectsController.setSelectionState(selection_state);
                                                            var state = drawingObjectsController.curState;
                                                            for (var i = 0; i < drawingObjectsController.selectedObjects.length; ++i) {
                                                                var xfrm = drawingObjectsController.selectedObjects[i].spPr.xfrm;
                                                                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                                                                var x = xfrm.offX;
                                                                var y = xfrm.offY - 3;
                                                                var offset = drawingObjectsController.drawingObjects.checkGraphicObjectPosition(x, y, xfrm.extX, xfrm.extY);
                                                                x += offset.x;
                                                                y += offset.y;
                                                                drawingObjectsController.selectedObjects[i].setPosition(x, y);
                                                                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                                                                drawingObjectsController.selectedObjects[i].recalculateTransform();
                                                                drawingObjectsController.selectedObjects[i].calculateTransformTextMatrix();
                                                            }
                                                            drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                        }
                                                    };
                                                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                    bRetValue = true;
                                                    break;
                                                case STATES_ID_GROUP:
                                                    drawingObjectsController.drawingObjects.objectLocker.reset();
                                                    drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.curState.group.Get_Id());
                                                    var selection_state = drawingObjectsController.getSelectionState();
                                                    var callback = function (bLock) {
                                                        if (bLock) {
                                                            History.Create_NewPoint();
                                                            drawingObjectsController.resetSelectionState2();
                                                            drawingObjectsController.setSelectionState(selection_state);
                                                            var state = drawingObjectsController.curState;
                                                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                                                            for (var i = 0; i < state.group.selectedObjects.length; ++i) {
                                                                var xfrm = state.group.selectedObjects[i].spPr.xfrm;
                                                                state.group.selectedObjects[i].setPosition(xfrm.offX, xfrm.offY - 3);
                                                            }
                                                            state.group.normalize();
                                                            state.group.updateCoordinatesAfterInternalResize();
                                                            state.group.recalculate();
                                                            History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                                                            drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                        }
                                                    };
                                                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                    bRetValue = true;
                                                    break;
                                                case STATES_ID_TEXT_ADD:
                                                    case STATES_ID_TEXT_ADD_IN_GROUP:
                                                    case STATES_ID_CHART_TEXT_ADD:
                                                    state.textObject.txBody.content.Cursor_MoveUp(e.shiftKey, e.ctrlKey);
                                                    drawingObjectsController.recalculateCurPos();
                                                    drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                                    break;
                                                }
                                                bRetValue = true;
                                            } else {
                                                if (e.keyCode == 39) {
                                                    switch (state.id) {
                                                    case STATES_ID_NULL:
                                                        case STATES_ID_EXPECT_DOUBLE_CLICK:
                                                        drawingObjectsController.drawingObjects.objectLocker.reset();
                                                        for (var i = 0; i < drawingObjectsController.selectedObjects.length; ++i) {
                                                            drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[i].Get_Id());
                                                        }
                                                        var selection_state = drawingObjectsController.getSelectionState();
                                                        var callback = function (bLock) {
                                                            if (bLock) {
                                                                History.Create_NewPoint();
                                                                drawingObjectsController.resetSelectionState2();
                                                                drawingObjectsController.setSelectionState(selection_state);
                                                                var state = drawingObjectsController.curState;
                                                                for (var i = 0; i < drawingObjectsController.selectedObjects.length; ++i) {
                                                                    var xfrm = drawingObjectsController.selectedObjects[i].spPr.xfrm;
                                                                    History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                                                                    drawingObjectsController.selectedObjects[i].setPosition(xfrm.offX + 3, xfrm.offY);
                                                                    History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                                                                    drawingObjectsController.selectedObjects[i].recalculateTransform();
                                                                    drawingObjectsController.selectedObjects[i].calculateTransformTextMatrix();
                                                                }
                                                                drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                            }
                                                        };
                                                        drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                        bRetValue = true;
                                                        break;
                                                    case STATES_ID_GROUP:
                                                        drawingObjectsController.drawingObjects.objectLocker.reset();
                                                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.curState.group.Get_Id());
                                                        var selection_state = drawingObjectsController.getSelectionState();
                                                        var callback = function (bLock) {
                                                            if (bLock) {
                                                                History.Create_NewPoint();
                                                                drawingObjectsController.resetSelectionState2();
                                                                drawingObjectsController.setSelectionState(selection_state);
                                                                var state = drawingObjectsController.curState;
                                                                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                                                                for (var i = 0; i < state.group.selectedObjects.length; ++i) {
                                                                    var xfrm = state.group.selectedObjects[i].spPr.xfrm;
                                                                    state.group.selectedObjects[i].setPosition(xfrm.offX + 3, xfrm.offY);
                                                                }
                                                                state.group.normalize();
                                                                state.group.updateCoordinatesAfterInternalResize();
                                                                state.group.recalculate();
                                                                History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                                                                drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                            }
                                                        };
                                                        drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                        bRetValue = true;
                                                        break;
                                                    case STATES_ID_TEXT_ADD:
                                                        case STATES_ID_TEXT_ADD_IN_GROUP:
                                                        case STATES_ID_CHART_TEXT_ADD:
                                                        state.textObject.txBody.content.Cursor_MoveRight(e.shiftKey, e.ctrlKey);
                                                        drawingObjectsController.recalculateCurPos();
                                                        drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                                        break;
                                                    }
                                                    bRetValue = true;
                                                } else {
                                                    if (e.keyCode == 40) {
                                                        switch (state.id) {
                                                        case STATES_ID_NULL:
                                                            case STATES_ID_EXPECT_DOUBLE_CLICK:
                                                            drawingObjectsController.drawingObjects.objectLocker.reset();
                                                            for (var i = 0; i < drawingObjectsController.selectedObjects.length; ++i) {
                                                                drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[i].Get_Id());
                                                            }
                                                            var selection_state = drawingObjectsController.getSelectionState();
                                                            var callback = function (bLock) {
                                                                if (bLock) {
                                                                    History.Create_NewPoint();
                                                                    drawingObjectsController.resetSelectionState2();
                                                                    drawingObjectsController.setSelectionState(selection_state);
                                                                    var state = drawingObjectsController.curState;
                                                                    for (var i = 0; i < drawingObjectsController.selectedObjects.length; ++i) {
                                                                        var xfrm = drawingObjectsController.selectedObjects[i].spPr.xfrm;
                                                                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                                                                        drawingObjectsController.selectedObjects[i].setPosition(xfrm.offX, xfrm.offY + 3);
                                                                        History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(drawingObjectsController.selectedObjects[i].Id, new UndoRedoDataShapeRecalc()), null);
                                                                        drawingObjectsController.selectedObjects[i].recalculateTransform();
                                                                        drawingObjectsController.selectedObjects[i].calculateTransformTextMatrix();
                                                                    }
                                                                    drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                                }
                                                            };
                                                            drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                            bRetValue = true;
                                                            break;
                                                        case STATES_ID_GROUP:
                                                            drawingObjectsController.drawingObjects.objectLocker.reset();
                                                            drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.curState.group.Get_Id());
                                                            var selection_state = drawingObjectsController.getSelectionState();
                                                            var callback = function (bLock) {
                                                                if (bLock) {
                                                                    History.Create_NewPoint();
                                                                    drawingObjectsController.resetSelectionState2();
                                                                    drawingObjectsController.setSelectionState(selection_state);
                                                                    var state = drawingObjectsController.curState;
                                                                    History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformUndo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                                                                    for (var i = 0; i < state.group.selectedObjects.length; ++i) {
                                                                        var xfrm = state.group.selectedObjects[i].spPr.xfrm;
                                                                        state.group.selectedObjects[i].setPosition(xfrm.offX, xfrm.offY + 3);
                                                                    }
                                                                    state.group.normalize();
                                                                    state.group.updateCoordinatesAfterInternalResize();
                                                                    state.group.recalculate();
                                                                    History.Add(g_oUndoRedoGraphicObjects, historyitem_AutoShapes_RecalculateTransformRedo, null, null, new UndoRedoDataGraphicObjects(state.group.Id, new UndoRedoDataShapeRecalc()), null);
                                                                    drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                                }
                                                            };
                                                            drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                            bRetValue = true;
                                                            break;
                                                        case STATES_ID_TEXT_ADD:
                                                            case STATES_ID_TEXT_ADD_IN_GROUP:
                                                            case STATES_ID_CHART_TEXT_ADD:
                                                            state.textObject.txBody.content.Cursor_MoveDown(e.shiftKey, e.ctrlKey);
                                                            drawingObjectsController.recalculateCurPos();
                                                            drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                                            break;
                                                        }
                                                        bRetValue = true;
                                                    } else {
                                                        if (e.keyCode == 45) {} else {
                                                            if (e.keyCode == 46 && false === isViewMode) {
                                                                drawingObjectsController.remove(1);
                                                                bRetValue = true;
                                                            } else {
                                                                if (e.keyCode == 65 && true === e.ctrlKey) {
                                                                    switch (state.id) {
                                                                    case STATES_ID_NULL:
                                                                        case STATES_ID_GROUP:
                                                                        case STATES_ID_EXPECT_DOUBLE_CLICK:
                                                                        if (state.id === STATES_ID_GROUP) {
                                                                            state.group.resetSelection();
                                                                        }
                                                                        drawingObjectsController.resetSelectionState();
                                                                        var drawing_bases = drawingObjectsController.drawingObjects.getDrawingObjects();
                                                                        for (var i = 0; i < drawing_bases.length; ++i) {
                                                                            drawing_bases[i].graphicObject.select(drawingObjectsController);
                                                                        }
                                                                        drawingObjectsController.drawingObjects.OnUpdateOverlay();
                                                                        break;
                                                                    case STATES_ID_TEXT_ADD:
                                                                        case STATES_ID_TEXT_ADD_IN_GROUP:
                                                                        case STATES_ID_CHART_TEXT_ADD:
                                                                        state.textObject.txBody.content.Select_All();
                                                                        state.drawingObjectsController.updateSelectionState();
                                                                        break;
                                                                    }
                                                                    bRetValue = true;
                                                                } else {
                                                                    if (e.keyCode == 66 && false === isViewMode && true === e.ctrlKey) {
                                                                        var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                        if (isRealObject(TextPr)) {
                                                                            if (typeof state.setCellBold === "function") {
                                                                                state.setCellBold(TextPr.Bold === true ? false : true);
                                                                            }
                                                                            bRetValue = true;
                                                                        }
                                                                    } else {
                                                                        if (e.keyCode == 67 && true === e.ctrlKey) {} else {
                                                                            if (e.keyCode == 69 && false === isViewMode && true === e.ctrlKey) {
                                                                                var ParaPr = drawingObjectsController.getParagraphParaPr();
                                                                                if (isRealObject(ParaPr)) {
                                                                                    if (typeof drawingObjectsController.setCellAlign === "function") {
                                                                                        drawingObjectsController.setCellAlign(ParaPr.Jc === align_Center ? "left" : "center");
                                                                                    }
                                                                                    bRetValue = true;
                                                                                }
                                                                            } else {
                                                                                if (e.keyCode == 73 && false === isViewMode && true === e.ctrlKey) {
                                                                                    var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                    if (isRealObject(TextPr)) {
                                                                                        if (typeof drawingObjectsController.setCellItalic === "function") {
                                                                                            drawingObjectsController.setCellItalic(TextPr.Italic === true ? false : true);
                                                                                        }
                                                                                        bRetValue = true;
                                                                                    }
                                                                                } else {
                                                                                    if (e.keyCode == 74 && false === isViewMode && true === e.ctrlKey) {
                                                                                        var ParaPr = drawingObjectsController.getParagraphParaPr();
                                                                                        if (isRealObject(ParaPr)) {
                                                                                            if (typeof drawingObjectsController.setCellAlign === "function") {
                                                                                                drawingObjectsController.setCellAlign(ParaPr.Jc === align_Justify ? "left" : "justify");
                                                                                            }
                                                                                            bRetValue = true;
                                                                                        }
                                                                                    } else {
                                                                                        if (e.keyCode == 75 && false === isViewMode && true === e.ctrlKey) {
                                                                                            bRetValue = true;
                                                                                        } else {
                                                                                            if (e.keyCode == 76 && false === isViewMode && true === e.ctrlKey) {
                                                                                                var ParaPr = drawingObjectsController.getParagraphParaPr();
                                                                                                if (isRealObject(ParaPr)) {
                                                                                                    if (typeof drawingObjectsController.setCellAlign === "function") {
                                                                                                        drawingObjectsController.setCellAlign(ParaPr.Jc === align_Left ? "justify" : "left");
                                                                                                    }
                                                                                                    bRetValue = true;
                                                                                                }
                                                                                            } else {
                                                                                                if (e.keyCode == 77 && false === isViewMode && true === e.ctrlKey) {
                                                                                                    bRetValue = true;
                                                                                                } else {
                                                                                                    if (e.keyCode == 80 && true === e.ctrlKey) {
                                                                                                        bRetValue = true;
                                                                                                    } else {
                                                                                                        if (e.keyCode == 82 && false === isViewMode && true === e.ctrlKey) {
                                                                                                            var ParaPr = drawingObjectsController.getParagraphParaPr();
                                                                                                            if (isRealObject(ParaPr)) {
                                                                                                                if (typeof drawingObjectsController.setCellAlign === "function") {
                                                                                                                    drawingObjectsController.setCellAlign(ParaPr.Jc === align_Right ? "left" : "right");
                                                                                                                }
                                                                                                                bRetValue = true;
                                                                                                            }
                                                                                                        } else {
                                                                                                            if (e.keyCode == 83 && false === isViewMode && true === e.ctrlKey) {
                                                                                                                bRetValue = false;
                                                                                                            } else {
                                                                                                                if (e.keyCode == 85 && false === isViewMode && true === e.ctrlKey) {
                                                                                                                    var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                                                    if (isRealObject(TextPr)) {
                                                                                                                        if (typeof drawingObjectsController.setCellUnderline === "function") {
                                                                                                                            drawingObjectsController.setCellUnderline(TextPr.Underline === true ? false : true);
                                                                                                                        }
                                                                                                                        bRetValue = true;
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    if (e.keyCode == 86 && false === isViewMode && true === e.ctrlKey) {} else {
                                                                                                                        if (e.keyCode == 88 && false === isViewMode && true === e.ctrlKey) {} else {
                                                                                                                            if (e.keyCode == 89 && false === isViewMode && true === e.ctrlKey) {} else {
                                                                                                                                if (e.keyCode == 90 && false === isViewMode && true === e.ctrlKey) {} else {
                                                                                                                                    if (e.keyCode == 93 || 57351 == e.keyCode) {
                                                                                                                                        bRetValue = true;
                                                                                                                                    } else {
                                                                                                                                        if (e.keyCode == 121 && true === e.shiftKey) {} else {
                                                                                                                                            if (e.keyCode == 144) {} else {
                                                                                                                                                if (e.keyCode == 145) {} else {
                                                                                                                                                    if (e.keyCode == 187 && false === isViewMode && true === e.ctrlKey) {
                                                                                                                                                        var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                                                                                        if (isRealObject(TextPr)) {
                                                                                                                                                            if (typeof drawingObjectsController.setCellSubscript === "function" && typeof drawingObjectsController.setCellSuperscript === "function") {
                                                                                                                                                                if (true === e.shiftKey) {
                                                                                                                                                                    drawingObjectsController.setCellSuperscript(TextPr.VertAlign === vertalign_SuperScript ? false : true);
                                                                                                                                                                } else {
                                                                                                                                                                    drawingObjectsController.setCellSubscript(TextPr.VertAlign === vertalign_SubScript ? false : true);
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                            bRetValue = true;
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        if (e.keyCode == 188 && true === e.ctrlKey) {
                                                                                                                                                            var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                                                                                            if (isRealObject(TextPr)) {
                                                                                                                                                                if (typeof drawingObjectsController.setCellSuperscript === "function") {
                                                                                                                                                                    drawingObjectsController.setCellSuperscript(TextPr.VertAlign === vertalign_SuperScript ? false : true);
                                                                                                                                                                }
                                                                                                                                                                bRetValue = true;
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            if (e.keyCode == 189 && false === isViewMode) {
                                                                                                                                                                var Item = null;
                                                                                                                                                                if (true === e.ctrlKey && true === e.shiftKey) {
                                                                                                                                                                    Item = new ParaText(String.fromCharCode(8211));
                                                                                                                                                                    Item.SpaceAfter = false;
                                                                                                                                                                } else {
                                                                                                                                                                    if (true === e.shiftKey) {
                                                                                                                                                                        Item = new ParaText("_");
                                                                                                                                                                    } else {
                                                                                                                                                                        Item = new ParaText("-");
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                                switch (state.id) {
                                                                                                                                                                case STATES_ID_TEXT_ADD:
                                                                                                                                                                    case STATES_ID_TEXT_ADD_IN_GROUP:
                                                                                                                                                                    case STATES_ID_CHART_TEXT_ADD:
                                                                                                                                                                    drawingObjectsController.drawingObjects.objectLocker.reset();
                                                                                                                                                                    if (state.id === STATES_ID_TEXT_ADD) {
                                                                                                                                                                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.textObject.Get_Id());
                                                                                                                                                                    } else {
                                                                                                                                                                        if (state.id === STATES_ID_CHART_TEXT_ADD) {
                                                                                                                                                                            drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.chart.Get_Id());
                                                                                                                                                                        } else {
                                                                                                                                                                            drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                    var selection_state = drawingObjectsController.getSelectionState();
                                                                                                                                                                    var callback = function (bLock) {
                                                                                                                                                                        if (bLock) {
                                                                                                                                                                            History.Create_NewPoint();
                                                                                                                                                                            drawingObjectsController.resetSelectionState2();
                                                                                                                                                                            drawingObjectsController.setSelectionState(selection_state);
                                                                                                                                                                            var state = drawingObjectsController.curState;
                                                                                                                                                                            state.textObject.paragraphAdd(Item);
                                                                                                                                                                            drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                                                                                                                                            state.textObject.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                                                                                                                                                        }
                                                                                                                                                                    };
                                                                                                                                                                    drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                                                                                                                                    break;
                                                                                                                                                                case STATES_ID_GROUP:
                                                                                                                                                                    if (!e.ctrlKey && state.group.selectedObjects.length === 1) {
                                                                                                                                                                        drawingObjectsController.drawingObjects.objectLocker.reset();
                                                                                                                                                                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(state.group.Get_Id());
                                                                                                                                                                        var selection_state = drawingObjectsController.getSelectionState();
                                                                                                                                                                        var callback = function (bLock) {
                                                                                                                                                                            if (bLock) {
                                                                                                                                                                                History.Create_NewPoint();
                                                                                                                                                                                drawingObjectsController.resetSelectionState2();
                                                                                                                                                                                drawingObjectsController.setSelectionState(selection_state);
                                                                                                                                                                                var state = drawingObjectsController.curState;
                                                                                                                                                                                drawingObjectsController.changeCurrentState(new TextAddInGroup(drawingObjectsController, drawingObjectsController.drawingObjects, state.group, state.group.selectedObjects[0]));
                                                                                                                                                                                var sp = drawingObjectsController.state.textObject;
                                                                                                                                                                                if (sp && sp.txBody && sp.txBody.content && sp.txBody.content.Cursor_MoveToEndPos) {
                                                                                                                                                                                    sp.txBody.content.Cursor_MoveToEndPos();
                                                                                                                                                                                }
                                                                                                                                                                                drawingObjectsController.state.textObject.paragraphAdd(Item);
                                                                                                                                                                                drawingObjectsController.showDrawingObjects(true);
                                                                                                                                                                                drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                                                                                                                                                            }
                                                                                                                                                                        };
                                                                                                                                                                        drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                                                                                                                                    }
                                                                                                                                                                    break;
                                                                                                                                                                case STATES_ID_NULL:
                                                                                                                                                                    case STATES_ID_EXPECT_DOUBLE_CLICK:
                                                                                                                                                                    if (drawingObjectsController.selectedObjects.length === 1 && drawingObjectsController.selectedObjects[0].isShape() && !e.ctrlKey) {
                                                                                                                                                                        drawingObjectsController.drawingObjects.objectLocker.reset();
                                                                                                                                                                        drawingObjectsController.drawingObjects.objectLocker.addObjectId(drawingObjectsController.selectedObjects[0].Get_Id());
                                                                                                                                                                        var selection_state = drawingObjectsController.getSelectionState();
                                                                                                                                                                        var callback = function (bLock) {
                                                                                                                                                                            if (bLock) {
                                                                                                                                                                                History.Create_NewPoint();
                                                                                                                                                                                drawingObjectsController.resetSelectionState2();
                                                                                                                                                                                drawingObjectsController.setSelectionState(selection_state);
                                                                                                                                                                                drawingObjectsController.changeCurrentState(new TextAddState(drawingObjectsController, drawingObjectsController.drawingObjects, drawingObjectsController.selectedObjects[0]));
                                                                                                                                                                                drawingObjectsController.curState.textObject.paragraphAdd(Item);
                                                                                                                                                                                drawingObjectsController.drawingObjects.showDrawingObjects(true);
                                                                                                                                                                                drawingObjectsController.updateSelectionState(drawingObjectsController.drawingObjects.drawingDocument);
                                                                                                                                                                            }
                                                                                                                                                                        };
                                                                                                                                                                        drawingObjectsController.drawingObjects.objectLocker.checkObjects(callback);
                                                                                                                                                                    }
                                                                                                                                                                    break;
                                                                                                                                                                }
                                                                                                                                                                bRetValue = true;
                                                                                                                                                            } else {
                                                                                                                                                                if (e.keyCode == 190 && true === e.ctrlKey) {
                                                                                                                                                                    var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                                                                                                    if (isRealObject(TextPr)) {
                                                                                                                                                                        if (typeof drawingObjectsController.setCellSubscript === "function") {
                                                                                                                                                                            drawingObjectsController.setCellSubscript(TextPr.VertAlign === vertalign_SubScript ? false : true);
                                                                                                                                                                        }
                                                                                                                                                                        bRetValue = true;
                                                                                                                                                                    }
                                                                                                                                                                } else {
                                                                                                                                                                    if (e.keyCode == 219 && false === isViewMode && true === e.ctrlKey) {
                                                                                                                                                                        if (typeof drawingObjectsController.decreaseFontSize === "function") {
                                                                                                                                                                            drawingObjectsController.decreaseFontSize();
                                                                                                                                                                        }
                                                                                                                                                                        bRetValue = true;
                                                                                                                                                                    } else {
                                                                                                                                                                        if (e.keyCode == 221 && false === isViewMode && true === e.ctrlKey) {
                                                                                                                                                                            if (typeof drawingObjectsController.increaseFontSize === "function") {
                                                                                                                                                                                drawingObjectsController.increaseFontSize();
                                                                                                                                                                            }
                                                                                                                                                                            bRetValue = true;
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (bRetValue) {
        e.preventDefault();
    }
    return bRetValue;
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