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
var STATES_ID_PRE_CHANGE_ADJ = 1;
var STATES_ID_PRE_MOVE = 2;
var STATES_ID_PRE_MOVE_INLINE_OBJECT = 3;
var STATES_ID_PRE_ROTATE = 4;
var STATES_ID_PRE_RESIZE = 5;
var STATES_ID_CHANGE_ADJ = 6;
var STATES_ID_MOVE = 7;
var STATES_ID_START_ADD_NEW_SHAPE = 8;
var STATES_ID_START_TRACK_NEW_SHAPE = 9;
var STATES_ID_TRACK_NEW_SHAPE = 9;
var STATES_ID_ROTATE = 16;
var STATES_ID_RESIZE = 17;
var STATES_ID_GROUP = 18;
var STATES_ID_TEXT_ADD = 19;
var STATES_ID_PRE_CHANGE_ADJ_GROUPED = 20;
var STATES_ID_CHANGE_ADJ_GROUPED = 21;
var STATES_ID_TEXT_ADD_IN_GROUP = 22;
var STATES_ID_START_CHANGE_WRAP = 23;
var STATES_ID_PRE_CHANGE_WRAP = 24;
var STATES_ID_PRE_CHANGE_WRAP_ADD = 25;
var STATES_ID_PRE_CHANGE_WRAP_CONTOUR = 25;
var STATES_ID_SPLINE_BEZIER = 32;
var STATES_ID_SPLINE_BEZIER33 = 33;
var STATES_ID_SPLINE_BEZIER2 = 34;
var STATES_ID_SPLINE_BEZIER3 = 35;
var STATES_ID_SPLINE_BEZIER4 = 36;
var STATES_ID_SPLINE_BEZIER5 = 37;
var STATES_ID_MOVE_INLINE_OBJECT = 38;
var STATES_ID_NULL_HF = 39;
var STATES_ID_START_ADD_TEXT_RECT = 40;
var STATES_ID_START_TRACK_TEXT_RECT = 41;
var STATES_ID_TRACK_TEXT_RECT = 48;
var STATES_ID_PRE_RESIZE_GROUPED = 49;
var STATES_ID_RESIZE_GROUPED = 50;
var STATES_ID_PRE_MOVE_IN_GROUP = 51;
var STATES_ID_MOVE_IN_GROUP = 52;
var STATES_ID_PRE_ROTATE_IN_GROUP = 53;
var STATES_ID_ROTATE_IN_GROUP = 54;
var STATES_ID_PRE_CH_ADJ_IN_GROUP = 55;
var STATES_ID_CH_ADJ_IN_GROUP = 56;
var STATES_ID_PRE_RESIZE_IN_GROUP = 57;
var STATES_ID_RESIZE_IN_GROUP = 64;
var STATES_ID_PRE_ROTATE_IN_GROUP2 = 65;
var STATES_ID_ROTATE_IN_GROUP2 = 66;
var STATES_ID_CHART = 67;
var STATES_ID_CHART_TITLE_TEXT = 68;
var STATES_ID_PRE_MOVE_CHART_TITLE = 69;
var STATES_ID_MOVE_CHART_TITLE = 70;
var STATES_ID_PRE_MOVE_CHART_TITLE_GROUP = 71;
var STATES_ID_MOVE_CHART_TITLE_GROUP = 72;
var STATES_ID_CHART_GROUP = 73;
var STATES_ID_CHART_TITLE_TEXT_GROUP = 80;
var SNAP_DISTANCE = 1.27;
function handleSelectedObjects(graphicObjects, e, x, y, pageIndex) {
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    if (_common_selection_array.length > 0) {
        if (_common_selection_array.length === 1) {
            var _selected_gr_object = _common_selection_array[0];
            var _translated_x;
            var _translated_y;
            if (_selected_gr_object.selectStartPage !== pageIndex) {
                var _translated_point = graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, _selected_gr_object.pageIndex);
                _translated_x = _translated_point.X;
                _translated_y = _translated_point.Y;
            } else {
                _translated_x = x;
                _translated_y = y;
            }
            var _hit_to_adj = _selected_gr_object.hitToAdj(_translated_x, _translated_y);
            if (_hit_to_adj.hit === true) {
                graphicObjects.majorGraphicObject = _selected_gr_object;
                graphicObjects.arrPreTrackObjects = [];
                if (_hit_to_adj.adjPolarFlag === true) {
                    graphicObjects.arrPreTrackObjects.push(new CTrackPolarAdjObject(_selected_gr_object.GraphicObj, _hit_to_adj.adjNum, _selected_gr_object.pageIndex));
                } else {
                    graphicObjects.arrPreTrackObjects.push(new CTrackXYAdjObject(_selected_gr_object.GraphicObj, _hit_to_adj.adjNum, _selected_gr_object.pageIndex));
                }
                graphicObjects.changeCurrentState(new PreChangeAdjState(graphicObjects));
                return true;
            }
        }
        for (var _index = _common_selection_array.length - 1; _index > -1; --_index) {
            var _cur_selected_gr_object = _common_selection_array[_index];
            if (_cur_selected_gr_object.pageIndex !== pageIndex) {
                _translated_point = graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, _cur_selected_gr_object.pageIndex);
                _translated_x = _translated_point.X;
                _translated_y = _translated_point.Y;
            } else {
                _translated_x = x;
                _translated_y = y;
            }
            var _hit_to_handle = _cur_selected_gr_object.hitToHandle(_translated_x, _translated_y);
            if (_hit_to_handle.hit === true) {
                graphicObjects.majorGraphicObject = _cur_selected_gr_object;
                graphicObjects.arrPreTrackObjects.length = 0;
                if (_hit_to_handle.handleRotate === false) {
                    var _card_direction = _cur_selected_gr_object.numberToCardDirection(_hit_to_handle.handleNum);
                    for (var _selected_index = 0; _selected_index < _common_selection_array.length; ++_selected_index) {
                        graphicObjects.arrPreTrackObjects.push(new CTrackHandleObject(_common_selection_array[_selected_index], _card_direction, _common_selection_array[_selected_index].pageIndex));
                    }
                    graphicObjects.changeCurrentState(new PreResizeState(graphicObjects, _hit_to_handle.handleNum));
                    return true;
                } else {
                    if (!_cur_selected_gr_object.canRotate()) {
                        return false;
                    }
                    for (_selected_index = 0; _selected_index < _common_selection_array.length; ++_selected_index) {
                        if (_common_selection_array[_selected_index].canRotate()) {
                            break;
                        }
                    }
                    if (_selected_index === _common_selection_array.length) {
                        return false;
                    }
                    for (_selected_index = 0; _selected_index < _common_selection_array.length; ++_selected_index) {
                        if (_common_selection_array[_selected_index].canRotate()) {
                            graphicObjects.arrPreTrackObjects.push(new CTrackRotateObject(_common_selection_array[_selected_index], _common_selection_array[_selected_index].pageIndex));
                        }
                    }
                    graphicObjects.changeCurrentState(new PreRotateState(graphicObjects));
                    return true;
                }
            }
        }
    }
    return false;
}
function handleSelectedObjectsCursorType(graphicObjects, e, x, y, pageIndex) {
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    if (_common_selection_array.length > 0) {
        if (_common_selection_array.length === 1) {
            var _selected_gr_object = _common_selection_array[0];
            var _translated_x;
            var _translated_y;
            if (_selected_gr_object.selectStartPage !== pageIndex) {
                var _translated_point = graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, _selected_gr_object.pageIndex);
                _translated_x = _translated_point.X;
                _translated_y = _translated_point.Y;
            } else {
                _translated_x = x;
                _translated_y = y;
            }
            var _hit_to_adj = _selected_gr_object.hitToAdj(_translated_x, _translated_y);
            if (_hit_to_adj.hit === true) {
                graphicObjects.drawingDocument.SetCursorType("crosshair");
                return true;
            }
        }
        for (var _index = _common_selection_array.length - 1; _index > -1; --_index) {
            var _cur_selected_gr_object = _common_selection_array[_index];
            if (_cur_selected_gr_object.pageIndex !== pageIndex) {
                _translated_point = graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, _cur_selected_gr_object.pageIndex);
                _translated_x = _translated_point.X;
                _translated_y = _translated_point.Y;
            } else {
                _translated_x = x;
                _translated_y = y;
            }
            var _hit_to_handle = _cur_selected_gr_object.hitToHandle(_translated_x, _translated_y);
            if (_hit_to_handle.hit === true) {
                graphicObjects.majorGraphicObject = _cur_selected_gr_object;
                graphicObjects.arrPreTrackObjects.length = 0;
                if (_hit_to_handle.handleRotate === false) {
                    var _card_direction = _cur_selected_gr_object.numberToCardDirection(_hit_to_handle.handleNum);
                    graphicObjects.drawingDocument.SetCursorType(CURSOR_TYPES_BY_CARD_DIRECTION[_card_direction]);
                    return true;
                } else {
                    graphicObjects.drawingDocument.SetCursorType("crosshair");
                    return true;
                }
            }
        }
    }
    return false;
}
function handleFloatShapeImage(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _hit = drawing.hit(x, y);
    var _hit_to_path = drawing.hitToPath(x, y);
    var b_hit_to_text = drawing.hitToTextRect(x, y);
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    if ((_hit && !b_hit_to_text) || _hit_to_path) {
        handleHitNoText(drawing, graphicObjects, e, x, y, pageIndex, handleState);
        return true;
    } else {
        if (b_hit_to_text) {
            for (var _sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                _common_selection_array[_sel_index].deselect();
            }
            _common_selection_array.length = 0;
            _common_selection_array.push(drawing);
            drawing.select(pageIndex);
            var arr_inline_objects = drawing.getArrContentDrawingObjects();
            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                var cur_inline_object = arr_inline_objects[inline_index];
                _hit = cur_inline_object.hit(x, y);
                if (_hit) {
                    graphicObjects.majorGraphicObject = cur_inline_object;
                    if (! (e.CtrlKey || e.ShiftKey)) {
                        if (cur_inline_object.selected === false) {
                            for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                                _common_selection_array[_sel_index].deselect();
                            }
                            _common_selection_array.length = 0;
                            cur_inline_object.select(pageIndex);
                            _common_selection_array.push(cur_inline_object);
                        }
                        graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                        graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                    } else {
                        if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                            if (cur_inline_object.selected === false) {
                                cur_inline_object.select(pageIndex);
                                _common_selection_array.push(cur_inline_object);
                            }
                            graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                            graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                        }
                    }
                    editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
                    editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
                    return true;
                }
            }
            drawing.selectionSetStart(x, y, e);
            graphicObjects.changeCurrentState(new TextAddState(graphicObjects, drawing));
            if (e.ClickCount <= 1) {
                graphicObjects.updateSelectionState();
            }
            return true;
        }
    }
    return false;
}
function handleFloatGroup(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _hit = drawing.hit(x, y);
    var _hit_to_path = drawing.hitToPath(x, y);
    var _hit_to_text_rect = drawing.hitToTextRect(x, y);
    var b_hit_to_text = _hit_to_text_rect.hit;
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    if ((_hit && !b_hit_to_text) || _hit_to_path) {
        handleHitNoText(drawing, graphicObjects, e, x, y, pageIndex, handleState);
        return true;
    } else {
        if (b_hit_to_text) {
            for (var _sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                _common_selection_array[_sel_index].deselect();
            }
            _common_selection_array.length = 0;
            _common_selection_array.push(drawing);
            drawing.select(pageIndex);
            var sp = drawing.GraphicObj.spTree[_hit_to_text_rect.num];
            if (typeof sp.getArrContentDrawingObjects === "function") {
                var arr_inline_objects = sp.getArrContentDrawingObjects();
                for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                    var cur_inline_object = arr_inline_objects[inline_index];
                    _hit = cur_inline_object.hit(x, y);
                    if (_hit) {
                        graphicObjects.majorGraphicObject = cur_inline_object;
                        if (! (e.CtrlKey || e.ShiftKey)) {
                            if (cur_inline_object.selected === false) {
                                for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                                    _common_selection_array[_sel_index].deselect();
                                }
                                _common_selection_array.length = 0;
                                cur_inline_object.select(pageIndex);
                                _common_selection_array.push(cur_inline_object);
                            }
                            graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                            graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                        } else {
                            if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                if (cur_inline_object.selected === false) {
                                    cur_inline_object.select(pageIndex);
                                    _common_selection_array.push(cur_inline_object);
                                }
                                graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                                graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                            }
                        }
                        editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
                        editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
                        return true;
                    }
                }
            }
            sp.selectionSetStart(x, y, e);
            sp.select(pageIndex);
            drawing.GraphicObj.selectionInfo.selectionArray.push(sp);
            graphicObjects.changeCurrentState(new TextAddInGroup(graphicObjects, sp, drawing.GraphicObj));
            if (e.ClickCount <= 1) {
                graphicObjects.updateSelectionState();
            }
            editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
            editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
            return true;
        }
    }
    return false;
}
function handleFloatObjects(drawingArray, graphicObjects, e, x, y, pageIndex, handleState) {
    for (var _object_index = drawingArray.length - 1; _object_index > -1; --_object_index) {
        var _current_graphic_object = drawingArray[_object_index];
        if (_current_graphic_object.GraphicObj instanceof WordShape || _current_graphic_object.GraphicObj instanceof WordImage) {
            if (handleFloatShapeImage(_current_graphic_object, graphicObjects, e, x, y, pageIndex, handleState)) {
                return true;
            }
        } else {
            if (_current_graphic_object.GraphicObj instanceof WordGroupShapes) {
                if (handleFloatGroup(_current_graphic_object, graphicObjects, e, x, y, pageIndex, handleState)) {
                    return true;
                }
            } else {
                if (typeof CChartAsGroup != "undefined" && _current_graphic_object.GraphicObj instanceof CChartAsGroup) {
                    if (handleChart(_current_graphic_object, graphicObjects, x, y, e, pageIndex)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
function handleHitNoText(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    graphicObjects.majorGraphicObject = drawing;
    if (! (e.CtrlKey || e.ShiftKey)) {
        if (drawing.selected === false) {
            for (var _sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                _common_selection_array[_sel_index].deselect();
            }
            _common_selection_array.length = 0;
            drawing.select(pageIndex);
            _common_selection_array.push(drawing);
            editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
            editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
            _common_selection_array.sort(ComparisonByZIndex);
            graphicObjects.arrPreTrackObjects.length = 0;
            graphicObjects.arrPreTrackObjects[0] = new CTrackMoveObject(drawing, drawing.absOffsetX - x, drawing.absOffsetY - y, graphicObjects, pageIndex);
            if (_common_selection_array.length === 1) {
                var pre_track = _common_selection_array[0];
                pre_track.calculateOffset();
                var boundsOffX = pre_track.absOffsetX - pre_track.boundsOffsetX;
                var boundsOffY = pre_track.absOffsetY - pre_track.boundsOffsetY;
                handleState.anchorPos = pre_track.Get_AnchorPos();
                handleState.anchorPos.Page = pageIndex;
            }
            graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
            graphicObjects.changeCurrentState(new PreMoveState(graphicObjects, false, false));
            return;
        } else {
            graphicObjects.arrPreTrackObjects.length = 0;
            for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                if (_common_selection_array[_sel_index].pageIndex === pageIndex) {
                    drawing = _common_selection_array[_sel_index];
                    graphicObjects.arrPreTrackObjects.push(new CTrackMoveObject(drawing, drawing.absOffsetX - x, drawing.absOffsetY - y, graphicObjects, pageIndex));
                }
            }
            if (_common_selection_array.length === 1) {
                var pre_track = _common_selection_array[0];
                pre_track.calculateOffset();
                var boundsOffX = pre_track.absOffsetX - pre_track.boundsOffsetX;
                var boundsOffY = pre_track.absOffsetY - pre_track.boundsOffsetY;
                handleState.anchorPos = pre_track.Get_AnchorPos();
                handleState.anchorPos.Page = pageIndex;
                handleState.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
            }
            graphicObjects.changeCurrentState(new PreMoveState(graphicObjects, false, true));
            return;
        }
    } else {
        if ((_common_selection_array.length > 0 && _common_selection_array[0].Is_Inline())) {
            return;
        }
        if (drawing.selected === false) {
            drawing.select(pageIndex);
            _common_selection_array.push(drawing);
            _common_selection_array.sort(ComparisonByZIndex);
            editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
            editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
        }
        graphicObjects.arrPreTrackObjects.length = 0;
        for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
            if (_common_selection_array[_sel_index].pageIndex === pageIndex) {
                drawing = _common_selection_array[_sel_index];
                graphicObjects.arrPreTrackObjects.push(new CTrackMoveObject(drawing, drawing.absOffsetX - x, drawing.absOffsetY - y, graphicObjects, pageIndex));
            }
        }
        if (_common_selection_array.length === 1) {
            var pre_track = _common_selection_array[0];
            pre_track.calculateOffset();
            var boundsOffX = pre_track.absOffsetX - pre_track.boundsOffsetX;
            var boundsOffY = pre_track.absOffsetY - pre_track.boundsOffsetY;
            handleState.anchorPos = pre_track.Get_AnchorPos();
            handleState.anchorPos.Page = pageIndex;
        }
        graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        graphicObjects.changeCurrentState(new PreMoveState(graphicObjects, true, false));
        return;
    }
}
function handleInlineShapeImage(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    var _hit = drawing.hit(x, y);
    var _hit_to_path = drawing.hitToPath(x, y);
    var b_hit_to_text = drawing.hitToTextRect(x, y);
    if ((_hit && !b_hit_to_text) || _hit_to_path) {
        handleInlineHitNoText(drawing, graphicObjects, e, x, y, pageIndex, handleState);
        return true;
    } else {
        if (b_hit_to_text) {
            for (var _sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                _common_selection_array[_sel_index].deselect();
            }
            _common_selection_array.length = 0;
            drawing.select(pageIndex);
            _common_selection_array.push(drawing);
            var arr_inline_objects = drawing.getArrContentDrawingObjects();
            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                cur_inline_object = arr_inline_objects[inline_index];
                _hit = cur_inline_object.hit(x, y);
                if (_hit) {
                    graphicObjects.majorGraphicObject = cur_inline_object;
                    if (! (e.CtrlKey || e.ShiftKey)) {
                        if (cur_inline_object.selected === false) {
                            for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                                _common_selection_array[_sel_index].deselect();
                            }
                            _common_selection_array.length = 0;
                            cur_inline_object.select(pageIndex);
                            _common_selection_array.push(cur_inline_object);
                        }
                        graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                        graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                    } else {
                        if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                            if (cur_inline_object.selected === false) {
                                cur_inline_object.select(pageIndex);
                                _common_selection_array.push(cur_inline_object);
                            }
                            graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                            graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                        }
                    }
                    editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
                    editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
                    return true;
                }
            }
            drawing.selectionSetStart(x, y, e);
            graphicObjects.changeCurrentState(new TextAddState(graphicObjects, drawing));
            if (e.ClickCount <= 1) {
                graphicObjects.updateSelectionState();
            }
            editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
            editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
            return true;
        }
    }
    return false;
}
function handleInlineGroup(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    var _hit = drawing.hit(x, y);
    var _hit_to_path = drawing.hitToPath(x, y);
    var _hit_to_text_rect = drawing.hitToTextRect(x, y);
    var b_hit_to_text = _hit_to_text_rect.hit;
    if ((_hit && !b_hit_to_text) || _hit_to_path) {
        handleInlineHitNoText(drawing, graphicObjects, e, x, y, pageIndex, handleState);
        return true;
    } else {
        if (b_hit_to_text) {
            for (var _sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                _common_selection_array[_sel_index].deselect();
            }
            _common_selection_array.length = 0;
            drawing.select(pageIndex);
            _common_selection_array.push(drawing);
            var sp = drawing.GraphicObj.spTree[_hit_to_text_rect.num];
            if (typeof sp.getArrContentDrawingObjects === "function") {
                var arr_inline_objects = sp.getArrContentDrawingObjects();
                for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                    cur_inline_object = arr_inline_objects[inline_index];
                    _hit = cur_inline_object.hit(x, y);
                    if (_hit) {
                        graphicObjects.majorGraphicObject = cur_inline_object;
                        if (! (e.CtrlKey || e.ShiftKey)) {
                            if (cur_inline_object.selected === false) {
                                for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                                    _common_selection_array[_sel_index].deselect();
                                }
                                _common_selection_array.length = 0;
                                cur_inline_object.select(pageIndex);
                                _common_selection_array.push(cur_inline_object);
                            }
                            graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                            graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                        } else {
                            if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                if (cur_inline_object.selected === false) {
                                    cur_inline_object.select(pageIndex);
                                    _common_selection_array.push(cur_inline_object);
                                }
                                graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                                graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                            }
                        }
                        editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
                        editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
                        return true;
                    }
                }
            }
            sp.selectionSetStart(x, y, e);
            sp.select(pageIndex);
            drawing.GraphicObj.selectionInfo.selectionArray.push(sp);
            graphicObjects.changeCurrentState(new TextAddInGroup(graphicObjects, sp, drawing.GraphicObj));
            if (e.ClickCount <= 1) {
                graphicObjects.updateSelectionState();
            }
            editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
            editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
            return true;
        }
    }
    return false;
}
function handleInlineHitNoText(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    graphicObjects.majorGraphicObject = drawing;
    if (! (e.CtrlKey || e.ShiftKey)) {
        var b_sel = drawing.selected;
        if (drawing.selected === false) {
            for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                _common_selection_array[_sel_index].deselect();
            }
            _common_selection_array.length = 0;
            drawing.select(pageIndex);
            _common_selection_array.push(drawing);
        }
        graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, drawing.Get_Id(), false, b_sel));
        graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
        editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
        return;
    } else {
        if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === drawing) {
            b_sel = drawing.selected;
            if (drawing.selected === false) {
                drawing.select(pageIndex);
                _common_selection_array.push(drawing);
            }
            graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, drawing.Get_Id(), false, b_sel));
            graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        }
        editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
        editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
        return;
    }
}
function handleInlineObjects(inlineObjects, graphicObjects, e, x, y, pageIndex, handleState) {
    for (_object_index = inlineObjects.length - 1; _object_index > -1; --_object_index) {
        var _current_graphic_object = inlineObjects[_object_index];
        if (!_current_graphic_object.isShapeChild()) {
            if (_current_graphic_object.GraphicObj instanceof WordShape || _current_graphic_object.GraphicObj instanceof WordImage) {
                if (handleInlineShapeImage(_current_graphic_object, graphicObjects, e, x, y, pageIndex, handleState)) {
                    return true;
                }
            } else {
                if (_current_graphic_object.GraphicObj instanceof WordGroupShapes) {
                    if (handleInlineGroup(_current_graphic_object, graphicObjects, e, x, y, pageIndex, handleState)) {
                        return true;
                    }
                } else {
                    if (typeof CChartAsGroup != "undefined" && _current_graphic_object.GraphicObj instanceof CChartAsGroup) {
                        if (handleChart(_current_graphic_object, graphicObjects, x, y, e, pageIndex) === true) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}
function handleChart(paraDrawing, graphicObjects, x, y, e, pageIndex) {
    var chart = paraDrawing.GraphicObj;
    var titles = [];
    if (! (e.CtrlKey || e.ShiftKey)) {
        if (isRealObject(chart.chartTitle)) {
            titles.push(chart.chartTitle);
        }
        if (isRealObject(chart.hAxisTitle)) {
            titles.push(chart.hAxisTitle);
        }
        if (isRealObject(chart.vAxisTitle)) {
            titles.push(chart.vAxisTitle);
        }
        for (var i = 0; i < titles.length; ++i) {
            var cur_title = titles[i];
            var hit = cur_title.hit(x, y);
            var hit_in_text_rect = cur_title.hitInTextRect(x, y);
            if (chart.selected) {
                if (!cur_title.selected && hit && !hit_in_text_rect) {
                    var selected_objects = graphicObjects.selectionInfo.selectionArray;
                    for (var j = 0; j < selected_objects.length; ++j) {
                        selected_objects[j].deselect();
                    }
                    selected_objects.length = 0;
                    paraDrawing.select(pageIndex);
                    selected_objects.push(paraDrawing);
                    for (var j = 0; j < titles.length; ++j) {
                        if (titles[j]) {
                            titles[j].deselect();
                        }
                    }
                    cur_title.select(pageIndex);
                    graphicObjects.arrPreTrackObjects.push(new MoveTitleInChart(cur_title));
                    graphicObjects.changeCurrentState(new PreMoveChartTitleState(graphicObjects, cur_title, paraDrawing, x, y, pageIndex));
                    editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
                    editor.WordControl.OnUpdateOverlay();
                    return true;
                } else {
                    if (hit_in_text_rect) {
                        var selected_objects = graphicObjects.selectionInfo.selectionArray;
                        for (var j = 0; j < selected_objects.length; ++j) {
                            selected_objects[j].deselect();
                        }
                        selected_objects.length = 0;
                        for (var j = 0; j < titles.length; ++j) {
                            if (titles[j]) {
                                titles[j].deselect();
                            }
                        }
                        paraDrawing.select(pageIndex);
                        cur_title.select(pageIndex);
                        graphicObjects.selectionInfo.selectionArray.push(paraDrawing);
                        graphicObjects.changeCurrentState(new TextAddInChartTitle(graphicObjects, paraDrawing, cur_title));
                        cur_title.selectionSetStart(e, x, y, pageIndex);
                        if (e.ClickCount < 2) {
                            graphicObjects.updateSelectionState();
                        }
                        return true;
                    } else {
                        if (hit) {
                            graphicObjects.arrPreTrackObjects.push(new MoveTitleInChart(cur_title));
                            graphicObjects.changeCurrentState(new PreMoveChartTitleState(graphicObjects, cur_title, paraDrawing, x, y, pageIndex));
                            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
                            editor.WordControl.OnUpdateOverlay();
                            return true;
                        }
                    }
                }
            } else {
                if (hit && !hit_in_text_rect) {
                    var selected_objects = graphicObjects.selectionInfo.selectionArray;
                    for (var j = 0; j < selected_objects.length; ++j) {
                        selected_objects[j].deselect();
                    }
                    selected_objects.length = 0;
                    for (var j = 0; j < titles.length; ++j) {
                        if (titles[j]) {
                            titles[j].deselect();
                        }
                    }
                    paraDrawing.select(pageIndex);
                    cur_title.select(pageIndex);
                    graphicObjects.selectionInfo.selectionArray.push(paraDrawing);
                    graphicObjects.arrPreTrackObjects.push(new MoveTitleInChart(cur_title));
                    graphicObjects.changeCurrentState(new PreMoveChartTitleState(graphicObjects, cur_title, paraDrawing, x, y, pageIndex));
                    editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
                    editor.WordControl.OnUpdateOverlay();
                    return true;
                } else {
                    if (hit_in_text_rect) {
                        var selected_objects = graphicObjects.selectionInfo.selectionArray;
                        for (var j = 0; j < selected_objects.length; ++j) {
                            selected_objects[j].deselect();
                        }
                        selected_objects.length = 0;
                        for (var j = 0; j < titles.length; ++j) {
                            if (titles[j]) {
                                titles[j].deselect();
                            }
                        }
                        paraDrawing.select(pageIndex);
                        cur_title.select(pageIndex);
                        graphicObjects.selectionInfo.selectionArray.push(paraDrawing);
                        graphicObjects.changeCurrentState(new TextAddInChartTitle(graphicObjects, paraDrawing, cur_title));
                        cur_title.selectionSetStart(e, x, y, pageIndex);
                        graphicObjects.updateSelectionState();
                        editor.WordControl.OnUpdateOverlay();
                        return true;
                    }
                }
            }
        }
    }
    if (!chart.parent.Is_Inline()) {
        var _hit = chart.hit(x, y);
        var _hit_to_path = hit;
        var b_hit_to_text = false;
        var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
        if ((_hit && !b_hit_to_text) || _hit_to_path) {
            graphicObjects.majorGraphicObject = chart.parent;
            if (! (e.CtrlKey || e.ShiftKey)) {
                if (chart.selected === false) {
                    for (var _sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                        _common_selection_array[_sel_index].deselect();
                    }
                    _common_selection_array.length = 0;
                    chart.select(pageIndex);
                    _common_selection_array.push(paraDrawing);
                    editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
                    editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
                    _common_selection_array.sort(ComparisonByZIndex);
                    graphicObjects.arrPreTrackObjects.length = 0;
                    graphicObjects.arrPreTrackObjects[0] = new CTrackMoveObject(chart.parent, chart.absOffsetX - x, chart.absOffsetY - y, graphicObjects, pageIndex);
                    if (_common_selection_array.length === 1) {
                        var pre_track = _common_selection_array[0];
                        pre_track.calculateOffset();
                        var boundsOffX = pre_track.absOffsetX - pre_track.boundsOffsetX;
                        var boundsOffY = pre_track.absOffsetY - pre_track.boundsOffsetY;
                        graphicObjects.curState.anchorPos = pre_track.Get_AnchorPos();
                        graphicObjects.curState.anchorPos.Page = pageIndex;
                    }
                    graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                    graphicObjects.changeCurrentState(new PreMoveState(graphicObjects, false, false));
                    return true;
                } else {
                    graphicObjects.arrPreTrackObjects.length = 0;
                    for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                        if (_common_selection_array[_sel_index].pageIndex === pageIndex) {
                            _common_selection_array[_sel_index];
                            graphicObjects.arrPreTrackObjects.push(new CTrackMoveObject(_common_selection_array[_sel_index], _common_selection_array[_sel_index].absOffsetX - x, _common_selection_array[_sel_index].absOffsetY - y, graphicObjects, pageIndex));
                        }
                    }
                    if (_common_selection_array.length === 1) {
                        var pre_track = _common_selection_array[0];
                        pre_track.calculateOffset();
                        var boundsOffX = pre_track.absOffsetX - pre_track.boundsOffsetX;
                        var boundsOffY = pre_track.absOffsetY - pre_track.boundsOffsetY;
                        graphicObjects.curState.anchorPos = pre_track.Get_AnchorPos();
                        graphicObjects.curState.anchorPos.Page = pageIndex;
                        graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                    }
                    graphicObjects.changeCurrentState(new PreMoveState(graphicObjects, false, true));
                    return true;
                }
            } else {
                if ((_common_selection_array.length > 0 && _common_selection_array[0].Is_Inline())) {
                    return true;
                }
                if (chart.parent.selected === false) {
                    chart.parent.select(pageIndex);
                    _common_selection_array.push(chart.parent);
                    _common_selection_array.sort(ComparisonByZIndex);
                    editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
                    editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
                }
                graphicObjects.arrPreTrackObjects.length = 0;
                for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                    if (_common_selection_array[_sel_index].pageIndex === pageIndex) {
                        chart = _common_selection_array[_sel_index];
                        graphicObjects.arrPreTrackObjects.push(new CTrackMoveObject(chart, chart.absOffsetX - x, chart.absOffsetY - y, graphicObjects, pageIndex));
                    }
                }
                if (_common_selection_array.length === 1) {
                    var pre_track = _common_selection_array[0];
                    pre_track.calculateOffset();
                    var boundsOffX = pre_track.absOffsetX - pre_track.boundsOffsetX;
                    var boundsOffY = pre_track.absOffsetY - pre_track.boundsOffsetY;
                    graphicObjects.curState.anchorPos = pre_track.Get_AnchorPos();
                    graphicObjects.curState.anchorPos.Page = pageIndex;
                }
                graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                graphicObjects.changeCurrentState(new PreMoveState(graphicObjects, true, false));
                return true;
            }
        }
    } else {
        _hit = chart.parent.hit(x, y);
        if (_hit) {
            var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
            var _current_graphic_object = paraDrawing;
            graphicObjects.majorGraphicObject = chart.parent;
            if (! (e.CtrlKey || e.ShiftKey)) {
                var b_sel = _current_graphic_object.selected;
                if (_current_graphic_object.selected === false) {
                    for (_sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
                        _common_selection_array[_sel_index].deselect();
                    }
                    _common_selection_array.length = 0;
                    _current_graphic_object.select(pageIndex);
                    _common_selection_array.push(_current_graphic_object);
                }
                graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, _current_graphic_object.Get_Id(), false, b_sel));
                graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
                editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
                return true;
            } else {
                if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === _current_graphic_object) {
                    b_sel = _current_graphic_object.selected;
                    if (_current_graphic_object.selected === false) {
                        _current_graphic_object.select(pageIndex);
                        _common_selection_array.push(_current_graphic_object);
                    }
                    graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, _current_graphic_object.Get_Id(), false, b_sel));
                    graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                }
                editor.asc_fireCallback("asc_canGroup", graphicObjects.canGroup());
                editor.asc_fireCallback("asc_canUnGroup", graphicObjects.canUnGroup());
                return true;
            }
        }
    }
    return false;
}
function handleSelectedObjectsGroup(graphicObjects, group, e, x, y, pageIndex, handleState) {
    var t_x, t_y;
    if (group.pageIndex === pageIndex || graphicObjects.document.CurPos.Type === docpostype_HdrFtr) {
        t_x = x;
        t_y = y;
    } else {
        var t_p = graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, group.pageIndex);
        t_x = t_p.X;
        t_y = t_p.Y;
    }
    var s_arr = group.selectionInfo.selectionArray;
    if (s_arr.length > 0) {
        if (s_arr.length === 1) {
            if (typeof s_arr[0].hitToAdj === "function") {
                var hit = s_arr[0].hitToAdj(t_x, t_y);
                if (hit.hit) {
                    graphicObjects.arrPreTrackObjects.length = 0;
                    if (!hit.adjPolarFlag) {
                        graphicObjects.arrPreTrackObjects.push(new CTrackXYAdjObject(s_arr[0], hit.adjNum, group.pageIndex));
                    } else {
                        graphicObjects.arrPreTrackObjects.push(new CTrackPolarAdjObject(s_arr[0], hit.adjNum, group.pageIndex));
                    }
                    graphicObjects.changeCurrentState(new PreChangeAdjInGroup(graphicObjects, group));
                    return true;
                }
            }
        }
        for (var i = s_arr.length - 1; i > -1; --i) {
            if (typeof s_arr[i].hitToHandle === "function") {
                hit = s_arr[i].hitToHandle(t_x, t_y);
                if (hit.hit) {
                    graphicObjects.arrPreTrackObjects.length = 0;
                    if (!hit.handleRotate) {
                        var card_dir = s_arr[i].numberToCardDirection(hit.handleNum);
                        for (var j = 0; j < s_arr.length; ++j) {
                            var handle_num = s_arr[j].cardDirectionToNumber(card_dir);
                            graphicObjects.arrPreTrackObjects.push(new ShapeForResizeInGroup2(s_arr[j], handle_num));
                        }
                        graphicObjects.changeCurrentState(new PreResizeInGroup(graphicObjects, group, s_arr[i], handle_num));
                    } else {
                        if (!s_arr[i].canRotate()) {
                            return false;
                        }
                        for (var _selected_index = 0; _selected_index < s_arr.length; ++_selected_index) {
                            if (s_arr[_selected_index].canRotate()) {
                                break;
                            }
                        }
                        if (_selected_index === s_arr.length) {
                            return false;
                        }
                        for (j = 0; j < s_arr.length; ++j) {
                            graphicObjects.arrPreTrackObjects.push(new ShapeForRotateInGroup(s_arr[j]));
                        }
                        graphicObjects.changeCurrentState(new PreRotateInGroup(graphicObjects, group, s_arr[i]));
                    }
                    return true;
                }
            }
        }
    }
    hit = group.hitToHandle(t_x, t_y);
    if (hit.hit) {
        for (i = 0; i < group.selectionInfo.selectionArray.length; ++i) {
            group.selectionInfo.selectionArray[i].deselect();
        }
        group.selectionInfo.selectionArray.length = 0;
        graphicObjects.majorGraphicObject = group.parent;
        graphicObjects.arrPreTrackObjects.length = 0;
        if (hit.handleRotate === false) {
            var _card_direction = group.numberToCardDirection(hit.handleNum);
            graphicObjects.arrPreTrackObjects.push(new CTrackHandleObject(group.parent, _card_direction, group.pageIndex));
            graphicObjects.changeCurrentState(new PreResizeState(graphicObjects, hit.handleNum));
        } else {
            if (!group.canRotate()) {
                return false;
            }
            graphicObjects.arrPreTrackObjects.push(new CTrackRotateObject(group.parent, group.pageIndex));
            graphicObjects.changeCurrentState(new PreRotateState(graphicObjects));
        }
        return true;
    }
    return false;
}
function handleSelectedObjectsGroupCursorType(graphicObjects, group, e, x, y, pageIndex, handleState) {
    var t_x, t_y;
    if (group.pageIndex === pageIndex || graphicObjects.document.CurPos.Type === docpostype_HdrFtr) {
        t_x = x;
        t_y = y;
    } else {
        var t_p = graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, group.pageIndex);
        t_x = t_p.X;
        t_y = t_p.Y;
    }
    var s_arr = group.selectionInfo.selectionArray;
    if (s_arr.length > 0) {
        if (s_arr.length === 1) {
            if (typeof s_arr[0].hitToAdj === "function") {
                var hit = s_arr[0].hitToAdj(t_x, t_y);
                if (hit.hit) {
                    graphicObjects.drawingDocument.SetCursorType("crosshair");
                    return true;
                }
            }
        }
        for (var i = s_arr.length - 1; i > -1; --i) {
            if (typeof s_arr[i].hitToHandle === "function") {
                hit = s_arr[i].hitToHandle(t_x, t_y);
                if (hit.hit) {
                    graphicObjects.arrPreTrackObjects.length = 0;
                    if (!hit.handleRotate) {
                        var card_dir = s_arr[i].numberToCardDirection(hit.handleNum);
                        graphicObjects.drawingDocument.SetCursorType(CURSOR_TYPES_BY_CARD_DIRECTION[card_dir]);
                    } else {
                        graphicObjects.drawingDocument.SetCursorType("crosshair");
                    }
                    return true;
                }
            }
        }
    }
    hit = group.hitToHandle(t_x, t_y);
    if (hit.hit) {
        if (hit.handleRotate === false) {
            var _card_direction = group.numberToCardDirection(hit.handleNum);
            graphicObjects.drawingDocument.SetCursorType(CURSOR_TYPES_BY_CARD_DIRECTION[_card_direction]);
        } else {
            if (!group.canRotate()) {
                return false;
            }
            graphicObjects.drawingDocument.SetCursorType("crosshair");
        }
        return true;
    }
    return false;
}
function handleFloatShapeImageCursorType(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _hit = drawing.hit(x, y);
    var _hit_to_path = drawing.hitToPath(x, y);
    var b_hit_to_text = drawing.hitToTextRect(x, y);
    if ((_hit && !b_hit_to_text) || _hit_to_path) {
        graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    } else {
        if (b_hit_to_text) {
            var arr_inline_objects = drawing.getArrContentDrawingObjects();
            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                var cur_inline_object = arr_inline_objects[inline_index];
                _hit = cur_inline_object.hit(x, y);
                if (_hit) {
                    graphicObjects.drawingDocument.SetCursorType("move");
                    return true;
                }
            }
            drawing.GraphicObj.updateCursorType(e, x, y, pageIndex);
            return true;
        }
    }
    return false;
}
function handleFloatGroupCursorType(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _hit = drawing.hit(x, y);
    var _hit_to_path = drawing.hitToPath(x, y);
    var _hit_to_text_rect = drawing.hitToTextRect(x, y);
    var b_hit_to_text = _hit_to_text_rect.hit;
    if ((_hit && !b_hit_to_text) || _hit_to_path) {
        graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    } else {
        if (b_hit_to_text) {
            var sp = drawing.GraphicObj.spTree[_hit_to_text_rect.num];
            if (typeof sp.getArrContentDrawingObjects === "function") {
                var arr_inline_objects = sp.getArrContentDrawingObjects();
                for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                    var cur_inline_object = arr_inline_objects[inline_index];
                    var _hit = cur_inline_object.hit(x, y);
                    if (_hit) {
                        graphicObjects.drawingDocument.SetCursorType("move");
                        return true;
                    }
                }
            }
            sp.updateCursorType(e, x, y, pageIndex);
            return true;
        }
    }
    return false;
}
function handleFloatObjectsCursorType(drawingArray, graphicObjects, e, x, y, pageIndex, handleState) {
    for (var _object_index = drawingArray.length - 1; _object_index > -1; --_object_index) {
        var _current_graphic_object = drawingArray[_object_index];
        if (_current_graphic_object.GraphicObj instanceof WordShape || _current_graphic_object.GraphicObj instanceof WordImage) {
            if (handleFloatShapeImageCursorType(_current_graphic_object, graphicObjects, e, x, y, pageIndex, handleState)) {
                return true;
            }
        } else {
            if (_current_graphic_object.GraphicObj instanceof WordGroupShapes) {
                if (handleFloatGroupCursorType(_current_graphic_object, graphicObjects, e, x, y, pageIndex, handleState)) {
                    return true;
                }
            } else {
                if (typeof CChartAsGroup != "undefined" && _current_graphic_object.GraphicObj instanceof CChartAsGroup) {
                    if (handleChartCursorType(_current_graphic_object, graphicObjects, x, y, e, pageIndex)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
function handleChartCursorType(paraDrawing, graphicObjects, x, y, e, pageIndex) {
    var chart = paraDrawing.GraphicObj;
    var titles = [];
    if (isRealObject(chart.chartTitle)) {
        titles.push(chart.chartTitle);
    }
    if (isRealObject(chart.hAxisTitle)) {
        titles.push(chart.hAxisTitle);
    }
    if (isRealObject(chart.vAxisTitle)) {
        titles.push(chart.vAxisTitle);
    }
    for (var i = 0; i < titles.length; ++i) {
        var cur_title = titles[i];
        var hit = cur_title.hit(x, y);
        var hit_in_text_rect = cur_title.hitInTextRect(x, y);
        if (chart.selected) {
            if (!cur_title.selected && hit && !hit_in_text_rect) {
                graphicObjects.drawingDocument.SetCursorType("move");
                return true;
            } else {
                if (hit_in_text_rect) {
                    cur_title.updateCursorType(e, x, y, pageIndex);
                    return true;
                } else {
                    if (hit) {
                        graphicObjects.drawingDocument.SetCursorType("move");
                        return true;
                    }
                }
            }
        } else {
            if (hit && !hit_in_text_rect) {
                graphicObjects.drawingDocument.SetCursorType("move");
                return true;
            } else {
                if (hit_in_text_rect) {
                    cur_title.updateCursorType(e, x, y, pageIndex);
                    return true;
                }
            }
        }
    }
    if (!chart.parent.Is_Inline()) {
        var _hit = chart.hit(x, y);
        var _hit_to_path = hit;
        var _hit_to_text_rect = false;
        var b_hit_to_text = false;
        var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
        if ((_hit && !b_hit_to_text) || _hit_to_path) {
            graphicObjects.drawingDocument.SetCursorType("move");
            return true;
        }
    } else {
        _hit = chart.parent.hit(x, y);
        if (_hit) {
            graphicObjects.drawingDocument.SetCursorType("move");
            return true;
        }
    }
    return false;
}
function handleInlineShapeImageCursorType(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    var _hit = drawing.hit(x, y);
    var _hit_to_path = drawing.hitToPath(x, y);
    var b_hit_to_text = drawing.hitToTextRect(x, y);
    if ((_hit && !b_hit_to_text) || _hit_to_path) {
        graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    } else {
        if (b_hit_to_text) {
            var arr_inline_objects = drawing.getArrContentDrawingObjects();
            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                var cur_inline_object = arr_inline_objects[inline_index];
                var _hit = cur_inline_object.hit(x, y);
                if (_hit) {
                    graphicObjects.drawingDocument.SetCursorType("move");
                    return true;
                }
            }
            drawing.GraphicObj.updateCursorType(e, x, y, pageIndex);
            return true;
        }
    }
    return false;
}
function handleInlineGroupCursorType(drawing, graphicObjects, e, x, y, pageIndex, handleState) {
    var _hit = drawing.hit(x, y);
    var _hit_to_path = drawing.hitToPath(x, y);
    var _hit_to_text_rect = drawing.hitToTextRect(x, y);
    var b_hit_to_text = _hit_to_text_rect.hit;
    if ((_hit && !b_hit_to_text) || _hit_to_path) {
        graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    } else {
        if (b_hit_to_text) {
            var sp = drawing.GraphicObj.spTree[_hit_to_text_rect.num];
            if (typeof sp.getArrContentDrawingObjects === "function") {
                var arr_inline_objects = sp.getArrContentDrawingObjects();
                for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                    var cur_inline_object = arr_inline_objects[inline_index];
                    var _hit = cur_inline_object.hit(x, y);
                    if (_hit) {
                        graphicObjects.drawingDocument.SetCursorType("move");
                        return true;
                    }
                }
            }
            sp.updateCursorType(e, x, y, pageIndex);
            return true;
        }
    }
    return false;
}
function handleInlineObjectsCursorType(inlineObjects, graphicObjects, e, x, y, pageIndex, handleState) {
    for (var _object_index = inlineObjects.length - 1; _object_index > -1; --_object_index) {
        var _current_graphic_object = inlineObjects[_object_index];
        if (!_current_graphic_object.isShapeChild()) {
            if (_current_graphic_object.GraphicObj instanceof WordShape || _current_graphic_object.GraphicObj instanceof WordImage) {
                if (handleInlineShapeImageCursorType(_current_graphic_object, graphicObjects, e, x, y, pageIndex, handleState)) {
                    return true;
                }
            } else {
                if (_current_graphic_object.GraphicObj instanceof WordGroupShapes) {
                    if (handleInlineGroupCursorType(_current_graphic_object, graphicObjects, e, x, y, pageIndex, handleState)) {
                        return true;
                    }
                } else {
                    if (typeof CChartAsGroup != "undefined" && _current_graphic_object.GraphicObj instanceof CChartAsGroup) {
                        if (handleChartCursorType(_current_graphic_object, graphicObjects, x, y, e, pageIndex) === true) {
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}
function handleMouseDownNullState(graphicObjects, e, x, y, pageIndex, state) {
    graphicObjects.setStartTrackPos(x, y, pageIndex);
    var _graphic_pages = graphicObjects.graphicPages;
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    if (handleSelectedObjects(graphicObjects, e, x, y, pageIndex)) {
        return true;
    }
    var _cur_page = _graphic_pages[pageIndex];
    var beforeTextArray = _cur_page.beforeTextObjects;
    if (handleFloatObjects(beforeTextArray, graphicObjects, e, x, y, pageIndex, state)) {
        return true;
    }
    var inline_objects = _cur_page.inlineObjects;
    if (handleInlineObjects(inline_objects, graphicObjects, e, x, y, pageIndex, state)) {
        return true;
    }
    var wrapping_array = _cur_page.wrappingObjects;
    if (handleFloatObjects(wrapping_array, graphicObjects, e, x, y, pageIndex, state)) {
        return true;
    }
    var behind_array = _cur_page.behindDocObjects;
    if (handleFloatObjects(behind_array, graphicObjects, e, x, y, pageIndex, state)) {
        return true;
    }
    for (var _sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
        _common_selection_array[_sel_index].deselect();
    }
    _common_selection_array.length = 0;
    graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    graphicObjects.updateSelectionState();
    return false;
}
function handleMouseDownNullStateCursorType(graphicObjects, e, x, y, pageIndex, bTextFlag, state) {
    var _graphic_pages = graphicObjects.graphicPages;
    var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
    if (handleSelectedObjectsCursorType(graphicObjects, e, x, y, pageIndex)) {
        return true;
    }
    var _cur_page = _graphic_pages[pageIndex];
    var beforeTextArray = _cur_page.beforeTextObjects;
    if (handleFloatObjectsCursorType(beforeTextArray, graphicObjects, e, x, y, pageIndex, state)) {
        return true;
    }
    var inline_objects = _cur_page.inlineObjects;
    if (handleInlineObjectsCursorType(inline_objects, graphicObjects, e, x, y, pageIndex, state)) {
        return true;
    }
    if (!bTextFlag) {
        var wrapping_array = _cur_page.wrappingObjects;
        if (handleFloatObjectsCursorType(wrapping_array, graphicObjects, e, x, y, pageIndex, state)) {
            return true;
        }
        var behind_array = _cur_page.behindDocObjects;
        if (handleFloatObjectsCursorType(behind_array, graphicObjects, e, x, y, pageIndex, state)) {
            return true;
        }
    }
    return false;
}
function handleShapeImageGroup(drawing, group, graphicObjects, e, x, y, pageIndex, state) {
    var hit = drawing.hit(x, y);
    var hit_path = drawing.hitToPath(x, y);
    var hit_text = drawing.hitToTextRect(x, y);
    var _group_selection_array = group.selectionInfo.selectionArray;
    if ((hit && !hit_text) || hit_path) {
        if (! (e.CtrlKey || e.ShiftKey)) {
            if (drawing.selected === false) {
                for (var _sel_index = 0; _sel_index < _group_selection_array.length; ++_sel_index) {
                    _group_selection_array[_sel_index].deselect();
                }
                _group_selection_array.length = 0;
                drawing.select(pageIndex);
                _group_selection_array.push(drawing);
                graphicObjects.arrPreTrackObjects.length = 0;
                graphicObjects.arrPreTrackObjects[0] = new MoveTrackInGroup(drawing);
                graphicObjects.changeCurrentState(new PreMoveInGroup(graphicObjects, group, false, false, x, y));
                graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
            } else {
                graphicObjects.arrPreTrackObjects.length = 0;
                for (_sel_index = 0; _sel_index < _group_selection_array.length; ++_sel_index) {
                    graphicObjects.arrPreTrackObjects.push(new MoveTrackInGroup(_group_selection_array[_sel_index]));
                }
                graphicObjects.changeCurrentState(new PreMoveInGroup(graphicObjects, group, false, true, x, y));
                if (typeof CChartAsGroup != "undefined" && drawing instanceof CChartAsGroup) {
                    var selected_title = drawing.getSelectedTitle();
                    if (selected_title) {
                        selected_title.deselect();
                    }
                    graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                }
            }
            return true;
        } else {
            if (drawing.selected === false) {
                drawing.select(pageIndex);
                _group_selection_array.push(drawing);
                _group_selection_array.sort(ComparisonByZIndexSimple);
            }
            graphicObjects.arrPreTrackObjects.length = 0;
            for (_sel_index = 0; _sel_index < _group_selection_array.length; ++_sel_index) {
                var _current_graphic_object = _group_selection_array[_sel_index];
                graphicObjects.arrPreTrackObjects.push(new MoveTrackInGroup(_current_graphic_object));
            }
            graphicObjects.changeCurrentState(new PreMoveInGroup(graphicObjects, group, false, true, x, y));
            graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
            return true;
        }
    } else {
        if (hit_text) {
            var arr_inline_objects = drawing.getArrContentDrawingObjects();
            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                var cur_inline_object = arr_inline_objects[inline_index];
                var _hit = cur_inline_object.hit(x, y);
                if (_hit) {
                    graphicObjects.majorGraphicObject = cur_inline_object;
                    for (var j = 0; j < _group_selection_array.length; ++j) {
                        _group_selection_array[j].deselect();
                    }
                    _group_selection_array.length = 0;
                    group.deselect();
                    graphicObjects.selectionInfo.selectionArray.length = 0;
                    graphicObjects.selectionInfo.selectionArray.push(cur_inline_object);
                    graphicObjects.changeCurrentState(new PreMoveInlineObject(graphicObjects, cur_inline_object.Get_Id(), false, false));
                    graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                    return true;
                }
            }
            for (var gr_sel_index = 0; gr_sel_index < _group_selection_array.length; ++gr_sel_index) {
                _group_selection_array[gr_sel_index].deselect();
            }
            _group_selection_array.length = 0;
            drawing.selectionSetStart(x, y, e);
            drawing.select(pageIndex);
            _group_selection_array.push(drawing);
            graphicObjects.changeCurrentState(new TextAddInGroup(graphicObjects, drawing, group));
            if (e.ClickCount <= 1) {
                graphicObjects.updateSelectionState();
            }
            return true;
        }
    }
    return false;
}
function handleShapeImageGroupCursorType(drawing, group, graphicObjects, e, x, y, pageIndex, state) {
    var hit = drawing.hit(x, y);
    var hit_path = drawing.hitToPath(x, y);
    var hit_text = drawing.hitToTextRect(x, y);
    if ((hit && !hit_text) || hit_path) {
        graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    } else {
        if (hit_text) {
            var arr_inline_objects = drawing.getArrContentDrawingObjects();
            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                var cur_inline_object = arr_inline_objects[inline_index];
                var _hit = cur_inline_object.hit(x, y);
                if (_hit) {
                    graphicObjects.drawingDocument.SetCursorType("move");
                    return true;
                }
            }
            drawing.updateCursorType(e, x, y, pageIndex);
            return true;
        }
    }
    return false;
}
function handleChartGroup(drawing, group, graphicObjects, e, x, y, pageIndex, state) {
    var chart = drawing;
    var titles = [];
    if (isRealObject(chart.chartTitle)) {
        titles.push(chart.chartTitle);
    }
    if (isRealObject(chart.hAxisTitle)) {
        titles.push(chart.hAxisTitle);
    }
    if (isRealObject(chart.vAxisTitle)) {
        titles.push(chart.vAxisTitle);
    }
    var group_selected_objects = group.selectionInfo.selectionArray;
    if (! (e.CtrlKey || e.ShiftKey)) {
        for (var i = 0; i < titles.length; ++i) {
            var cur_title = titles[i];
            var hit = cur_title.hit(x, y);
            var hit_in_text_rect = cur_title.hitInTextRect(x, y);
            if (chart.selected) {
                if (!cur_title.selected && hit && !hit_in_text_rect) {
                    for (var j = 0; j < group_selected_objects.length; ++j) {
                        group_selected_objects[j].deselect();
                    }
                    group_selected_objects.length = 0;
                    for (var j = 0; j < titles.length; ++j) {
                        if (titles[j]) {
                            titles[j].deselect();
                        }
                    }
                    chart.select(pageIndex);
                    group_selected_objects.push(chart);
                    cur_title.select(pageIndex);
                    graphicObjects.arrPreTrackObjects.push(new MoveTitleInChart(cur_title));
                    graphicObjects.changeCurrentState(new PreMoveChartTitleGroupState(graphicObjects, group.parent, cur_title, chart, x, y, pageIndex));
                    editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
                    editor.WordControl.OnUpdateOverlay();
                    return true;
                } else {
                    if (hit_in_text_rect) {
                        for (var j = 0; j < group_selected_objects.length; ++j) {
                            group_selected_objects[j].deselect();
                        }
                        group_selected_objects.length = 0;
                        for (var j = 0; j < titles.length; ++j) {
                            if (titles[j]) {
                                titles[j].deselect();
                            }
                        }
                        chart.select(pageIndex);
                        cur_title.select(pageIndex);
                        group.selectionInfo.selectionArray.push(chart);
                        graphicObjects.changeCurrentState(new TextAddInChartTitleGroup(graphicObjects, group.parent, chart, cur_title));
                        cur_title.selectionSetStart(e, x, y, pageIndex);
                        if (e.ClickCount < 2) {
                            graphicObjects.updateSelectionState();
                        }
                        editor.WordControl.OnUpdateOverlay();
                        return true;
                    } else {
                        if (hit) {
                            graphicObjects.arrPreTrackObjects.push(new MoveTitleInChart(cur_title));
                            graphicObjects.changeCurrentState(new PreMoveChartTitleGroupState(graphicObjects, group.parent, cur_title, chart, x, y, pageIndex));
                            editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
                            return true;
                        }
                    }
                }
            } else {
                if (hit && !hit_in_text_rect) {
                    for (var j = 0; j < group_selected_objects.length; ++j) {
                        group_selected_objects[j].deselect();
                    }
                    group_selected_objects.length = 0;
                    for (var j = 0; j < titles.length; ++j) {
                        if (titles[j]) {
                            titles[j].deselect();
                        }
                    }
                    chart.select(pageIndex);
                    cur_title.select(pageIndex);
                    group.selectionInfo.selectionArray.push(chart);
                    graphicObjects.arrPreTrackObjects.push(new MoveTitleInChart(cur_title));
                    graphicObjects.changeCurrentState(new PreMoveChartTitleGroupState(graphicObjects, group.parent, cur_title, chart, x, y, pageIndex));
                    editor.WordControl.m_oLogicDocument.Document_UpdateSelectionState();
                    editor.WordControl.OnUpdateOverlay();
                    return true;
                } else {
                    if (hit_in_text_rect) {
                        for (var j = 0; j < group_selected_objects.length; ++j) {
                            group_selected_objects[j].deselect();
                        }
                        group_selected_objects.length = 0;
                        for (var j = 0; j < titles.length; ++j) {
                            if (titles[j]) {
                                titles[j].deselect();
                            }
                        }
                        chart.select(pageIndex);
                        cur_title.select(pageIndex);
                        group.selectionInfo.selectionArray.push(chart);
                        graphicObjects.changeCurrentState(new TextAddInChartTitleGroup(graphicObjects, group.parent, chart, cur_title));
                        cur_title.selectionSetStart(e, x, y, pageIndex);
                        graphicObjects.updateSelectionState();
                        editor.WordControl.OnUpdateOverlay();
                        return true;
                    }
                }
            }
        }
    }
    return handleShapeImageGroup(drawing, group, graphicObjects, e, x, y, pageIndex, state);
}
function handleChartGroupCursorType(drawing, group, graphicObjects, e, x, y, pageIndex, state) {
    var chart = drawing;
    var titles = [];
    if (isRealObject(chart.chartTitle)) {
        titles.push(chart.chartTitle);
    }
    if (isRealObject(chart.hAxisTitle)) {
        titles.push(chart.hAxisTitle);
    }
    if (isRealObject(chart.vAxisTitle)) {
        titles.push(chart.vAxisTitle);
    }
    var group_selected_objects = group.selectionInfo.selectionArray;
    if (! (e.CtrlKey || e.ShiftKey)) {
        for (var i = 0; i < titles.length; ++i) {
            var cur_title = titles[i];
            var hit = cur_title.hit(x, y);
            var hit_in_text_rect = cur_title.hitInTextRect(x, y);
            if (chart.selected) {
                if (!cur_title.selected && hit && !hit_in_text_rect) {
                    graphicObjects.drawingDocument.SetCursorType("move");
                    return true;
                } else {
                    if (hit_in_text_rect) {
                        cur_title.updateCursorType(e, x, y, pageIndex);
                        return true;
                    } else {
                        if (hit) {
                            graphicObjects.drawingDocument.SetCursorType("move");
                            return true;
                        }
                    }
                }
            } else {
                if (hit && !hit_in_text_rect) {
                    graphicObjects.drawingDocument.SetCursorType("move");
                    return true;
                } else {
                    if (hit_in_text_rect) {
                        cur_title.updateCursorType(e, x, y, pageIndex);
                        return true;
                    }
                }
            }
        }
    }
    return handleShapeImageGroupCursorType(drawing, group, graphicObjects, e, x, y, pageIndex, state);
}
function handleCurrentGroup(drawing, graphicObjects, e, x, y, pageIndex, state) {
    var group = drawing.GraphicObj;
    var sp_tree = group.getSpTree2();
    for (var j = sp_tree.length - 1; j > -1; --j) {
        var cur_sp = sp_tree[j];
        if (cur_sp instanceof WordShape || cur_sp instanceof WordImage) {
            if (handleShapeImageGroup(cur_sp, group, graphicObjects, e, x, y, pageIndex, state)) {
                return true;
            }
        } else {
            if (typeof CChartAsGroup != "undefined" && cur_sp instanceof CChartAsGroup) {
                if (handleChartGroup(cur_sp, group, graphicObjects, e, x, y, pageIndex, state)) {
                    return true;
                }
            }
        }
    }
    if (group.hitInBox(x, y)) {
        for (var r = 0; r < group.selectionInfo.selectionArray.length; ++r) {
            group.selectionInfo.selectionArray[r].deselect();
        }
        group.selectionInfo.selectionArray.length = 0;
        graphicObjects.arrPreTrackObjects.length = 0;
        graphicObjects.arrPreTrackObjects[0] = new CTrackMoveObject(group.parent, group.parent.absOffsetX - x, group.parent.absOffsetY - y, graphicObjects, pageIndex);
        graphicObjects.changeCurrentState(new PreMoveState(graphicObjects, false, false));
        graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        return true;
    }
    return false;
}
function handleCurrentGroupCursorType(drawing, graphicObjects, e, x, y, pageIndex, state) {
    var group = drawing.GraphicObj;
    var sp_tree = group.getSpTree2();
    for (var j = sp_tree.length - 1; j > -1; --j) {
        var cur_sp = sp_tree[j];
        if (cur_sp instanceof WordShape || cur_sp instanceof WordImage) {
            if (handleShapeImageGroupCursorType(cur_sp, group, graphicObjects, e, x, y, pageIndex, state)) {
                return true;
            }
        } else {
            if (typeof CChartAsGroup != "undefined" && cur_sp instanceof CChartAsGroup) {
                if (handleChartGroupCursorType(cur_sp, group, graphicObjects, e, x, y, pageIndex, state)) {
                    return true;
                }
            }
        }
    }
    if (group.hitInBox(x, y)) {
        graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    }
    return false;
}
function handleFloatObjectsGroupState(drawingArray, graphicObjects, e, x, y, pageIndex, state) {
    var group = state.group;
    for (var i = drawingArray.length - 1; i > -1; --i) {
        var _cur_object = drawingArray[i];
        if (_cur_object !== group.parent) {
            if (_cur_object.GraphicObj instanceof WordShape || _cur_object instanceof WordImage) {
                if (handleFloatShapeImage(_cur_object, graphicObjects, e, x, y, pageIndex, state)) {
                    return true;
                }
            } else {
                if (typeof CChartAsGroup != "undefined" && _cur_object.GraphicObj instanceof CChartAsGroup) {
                    if (handleChart(_cur_object, graphicObjects, x, y, e, pageIndex)) {
                        return true;
                    }
                } else {
                    if (_cur_object.GraphicObj instanceof WordGroupShapes) {
                        if (handleFloatGroup(_cur_object, graphicObjects, e, x, y, pageIndex, state)) {
                            return true;
                        }
                    }
                }
            }
        } else {
            if (handleCurrentGroup(_cur_object, graphicObjects, e, x, y, pageIndex, state)) {
                return true;
            }
        }
    }
    return false;
}
function handleFloatObjectsGroupStateCursorType(drawingArray, graphicObjects, e, x, y, pageIndex, state) {
    var group = state.group;
    for (var i = drawingArray.length - 1; i > -1; --i) {
        var _cur_object = drawingArray[i];
        if (_cur_object !== group.parent) {
            if (_cur_object.GraphicObj instanceof WordShape || _cur_object instanceof WordImage) {
                if (handleFloatShapeImageCursorType(_cur_object, graphicObjects, e, x, y, pageIndex, state)) {
                    return true;
                }
            } else {
                if (typeof CChartAsGroup != "undefined" && _cur_object.GraphicObj instanceof CChartAsGroup) {
                    if (handleChartCursorType(_cur_object, graphicObjects, x, y, e, pageIndex)) {
                        return true;
                    }
                } else {
                    if (_cur_object.GraphicObj instanceof WordGroupShapes) {
                        if (handleFloatGroupCursorType(_cur_object, graphicObjects, e, x, y, pageIndex, state)) {
                            return true;
                        }
                    }
                }
            }
        } else {
            if (handleCurrentGroupCursorType(_cur_object, graphicObjects, e, x, y, pageIndex, state)) {
                return true;
            }
        }
    }
    return false;
}
function handleInlineObjectsGroupState(drawingArray, graphicObjects, e, x, y, pageIndex, state) {
    for (var i = drawingArray.length - 1; i > -1; --i) {
        var _current_graphic_object = drawingArray[i];
        if (_current_graphic_object !== state.groupWordGO && !_current_graphic_object.isShapeChild()) {
            if (_current_graphic_object.GraphicObj instanceof WordShape || _current_graphic_object.GraphicObj instanceof WordImage) {
                if (handleInlineShapeImage(_current_graphic_object, graphicObjects, e, x, y, pageIndex, state)) {
                    return true;
                }
            } else {
                if (typeof CChartAsGroup != "undefined" && _current_graphic_object.GraphicObj instanceof CChartAsGroup) {
                    if (handleChart(_current_graphic_object, graphicObjects, x, y, e, pageIndex)) {
                        return true;
                    }
                } else {
                    if (_current_graphic_object instanceof WordGroupShapes) {
                        if (handleInlineGroup(_current_graphic_object, graphicObjects, e, x, y, pageIndex, state)) {
                            return true;
                        }
                    }
                }
            }
        } else {
            if (handleCurrentGroup(_current_graphic_object, graphicObjects, e, x, y, pageIndex, state)) {
                return true;
            }
        }
    }
    return false;
}
function handleInlineObjectsGroupStateCursorType(drawingArray, graphicObjects, e, x, y, pageIndex, state) {
    for (var i = drawingArray.length - 1; i > -1; --i) {
        var _current_graphic_object = drawingArray[i];
        if (_current_graphic_object !== state.groupWordGO && !_current_graphic_object.isShapeChild()) {
            if (_current_graphic_object.GraphicObj instanceof WordShape || _current_graphic_object.GraphicObj instanceof WordImage) {
                if (handleInlineShapeImageCursorType(_current_graphic_object, graphicObjects, e, x, y, pageIndex, state)) {
                    return true;
                }
            } else {
                if (typeof CChartAsGroup != "undefined" && _current_graphic_object.GraphicObj instanceof CChartAsGroup) {
                    if (handleChartCursorType(_current_graphic_object, graphicObjects, x, y, e, pageIndex)) {
                        return true;
                    }
                } else {
                    if (_current_graphic_object instanceof WordGroupShapes) {
                        if (handleInlineGroupCursorType(_current_graphic_object, graphicObjects, e, x, y, pageIndex, state)) {
                            return true;
                        }
                    }
                }
            }
        } else {
            if (handleCurrentGroupCursorType(_current_graphic_object, graphicObjects, e, x, y, pageIndex, state)) {
                return true;
            }
        }
    }
    return false;
}
function handleGroupState(graphicObjects, group, e, x, y, pageIndex, state) {
    var before_arr, inline_arr, wrap_arr, behind_arr;
    if (graphicObjects.document.CurPos.Type !== docpostype_HdrFtr) {
        before_arr = graphicObjects.graphicPages[pageIndex].beforeTextObjects;
        inline_arr = graphicObjects.graphicPages[pageIndex].inlineObjects;
        wrap_arr = graphicObjects.graphicPages[pageIndex].wrappingObjects;
        behind_arr = graphicObjects.graphicPages[pageIndex].behindDocObjects;
    } else {
        var hdr_ftr;
        if (pageIndex === 0) {
            hdr_ftr = graphicObjects.firstPage;
        } else {
            if (pageIndex % 2 === 1) {
                hdr_ftr = graphicObjects.evenPage;
            } else {
                hdr_ftr = graphicObjects.oddPage;
            }
        }
        if (isRealObject(hdr_ftr)) {
            before_arr = hdr_ftr.beforeTextArray;
            inline_arr = hdr_ftr.inlineArray;
            wrap_arr = hdr_ftr.wrappingArray;
            behind_arr = hdr_ftr.behindDocArray;
        }
    }
    if (handleSelectedObjectsGroup(graphicObjects, group, e, x, y, pageIndex, state)) {
        return;
    }
    if (handleFloatObjectsGroupState(before_arr, graphicObjects, e, x, y, pageIndex, state)) {
        return;
    }
    if (handleInlineObjectsGroupState(inline_arr, graphicObjects, e, x, y, pageIndex, state)) {
        return;
    }
    if (handleFloatObjectsGroupState(wrap_arr, graphicObjects, e, x, y, pageIndex, state)) {
        return;
    }
    if (handleFloatObjectsGroupState(behind_arr, graphicObjects, e, x, y, pageIndex, state)) {
        return;
    }
    var gr_sel_arr = group.selectionInfo.selectionArray;
    for (var i = 0; i < gr_sel_arr.length; ++i) {
        gr_sel_arr[i].deselect();
    }
    gr_sel_arr.length = 0;
    group.parent.deselect();
    graphicObjects.selectionInfo.selectionArray.length = 0;
    graphicObjects.changeCurrentState(new NullState(graphicObjects));
    graphicObjects.curState.updateAnchorPos();
}
function handleGroupStateCursorType(graphicObjects, group, e, x, y, pageIndex, state, textFlag) {
    var before_arr, inline_arr, wrap_arr, behind_arr;
    if (graphicObjects.document.CurPos.Type !== docpostype_HdrFtr) {
        before_arr = graphicObjects.graphicPages[pageIndex].beforeTextObjects;
        inline_arr = graphicObjects.graphicPages[pageIndex].inlineObjects;
        wrap_arr = graphicObjects.graphicPages[pageIndex].wrappingObjects;
        behind_arr = graphicObjects.graphicPages[pageIndex].behindDocObjects;
    } else {
        var hdr_ftr;
        if (pageIndex === 0) {
            hdr_ftr = graphicObjects.firstPage;
        } else {
            if (pageIndex % 2 === 1) {
                hdr_ftr = graphicObjects.evenPage;
            } else {
                hdr_ftr = graphicObjects.oddPage;
            }
        }
        if (isRealObject(hdr_ftr)) {
            before_arr = hdr_ftr.beforeTextArray;
            inline_arr = hdr_ftr.inlineArray;
            wrap_arr = hdr_ftr.wrappingArray;
            behind_arr = hdr_ftr.behindDocArray;
        }
    }
    if (handleSelectedObjectsGroupCursorType(graphicObjects, group, e, x, y, pageIndex, state)) {
        return true;
    }
    if (handleFloatObjectsGroupStateCursorType(before_arr, graphicObjects, e, x, y, pageIndex, state)) {
        return true;
    }
    if (handleInlineObjectsGroupStateCursorType(inline_arr, graphicObjects, e, x, y, pageIndex, state)) {
        return true;
    }
    if (!textFlag) {
        if (handleFloatObjectsGroupStateCursorType(wrap_arr, graphicObjects, e, x, y, pageIndex, state)) {
            return true;
        }
        if (handleFloatObjectsGroupStateCursorType(behind_arr, graphicObjects, e, x, y, pageIndex, state)) {
            return true;
        }
    }
    return false;
}
function NullState(graphicObjects) {
    this.id = STATES_ID_NULL;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        if (this.graphicObjects.document.CurPos.Type === docpostype_HdrFtr) {
            this.graphicObjects.changeCurrentState(new NullStateHeaderFooter(this.graphicObjects));
            this.graphicObjects.curState.OnMouseDown(e, x, y, pageIndex);
            return;
        }
        handleMouseDownNullState(this.graphicObjects, e, x, y, pageIndex, this);
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        if (this.graphicObjects.document.CurPos.Type === docpostype_HdrFtr) {
            var hdr_ftr_state = new NullStateHeaderFooter(this.graphicObjects);
            return hdr_ftr_state.updateCursorType(pageIndex, x, y, e, bTextFlag);
        }
        return handleMouseDownNullStateCursorType(this.graphicObjects, e, x, y, pageIndex, bTextFlag, this);
    };
    this.updateAnchorPos = function () {
        if (isRealObject(this.graphicObjects.selectionInfo) && isRealObject(this.graphicObjects.selectionInfo.selectionArray)) {
            var selection_array = this.graphicObjects.selectionInfo.selectionArray;
            if (selection_array.length === 1 && !selection_array[0].Is_Inline()) {
                this.anchorPos = selection_array[0].Get_AnchorPos();
                this.anchorPos.Page = selection_array[0].getPageIndex();
            } else {
                delete this.anchorPos;
            }
        }
    };
}
function NullStateHeaderFooter(graphicObjects) {
    this.id = STATES_ID_NULL_HF;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        var bFirst = (0 === pageIndex ? true : false);
        var bEven = (pageIndex % 2 === 1 ? true : false);
        var graphicObjects = this.graphicObjects;
        var hdr_footer_objects;
        if (bFirst) {
            hdr_footer_objects = this.graphicObjects.firstPage;
        } else {
            if (bEven) {
                hdr_footer_objects = this.graphicObjects.evenPage;
            } else {
                hdr_footer_objects = this.graphicObjects.oddPage;
            }
        }
        graphicObjects.setStartTrackPos(x, y, pageIndex);
        var _graphic_pages = graphicObjects.graphicPages;
        var _common_selection_array = graphicObjects.selectionInfo.selectionArray;
        var state = this;
        if (handleSelectedObjects(graphicObjects, e, x, y, pageIndex)) {
            return true;
        }
        var _cur_page = _graphic_pages[pageIndex];
        var beforeTextArray = hdr_footer_objects.beforeTextArray;
        if (handleFloatObjects(beforeTextArray, graphicObjects, e, x, y, pageIndex, state)) {
            return true;
        }
        var inline_objects = hdr_footer_objects.inlineArray;
        if (handleInlineObjects(inline_objects, graphicObjects, e, x, y, pageIndex, state)) {
            return true;
        }
        var wrapping_array = hdr_footer_objects.wrappingArray;
        if (handleFloatObjects(wrapping_array, graphicObjects, e, x, y, pageIndex, state)) {
            return true;
        }
        var behind_array = hdr_footer_objects.behindDocArray;
        if (handleFloatObjects(behind_array, graphicObjects, e, x, y, pageIndex, state)) {
            return true;
        }
        for (var _sel_index = 0; _sel_index < _common_selection_array.length; ++_sel_index) {
            _common_selection_array[_sel_index].deselect();
        }
        _common_selection_array.length = 0;
        graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        graphicObjects.updateSelectionState();
        return false;
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        var _graphic_pages = this.graphicObjects.graphicPages;
        var _common_selection_array = this.graphicObjects.selectionInfo.selectionArray;
        if (_common_selection_array.length > 0) {
            if (_common_selection_array.length === 1) {
                var _selected_gr_object = _common_selection_array[0];
                var _translated_x;
                var _translated_y;
                if (isRealObject(_selected_gr_object) && isRealObject(_selected_gr_object.GraphicObj) && _selected_gr_object.GraphicObj.selectStartPage !== pageIndex) {
                    var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, _selected_gr_object.GraphicObj.selectStartPage);
                    _translated_x = _translated_point.X;
                    _translated_y = _translated_point.Y;
                } else {
                    _translated_x = x;
                    _translated_y = y;
                }
                var _hit_to_adj = _selected_gr_object.hitToAdj(_translated_x, _translated_y);
                if (_hit_to_adj.hit === true) {
                    this.graphicObjects.drawingDocument.SetCursorType("crosshair");
                    return true;
                }
            }
            for (var _index = _common_selection_array.length - 1; _index > -1; --_index) {
                var _cur_selected_gr_object = _common_selection_array[_index];
                if (isRealObject(_cur_selected_gr_object) && isRealObject(_cur_selected_gr_object.GraphicObj) && _cur_selected_gr_object.GraphicObj.selectStartPage !== pageIndex) {
                    _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, _cur_selected_gr_object.GraphicObj.selectStartPage);
                    _translated_x = _translated_point.X;
                    _translated_y = _translated_point.Y;
                } else {
                    _translated_x = x;
                    _translated_y = y;
                }
                var _hit_to_handle = _cur_selected_gr_object.hitToHandle(_translated_x, _translated_y);
                if (_hit_to_handle.hit === true) {
                    this.graphicObjects.majorGraphicObject = _cur_selected_gr_object;
                    this.graphicObjects.arrPreTrackObjects.length = 0;
                    if (_hit_to_handle.handleRotate === false) {
                        this.graphicObjects.drawingDocument.SetCursorType(_cur_selected_gr_object.getCursorTypeByNum(_hit_to_handle.handleNum));
                    } else {
                        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
                    }
                    return true;
                }
            }
        }
        var hdr_footer_objects;
        var bFirst = (0 === pageIndex ? true : false);
        var bEven = (pageIndex % 2 === 1 ? true : false);
        if (bFirst) {
            hdr_footer_objects = this.graphicObjects.firstPage;
        } else {
            if (bEven) {
                hdr_footer_objects = this.graphicObjects.evenPage;
            } else {
                hdr_footer_objects = this.graphicObjects.oddPage;
            }
        }
        if (!isRealObject(hdr_footer_objects)) {
            return false;
        }
        var beforeTextArray = hdr_footer_objects.beforeTextArray;
        for (var _object_index = beforeTextArray.length - 1; _object_index > -1; --_object_index) {
            var _current_graphic_object = beforeTextArray[_object_index];
            var _hit = _current_graphic_object.hit(x, y);
            var _hit_to_path = _current_graphic_object.hitToPath(x, y);
            var _hit_to_text_rect = _current_graphic_object.hitToTextRect(x, y);
            var b_hit_to_text = _current_graphic_object.isGroup() ? _hit_to_text_rect.hit : _hit_to_text_rect;
            if ((_hit && !b_hit_to_text) || _hit_to_path) {
                this.graphicObjects.majorGraphicObject = _current_graphic_object;
                if (! (e.CtrlKey || e.ShiftKey)) {
                    this.graphicObjects.drawingDocument.SetCursorType("move");
                } else {
                    if ((_common_selection_array.length > 0 && _common_selection_array[0].Is_Inline())) {
                        this.graphicObjects.drawingDocument.SetCursorType("default");
                    } else {
                        this.graphicObjects.drawingDocument.SetCursorType("move");
                    }
                }
                return true;
            } else {
                if (b_hit_to_text) {
                    if (!_current_graphic_object.isGroup()) {
                        var arr_inline_objects = _current_graphic_object.getArrContentDrawingObjects();
                        for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                            var cur_inline_object = arr_inline_objects[inline_index];
                            _hit = cur_inline_object.hit(x, y);
                            if (_hit) {
                                this.graphicObjects.majorGraphicObject = cur_inline_object;
                                if (! (e.CtrlKey || e.ShiftKey)) {
                                    this.graphicObjects.drawingDocument.SetCursorType("move");
                                } else {
                                    if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                        this.graphicObjects.drawingDocument.SetCursorType("move");
                                    }
                                }
                                return true;
                            }
                        }
                        var tmp2 = global_MatrixTransformer.Invert(_current_graphic_object.GraphicObj.transformText);
                        var Xt = tmp2.TransformPointX(x, y);
                        var Yt = tmp2.TransformPointY(x, y);
                        _current_graphic_object.GraphicObj.textBoxContent.Update_CursorType(Xt, Yt, pageIndex);
                    } else {
                        var obj = _current_graphic_object.GraphicObj.spTree[_hit_to_text_rect.num];
                        if (typeof obj.getArrContentDrawingObjects === "function") {
                            arr_inline_objects = obj.getArrContentDrawingObjects();
                            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                                var cur_inline_object = arr_inline_objects[inline_index];
                                _hit = cur_inline_object.hit(x, y);
                                if (_hit) {
                                    this.graphicObjects.majorGraphicObject = cur_inline_object;
                                    if (! (e.CtrlKey || e.ShiftKey)) {
                                        this.graphicObjects.drawingDocument.SetCursorType("move");
                                    } else {
                                        if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                            this.graphicObjects.drawingDocument.SetCursorType("move");
                                        }
                                    }
                                    return true;
                                }
                            }
                        }
                        tmp2 = global_MatrixTransformer.Invert(obj.transformText);
                        Xt = tmp2.TransformPointX(x, y);
                        Yt = tmp2.TransformPointY(x, y);
                        obj.textBoxContent.Update_CursorType(Xt, Yt, pageIndex);
                    }
                    return true;
                }
            }
        }
        var inline_objects = hdr_footer_objects.inlineArray;
        for (_object_index = inline_objects.length - 1; _object_index > -1; --_object_index) {
            _current_graphic_object = inline_objects[_object_index];
            if (!_current_graphic_object.isShapeChild()) {
                _hit = _current_graphic_object.hit(x, y);
                _hit_to_path = _current_graphic_object.hitToPath(x, y);
                _hit_to_text_rect = _current_graphic_object.hitToTextRect(x, y);
                b_hit_to_text = _current_graphic_object.isGroup() ? _hit_to_text_rect.hit : _hit_to_text_rect;
                if ((_hit && !b_hit_to_text) || _hit_to_path) {
                    this.graphicObjects.majorGraphicObject = _current_graphic_object;
                    if (! (e.CtrlKey || e.ShiftKey)) {
                        this.graphicObjects.drawingDocument.SetCursorType("move");
                    } else {
                        if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === _current_graphic_object) {
                            this.graphicObjects.drawingDocument.SetCursorType("move");
                        } else {
                            this.graphicObjects.drawingDocument.SetCursorType("default");
                        }
                    }
                    return true;
                } else {
                    if (b_hit_to_text) {
                        if (!_current_graphic_object.isGroup()) {
                            var arr_inline_objects = _current_graphic_object.getArrContentDrawingObjects();
                            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                                var cur_inline_object = arr_inline_objects[inline_index];
                                _hit = cur_inline_object.hit(x, y);
                                if (_hit) {
                                    this.graphicObjects.majorGraphicObject = cur_inline_object;
                                    if (! (e.CtrlKey || e.ShiftKey)) {
                                        this.graphicObjects.drawingDocument.SetCursorType("move");
                                    } else {
                                        if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                            this.graphicObjects.drawingDocument.SetCursorType("move");
                                        }
                                    }
                                    return true;
                                }
                            }
                            var tmp2 = global_MatrixTransformer.Invert(_current_graphic_object.GraphicObj.transformText);
                            var Xt = tmp2.TransformPointX(x, y);
                            var Yt = tmp2.TransformPointY(x, y);
                            _current_graphic_object.GraphicObj.textBoxContent.Update_CursorType(Xt, Yt, pageIndex);
                        } else {
                            var obj = _current_graphic_object.GraphicObj.spTree[_hit_to_text_rect.num];
                            if (typeof obj.getArrContentDrawingObjects === "function") {
                                arr_inline_objects = obj.getArrContentDrawingObjects();
                                for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                                    var cur_inline_object = arr_inline_objects[inline_index];
                                    _hit = cur_inline_object.hit(x, y);
                                    if (_hit) {
                                        this.graphicObjects.majorGraphicObject = cur_inline_object;
                                        if (! (e.CtrlKey || e.ShiftKey)) {
                                            this.graphicObjects.drawingDocument.SetCursorType("move");
                                        } else {
                                            if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                                this.graphicObjects.drawingDocument.SetCursorType("move");
                                            }
                                        }
                                        return true;
                                    }
                                }
                            }
                            tmp2 = global_MatrixTransformer.Invert(obj.transformText);
                            Xt = tmp2.TransformPointX(x, y);
                            Yt = tmp2.TransformPointY(x, y);
                            obj.textBoxContent.Update_CursorType(Xt, Yt, pageIndex);
                        }
                        return true;
                    }
                }
            }
        }
        if (!bTextFlag) {
            var wrapping_array = hdr_footer_objects.wrappingArray;
            for (var _object_index = wrapping_array.length - 1; _object_index > -1; --_object_index) {
                var _current_graphic_object = wrapping_array[_object_index];
                var _hit = _current_graphic_object.hit(x, y);
                var _hit_to_path = _current_graphic_object.hitToPath(x, y);
                var _hit_to_text_rect = _current_graphic_object.hitToTextRect(x, y);
                var b_hit_to_text = _current_graphic_object.isGroup() ? _hit_to_text_rect.hit : _hit_to_text_rect;
                if ((_hit && !b_hit_to_text) || _hit_to_path) {
                    this.graphicObjects.majorGraphicObject = _current_graphic_object;
                    if (! (e.CtrlKey || e.ShiftKey)) {
                        this.graphicObjects.drawingDocument.SetCursorType("move");
                    } else {
                        if ((_common_selection_array.length > 0 && _common_selection_array[0].Is_Inline())) {
                            this.graphicObjects.drawingDocument.SetCursorType("default");
                        } else {
                            this.graphicObjects.drawingDocument.SetCursorType("move");
                        }
                    }
                    return true;
                } else {
                    if (b_hit_to_text) {
                        if (!_current_graphic_object.isGroup()) {
                            var arr_inline_objects = _current_graphic_object.getArrContentDrawingObjects();
                            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                                var cur_inline_object = arr_inline_objects[inline_index];
                                _hit = cur_inline_object.hit(x, y);
                                if (_hit) {
                                    this.graphicObjects.majorGraphicObject = cur_inline_object;
                                    if (! (e.CtrlKey || e.ShiftKey)) {
                                        this.graphicObjects.drawingDocument.SetCursorType("move");
                                    } else {
                                        if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                            this.graphicObjects.drawingDocument.SetCursorType("move");
                                        }
                                    }
                                    return true;
                                }
                            }
                            var tmp2 = global_MatrixTransformer.Invert(_current_graphic_object.GraphicObj.transformText);
                            var Xt = tmp2.TransformPointX(x, y);
                            var Yt = tmp2.TransformPointY(x, y);
                            _current_graphic_object.GraphicObj.textBoxContent.Update_CursorType(Xt, Yt, pageIndex);
                        } else {
                            var obj = _current_graphic_object.GraphicObj.spTree[_hit_to_text_rect.num];
                            if (typeof obj.getArrContentDrawingObjects === "function") {
                                arr_inline_objects = obj.getArrContentDrawingObjects();
                                for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                                    var cur_inline_object = arr_inline_objects[inline_index];
                                    _hit = cur_inline_object.hit(x, y);
                                    if (_hit) {
                                        this.graphicObjects.majorGraphicObject = cur_inline_object;
                                        if (! (e.CtrlKey || e.ShiftKey)) {
                                            this.graphicObjects.drawingDocument.SetCursorType("move");
                                        } else {
                                            if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                                this.graphicObjects.drawingDocument.SetCursorType("move");
                                            }
                                        }
                                        return true;
                                    }
                                }
                            }
                            tmp2 = global_MatrixTransformer.Invert(obj.transformText);
                            Xt = tmp2.TransformPointX(x, y);
                            Yt = tmp2.TransformPointY(x, y);
                            obj.textBoxContent.Update_CursorType(Xt, Yt, pageIndex);
                        }
                        return true;
                    }
                }
            }
            var behind_array = hdr_footer_objects.behindDocArray;
            for (var _object_index = behind_array.length - 1; _object_index > -1; --_object_index) {
                var _current_graphic_object = behind_array[_object_index];
                var _hit = _current_graphic_object.hit(x, y);
                var _hit_to_path = _current_graphic_object.hitToPath(x, y);
                var _hit_to_text_rect = _current_graphic_object.hitToTextRect(x, y);
                var b_hit_to_text = _current_graphic_object.isGroup() ? _hit_to_text_rect.hit : _hit_to_text_rect;
                if ((_hit && !b_hit_to_text) || _hit_to_path) {
                    this.graphicObjects.majorGraphicObject = _current_graphic_object;
                    if (! (e.CtrlKey || e.ShiftKey)) {
                        this.graphicObjects.drawingDocument.SetCursorType("move");
                    } else {
                        if ((_common_selection_array.length > 0 && _common_selection_array[0].Is_Inline())) {
                            this.graphicObjects.drawingDocument.SetCursorType("default");
                        } else {
                            this.graphicObjects.drawingDocument.SetCursorType("move");
                        }
                    }
                    return true;
                } else {
                    if (b_hit_to_text) {
                        if (!_current_graphic_object.isGroup()) {
                            var arr_inline_objects = _current_graphic_object.getArrContentDrawingObjects();
                            for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                                var cur_inline_object = arr_inline_objects[inline_index];
                                _hit = cur_inline_object.hit(x, y);
                                if (_hit) {
                                    this.graphicObjects.majorGraphicObject = cur_inline_object;
                                    if (! (e.CtrlKey || e.ShiftKey)) {
                                        this.graphicObjects.drawingDocument.SetCursorType("move");
                                    } else {
                                        if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                            this.graphicObjects.drawingDocument.SetCursorType("move");
                                        }
                                    }
                                    return true;
                                }
                            }
                            var tmp2 = global_MatrixTransformer.Invert(_current_graphic_object.GraphicObj.transformText);
                            var Xt = tmp2.TransformPointX(x, y);
                            var Yt = tmp2.TransformPointY(x, y);
                            _current_graphic_object.GraphicObj.textBoxContent.Update_CursorType(Xt, Yt, pageIndex);
                        } else {
                            var obj = _current_graphic_object.GraphicObj.spTree[_hit_to_text_rect.num];
                            if (typeof obj.getArrContentDrawingObjects === "function") {
                                arr_inline_objects = obj.getArrContentDrawingObjects();
                                for (var inline_index = 0; inline_index < arr_inline_objects.length; ++inline_index) {
                                    var cur_inline_object = arr_inline_objects[inline_index];
                                    _hit = cur_inline_object.hit(x, y);
                                    if (_hit) {
                                        this.graphicObjects.majorGraphicObject = cur_inline_object;
                                        if (! (e.CtrlKey || e.ShiftKey)) {
                                            this.graphicObjects.drawingDocument.SetCursorType("move");
                                        } else {
                                            if (_common_selection_array.length === 0 || _common_selection_array.length === 1 && _common_selection_array[0] === cur_inline_object) {
                                                this.graphicObjects.drawingDocument.SetCursorType("move");
                                            }
                                        }
                                        return true;
                                    }
                                }
                            }
                            tmp2 = global_MatrixTransformer.Invert(obj.transformText);
                            Xt = tmp2.TransformPointX(x, y);
                            Yt = tmp2.TransformPointY(x, y);
                            obj.textBoxContent.Update_CursorType(Xt, Yt, pageIndex);
                        }
                        return true;
                    }
                }
            }
        }
        return false;
    };
}
function ChartState(graphicObjects, chart) {
    this.id = STATES_ID_CHART;
    this.graphicObjects = graphicObjects;
    this.chart = chart;
    this.headerFooterState = new NullStateHeaderFooter(this.graphicObjects);
    this.OnMouseDown = function (e, x, y, pageIndex) {
        if (this.graphicObjects.document.CurPos.Type === docpostype_HdrFtr) {
            this.headerFooterState.OnMouseDown(e, x, y, pageIndex);
        } else {
            handleMouseDownNullState(this.graphicObjects, e, x, y, pageIndex, this);
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        if (this.graphicObjects.document.CurPos.Type === docpostype_HdrFtr) {
            var hdr_ftr_state = new NullStateHeaderFooter(this.graphicObjects);
            return hdr_ftr_state.updateCursorType(pageIndex, x, y, e, bTextFlag);
        }
        return handleMouseDownNullStateCursorType(this.graphicObjects, e, x, y, pageIndex, bTextFlag, this);
    };
}
function TextAddInChartTitle(graphicObjects, chart, title) {
    this.id = STATES_ID_CHART_TITLE_TEXT;
    this.graphicObjects = graphicObjects;
    this.chart = chart;
    this.title = title;
    this.chartState = new ChartState(graphicObjects, chart);
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.chartState.OnMouseDown(e, x, y, pageIndex);
        if (this.graphicObjects.curState.id !== STATES_ID_CHART_TITLE_TEXT || this.graphicObjects.curState.title !== this.title) {
            this.chart.GraphicObj.recalculate();
            this.graphicObjects.updateCharts();
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (e.IsLocked) {
            this.title.selectionSetEnd(e, x, y, pageIndex);
            this.graphicObjects.updateSelectionState();
        }
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.title.selectionSetEnd(e, x, y, pageIndex);
        this.graphicObjects.updateSelectionState();
    };
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        return this.chartState.updateCursorType(pageIndex, x, y, e, bTextFlag);
    };
}
function TextAddInChartTitleGroup(graphicObjects, group, chart, title) {
    this.id = STATES_ID_CHART_TITLE_TEXT_GROUP;
    this.graphicObjects = graphicObjects;
    this.chart = chart;
    this.title = title;
    this.group = group;
    this.textObject = title;
    this.groupWordGO = group.GraphicObj;
    this.chartGroupState = new ChartGroupState(graphicObjects, group, chart);
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.chartGroupState.OnMouseDown(e, x, y, pageIndex);
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (e.IsLocked) {
            this.title.selectionSetEnd(e, x, y, pageIndex);
            this.title.updateSelectionState(editor.WordControl.m_oDrawingDocument);
        }
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.title.selectionSetEnd(e, x, y, pageIndex);
        this.title.updateSelectionState(editor.WordControl.m_oDrawingDocument);
    };
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        return this.chartGroupState.updateCursorType(pageIndex, x, y, e, bTextFlag);
    };
}
function ChartGroupState(graphicObjects, group, chart) {
    this.id = STATES_ID_CHART_GROUP;
    this.graphicObjects = graphicObjects;
    this.chart = chart;
    this.group = group;
    this.groupState = new GroupState(this.graphicObjects, this.group);
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.groupState.OnMouseDown(e, x, y, pageIndex);
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (e.IsLocked) {
            this.title.selectionSetEnd(e, x, y, pageIndex);
            this.graphicObjects.updateSelectionState();
        }
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.title.selectionSetEnd(e, x, y, pageIndex);
        this.graphicObjects.updateSelectionState();
    };
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        return this.groupState.updateCursorType(pageIndex, x, y, e, bTextFlag);
    };
}
function PreMoveChartTitleGroupState(graphicObjects, group, title, chart, startX, startY, startPageIndex) {
    this.id = STATES_ID_PRE_MOVE_CHART_TITLE_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.title = title;
    this.chart = chart;
    this.startX = startX;
    this.startY = startY;
    this.startPageIndex = startPageIndex;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (x === this.startX && y === this.startY && this.startPageIndex === pageIndex) {
            return;
        }
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new MoveChartTitleGroupState(this.graphicObjects, this.group, this.title, this.chart, this.startX, this.startY, this.startPageIndex));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {};
}
function MoveChartTitleGroupState(graphicObjects, group, title, chart, startX, startY, startPageIndex) {
    this.id = STATES_ID_MOVE_CHART_TITLE_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.title = title;
    this.chart = chart;
    this.startX = startX;
    this.startY = startY;
    this.startPageIndex = startPageIndex;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var tx, ty;
        if (pageIndex === this.startPageIndex) {
            tx = x;
            ty = y;
        } else {
            var tp = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.startPageIndex);
            tx = tp.X;
            ty = tp.Y;
        }
        var dx = tx - this.startX;
        var dy = ty - this.startY;
        this.graphicObjects.arrTrackObjects[0].track(dx, dy, pageIndex);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var doc = editor.WordControl.m_oLogicDocument;
        if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.group.Parent,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            this.graphicObjects.arrTrackObjects[0].trackEnd();
            this.graphicObjects.drawingDocument.OnRecalculatePage(this.startPageIndex, this.graphicObjects.document.Pages[this.startPageIndex]);
            this.graphicObjects.drawingDocument.OnEndRecalculate(false, false);
        }
        this.graphicObjects.arrTrackObjects = [];
        this.graphicObjects.changeCurrentState(new ChartGroupState(this.graphicObjects, this.group, this.chart));
        editor.WordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {};
}
function PreMoveChartTitleState(graphicObjects, title, chart, startX, startY, startPageIndex) {
    this.id = STATES_ID_PRE_MOVE_CHART_TITLE;
    this.graphicObjects = graphicObjects;
    this.title = title;
    this.chart = chart;
    this.startX = startX;
    this.startY = startY;
    this.startPageIndex = startPageIndex;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (x === this.startX && y === this.startY && this.startPageIndex === pageIndex) {
            return;
        }
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new MoveChartTitleState(this.graphicObjects, this.title, this.chart, this.startX, this.startY, this.startPageIndex));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new ChartState(this.graphicObjects, this.chart));
    };
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        return false;
    };
}
function MoveChartTitleState(graphicObjects, title, chart, startX, startY, startPageIndex) {
    this.id = STATES_ID_MOVE_CHART_TITLE;
    this.graphicObjects = graphicObjects;
    this.title = title;
    this.chart = chart;
    this.startX = startX;
    this.startY = startY;
    this.startPageIndex = startPageIndex;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var tx, ty;
        if (pageIndex === this.startPageIndex) {
            tx = x;
            ty = y;
        } else {
            var tp = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.startPageIndex);
            tx = tp.X;
            ty = tp.Y;
        }
        var dx = tx - this.startX;
        var dy = ty - this.startY;
        this.graphicObjects.arrTrackObjects[0].track(dx, dy, pageIndex);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var doc = editor.WordControl.m_oLogicDocument;
        if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.chart.Parent,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            this.graphicObjects.arrTrackObjects[0].trackEnd();
            this.graphicObjects.drawingDocument.OnRecalculatePage(this.startPageIndex, this.graphicObjects.document.Pages[this.startPageIndex]);
            this.graphicObjects.drawingDocument.OnEndRecalculate(false, false);
        }
        this.graphicObjects.arrTrackObjects = [];
        this.graphicObjects.changeCurrentState(new ChartState(this.graphicObjects, this.chart));
        editor.WordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        return false;
    };
}
function PreMoveInlineObject(graphicObjects, objectId, ctrlShiftFlag, bSelectedMajorObject) {
    this.id = STATES_ID_PRE_MOVE_INLINE_OBJECT;
    this.graphicObjects = graphicObjects;
    this.ctrlShiftFlag = ctrlShiftFlag;
    this.bSelectedMajorObjected = bSelectedMajorObject;
    this.objectId = objectId;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        var _track_objects = this.graphicObjects.arrTrackObjects;
        var _object_index = 0;
        var _object_count = _track_objects.length;
        for (; _object_index < _object_count; ++_object_index) {
            _track_objects[_object_index].init();
        }
        var object = this.graphicObjects.getObjectById(objectId);
        object.calculateOffset();
        this.graphicObjects.changeCurrentState(new MoveInlineObject(this.graphicObjects, this.objectId));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.arrTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        if (this.ctrlShiftFlag === false) {
            if (e.ClickCount > 1) {
                var gr_obj = this.graphicObjects.majorGraphicObject;
            }
        }
        if (this.ctrlShiftFlag === true) {
            if (this.bSelectedMajorObjected === true) {
                var _selection_array = this.graphicObjects.selectionInfo.selectionArray;
                for (var _sel_index = 0; _sel_index < _selection_array.length; ++_sel_index) {
                    if (_selection_array[_sel_index] === this.graphicObjects.majorGraphicObject) {
                        _selection_array.splice(_sel_index, 1);
                        this.graphicObjects.sortSelectionArray();
                        this.graphicObjects.majorGraphicObject.deselect();
                    }
                }
            }
        } else {
            if (this.bSelectedMajorObjected === true && this.graphicObjects.majorGraphicObject.isGroup() && e.Button !== 2) {
                this.graphicObjects.changeCurrentState(new GroupState(graphicObjects, this.graphicObjects.majorGraphicObject));
                this.graphicObjects.OnMouseDown(e, x, y, pageIndex);
                this.graphicObjects.OnMouseUp(e, x, y, pageIndex);
            }
        }
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    };
}
function MoveInlineObject(graphicObjects, objectId) {
    this.id = STATES_ID_MOVE_INLINE_OBJECT;
    this.graphicObjects = graphicObjects;
    this.objectId = objectId;
    this.object = this.graphicObjects.getObjectById(objectId);
    this.InlinePos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, this.graphicObjects.startTrackPos.x, this.graphicObjects.startTrackPos.y);
    this.InlinePos.Page = this.graphicObjects.startTrackPos.pageIndex;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.InlinePos = this.graphicObjects.document.Get_NearestPos(pageIndex, x, y, false, this.object);
        this.InlinePos.Page = pageIndex;
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var graphicObject = this.graphicObjects.getObjectById(this.objectId);
        if (graphicObject !== null) {
            if (!e.CtrlKey) {
                graphicObject.OnEnd_MoveInline(this.InlinePos);
            } else {
                var doc = this.graphicObjects.document;
                if (false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                    Type: changestype_2_Element_and_Type,
                    Element: this.InlinePos.Paragraph,
                    CheckType: changestype_Paragraph_Content
                }) && false === editor.isViewMode) {
                    History.Create_NewPoint();
                    var para_drawing = graphicObject.copy();
                    para_drawing.Add_ToDocument(this.InlinePos, true);
                }
            }
        }
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("default");
        return true;
    };
}
function StateAddArrows(graphicObjects, beginArrow, endArrow) {
    this.graphicObjects = graphicObjects;
    this.beginArrow = beginArrow;
    this.endArrow = endArrow;
    this.currentPreset = graphicObjects.currentPreset;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function StartAddNewShape(graphicObjects) {
    this.id = STATES_ID_START_ADD_NEW_SHAPE;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.graphicObjects.setStartTrackPos(x, y, pageIndex);
        this.graphicObjects.changeCurrentState(new StartTrackNewShape(this.graphicObjects));
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function StartAddNewArrow(graphicObjects, beginArrow, endArrow) {
    this.id = STATES_ID_START_ADD_NEW_SHAPE;
    this.graphicObjects = graphicObjects;
    this.beginArrow = beginArrow;
    this.endArrow = endArrow;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.graphicObjects.setStartTrackPos(x, y, pageIndex);
        this.graphicObjects.changeCurrentState(new StartTrackNewShape(this.graphicObjects, this.beginArrow, this.endArrow));
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function StartTrackNewShape(graphicObjects, beginArrow, endArrow) {
    this.id = STATES_ID_START_TRACK_NEW_SHAPE;
    this.graphicObjects = graphicObjects;
    this.beginArrow = beginArrow;
    this.endArrow = endArrow;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _translated_x;
        var _translated_y;
        if (pageIndex !== this.graphicObjects.startTrackPos.pageIndex) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        var pen = new CLn();
        pen.Fill = new CUniFill();
        pen.Fill.fill = new CSolidFill();
        pen.Fill.fill.color.color = new CSchemeColor();
        pen.Fill.calculate(this.graphicObjects.document.theme, this.graphicObjects.document.clrSchemeMap, {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        });
        if (this.beginArrow) {
            pen.headEnd = new EndArrow();
            pen.headEnd.type = LineEndType.Arrow;
            pen.headEnd.w = LineEndSize.Mid;
            pen.headEnd.len = LineEndSize.Mid;
        }
        if (this.endArrow) {
            pen.tailEnd = new EndArrow();
            pen.tailEnd.type = LineEndType.Arrow;
            pen.tailEnd.w = LineEndSize.Mid;
            pen.tailEnd.len = LineEndSize.Mid;
        }
        var brush = new CUniFill();
        brush.fill = new CSolidFill();
        brush.fill.color.color = new CSchemeColor();
        brush.calculate(this.graphicObjects.document.theme, this.graphicObjects.document.clrSchemeMap, {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        });
        var _track_new_shape_obj = new CTrackNewObject2(this.graphicObjects.currentPresetGeom, pen, brush, this.graphicObjects.startTrackPos.x, this.graphicObjects.startTrackPos.y, this.graphicObjects.startTrackPos.pageIndex);
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.arrTrackObjects.push(_track_new_shape_obj);
        _track_new_shape_obj.init(_translated_x, _translated_y);
        _track_new_shape_obj.modify(_translated_x, _translated_y, e.CtrlKey, e.ShiftKey);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        this.graphicObjects.changeCurrentState(new TrackNewShape(this.graphicObjects, this.beginArrow, this.endArrow));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var _start_track_pos = this.graphicObjects.startTrackPos;
        var _offset_x = _start_track_pos.x;
        var _offset_y = _start_track_pos.y;
        var _ext_x;
        var _ext_y;
        if (typeof SHAPE_ASPECTS[this.graphicObjects.currentPresetGeom] === "number") {
            var _aspect = SHAPE_ASPECTS[this.graphicObjects.currentPresetGeom];
            if (_aspect >= 1) {
                _ext_y = 25.4;
                _ext_x = _ext_y * _aspect;
            } else {
                _ext_x = 25.4;
                _ext_y = _ext_x / _aspect;
            }
        } else {
            _ext_x = 25.4;
            _ext_y = 25.4;
        }
        var Drawing = new ParaDrawing(_ext_x, _ext_y, null, this.graphicObjects.drawingDocument, this.graphicObjects.document, this.graphicObjects.document);
        Drawing.Set_DrawingType(drawing_Anchor);
        var shape = new WordShape(Drawing, this.graphicObjects.document, this.graphicObjects.drawingDocument, null);
        Drawing.Set_GraphicObject(shape);
        Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
        Drawing.Set_Distance(3.2, 0, 3.2, 0);
        shape.init(this.graphicObjects.currentPresetGeom, _offset_x, _offset_y, _ext_x, _ext_y, false, false, false, false);
        var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, x, y, true, Drawing);
        if (near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
            Type: changestype_2_Element_and_Type,
            Element: near_pos.Paragraph,
            CheckType: changestype_Paragraph_Content
        }) && false === editor.isViewMode) {
            History.Create_NewPoint();
            var Drawing = new ParaDrawing(_ext_x, _ext_y, null, this.graphicObjects.drawingDocument, this.graphicObjects.document, this.graphicObjects.document);
            Drawing.Set_DrawingType(drawing_Anchor);
            var shape = new WordShape(Drawing, this.graphicObjects.document, this.graphicObjects.drawingDocument, null);
            Drawing.Set_GraphicObject(shape);
            Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
            Drawing.Set_Distance(3.2, 0, 3.2, 0);
            shape.init(this.graphicObjects.currentPresetGeom, _offset_x, _offset_y, _ext_x, _ext_y, false, false, false, false);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            Drawing.Set_XYForAdd(_offset_x, _offset_y, near_pos, this.graphicObjects.startTrackPos.pageIndex);
            Drawing.Add_ToDocument(near_pos);
            this.graphicObjects.resetSelection();
            Drawing.select(pageIndex);
            this.graphicObjects.selectionInfo.selectionArray.push(Drawing);
        }
        editor.sync_StartAddShapeCallback(false);
        editor.sync_EndAddShape();
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        editor.asc_fireCallback("asc_canGroup", this.graphicObjects.canGroup());
        editor.asc_fireCallback("asc_canUnGroup", this.graphicObjects.canUnGroup());
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function TrackNewShape(graphicObjects, beginArrow, endArrow) {
    this.id = STATES_ID_TRACK_NEW_SHAPE;
    this.graphicObjects = graphicObjects;
    this.beginArrow = beginArrow;
    this.endArrow = endArrow;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _translated_x;
        var _translated_y;
        if (pageIndex !== this.graphicObjects.startTrackPos.pageIndex) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        this.graphicObjects.arrTrackObjects[0].modify(_translated_x, _translated_y, e.CtrlKey, e.ShiftKey);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var track_obj = this.graphicObjects.arrTrackObjects[0];
        var object_bounds = track_obj.getBounds();
        var Drawing = new ParaDrawing(track_obj.extX, track_obj.extY, null, this.graphicObjects.drawingDocument, this.graphicObjects.document, this.graphicObjects.document);
        Drawing.Set_DrawingType(drawing_Anchor);
        var shape = new WordShape(Drawing, this.graphicObjects.document, this.graphicObjects.drawingDocument, null);
        Drawing.Set_GraphicObject(shape);
        Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
        Drawing.Set_Distance(3.2, 0, 3.2, 0);
        shape.init(track_obj.presetGeom, track_obj.posX, track_obj.posY, track_obj.extX, track_obj.extY, track_obj.flipH, track_obj.flipV, this.beginArrow, this.endArrow);
        var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, object_bounds.l, object_bounds.t, true, Drawing);
        if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
            Type: changestype_2_Element_and_Type,
            Element: near_pos.Paragraph,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            var Drawing = new ParaDrawing(track_obj.extX, track_obj.extY, null, this.graphicObjects.drawingDocument, this.graphicObjects.document, this.graphicObjects.document);
            Drawing.Set_DrawingType(drawing_Anchor);
            var shape = new WordShape(Drawing, this.graphicObjects.document, this.graphicObjects.drawingDocument, null);
            Drawing.Set_GraphicObject(shape);
            Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
            Drawing.Set_Distance(3.2, 0, 3.2, 0);
            shape.init(track_obj.presetGeom, track_obj.posX, track_obj.posY, track_obj.extX, track_obj.extY, track_obj.flipH, track_obj.flipV, this.beginArrow, this.endArrow);
            this.graphicObjects.arrTrackObjects[0].endTrack();
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            Drawing.Set_XYForAdd(track_obj.posX, track_obj.posY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
            Drawing.Add_ToDocument(near_pos);
            this.graphicObjects.resetSelection();
            Drawing.select(this.graphicObjects.startTrackPos.pageIndex);
            this.graphicObjects.selectionInfo.selectionArray.push(Drawing);
        }
        editor.sync_StartAddShapeCallback(false);
        editor.sync_EndAddShape();
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        editor.asc_fireCallback("asc_canGroup", this.graphicObjects.canGroup());
        editor.asc_fireCallback("asc_canUnGroup", this.graphicObjects.canUnGroup());
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function StartAddTextRect(graphicObjects) {
    this.id = STATES_ID_START_ADD_TEXT_RECT;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.graphicObjects.setStartTrackPos(x, y, pageIndex);
        this.graphicObjects.changeCurrentState(new StartTrackTextRect(this.graphicObjects));
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function StartTrackTextRect(graphicObjects) {
    this.id = STATES_ID_START_TRACK_TEXT_RECT;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _translated_x;
        var _translated_y;
        if (pageIndex !== this.graphicObjects.startTrackPos.pageIndex) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        var pen = new CLn();
        pen.w = 6350;
        pen.Fill = new CUniFill();
        pen.Fill.fill = new CSolidFill();
        pen.Fill.fill.color.color = new CPrstColor();
        pen.Fill.fill.color.color.id = "black";
        pen.Fill.calculate(this.graphicObjects.document.theme, this.graphicObjects.document.clrSchemeMap, {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        });
        var brush = new CUniFill();
        brush.fill = new CSolidFill();
        brush.fill.color.color = new CSchemeColor();
        brush.fill.color.color.id = 12;
        brush.calculate(this.graphicObjects.document.theme, this.graphicObjects.document.clrSchemeMap, {
            R: 0,
            G: 0,
            B: 0,
            A: 255
        });
        var _track_new_shape_obj = new CTrackNewObject2("rect", pen, brush, this.graphicObjects.startTrackPos.x, this.graphicObjects.startTrackPos.y, this.graphicObjects.startTrackPos.pageIndex);
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.arrTrackObjects.push(_track_new_shape_obj);
        _track_new_shape_obj.init(_translated_x, _translated_y);
        _track_new_shape_obj.modify(_translated_x, _translated_y, e.CtrlKey, e.ShiftKey);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        this.graphicObjects.changeCurrentState(new TrackTextRect(this.graphicObjects));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function TrackTextRect(graphicObjects) {
    this.id = STATES_ID_TRACK_TEXT_RECT;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _translated_x;
        var _translated_y;
        if (pageIndex !== this.graphicObjects.startTrackPos.pageIndex) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        this.graphicObjects.arrTrackObjects[0].modify(_translated_x, _translated_y, e.CtrlKey, e.ShiftKey);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var track_obj = this.graphicObjects.arrTrackObjects[0];
        var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, track_obj.posX, track_obj.posY, true, null);
        if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
            Type: changestype_2_Element_and_Type,
            Element: near_pos.Paragraph,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            this.graphicObjects.arrTrackObjects[0].endTrack();
            track_obj = this.graphicObjects.arrTrackObjects[0];
            var Drawing = new ParaDrawing(track_obj.extX, track_obj.extY, null, this.graphicObjects.drawingDocument, this.graphicObjects.document, this.graphicObjects.document);
            Drawing.Set_DrawingType(drawing_Anchor);
            var shape = new WordShape(Drawing, this.graphicObjects.document, this.graphicObjects.drawingDocument, null);
            Drawing.Set_GraphicObject(shape);
            Drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
            Drawing.Set_Distance(3.2, 0, 3.2, 0);
            shape.init2(track_obj.presetGeom, track_obj.posX, track_obj.posY, track_obj.extX, track_obj.extY, track_obj.flipH, track_obj.flipV, false, false);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            Drawing.Set_XYForAdd(track_obj.posX, track_obj.posY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
            Drawing.Add_ToDocument(near_pos);
            this.graphicObjects.arrTrackObjects.length = 0;
            this.graphicObjects.resetSelection();
            Drawing.select(this.graphicObjects.startTrackPos.pageIndex);
            this.graphicObjects.selectionInfo.selectionArray.push(Drawing);
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            Drawing.selectionSetStart(0, 0, e);
            Drawing.selectionSetEnd(0, 0, e);
            this.graphicObjects.changeCurrentState(new TextAddState(this.graphicObjects, Drawing));
            this.graphicObjects.updateSelectionState();
            return;
        }
        editor.sync_StartAddShapeCallback(false);
        editor.sync_EndAddShape();
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        editor.asc_fireCallback("asc_canGroup", this.graphicObjects.canGroup());
        editor.asc_fireCallback("asc_canUnGroup", this.graphicObjects.canUnGroup());
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function PreChangeAdjState(graphicObjects) {
    this.id = STATES_ID_PRE_CHANGE_ADJ;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new ChangeAdjState(this.graphicObjects));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function PreMoveState(graphicObjects, ctrlShiftFlag, bSelectedMajorObject) {
    this.id = STATES_ID_PRE_MOVE;
    this.graphicObjects = graphicObjects;
    this.ctrlShiftFlag = ctrlShiftFlag;
    this.bSelectedMajorObjected = bSelectedMajorObject;
    var _common_selection_array = this.graphicObjects.selectionInfo.selectionArray;
    if (_common_selection_array.length === 1) {
        var pre_track = _common_selection_array[0];
        pre_track.calculateOffset();
        this.anchorPos = pre_track.Get_AnchorPos();
        this.anchorPos.Page = this.graphicObjects.startTrackPos.pageIndex;
    }
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (this.graphicObjects.startTrackPos.x === x && this.graphicObjects.startTrackPos.y === y && this.graphicObjects.startTrackPos.pageIndex === pageIndex) {
            return;
        }
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        var _track_objects = this.graphicObjects.arrTrackObjects;
        var _object_index = 0;
        var _object_count = _track_objects.length;
        for (; _object_index < _object_count; ++_object_index) {
            _track_objects[_object_index].init();
        }
        this.graphicObjects.changeCurrentState(new MoveState(this.graphicObjects));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        if (this.ctrlShiftFlag === false) {
            if (e.ClickCount > 1) {
                var gr_obj = this.graphicObjects.majorGraphicObject;
            }
        }
        if (this.ctrlShiftFlag === true) {
            if (this.bSelectedMajorObjected === true) {
                var _selection_array = this.graphicObjects.selectionInfo.selectionArray;
                for (var _sel_index = 0; _sel_index < _selection_array.length; ++_sel_index) {
                    if (_selection_array[_sel_index] === this.graphicObjects.majorGraphicObject) {
                        _selection_array.splice(_sel_index, 1);
                        this.graphicObjects.sortSelectionArray();
                        this.graphicObjects.majorGraphicObject.deselect();
                    }
                }
            }
        } else {
            if (this.bSelectedMajorObjected === true && this.graphicObjects.majorGraphicObject.isGroup() && e.Button !== 2) {
                this.graphicObjects.changeCurrentState(new GroupState(graphicObjects, this.graphicObjects.majorGraphicObject));
                this.graphicObjects.OnMouseDown(e, x, y, pageIndex);
                this.graphicObjects.OnMouseUp(e, x, y, pageIndex);
            }
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    };
}
function PreRotateState(graphicObjects) {
    this.id = STATES_ID_PRE_ROTATE;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        var _track_objects = this.graphicObjects.arrTrackObjects;
        var _track_object_index;
        var _track_object_count = _track_objects.length;
        for (_track_object_index = 0; _track_object_index < _track_object_count; ++_track_object_index) {
            _track_objects[_track_object_index].init();
        }
        this.graphicObjects.changeCurrentState(new RotateState(this.graphicObjects));
        this.graphicObjects.OnMouseMove(e, x, y, pageIndex);
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function RotateState(graphicObjects) {
    this.id = STATES_ID_ROTATE;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _translated_x;
        var _translated_y;
        var object_page_index;
        if (isRealObject(this.graphicObjects.majorGraphicObject) && isRealObject(this.graphicObjects.majorGraphicObject.Parent) && isRealObject(this.graphicObjects.majorGraphicObject.Parent.Parent) && typeof this.graphicObjects.majorGraphicObject.Parent.Parent.Is_HdrFtr === "function" && this.graphicObjects.majorGraphicObject.Parent.Parent.Is_HdrFtr()) {
            if (isRealObject(this.graphicObjects.majorGraphicObject.GraphicObj) && typeof this.graphicObjects.majorGraphicObject.GraphicObj.selectStartPage === "number" && this.graphicObjects.majorGraphicObject.GraphicObj.selectStartPage !== -1) {
                object_page_index = this.graphicObjects.majorGraphicObject.GraphicObj.selectStartPage;
            } else {
                if (isRealObject(this.graphicObjects.majorGraphicObject)) {
                    object_page_index = this.graphicObjects.majorGraphicObject.pageIndex;
                } else {
                    object_page_index = pageIndex;
                }
            }
        } else {
            if (isRealObject(this.graphicObjects.majorGraphicObject)) {
                object_page_index = this.graphicObjects.majorGraphicObject.pageIndex;
            } else {
                object_page_index = pageIndex;
            }
        }
        if (pageIndex !== object_page_index) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, object_page_index);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        var _angle = this.graphicObjects.majorGraphicObject.getAngle(_translated_x, _translated_y);
        var _track_object_index;
        var _track_objects = this.graphicObjects.arrTrackObjects;
        var _track_objects_count = _track_objects.length;
        for (_track_object_index = 0; _track_object_index < _track_objects_count; ++_track_object_index) {
            _track_objects[_track_object_index].modify(_angle, e.ShiftKey);
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var tracks = this.graphicObjects.arrTrackObjects;
        if (tracks.length > 0) {
            History.Create_NewPoint();
            var doc = this.graphicObjects.document;
            var para_drawing, bounds;
            if (tracks[0].originalGraphicObject.Is_Inline()) {
                if (false === editor.isViewMode && doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                    Type: changestype_2_Element_and_Type,
                    Element: tracks[0].originalGraphicObject.Parent,
                    CheckType: changestype_Paragraph_Content
                }) === false) {
                    tracks[0].trackEnd();
                    para_drawing = tracks[0].originalGraphicObject;
                    bounds = para_drawing.getBounds();
                    para_drawing.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                }
            } else {
                var b_recalc = false;
                var n_pos;
                for (var i = 0; i < tracks.length; ++i) {
                    var cur_track = tracks[i];
                    para_drawing = cur_track.originalGraphicObject;
                    if (false === editor.isViewMode && doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                        Type: changestype_2_Element_and_Type,
                        Element: para_drawing.Parent,
                        CheckType: changestype_Paragraph_Content
                    }) === false) {
                        cur_track.trackEnd();
                        bounds = para_drawing.getBounds();
                        n_pos = para_drawing.Parent.Get_NearestPos(para_drawing.pageIndex, para_drawing.absOffsetX, para_drawing.absOffsetY, true, para_drawing);
                        para_drawing.OnEnd_ChangeFlow(para_drawing.absOffsetX, para_drawing.absOffsetY, para_drawing.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, n_pos, true, false);
                        b_recalc = true;
                    }
                }
                if (b_recalc) {
                    doc.Recalculate();
                }
            }
            tracks.length = 0;
        }
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function PreResizeState(graphicObjects, majorHandleNum) {
    this.id = STATES_ID_PRE_RESIZE;
    this.graphicObjects = graphicObjects;
    this.majorHandleNum = majorHandleNum;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        var _track_objects = this.graphicObjects.arrTrackObjects;
        var _object_index;
        var _objects_count = _track_objects.length;
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _track_objects[_object_index].init();
        }
        this.graphicObjects.changeCurrentState(new ResizeState(this.graphicObjects, this.majorHandleNum));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function ChangeAdjState(graphicObjects) {
    this.id = STATES_ID_CHANGE_ADJ;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _transformed_x;
        var _transformed_y;
        var object_page_index;
        if (this.graphicObjects.majorGraphicObject.Parent.Parent.Is_HdrFtr(false)) {
            object_page_index = this.graphicObjects.majorGraphicObject.GraphicObj.selectStartPage;
        } else {
            object_page_index = this.graphicObjects.majorGraphicObject.pageIndex;
        }
        if (pageIndex !== object_page_index) {
            var _transformed_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, object_page_index);
            _transformed_x = _transformed_point.X;
            _transformed_y = _transformed_point.Y;
        } else {
            _transformed_x = x;
            _transformed_y = y;
        }
        this.graphicObjects.arrTrackObjects[0].track(_transformed_x, _transformed_y);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp2 = function (e, x, y, pageIndex) {
        var near_pos = null;
        var bounds33 = this.graphicObjects.arrTrackObjects[0].getBounds();
        near_pos = this.graphicObjects.document.Get_NearestPos(pageIndex, bounds33.l, bounds33.t, true, this.graphicObjects.majorGraphicObject);
        if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: near_pos.Paragraph,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            this.graphicObjects.arrTrackObjects[0].trackEnd();
            if (this.graphicObjects.arrTrackObjects[0].originalShape.group == null) {
                var graphic_object = this.graphicObjects.arrTrackObjects[0].originalShape.parent;
                if (graphic_object.Is_Inline()) {
                    var bounds = graphic_object.getBounds();
                    graphic_object.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                } else {
                    graphic_object.calculateOffset();
                    var pos_x = graphic_object.absOffsetX - graphic_object.boundsOffsetX;
                    var pos_y = graphic_object.absOffsetY - graphic_object.boundsOffsetY;
                    bounds = graphic_object.getBounds();
                    var W = bounds.r - bounds.l;
                    var H = bounds.b - bounds.t;
                    var near_pos = this.graphicObjects.document.Get_NearestPos(graphic_object.pageIndex, bounds.l, bounds.t, true, graphic_object);
                    graphic_object.OnEnd_ChangeFlow(pos_x, pos_y, graphic_object.pageIndex, W, H, near_pos, !graphic_object.Is_Inline(), true);
                }
            } else {
                var main_group = this.graphicObjects.arrTrackObjects[0].originalShape.mainGroup;
                graphic_object = main_group.parent;
                if (graphic_object.Is_Inline()) {
                    bounds = graphic_object.getBounds();
                    graphic_object.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                } else {
                    graphic_object.calculateOffset();
                    pos_x = graphic_object.absOffsetX - graphic_object.boundsOffsetX;
                    pos_y = graphic_object.absOffsetY - graphic_object.boundsOffsetY;
                    bounds = graphic_object.getBounds();
                    W = bounds.r - bounds.l;
                    H = bounds.b - bounds.t;
                    near_pos = this.graphicObjects.document.Get_NearestPos(graphic_object.pageIndex, bounds.l, bounds.t, true, graphic_object);
                    graphic_object.OnEnd_ChangeFlow(pos_x, pos_y, graphic_object.pageIndex, W, H, near_pos, !graphic_object.Is_Inline(), true);
                }
            }
        }
        this.graphicObjects.arrTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var doc = this.graphicObjects.document;
        var track = this.graphicObjects.arrTrackObjects[0];
        if (isRealObject(track)) {
            var shape = track.originalShape;
            var para_drawing = track.originalShape.parent;
            if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                Type: changestype_2_Element_and_Type,
                Element: para_drawing.Parent,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                track.trackEnd();
                var bounds = para_drawing.getBounds();
                if (para_drawing.Is_Inline()) {
                    para_drawing.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                } else {
                    var bounds_rect = para_drawing.getBoundsRect();
                    var nearest_pos = para_drawing.Parent.Get_NearestPos(para_drawing.pageIndex, bounds_rect.l, bounds_rect.t, true, para_drawing);
                    para_drawing.OnEnd_ChangeFlow(para_drawing.absOffsetX, para_drawing.absOffsetY, para_drawing.pageIndex, bounds.r - bounds.l, bounds.t - bounds.b, nearest_pos, true, true);
                }
            }
        }
        this.graphicObjects.arrTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function MoveState(graphicObjects) {
    this.id = STATES_ID_MOVE;
    this.graphicObjects = graphicObjects;
    var major_object = this.graphicObjects.majorGraphicObject;
    major_object.calculateOffset();
    this.boundsOffX = major_object.absOffsetX - major_object.boundsOffsetX - this.graphicObjects.startTrackPos.x;
    this.boundsOffY = major_object.absOffsetY - major_object.boundsOffsetY - this.graphicObjects.startTrackPos.y;
    this.anchorPos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, this.boundsOffX + this.graphicObjects.startTrackPos.x, this.boundsOffY + this.graphicObjects.startTrackPos.y);
    this.anchorPos.Page = this.graphicObjects.startTrackPos.pageIndex;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _arr_track_objects = this.graphicObjects.arrTrackObjects;
        var _objects_count = _arr_track_objects.length;
        var _object_index;
        var result_x, result_y;
        if (!e.ShiftKey) {
            result_x = x;
            result_y = y;
        } else {
            var abs_dist_x = Math.abs(this.graphicObjects.startTrackPos.x - x);
            var abs_dist_y = Math.abs(this.graphicObjects.startTrackPos.y - y);
            if (abs_dist_x > abs_dist_y) {
                result_x = x;
                result_y = this.graphicObjects.startTrackPos.y;
            } else {
                result_x = this.graphicObjects.startTrackPos.x;
                result_y = y;
            }
        }
        var tr_to_start_page_x;
        var tr_to_start_page_y;
        if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            tr_to_start_page_x = x;
            tr_to_start_page_y = y;
        } else {
            var tr_to_start_page = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            tr_to_start_page_x = tr_to_start_page.X;
            tr_to_start_page_y = tr_to_start_page.Y;
        }
        var startPage = this.graphicObjects.graphicPages[this.graphicObjects.startTrackPos.pageIndex];
        var startPos = this.graphicObjects.startTrackPos;
        var startBeforeArr = startPage.beforeTextObjects;
        var startWrapArr = startPage.wrappingObjects;
        var startInlineArr = startPage.inlineObjects;
        var startBehindArr = startPage.behindDocObjects;
        var min_dx = null,
        min_dy = null;
        var dx, dy;
        var snap_x = null,
        snap_y = null;
        var snapHorArray = [],
        snapVerArray = [];
        snapHorArray.push(X_Left_Field);
        snapHorArray.push(X_Right_Field);
        snapHorArray.push(Page_Width / 2);
        snapVerArray.push(Y_Top_Field);
        snapVerArray.push(Y_Bottom_Field);
        snapVerArray.push(Page_Height / 2);
        if (result_x === this.graphicObjects.startTrackPos.x) {
            min_dx = 0;
        } else {
            for (var track_index = 0; track_index < _arr_track_objects.length; ++track_index) {
                var cur_track_original_shape = _arr_track_objects[track_index].originalGraphicObject;
                var trackSnapArrayX = cur_track_original_shape.snapArrayX;
                var curDX = result_x - startPos.x;
                for (snap_index = 0; snap_index < trackSnapArrayX.length; ++snap_index) {
                    var snap_obj = GetMinSnapDistanceXObjectByArrays(trackSnapArrayX[snap_index] + curDX, snapHorArray);
                    if (isRealObject(snap_obj)) {
                        dx = snap_obj.dist;
                        if (dx !== null) {
                            if (min_dx === null) {
                                min_dx = dx;
                                snap_x = snap_obj.pos;
                            } else {
                                if (Math.abs(min_dx) > Math.abs(dx)) {
                                    min_dx = dx;
                                    snap_x = snap_obj.pos;
                                }
                            }
                        }
                    }
                }
                if (startBeforeArr.length > 0) {
                    for (var snap_index = 0; snap_index < trackSnapArrayX.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceXObject(trackSnapArrayX[snap_index] + curDX, startBeforeArr);
                        if (isRealObject(snap_obj)) {
                            dx = snap_obj.dist;
                            if (dx !== null) {
                                if (min_dx === null) {
                                    snap_x = snap_obj.pos;
                                    min_dx = dx;
                                } else {
                                    if (Math.abs(min_dx) > Math.abs(dx)) {
                                        min_dx = dx;
                                        snap_x = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
                if (startWrapArr.length > 0) {
                    for (snap_index = 0; snap_index < trackSnapArrayX.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceXObject(trackSnapArrayX[snap_index] + curDX, startWrapArr);
                        if (isRealObject(snap_obj)) {
                            dx = snap_obj.dist;
                            if (dx !== null) {
                                if (min_dx === null) {
                                    min_dx = dx;
                                    snap_x = snap_obj.pos;
                                } else {
                                    if (Math.abs(min_dx) > Math.abs(dx)) {
                                        min_dx = dx;
                                        snap_x = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
                if (startInlineArr.length > 0) {
                    for (snap_index = 0; snap_index < trackSnapArrayX.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceXObject(trackSnapArrayX[snap_index] + curDX, startInlineArr);
                        if (isRealObject(snap_obj)) {
                            dx = snap_obj.dist;
                            if (dx !== null) {
                                if (min_dx === null) {
                                    min_dx = dx;
                                    snap_x = snap_obj.pos;
                                } else {
                                    if (Math.abs(min_dx) > Math.abs(dx)) {
                                        min_dx = dx;
                                        snap_x = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
                if (startBehindArr.length > 0) {
                    for (snap_index = 0; snap_index < trackSnapArrayX.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceXObject(trackSnapArrayX[snap_index] + curDX, startBehindArr);
                        if (isRealObject(snap_obj)) {
                            dx = snap_obj.dist;
                            if (dx !== null) {
                                if (min_dx === null) {
                                    min_dx = dx;
                                    snap_x = snap_obj.pos;
                                } else {
                                    if (Math.abs(min_dx) > Math.abs(dx)) {
                                        min_dx = dx;
                                        snap_x = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (result_y === this.graphicObjects.startTrackPos.y) {
            min_dy = 0;
        } else {
            for (track_index = 0; track_index < _arr_track_objects.length; ++track_index) {
                cur_track_original_shape = _arr_track_objects[track_index].originalGraphicObject;
                var trackSnapArrayY = cur_track_original_shape.snapArrayY;
                var curDY = result_y - startPos.y;
                for (snap_index = 0; snap_index < trackSnapArrayY.length; ++snap_index) {
                    var snap_obj = GetMinSnapDistanceYObjectByArrays(trackSnapArrayY[snap_index] + curDY, snapVerArray);
                    if (isRealObject(snap_obj)) {
                        dy = snap_obj.dist;
                        if (dy !== null) {
                            if (min_dy === null) {
                                min_dy = dy;
                                snap_y = snap_obj.pos;
                            } else {
                                if (Math.abs(min_dy) > Math.abs(dy)) {
                                    min_dy = dy;
                                    snap_y = snap_obj.pos;
                                }
                            }
                        }
                    }
                }
                if (startBeforeArr.length > 0) {
                    for (snap_index = 0; snap_index < trackSnapArrayY.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceYObject(trackSnapArrayY[snap_index] + curDY, startBeforeArr);
                        if (isRealObject(snap_obj)) {
                            dy = snap_obj.dist;
                            if (dy !== null) {
                                if (min_dy === null) {
                                    min_dy = dy;
                                    snap_y = snap_obj.pos;
                                } else {
                                    if (Math.abs(min_dy) > Math.abs(dy)) {
                                        min_dy = dy;
                                        snap_y = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
                if (startWrapArr.length) {
                    for (snap_index = 0; snap_index < trackSnapArrayY.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceYObject(trackSnapArrayY[snap_index] + curDY, startWrapArr);
                        if (isRealObject(snap_obj)) {
                            dy = snap_obj.dist;
                            if (dy !== null) {
                                if (min_dy === null) {
                                    min_dy = dy;
                                    snap_y = snap_obj.pos;
                                } else {
                                    if (Math.abs(min_dy) > Math.abs(dy)) {
                                        min_dy = dy;
                                        snap_y = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
                if (startInlineArr.length > 0) {
                    for (snap_index = 0; snap_index < trackSnapArrayY.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceYObject(trackSnapArrayY[snap_index] + curDY, startInlineArr);
                        if (isRealObject(snap_obj)) {
                            dy = snap_obj.dist;
                            if (dy !== null) {
                                if (min_dy === null) {
                                    min_dy = dy;
                                    snap_y = snap_obj.pos;
                                } else {
                                    if (Math.abs(min_dy) > Math.abs(dy)) {
                                        min_dy = dy;
                                        snap_y = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
                if (startBehindArr.length > 0) {
                    for (snap_index = 0; snap_index < trackSnapArrayY.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceYObject(trackSnapArrayY[snap_index] + curDY, startBehindArr);
                        if (isRealObject(snap_obj)) {
                            dy = snap_obj.dist;
                            if (dy !== null) {
                                if (min_dy === null) {
                                    min_dy = dy;
                                    snap_y = snap_obj.pos;
                                } else {
                                    if (Math.abs(min_dy) > Math.abs(dy)) {
                                        min_dy = dy;
                                        snap_y = snap_obj.pos;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (min_dx === null || Math.abs(min_dx) > SNAP_DISTANCE) {
            min_dx = 0;
        } else {
            if (isRealNumber(snap_x)) {
                editor.WordControl.m_oDrawingDocument.DrawVerAnchor(pageIndex, snap_x);
            }
        }
        if (min_dy === null || Math.abs(min_dy) > SNAP_DISTANCE) {
            min_dy = 0;
        } else {
            if (isRealNumber(snap_y)) {
                editor.WordControl.m_oDrawingDocument.DrawHorAnchor(pageIndex, snap_y);
            }
        }
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _arr_track_objects[_object_index].track(result_x + min_dx, result_y + min_dy, pageIndex);
        }
        this.anchorPos = this.graphicObjects.document.Get_NearestPos(pageIndex, this.boundsOffX + x, this.boundsOffY + y, true, this.graphicObjects.majorGraphicObject);
        this.anchorPos.Page = pageIndex;
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var tracks = this.graphicObjects.arrTrackObjects;
        if (tracks.length > 0) {
            History.Create_NewPoint();
            var doc = this.graphicObjects.document;
            var b_recalculate = false;
            var gr_obj;
            for (var i = 0; i < tracks.length; ++i) {
                var cur_track = tracks[i];
                var bounds = cur_track.getBoundsRect();
                var near_pos = doc.Get_NearestPos(cur_track.trackGraphicObject.pageIndex, bounds.l, bounds.t, true, cur_track.originalGraphicObject);
                near_pos.Page = cur_track.trackGraphicObject.pageIndex;
                if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                    Type: changestype_2_Element_and_Type,
                    Element: near_pos.Paragraph,
                    CheckType: changestype_Paragraph_Content
                })) {
                    b_recalculate = true;
                    cur_track.trackEnd(e, pageIndex);
                    gr_obj = cur_track.originalGraphicObject;
                    bounds = gr_obj.getBounds();
                    cur_track.originalGraphicObject.OnEnd_ChangeFlow(gr_obj.absOffsetX, gr_obj.absOffsetY, cur_track.trackGraphicObject.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, near_pos, true, false);
                }
            }
            if (b_recalculate) {
                doc.Recalculate();
            }
        }
        tracks.length = 0;
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("move");
        return true;
    };
}
function ResizeState(graphicObjects, majorHandleNum) {
    this.id = STATES_ID_RESIZE;
    this.majorHandleNum = majorHandleNum;
    this.graphicObjects = graphicObjects;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _translated_x;
        var _translated_y;
        var object_page_index;
        var major_object = this.graphicObjects.majorGraphicObject;
        if (major_object.Parent.Parent.Is_HdrFtr(false)) {
            object_page_index = major_object.GraphicObj.selectStartPage;
        } else {
            object_page_index = this.graphicObjects.majorGraphicObject.pageIndex;
        }
        if (pageIndex !== object_page_index) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, object_page_index);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        var graphic_page = this.graphicObjects.graphicPages[object_page_index];
        var min_dx = null,
        min_dy = null;
        var dx, dy;
        var gr_arr = graphic_page.beforeTextObjects;
        for (var i = 0; i < gr_arr.length; ++i) {
            var snap_arr_x = gr_arr[i].snapArrayX;
            var snap_arr_y = gr_arr[i].snapArrayY;
            for (var j = 0, count = snap_arr_x.length; j < count; ++j) {
                dx = snap_arr_x[j] - _translated_x;
                if (min_dx === null) {
                    min_dx = dx;
                } else {
                    if (Math.abs(dx) < Math.abs(min_dx)) {
                        min_dx = dx;
                    }
                }
            }
            count = snap_arr_y.length;
            for (j = 0; j < count; ++j) {
                dy = snap_arr_y[j] - _translated_y;
                if (min_dy === null) {
                    min_dy = dy;
                } else {
                    if (Math.abs(min_dy) > Math.abs(dy)) {
                        min_dy = dy;
                    }
                }
            }
        }
        gr_arr = graphic_page.wrappingObjects;
        for (i = 0; i < gr_arr.length; ++i) {
            snap_arr_x = gr_arr[i].snapArrayX;
            snap_arr_y = gr_arr[i].snapArrayY;
            for (j = 0, count = snap_arr_x.length; j < count; ++j) {
                dx = snap_arr_x[j] - _translated_x;
                if (min_dx === null) {
                    min_dx = dx;
                } else {
                    if (Math.abs(dx) < Math.abs(min_dx)) {
                        min_dx = dx;
                    }
                }
            }
            count = snap_arr_y.length;
            for (j = 0; j < count; ++j) {
                dy = snap_arr_y[j] - _translated_y;
                if (min_dy === null) {
                    min_dy = dy;
                } else {
                    if (Math.abs(min_dy) > Math.abs(dy)) {
                        min_dy = dy;
                    }
                }
            }
        }
        gr_arr = graphic_page.inlineObjects;
        for (i = 0; i < gr_arr.length; ++i) {
            snap_arr_x = gr_arr[i].snapArrayX;
            snap_arr_y = gr_arr[i].snapArrayY;
            for (j = 0, count = snap_arr_x.length; j < count; ++j) {
                dx = snap_arr_x[j] - _translated_x;
                if (min_dx === null) {
                    min_dx = dx;
                } else {
                    if (Math.abs(dx) < Math.abs(min_dx)) {
                        min_dx = dx;
                    }
                }
            }
            count = snap_arr_y.length;
            for (j = 0; j < count; ++j) {
                dy = snap_arr_y[j] - _translated_y;
                if (min_dy === null) {
                    min_dy = dy;
                } else {
                    if (Math.abs(min_dy) > Math.abs(dy)) {
                        min_dy = dy;
                    }
                }
            }
        }
        gr_arr = graphic_page.behindDocObjects;
        for (i = 0; i < gr_arr.length; ++i) {
            snap_arr_x = gr_arr[i].snapArrayX;
            snap_arr_y = gr_arr[i].snapArrayY;
            for (j = 0, count = snap_arr_x.length; j < count; ++j) {
                dx = snap_arr_x[j] - _translated_x;
                if (min_dx === null) {
                    min_dx = dx;
                } else {
                    if (dx < min_dx) {
                        min_dx = dx;
                    }
                }
            }
            count = snap_arr_y.length;
            for (j = 0; j < count; ++j) {
                dy = snap_arr_y[j] - _translated_y;
                if (min_dy === null) {
                    min_dy = dy;
                } else {
                    if (Math.abs(min_dy) > Math.abs(dy)) {
                        min_dy = dy;
                    }
                }
            }
        }
        if (min_dx === null) {
            min_dx = 0;
        } else {
            if (Math.abs(min_dx) > SNAP_DISTANCE) {
                min_dx = 0;
            }
        }
        if (min_dy === null) {
            min_dy = 0;
        } else {
            if (Math.abs(min_dy) > SNAP_DISTANCE) {
                min_dy = 0;
            }
        }
        var _resize_coefficients = this.graphicObjects.majorGraphicObject.getResizeCoefficients(this.majorHandleNum, _translated_x + min_dx, _translated_y + min_dy);
        var _arr_track_objects = this.graphicObjects.arrTrackObjects;
        var _objects_count = _arr_track_objects.length;
        var _object_index;
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _arr_track_objects[_object_index].track(_resize_coefficients.kd1, _resize_coefficients.kd2, e);
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp2 = function (e, x, y, pageIndex) {
        History.Create_NewPoint();
        var _translated_x;
        var _translated_y;
        if (pageIndex !== this.graphicObjects.majorGraphicObject.pageIndex) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.majorGraphicObject.pageIndex);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        var _resize_coefficients = this.graphicObjects.majorGraphicObject.getResizeCoefficients(this.majorHandleNum, _translated_x, _translated_y);
        var _arr_track_objects = this.graphicObjects.arrTrackObjects;
        var _objects_count = _arr_track_objects.length;
        var _object_index;
        for (var i = 0; i < _objects_count; ++i) {
            if (_arr_track_objects[i].originalGraphicObject === this.graphicObjects.majorGraphicObject) {
                var bounds33 = _arr_track_objects[i].getBounds();
                near_pos = this.graphicObjects.document.Get_NearestPos(pageIndex, bounds33.l, bounds33.t, true, this.graphicObjects.majorGraphicObject);
            }
        }
        if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: near_pos.Paragraph,
            CheckType: changestype_Paragraph_Content
        })) {
            for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
                _arr_track_objects[_object_index].trackEnd();
            }
            if (_arr_track_objects[0].originalGraphicObject.Is_Inline()) {
                var bounds = _arr_track_objects[0].originalGraphicObject.getBounds();
                _arr_track_objects[0].originalGraphicObject.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                this.graphicObjects.arrTrackObjects = [];
                this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
                this.graphicObjects.curState.updateAnchorPos();
                return;
            } else {
                var bounds_2 = this.graphicObjects.majorGraphicObject.getBounds();
                var near_pos = this.graphicObjects.document.Get_NearestPos(pageIndex, bounds_2.l, bounds_2.t, true, this.graphicObjects.majorGraphicObject);
                for (var i = 0; i < _arr_track_objects.length; ++i) {
                    var or_gr_obj = _arr_track_objects[i].originalGraphicObject;
                    or_gr_obj.calculateOffset();
                    var pos_x = or_gr_obj.absOffsetX - or_gr_obj.boundsOffsetX;
                    var pos_y = or_gr_obj.absOffsetY - or_gr_obj.boundsOffsetY;
                    bounds_2 = or_gr_obj.getBounds();
                    var W = bounds_2.r - bounds_2.l;
                    var H = bounds_2.b - bounds_2.t;
                    or_gr_obj.OnEnd_ChangeFlow(pos_x, pos_y, or_gr_obj.pageIndex, W, H, near_pos, _arr_track_objects[i].trackGraphicObject.boolChangePos, i == _arr_track_objects.length - 1);
                }
            }
        }
        this.graphicObjects.arrTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var tracks = this.graphicObjects.arrTrackObjects;
        if (tracks.length > 0) {
            History.Create_NewPoint();
            var para_drawing;
            var doc = this.graphicObjects.document;
            var bounds;
            if (tracks[0].originalGraphicObject.Is_Inline()) {
                para_drawing = tracks[0].originalGraphicObject;
                var paragraph = null;
                if (!para_drawing.isShapeChild()) {
                    paragraph = para_drawing.Parent;
                } else {
                    var parent_shape = para_drawing.getParentShape();
                    if (!parent_shape.group) {
                        paragraph = parent_shape.parent.Parent;
                    } else {
                        main_group = parent_shape.getMainGroup();
                        if (isRealObject(main_group)) {
                            paragraph = main_group.parent.Parent;
                        } else {
                            paragraph = para_drawing.Parent;
                        }
                    }
                }
                if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                    Type: changestype_2_Element_and_Type,
                    Element: paragraph,
                    CheckType: changestype_Paragraph_Content
                })) {
                    tracks[0].trackEnd();
                    bounds = para_drawing.getBounds();
                    para_drawing.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
                }
            } else {
                var b_recalculate = false;
                for (var i = 0; i < tracks.length; ++i) {
                    var track = tracks[i];
                    para_drawing = track.originalGraphicObject;
                    var bounds_rect = track.getBoundsRect();
                    var nearest_pos = doc.Get_NearestPos(para_drawing.pageIndex, bounds_rect.l, bounds_rect.t, true, para_drawing);
                    if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                        Type: changestype_Drawing_Props,
                        Element: nearest_pos.Paragraph,
                        CheckType: changestype_Paragraph_Content
                    })) {
                        b_recalculate = true;
                        track.trackEnd();
                        bounds = para_drawing.getBounds();
                        para_drawing.OnEnd_ChangeFlow(para_drawing.absOffsetX, para_drawing.absOffsetY, para_drawing.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, nearest_pos, true, false);
                    }
                }
                if (b_recalculate) {
                    doc.Recalculate();
                }
            }
        }
        this.graphicObjects.arrTrackObjects = [];
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        this.graphicObjects.drawingDocument.SetCursorType("crosshair");
        return true;
    };
}
function TextAddState(graphicObjects, textObject) {
    this.id = STATES_ID_TEXT_ADD;
    this.graphicObjects = graphicObjects;
    this.textObject = textObject;
    this.nullState = new NullState(graphicObjects);
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.textObject.selectionRemove();
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        this.graphicObjects.OnMouseDown(e, x, y, pageIndex);
        if (this.graphicObjects.curState.id !== STATES_ID_TEXT_ADD || this.graphicObjects.curState.id !== STATES_ID_TEXT_ADD_IN_GROUP) {
            this.graphicObjects.drawingDocument.UpdateTargetTransform(new CMatrix());
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (e.IsLocked) {
            var page_index;
            if (isRealObject(this.textObject.Parent) && isRealObject(this.textObject.Parent.Parent) && this.textObject.Parent.Parent.Is_HdrFtr()) {
                page_index = this.textObject.GraphicObj.selectStartPage;
            } else {
                page_index = this.textObject.pageIndex;
            }
            var tx, ty;
            if (pageIndex === page_index) {
                tx = x;
                ty = y;
            } else {
                var tp = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, page_index);
                tx = tp.X;
                ty = tp.Y;
            }
            this.textObject.selectionSetEnd(tx, ty, e, page_index);
            this.graphicObjects.updateSelectionState();
        }
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var page_index;
        if (isRealObject(this.textObject.Parent) && isRealObject(this.textObject.Parent.Parent) && this.textObject.Parent.Parent.Is_HdrFtr()) {
            page_index = this.textObject.GraphicObj.selectStartPage;
        } else {
            page_index = this.textObject.pageIndex;
        }
        var tx, ty;
        if (pageIndex === page_index) {
            tx = x;
            ty = y;
        } else {
            var tp = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, page_index);
            tx = tp.X;
            ty = tp.Y;
        }
        this.textObject.selectionSetEnd(tx, ty, e, page_index);
        this.graphicObjects.updateSelectionState();
    };
    this.updateCursorType = function (pageIndex, x, y, e, textFlag) {
        return this.nullState.updateCursorType(pageIndex, x, y, e, textFlag);
    };
}
function TextAddInGroup(graphicObjects, textObject, group) {
    this.id = STATES_ID_TEXT_ADD_IN_GROUP;
    this.graphicObjects = graphicObjects;
    this.textObject = textObject;
    this.group = group;
    this.groupState = new GroupState(this.graphicObjects, group.parent);
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.textObject.selectionRemove();
        this.graphicObjects.changeCurrentState(new GroupState(graphicObjects, this.group.parent));
        this.graphicObjects.OnMouseDown(e, x, y, pageIndex);
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (e.IsLocked) {
            var page_index;
            if (isRealObject(this.group.parent.Parent) && isRealObject(this.group.parent.Parent.Parent) && this.group.parent.Parent.Parent.Is_HdrFtr()) {
                page_index = this.group.selectStartPage;
            } else {
                page_index = this.group.parent.pageIndex;
            }
            var tx, ty;
            if (pageIndex === page_index) {
                tx = x;
                ty = y;
            } else {
                var tp = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, page_index);
                tx = tp.X;
                ty = tp.Y;
            }
            this.textObject.selectionSetEnd(tx, ty, e, page_index);
            this.graphicObjects.updateSelectionState();
        }
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.textObject.selectionSetEnd(x, y, e, pageIndex);
        this.graphicObjects.updateSelectionState();
    };
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        return this.groupState.updateCursorType(pageIndex, x, y, e, bTextFlag);
    };
}
function GroupState(graphicObjects, group) {
    this.id = STATES_ID_GROUP;
    this.graphicObjects = graphicObjects;
    this.groupWordGO = group;
    this.group = group.GraphicObj;
    this.groupInvertMatrix = global_MatrixTransformer.Invert(this.group.transform);
    this.OnMouseDown = function (e, x, y, pageIndex) {
        handleGroupState(this.graphicObjects, this.group, e, x, y, pageIndex, this);
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y, e, bTextFlag) {
        return handleGroupStateCursorType(this.graphicObjects, this.group, e, x, y, pageIndex, this, bTextFlag);
    };
}
function PreChangeAdjInGroup(graphicObjects, group) {
    this.id = STATES_ID_PRE_CH_ADJ_IN_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new ChangeAdjInGroup(this.graphicObjects, this.group));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
    };
    this.updateCursorType = function () {};
}
function ChangeAdjInGroup(graphicObjects, group) {
    this.id = STATES_ID_CH_ADJ_IN_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.track = this.graphicObjects.arrTrackObjects[0];
    this.invertMatrix = global_MatrixTransformer.Invert(this.track.originalShape.group.transform);
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var t_x, t_y;
        if (pageIndex === this.group.pageIndex) {
            t_x = this.invertMatrix.TransformPointX(x, y);
            t_y = this.invertMatrix.TransformPointY(x, y);
        } else {
            var t_p = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.group.pageIndex);
            t_x = this.invertMatrix.TransformPointX(t_p.X, t_p.Y);
            t_y = this.invertMatrix.TransformPointY(t_p.X, t_p.Y);
        }
        this.track.track(t_x, t_y);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var doc = this.graphicObjects.document;
        if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.group.parent.Parent,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            this.track.trackEnd();
            var bounds = this.group.parent.getBounds();
            if (this.group.parent.Is_Inline()) {
                this.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
            } else {
                var near_pos = this.group.parent.Parent.Get_NearestPos(this.group.pageIndex, this.group.absOffsetX, this.group.absOffsetY, true, this.group.parent);
                this.group.parent.OnEnd_ChangeFlow(this.group.absOffsetX, this.group.absOffsetY, this.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, true);
            }
        }
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function () {};
}
function PreResizeInGroup(graphicObjects, group, majorObject, majorHandleNum) {
    this.id = STATES_ID_PRE_RESIZE_IN_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.majorHandleNum = majorHandleNum;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new ResizeInGroup(this.graphicObjects, this.group, this.majorObject, this.majorHandleNum));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
    };
    this.updateCursorType = function () {
        return false;
    };
}
function ResizeInGroup(graphicObjects, group, majorObject, majorHandleNum) {
    this.id = STATES_ID_RESIZE_IN_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.majorHandleNum = majorHandleNum;
    this.inv = global_MatrixTransformer.Invert(this.majorObject.group.transform);
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var t_x, t_y;
        if (pageIndex === this.group.pageIndex) {
            t_x = this.inv.TransformPointX(x, y);
            t_y = this.inv.TransformPointY(x, y);
        } else {
            var t_p = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.group.pageIndex);
            t_x = this.inv.TransformPointX(t_p.X, t_p.Y);
            t_y = this.inv.TransformPointY(t_p.X, t_p.Y);
        }
        var _resize_coefficients = this.majorObject.getResizeCoefficients(this.majorHandleNum, t_x, t_y);
        var _arr_track_objects = this.graphicObjects.arrTrackObjects;
        var _objects_count = _arr_track_objects.length;
        var _object_index;
        if (!e.CtrlKey) {
            for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
                _arr_track_objects[_object_index].resize(_resize_coefficients.kd1, _resize_coefficients.kd2, e.ShiftKey);
            }
        } else {
            for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
                _arr_track_objects[_object_index].resizeRelativeCenter(_resize_coefficients.kd1, _resize_coefficients.kd2, e.ShiftKey);
            }
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var doc = this.graphicObjects.document;
        if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.group.parent.Parent,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            var tracks = this.graphicObjects.arrTrackObjects;
            for (var i = 0; i < tracks.length; ++i) {
                tracks[i].endTrack();
            }
            this.group.updateSizes();
            this.group.recalculate();
            var bounds = this.group.parent.getBounds();
            if (this.group.parent.Is_Inline()) {
                this.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
            } else {
                var near_pos = this.group.parent.Parent.Get_NearestPos(this.group.pageIndex, this.group.absOffsetX, this.group.absOffsetY, true, this.group.parent);
                this.group.parent.OnEnd_ChangeFlow(this.group.absOffsetX, this.group.absOffsetY, this.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, true);
            }
        }
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
    };
    this.updateCursorType = function () {
        return false;
    };
}
function PreRotateInGroup(graphicObjects, group, majorObject) {
    this.id = STATES_ID_PRE_ROTATE_IN_GROUP2;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new RotateInGroup(this.graphicObjects, this.group, this.majorObject));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
    };
    this.updateCursorType = function () {
        return false;
    };
}
function RotateInGroup(graphicObjects, group, majorObject) {
    this.id = STATES_ID_ROTATE_IN_GROUP2;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.inv = global_MatrixTransformer.Invert(majorObject.group.transform);
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var t_x, t_y;
        if (pageIndex === this.group.pageIndex) {
            t_x = this.inv.TransformPointX(x, y);
            t_y = this.inv.TransformPointY(x, y);
        } else {
            var t_p = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.group.pageIndex);
            t_x = this.inv.TransformPointX(t_p.X, t_p.Y);
            t_y = this.inv.TransformPointY(t_p.X, t_p.Y);
        }
        var angle = this.majorObject.getAngle(t_x, t_y);
        var tracks = this.graphicObjects.arrTrackObjects;
        for (var i = 0; i < tracks.length; ++i) {
            tracks[i].track(angle, e.ShiftKey);
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var doc = this.graphicObjects.document;
        if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.group.parent.Parent,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            var tracks = this.graphicObjects.arrTrackObjects;
            for (var i = 0; i < tracks.length; ++i) {
                tracks[i].trackEnd();
            }
            this.group.updateSizes();
            this.group.recalculate();
            var bounds = this.group.parent.getBounds();
            if (this.group.parent.Is_Inline()) {
                this.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
            } else {
                var near_pos = this.group.parent.Parent.Get_NearestPos(this.group.pageIndex, this.group.absOffsetX, this.group.absOffsetY, true, this.group.parent);
                this.group.parent.OnEnd_ChangeFlow(this.group.absOffsetX, this.group.absOffsetY, this.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, null, true, true);
            }
        }
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function () {
        return false;
    };
}
function PreResizeGroupedShapes(graphicObjects, group, majorObject, majorObjectHandleNum) {
    this.id = STATES_ID_PRE_RESIZE_GROUPED;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.majorHandleNum = majorObjectHandleNum;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        var _track_objects = this.graphicObjects.arrTrackObjects;
        var _object_index;
        var _objects_count = _track_objects.length;
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _track_objects[_object_index].init();
        }
        this.graphicObjects.changeCurrentState(new ResizeGroupedShapes(this.graphicObjects, this.group, this.majorObject, majorObjectHandleNum));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function ResizeGroupedShapes(graphicObjects, group, majorObject, majorObjectHandleNum) {
    this.id = STATES_ID_RESIZE_GROUPED;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.majorHandleNum = majorObjectHandleNum;
    this.invertGroupMatrix = global_MatrixTransformer.Invert(this.group.transform);
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _translated_x;
        var _translated_y;
        if (pageIndex !== this.group.pageIndex) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.group.pageIndex);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        var _translated_to_group_x = this.invertGroupMatrix.TransformPointX(_translated_x, _translated_y);
        var _translated_to_group_y = this.invertGroupMatrix.TransformPointY(_translated_x, _translated_y);
        var _resize_coefficients = this.majorObject.getResizeCoefficients(this.majorHandleNum, _translated_to_group_x, _translated_to_group_y);
        var _arr_track_objects = this.graphicObjects.arrTrackObjects;
        var _objects_count = _arr_track_objects.length;
        var _object_index;
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _arr_track_objects[_object_index].track(_resize_coefficients.kd1, _resize_coefficients.kd2, e);
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        if (false === editor.isViewMode && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.group.parent.Parent,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            var _arr_track_objects = this.graphicObjects.arrTrackObjects;
            var _objects_count = _arr_track_objects.length;
            var _object_index;
            for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
                _arr_track_objects[_object_index].trackEnd();
            }
            this.group.recalculateAfterInternalResize();
            History.Add(this.group, {
                Type: historyitem_InternalChanges
            });
            var bounds = this.group.parent.getBounds();
            if (this.group.parent.Is_Inline()) {
                this.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
            } else {
                var bounds = this.group.parent.getBounds();
                var near_pos = this.graphicObjects.document.Get_NearestPos(this.group.parent.getPageIndex(), bounds.l, bounds.t, true, this.group.parent);
                this.group.parent.OnEnd_ChangeFlow(this.group.absOffsetX, this.group.absOffsetY, this.group.parent.getPageIndex(), bounds.r - bounds.l, bounds.b - bounds.t, near_pos, true, true);
            }
            this.graphicObjects.arrTrackObjects = [];
            this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
        }
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function PreMoveInGroup(graphicObjects, group, ctrlShift, bSelectedMajorObject, startX, startY) {
    this.id = STATES_ID_PRE_MOVE_IN_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.ctrlShiftFlag = ctrlShift;
    this.bSelectedMajorObjected = bSelectedMajorObject;
    this.startX = startX;
    this.startY = startY;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new MoveInGroup(this.graphicObjects, this.group, this.startX, this.startY));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function MoveInGroup(graphicObjects, group, startX, startY) {
    this.id = STATES_ID_MOVE_IN_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.invertGroupMatrix = global_MatrixTransformer.Invert(this.group.getTransformMatrix());
    this.startX = startX;
    this.startY = startY;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var t_x, t_y;
        if (pageIndex === this.group.pageIndex) {
            t_x = x;
            t_y = y;
        } else {
            var t_p = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.group.pageIndex);
            t_x = t_p.X;
            t_y = t_p.Y;
        }
        var _track_objects = this.graphicObjects.arrTrackObjects;
        for (var _index = 0; _index < _track_objects.length; ++_index) {
            _track_objects[_index].track(this.startX, this.startY, t_x, t_y);
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var doc = this.graphicObjects.document;
        var _track_objects = this.graphicObjects.arrTrackObjects;
        for (var _index = 0; _index < _track_objects.length; ++_index) {
            _track_objects[_index].track(this.startX, this.startY, x, y);
        }
        if (false === editor.isViewMode && false === doc.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.group.parent.Parent,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            var tracks = this.graphicObjects.arrTrackObjects;
            for (var i = 0; i < tracks.length; ++i) {
                tracks[i].trackEnd(e);
            }
            this.group.updateSizes();
            this.group.recalculate();
            var bounds = this.group.parent.getBounds();
            if (this.group.parent.Is_Inline()) {
                this.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
            } else {
                var near_pos = this.group.parent.Parent.Get_NearestPos(this.group.pageIndex, this.group.absOffsetX, this.group.absOffsetY, true, this.group.parent);
                this.group.parent.OnEnd_ChangeFlow(this.group.absOffsetX, this.group.absOffsetY, this.group.pageIndex, bounds.r - bounds.l, bounds.b - bounds.t, near_pos, true, true);
            }
        }
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function PreRotateInGroupState(graphicObjects, group, majorObject) {
    this.id = STATES_ID_PRE_ROTATE_IN_GROUP;
    this.graphicObjects = graphicObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects = this.graphicObjects.arrPreTrackObjects;
        this.graphicObjects.arrPreTrackObjects = [];
        var _track_objects = this.graphicObjects.arrTrackObjects;
        var _track_object_index;
        var _track_object_count = _track_objects.length;
        for (_track_object_index = 0; _track_object_index < _track_object_count; ++_track_object_index) {
            _track_objects[_track_object_index].init();
        }
        this.graphicObjects.changeCurrentState(new RotateInGroupState(this.graphicObjects, this.group, this.majorObject));
        this.graphicObjects.OnMouseMove(e, x, y, pageIndex);
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.arrPreTrackObjects = [];
        this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function RotateInGroupState(graphicObjects, group, majorObject) {
    this.id = STATES_ID_ROTATE_IN_GROUP;
    this.group = group;
    this.majorObject = majorObject;
    this.graphicObjects = graphicObjects;
    this.invertGroupTransfrom = global_MatrixTransformer.Invert(this.group.transform);
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _translated_x;
        var _translated_y;
        if (pageIndex !== this.group.pageIndex) {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.group.pageIndex);
            _translated_x = _translated_point.X;
            _translated_y = _translated_point.Y;
        } else {
            _translated_x = x;
            _translated_y = y;
        }
        var _transformed_to_group_x = this.invertGroupTransfrom.TransformPointX(_translated_x, _translated_y);
        var _transformed_to_group_y = this.invertGroupTransfrom.TransformPointY(_translated_x, _translated_y);
        var _angle = this.majorObject.getAngle(_transformed_to_group_x, _transformed_to_group_y);
        var _track_object_index;
        var _track_objects = this.graphicObjects.arrTrackObjects;
        var _track_objects_count = _track_objects.length;
        for (_track_object_index = 0; _track_object_index < _track_objects_count; ++_track_object_index) {
            _track_objects[_track_object_index].modify(_angle, e.ShiftKey);
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        if (false === editor.isViewMode && false === this.graphicObject.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.group.parent.Parent,
            CheckType: changestype_Paragraph_Content
        })) {
            History.Create_NewPoint();
            var _track_object_index;
            var _track_objects = this.graphicObjects.arrTrackObjects;
            var _track_objects_count = _track_objects.length;
            for (_track_object_index = 0; _track_object_index < _track_objects_count; ++_track_object_index) {
                _track_objects[_track_object_index].trackEnd();
            }
            this.group.startCalculateAfterInternalResize();
            var bounds = this.group.parent.getBounds();
            this.graphicObjects.arrTrackObjects = [];
            this.graphicObjects.changeCurrentState(new GroupState(this.graphicObjects, this.group.parent));
            if (this.group.parent.Is_Inline()) {
                this.group.parent.OnEnd_ResizeInline(bounds.r - bounds.l, bounds.b - bounds.t);
            } else {
                var bounds = this.group.parent.getBounds();
                var near_pos = this.graphicObjects.document.Get_NearestPos(this.group.parent.getPageIndex(), bounds.l, bounds.t, true, this.group.parent);
                this.group.parent.OnEnd_ChangeFlow(this.group.absOffsetX, this.group.absOffsetY, this.group.parent.getPageIndex(), bounds.r - bounds.l, bounds.b - bounds.t, near_pos, true, true);
            }
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function StartChangeWrapContourState(graphicObjects, wordGraphicObject) {
    this.id = STATES_ID_START_CHANGE_WRAP;
    this.graphicObjects = graphicObjects;
    this.wordGraphicObject = wordGraphicObject;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        var object_page_x, object_page_y;
        if (this.wordGraphicObject.pageIndex === pageIndex) {
            object_page_x = x;
            object_page_y = y;
        } else {
            var _translated_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.wordGraphicObject.pageIndex);
            object_page_x = _translated_point.X;
            object_page_y = _translated_point.Y;
        }
        var hit_to_wrap_polygon = this.wordGraphicObject.hitToWrapPolygonPoint(object_page_x, object_page_y);
        if (hit_to_wrap_polygon.hit === true) {
            if (hit_to_wrap_polygon.hitType === WRAP_HIT_TYPE_POINT) {
                if (!e.CtrlKey) {
                    this.graphicObjects.changeCurrentState(new PreChangeWrapContour(this.graphicObjects, this.wordGraphicObject, hit_to_wrap_polygon.pointNum));
                } else {
                    if (false === editor.isViewMode && this.wordGraphicObject.wrappingPolygon.arrPoints.length > 3 && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                        Type: changestype_2_Element_and_Type,
                        Element: this.wordGraphicObject.Parent,
                        CheckType: changestype_Paragraph_Content
                    })) {
                        History.Create_NewPoint();
                        var wrap_polygon = this.wordGraphicObject.wrappingPolygon;
                        var data = {};
                        data.Type = historyitem_ChangePolygon;
                        data.oldEdited = wrap_polygon.edited;
                        data.oldRelArr = [];
                        for (var i = 0; i < wrap_polygon.relativeArrPoints.length; ++i) {
                            data.oldRelArr[i] = {
                                x: wrap_polygon.relativeArrPoints[i].x,
                                y: wrap_polygon.relativeArrPoints[i].y
                            };
                        }
                        wrap_polygon.edited = true;
                        wrap_polygon.arrPoints.splice(hit_to_wrap_polygon.pointNum, 1);
                        wrap_polygon.calculateAbsToRel(this.wordGraphicObject.getTransformMatrix());
                        data.newRelArr = [];
                        for (i = 0; i < wrap_polygon.relativeArrPoints.length; ++i) {
                            data.newRelArr[i] = {
                                x: wrap_polygon.relativeArrPoints[i].x,
                                y: wrap_polygon.relativeArrPoints[i].y
                            };
                        }
                        History.Add(wrap_polygon, data);
                        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
                        this.graphicObjects.document.Recalculate();
                        this.graphicObjects.drawingDocument.OnRecalculatePage(this.wordGraphicObject.pageIndex, this.graphicObjects.document.Pages[this.wordGraphicObject.pageIndex]);
                    }
                }
            } else {
                if (false === editor.isViewMode && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                    Type: changestype_2_Element_and_Type,
                    Element: this.wordGraphicObject.Parent,
                    CheckType: changestype_Paragraph_Content
                })) {
                    this.graphicObjects.changeCurrentState(new PreChangeWrapContourAddPoint(this.graphicObjects, this.wordGraphicObject, hit_to_wrap_polygon.pointNum1, hit_to_wrap_polygon.pointNum2, object_page_x, object_page_y));
                }
            }
        } else {
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
            this.graphicObjects.OnMouseDown(e, x, y, pageIndex);
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function PreChangeWrapContour(graphicObjects, wordGraphicObject, pointNum) {
    this.id = STATES_ID_PRE_CHANGE_WRAP;
    this.graphicObjects = graphicObjects;
    this.wordGraphicObject = wordGraphicObject;
    this.pointNum = pointNum;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.arrTrackObjects.push(new CTrackWrapPolygon(this.wordGraphicObject.wrappingPolygon, this.pointNum));
        this.graphicObjects.changeCurrentState(new ChangeWrapContour(this.graphicObjects, this.wordGraphicObject, true));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.changeCurrentState(new StartChangeWrapContourState(this.graphicObjects, this.wordGraphicObject));
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function PreChangeWrapContourAddPoint(graphicObjects, wordGraphicObject, pointNum1, pointNum2, startX, startY) {
    this.id = STATES_ID_PRE_CHANGE_WRAP_ADD;
    this.graphicObjects = graphicObjects;
    this.wordGraphicObject = wordGraphicObject;
    this.pointNum1 = pointNum1;
    this.pointNum2 = pointNum2;
    this.startX = startX;
    this.startY = startY;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        History.Create_NewPoint();
        var wrap_polygon = this.wordGraphicObject.wrappingPolygon;
        var data = {};
        data.Type = historyitem_ChangePolygon;
        data.oldEdited = wrap_polygon.edited;
        data.oldRelArr = [];
        for (var i = 0; i < wrap_polygon.relativeArrPoints.length; ++i) {
            data.oldRelArr[i] = {
                x: wrap_polygon.relativeArrPoints[i].x,
                y: wrap_polygon.relativeArrPoints[i].y
            };
        }
        this.wordGraphicObject.wrappingPolygon.arrPoints.splice(this.pointNum2, 0, {
            x: this.startX,
            y: this.startY
        });
        this.wordGraphicObject.wrappingPolygon.calculateAbsToRel(this.wordGraphicObject.getTransformMatrix());
        data.newRelArr = [];
        for (i = 0; i < wrap_polygon.relativeArrPoints.length; ++i) {
            data.newRelArr[i] = {
                x: wrap_polygon.relativeArrPoints[i].x,
                y: wrap_polygon.relativeArrPoints[i].y
            };
        }
        History.Add(wrap_polygon, data);
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.arrTrackObjects.push(new CTrackWrapPolygon(this.wordGraphicObject.wrappingPolygon, this.pointNum2));
        this.graphicObjects.changeCurrentState(new ChangeWrapContour(this.graphicObjects, this.wordGraphicObject, false));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.changeCurrentState(new StartChangeWrapContourState(this.graphicObjects, this.wordGraphicObject));
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function ChangeWrapContour(graphicObjects, wordGraphicObject, bHistoryNewPoint) {
    this.id = STATES_ID_PRE_CHANGE_WRAP_CONTOUR;
    this.graphicObjects = graphicObjects;
    this.wordGraphicObject = wordGraphicObject;
    this.bHistoryNewPoint = bHistoryNewPoint;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var tr_x, tr_y;
        if (pageIndex === this.wordGraphicObject.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_p = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.wordGraphicObject.pageIndex);
            tr_x = tr_p.X;
            tr_y = tr_p.Y;
        }
        this.graphicObjects.arrTrackObjects[0].track(tr_x, tr_y);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        var bEndTrack = this.bHistoryNewPoint && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_Element_and_Type,
            Element: this.wordGraphicObject.Parent,
            CheckType: changestype_Paragraph_Content
        }) || !this.bHistoryNewPoint;
        if (bEndTrack) {
            if (this.bHistoryNewPoint) {
                History.Create_NewPoint();
            }
            this.graphicObjects.arrTrackObjects[0].trackEnd();
        }
        this.graphicObjects.arrTrackObjects.length = 0;
        this.graphicObjects.changeCurrentState(new StartChangeWrapContourState(this.graphicObjects, this.wordGraphicObject));
        if (bEndTrack) {
            this.graphicObjects.document.Recalculate();
        }
        this.graphicObjects.drawingDocument.OnRecalculatePage(this.wordGraphicObject.pageIndex, this.graphicObjects.document.Pages[this.wordGraphicObject.pageIndex]);
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function SplineBezierState(graphicObjects) {
    this.id = STATES_ID_SPLINE_BEZIER;
    this.graphicObjects = graphicObjects;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.graphicObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        this.graphicObjects.spline = new Spline(pageIndex, this.graphicObjects.document);
        this.graphicObjects.spline.path.push(new SplineCommandMoveTo(x, y));
        this.graphicObjects.changeCurrentState(new SplineBezierState33(this.graphicObjects, x, y));
        var sel_arr = this.graphicObjects.selectionInfo.selectionArray;
        for (var i = 0; i < sel_arr.length; ++i) {
            sel_arr[i].deselect();
        }
        sel_arr.length = 0;
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseMove = function (e, X, Y, pageIndex) {};
    this.OnMouseUp = function (e, X, Y, pageIndex) {
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function SplineBezierState33(graphicObjects, startX, startY) {
    this.id = STATES_ID_SPLINE_BEZIER33;
    this.graphicObjects = graphicObjects;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var startPos = this.graphicObjects.startTrackPos;
        if (startPos.x === x && startPos.y === y && startPos.pageIndex === pageIndex) {
            return;
        }
        var tr_x, tr_y;
        if (pageIndex === startPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, startPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        this.graphicObjects.spline.path.push(new SplineCommandLineTo(tr_x, tr_y));
        this.graphicObjects.changeCurrentState(new SplineBezierState2(this.graphicObjects));
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function SplineBezierState2(graphicObjects) {
    this.id = STATES_ID_SPLINE_BEZIER2;
    this.graphicObjects = graphicObjects;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        if (e.ClickCount >= 2) {
            var lt = this.graphicObjects.spline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y, true, null);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.spline.createShape(this.graphicObjects.document);
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.recalculateWrapPolygon();
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            this.graphicObjects.arrTrackObjects.length = 0;
            this.graphicObjects.spline = null;
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var startPos = this.graphicObjects.startTrackPos;
        var tr_x, tr_y;
        if (pageIndex === startPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, startPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        this.graphicObjects.spline.path[1].changePoint(tr_x, tr_y);
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        if (e.ClickCount < 2) {
            var tr_x, tr_y;
            if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
                tr_x = x;
                tr_y = y;
            } else {
                var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
                tr_x = tr_point.x;
                tr_y = tr_point.y;
            }
            this.graphicObjects.changeCurrentState(new SplineBezierState3(this.graphicObjects, tr_x, tr_y));
        }
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function SplineBezierState3(graphicObjects, startX, startY) {
    this.id = STATES_ID_SPLINE_BEZIER3;
    this.graphicObjects = graphicObjects;
    this.startX = startX;
    this.startY = startY;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        if (e.ClickCount >= 2) {
            var lt = this.graphicObjects.spline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y, true, null);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.spline.createShape(this.graphicObjects.document);
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.recalculateWrapPolygon();
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, near_pos.Page);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            this.graphicObjects.arrTrackObjects.length = 0;
            this.graphicObjects.spline = null;
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (x === this.startX && y === this.startY && pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            return;
        }
        var tr_x, tr_y;
        if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        var spline = this.graphicObjects.spline;
        x0 = spline.path[0].x;
        y0 = spline.path[0].y;
        x3 = spline.path[1].x;
        y3 = spline.path[1].y;
        x6 = tr_x;
        y6 = tr_y;
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
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        this.graphicObjects.changeCurrentState(new SplineBezierState4(this.graphicObjects));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        if (e.ClickCount >= 2) {
            var lt = this.graphicObjects.spline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y, true, null);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.spline.createShape(this.graphicObjects.document);
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.recalculateWrapPolygon();
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, near_pos.Page);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            this.graphicObjects.arrTrackObjects.length = 0;
            this.graphicObjects.spline = null;
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
        }
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function SplineBezierState4(graphicObjects) {
    this.id = STATES_ID_SPLINE_BEZIER4;
    this.graphicObjects = graphicObjects;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        if (e.ClickCount >= 2) {
            var lt = this.graphicObjects.spline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y, true, null);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                var _new_word_graphic_object = this.graphicObjects.spline.createShape(this.graphicObjects.document);
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.recalculateWrapPolygon();
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            this.graphicObjects.arrTrackObjects.length = 0;
            this.graphicObjects.spline = null;
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var spline = this.graphicObjects.spline;
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
        var tr_x, tr_y;
        if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        x6 = tr_x;
        y6 = tr_y;
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
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        if (e.ClickCount < 2) {
            var tr_x, tr_y;
            if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
                tr_x = x;
                tr_y = y;
            } else {
                var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
                tr_x = tr_point.X;
                tr_y = tr_point.Y;
            }
            this.graphicObjects.changeCurrentState(new SplineBezierState5(graphicObjects, tr_x, tr_y));
        }
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function SplineBezierState5(graphicObjects, startX, startY) {
    this.id = STATES_ID_SPLINE_BEZIER5;
    this.graphicObjects = graphicObjects;
    this.startX = startX;
    this.startY = startY;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        if (e.ClickCount >= 2) {
            var lt = this.graphicObjects.spline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y, true, null);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.spline.createShape(this.graphicObjects.document);
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.recalculateWrapPolygon();
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            this.graphicObjects.arrTrackObjects.length = 0;
            this.graphicObjects.spline = null;
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (x === this.startX && y === this.startY && pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            return;
        }
        var spline = this.graphicObjects.spline;
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
        var tr_x, tr_y;
        if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        x6 = tr_x;
        y6 = tr_y;
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
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        this.graphicObjects.changeCurrentState(new SplineBezierState4(this.graphicObjects));
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        if (e.ClickCount >= 2) {
            var lt = this.graphicObjects.spline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y, true, null);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.spline.createShape(this.graphicObjects.document);
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.recalculateWrapPolygon();
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            this.graphicObjects.arrTrackObjects.length = 0;
            this.graphicObjects.spline = null;
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
        }
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function PolyLineAddState(graphicObjects) {
    this.graphicObjects = graphicObjects;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.graphicObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        this.graphicObjects.polyline = new PolyLine(this.graphicObjects.document, pageIndex);
        this.graphicObjects.polyline.arrPoint.push({
            x: x,
            y: y
        });
        var sel_arr = this.graphicObjects.selectionInfo.selectionArray;
        for (var i = 0; i < sel_arr.length; ++i) {
            sel_arr[i].deselect();
        }
        sel_arr.length = 0;
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        var _min_distance = this.graphicObjects.drawingDocument.GetMMPerDot(1);
        this.graphicObjects.changeCurrentState(new PolyLineAddState2(this.graphicObjects, _min_distance));
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {};
    this.OnMouseUp = function (e, x, y, pageIndex) {
        this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
        this.graphicObjects.curState.updateAnchorPos();
        this.graphicObjects.polyline = null;
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function PolyLineAddState2(graphicObjects, minDistance) {
    this.graphicObjects = graphicObjects;
    this.minDistance = minDistance;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {};
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var _last_point = this.graphicObjects.polyline.arrPoint[this.graphicObjects.polyline.arrPoint.length - 1];
        var tr_x, tr_y;
        if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        var dx = tr_x - _last_point.x;
        var dy = tr_y - _last_point.y;
        if (Math.sqrt(dx * dx + dy * dy) >= this.minDistance) {
            this.graphicObjects.polyline.arrPoint.push({
                x: tr_x,
                y: tr_y
            });
            this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        }
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        if (this.graphicObjects.polyline.arrPoint.length > 1) {
            var lt = this.graphicObjects.polyline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.polyline.createShape(this.graphicObjects.document);
                this.graphicObjects.arrTrackObjects.length = 0;
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.recalculateWrapPolygon();
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
            this.graphicObjects.polyline = null;
        } else {
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
            this.graphicObjects.drawingDocument.OnRecalculatePage(this.graphicObjects.startTrackPos.pageIndex, this.graphicObjects.document.Pages[this.graphicObjects.startTrackPos.pageIndex]);
            this.graphicObjects.polyline = null;
        }
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function AddPolyLine2State(graphicObjects) {
    this.graphicObjects = graphicObjects;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        this.graphicObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        var sel_arr = this.graphicObjects.selectionInfo.selectionArray;
        for (var sel_index = 0; sel_index < sel_arr.length; ++sel_index) {
            sel_arr[sel_index].deselect();
        }
        sel_arr.length = 0;
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
        this.graphicObjects.polyline = new PolyLine(this.graphicObjects.document, pageIndex);
        this.graphicObjects.polyline.arrPoint.push({
            x: x,
            y: y
        });
        this.graphicObjects.changeCurrentState(new AddPolyLine2State2(this.graphicObjects, x, y));
    };
    this.OnMouseMove = function (AutoShapes, e, X, Y) {};
    this.OnMouseUp = function (AutoShapes, e, X, Y) {};
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function AddPolyLine2State2(graphicObjects, x, y) {
    this.graphicObjects = graphicObjects;
    this.X = x;
    this.Y = y;
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        if (e.ClickCount > 1) {
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
            this.graphicObjects.polyline = null;
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        if (this.X !== x || this.Y !== y || this.graphicObjects.startTrackPos.pageIndex !== pageIndex) {
            var tr_x, tr_y;
            if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
                tr_x = x;
                tr_y = y;
            } else {
                var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
                tr_x = tr_point.X;
                tr_y = tr_point.Y;
            }
            this.graphicObjects.polyline.arrPoint.push({
                x: tr_x,
                y: tr_y
            });
            this.graphicObjects.changeCurrentState(new AddPolyLine2State3(this.graphicObjects));
        }
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {};
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function AddPolyLine2State3(graphicObjects) {
    this.graphicObjects = graphicObjects;
    this.minSize = graphicObjects.drawingDocument.GetMMPerDot(1);
    this.polylineFlag = true;
    this.OnMouseDown = function (e, x, y, pageIndex) {
        var tr_x, tr_y;
        if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        this.graphicObjects.polyline.arrPoint.push({
            x: tr_x,
            y: tr_y
        });
        if (e.ClickCount > 1) {
            var lt = this.graphicObjects.polyline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.polyline.createShape(this.graphicObjects.document);
                this.graphicObjects.arrTrackObjects.length = 0;
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.recalculateWrapPolygon();
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
            this.graphicObjects.polyline = null;
        }
    };
    this.OnMouseMove = function (e, x, y, pageIndex) {
        var tr_x, tr_y;
        if (pageIndex === this.graphicObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.graphicObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.graphicObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        if (!e.IsLocked) {
            this.graphicObjects.polyline.arrPoint[this.graphicObjects.polyline.arrPoint.length - 1] = {
                x: tr_x,
                y: tr_y
            };
        } else {
            var _last_point = this.graphicObjects.polyline.arrPoint[this.graphicObjects.polyline.arrPoint.length - 1];
            var dx = tr_x - _last_point.x;
            var dy = tr_y - _last_point.y;
            if (Math.sqrt(dx * dx + dy * dy) >= this.minSize) {
                this.graphicObjects.polyline.arrPoint.push({
                    x: tr_x,
                    y: tr_y
                });
            }
        }
        this.graphicObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    };
    this.OnMouseUp = function (e, x, y, pageIndex) {
        if (e.ClickCount > 1) {
            var lt = this.graphicObjects.polyline.getLeftTopPoint();
            var near_pos = this.graphicObjects.document.Get_NearestPos(this.graphicObjects.startTrackPos.pageIndex, lt.x, lt.y);
            near_pos.Page = this.graphicObjects.startTrackPos.pageIndex;
            if (false === editor.isViewMode && near_pos != null && false === this.graphicObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: near_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint();
                var _new_word_graphic_object = this.graphicObjects.polyline.createShape(this.graphicObjects.document);
                this.graphicObjects.arrTrackObjects.length = 0;
                _new_word_graphic_object.select(this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.recalculateWrapPolygon();
                this.graphicObjects.selectionInfo.selectionArray.push(_new_word_graphic_object);
                _new_word_graphic_object.Set_DrawingType(drawing_Anchor);
                _new_word_graphic_object.Set_WrappingType(WRAPPING_TYPE_NONE);
                _new_word_graphic_object.Set_XYForAdd(_new_word_graphic_object.absOffsetX, _new_word_graphic_object.absOffsetY, near_pos, this.graphicObjects.startTrackPos.pageIndex);
                _new_word_graphic_object.Add_ToDocument(near_pos);
            }
            editor.sync_StartAddShapeCallback(false);
            editor.sync_EndAddShape();
            this.graphicObjects.changeCurrentState(new NullState(this.graphicObjects));
            this.graphicObjects.curState.updateAnchorPos();
            this.graphicObjects.polyline = null;
        }
    };
    this.updateCursorType = function (pageIndex, x, y) {
        return false;
    };
}
function GetMinSnapDistanceX(pointX, arrGrObjects) {
    var min_dx = null;
    for (var i = 0; i < arrGrObjects.length; ++i) {
        var cur_snap_arr_x = arrGrObjects[i].snapArrayX;
        var count = cur_snap_arr_x.length;
        for (var snap_index = 0; snap_index < count; ++snap_index) {
            var dx = cur_snap_arr_x[snap_index] - pointX;
            if (min_dx === null) {
                min_dx = dx;
            } else {
                if (Math.abs(dx) < Math.abs(min_dx)) {
                    min_dx = dx;
                }
            }
        }
    }
    return min_dx;
}
function GetMinSnapDistanceY(pointY, arrGrObjects) {
    var min_dy = null;
    for (var i = 0; i < arrGrObjects.length; ++i) {
        var cur_snap_arr_y = arrGrObjects[i].snapArrayY;
        var count = cur_snap_arr_y.length;
        for (var snap_index = 0; snap_index < count; ++snap_index) {
            var dy = cur_snap_arr_y[snap_index] - pointY;
            if (min_dy === null) {
                min_dy = dy;
            } else {
                if (Math.abs(dy) < Math.abs(min_dy)) {
                    min_dy = dy;
                }
            }
        }
    }
    return min_dy;
}
function GetMinSnapDistanceXObject(pointX, arrGrObjects) {
    var min_dx = null;
    var ret = null;
    for (var i = 0; i < arrGrObjects.length; ++i) {
        var cur_snap_arr_x = arrGrObjects[i].snapArrayX;
        var count = cur_snap_arr_x.length;
        for (var snap_index = 0; snap_index < count; ++snap_index) {
            var dx = cur_snap_arr_x[snap_index] - pointX;
            if (min_dx === null) {
                ret = {
                    dist: dx,
                    pos: cur_snap_arr_x[snap_index]
                };
                min_dx = dx;
            } else {
                if (Math.abs(dx) < Math.abs(min_dx)) {
                    min_dx = dx;
                    ret = {
                        dist: dx,
                        pos: cur_snap_arr_x[snap_index]
                    };
                }
            }
        }
    }
    return ret;
}
function GetMinSnapDistanceYObject(pointY, arrGrObjects) {
    var min_dy = null;
    var ret = null;
    for (var i = 0; i < arrGrObjects.length; ++i) {
        var cur_snap_arr_y = arrGrObjects[i].snapArrayY;
        var count = cur_snap_arr_y.length;
        for (var snap_index = 0; snap_index < count; ++snap_index) {
            var dy = cur_snap_arr_y[snap_index] - pointY;
            if (min_dy === null) {
                min_dy = dy;
                ret = {
                    dist: dy,
                    pos: cur_snap_arr_y[snap_index]
                };
            } else {
                if (Math.abs(dy) < Math.abs(min_dy)) {
                    min_dy = dy;
                    ret = {
                        dist: dy,
                        pos: cur_snap_arr_y[snap_index]
                    };
                }
            }
        }
    }
    return ret;
}
function GetMinSnapDistanceXObjectByArrays(pointX, snapArrayX) {
    var min_dx = null;
    var ret = null;
    var cur_snap_arr_x = snapArrayX;
    var count = cur_snap_arr_x.length;
    for (var snap_index = 0; snap_index < count; ++snap_index) {
        var dx = cur_snap_arr_x[snap_index] - pointX;
        if (min_dx === null) {
            ret = {
                dist: dx,
                pos: cur_snap_arr_x[snap_index]
            };
            min_dx = dx;
        } else {
            if (Math.abs(dx) < Math.abs(min_dx)) {
                min_dx = dx;
                ret = {
                    dist: dx,
                    pos: cur_snap_arr_x[snap_index]
                };
            }
        }
    }
    return ret;
}
function GetMinSnapDistanceYObjectByArrays(pointY, snapArrayY) {
    var min_dy = null;
    var ret = null;
    var cur_snap_arr_y = snapArrayY;
    var count = cur_snap_arr_y.length;
    for (var snap_index = 0; snap_index < count; ++snap_index) {
        var dy = cur_snap_arr_y[snap_index] - pointY;
        if (min_dy === null) {
            min_dy = dy;
            ret = {
                dist: dy,
                pos: cur_snap_arr_y[snap_index]
            };
        } else {
            if (Math.abs(dy) < Math.abs(min_dy)) {
                min_dy = dy;
                ret = {
                    dist: dy,
                    pos: cur_snap_arr_y[snap_index]
                };
            }
        }
    }
    return ret;
}