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
var MOVE_DELTA = 1 / 100000;
var SNAP_DISTANCE = 1.27;
function StartAddNewShape(drawingObjects, preset) {
    this.drawingObjects = drawingObjects;
    this.preset = preset;
    this.bStart = false;
    this.bMoved = false;
    this.startX = null;
    this.startY = null;
}
StartAddNewShape.prototype = {
    onMouseDown: function (e, x, y) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        this.startX = x;
        this.startY = y;
        this.drawingObjects.arrPreTrackObjects.length = 0;
        this.drawingObjects.arrPreTrackObjects.push(new NewShapeTrack(this.preset, x, y, this.drawingObjects.getTheme(), null, null, null, 0));
        this.bStart = true;
        this.drawingObjects.swapTrackObjects();
    },
    onMouseMove: function (e, x, y) {
        if (this.bStart && e.IsLocked) {
            if (!this.bMoved && (Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA)) {
                this.bMoved = true;
            }
            this.drawingObjects.arrTrackObjects[0].track(e, x, y);
            this.drawingObjects.updateOverlay();
        }
    },
    onMouseUp: function (e, x, y) {
        if (this.bStart) {
            if (this.drawingObjects.drawingObjects.objectLocker) {
                this.drawingObjects.drawingObjects.objectLocker.reset();
                this.drawingObjects.drawingObjects.objectLocker.addObjectId(g_oIdCounter.Get_NewId());
            }
            var oThis = this;
            var track = oThis.drawingObjects.arrTrackObjects[0];
            if (!this.bMoved && this instanceof StartAddNewShape) {
                var ext_x, ext_y;
                if (typeof SHAPE_ASPECTS[this.preset] === "number") {
                    var _aspect = SHAPE_ASPECTS[this.preset];
                    if (_aspect >= 1) {
                        ext_y = 25.4;
                        ext_x = ext_y * _aspect;
                    } else {
                        ext_x = 25.4;
                        ext_y = ext_x / _aspect;
                    }
                } else {
                    ext_x = 25.4;
                    ext_y = 25.4;
                }
                this.onMouseMove({
                    IsLocked: true
                },
                this.startX + ext_x, this.startY + ext_y);
            }
            var callback = function (bLock) {
                if (bLock) {
                    History.Create_NewPoint(historydescription_CommonStatesAddNewShape);
                    var shape = track.getShape(false, oThis.drawingObjects.getDrawingDocument(), oThis.drawingObjects.drawingObjects);
                    if (shape.spPr.xfrm.offX < 0) {
                        shape.spPr.xfrm.setOffX(0);
                    }
                    if (shape.spPr.xfrm.offY < 0) {
                        shape.spPr.xfrm.setOffY(0);
                    }
                    oThis.drawingObjects.drawingObjects.getWorksheetModel && shape.setWorksheet(oThis.drawingObjects.drawingObjects.getWorksheetModel());
                    if (oThis.drawingObjects.drawingObjects && oThis.drawingObjects.drawingObjects.cSld) {
                        shape.setParent(oThis.drawingObjects.drawingObjects);
                        shape.setRecalculateInfo();
                    }
                    shape.addToDrawingObjects();
                    shape.checkDrawingBaseCoords();
                    oThis.drawingObjects.checkChartTextSelection();
                    oThis.drawingObjects.resetSelection();
                    shape.select(oThis.drawingObjects, 0);
                    if (oThis.preset === "textRect") {
                        oThis.drawingObjects.selection.textSelection = shape;
                    }
                    oThis.drawingObjects.startRecalculate();
                    oThis.drawingObjects.drawingObjects.sendGraphicObjectProps();
                }
            };
            if (this.drawingObjects.drawingObjects.objectLocker) {
                this.drawingObjects.drawingObjects.objectLocker.checkObjects(callback);
            } else {
                callback(true);
            }
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
        if (asc["editor"]) {
            asc["editor"].asc_endAddShape();
        } else {
            if (editor && editor.sync_EndAddShape) {
                editor.sync_EndAddShape();
            }
        }
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function checkEmptyPlaceholderContent(content) {
    if (!content || content.Is_Empty() && content.Parent && content.Parent.parent && content.Parent.parent.isPlaceholder && content.Parent.parent.isPlaceholder()) {
        return content;
    }
    return null;
}
function NullState(drawingObjects) {
    this.drawingObjects = drawingObjects;
}
NullState.prototype = {
    onMouseDown: function (e, x, y, pageIndex, bTextFlag) {
        var start_target_doc_content, end_target_doc_content, selected_comment_index = -1;
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            start_target_doc_content = checkEmptyPlaceholderContent(this.drawingObjects.getTargetDocContent());
        }
        var ret;
        ret = this.drawingObjects.handleSlideComments(e, x, y, pageIndex);
        if (ret) {
            if (ret.result) {
                return ret.result;
            }
            selected_comment_index = ret.selectedIndex;
        }
        var selection = this.drawingObjects.selection;
        var b_no_handle_selected = false;
        if (selection.groupSelection) {
            ret = handleSelectedObjects(this.drawingObjects, e, x, y, selection.groupSelection, pageIndex, false);
            if (ret) {
                end_target_doc_content = checkEmptyPlaceholderContent(this.drawingObjects.getTargetDocContent());
                if ((start_target_doc_content || end_target_doc_content) && (start_target_doc_content !== end_target_doc_content)) {
                    this.drawingObjects.drawingObjects.showDrawingObjects(true);
                }
                return ret;
            }
            ret = handleFloatObjects(this.drawingObjects, selection.groupSelection.arrGraphicObjects, e, x, y, selection.groupSelection, pageIndex, false);
            if (ret) {
                if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
                    end_target_doc_content = checkEmptyPlaceholderContent(this.drawingObjects.getTargetDocContent());
                    if ((start_target_doc_content || end_target_doc_content) && (start_target_doc_content !== end_target_doc_content)) {
                        this.drawingObjects.drawingObjects.showDrawingObjects(true);
                    }
                }
                return ret;
            }
        } else {
            if (selection.chartSelection) {}
        }
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            if (this.drawingObjects.checkNeedResetChartSelection(e, x, y, pageIndex, bTextFlag)) {
                this.drawingObjects.checkChartTextSelection();
            }
            this.drawingObjects.resetInternalSelection(true);
        }
        if (!b_no_handle_selected) {
            ret = handleSelectedObjects(this.drawingObjects, e, x, y, null, pageIndex, false);
            if (ret) {
                if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
                    end_target_doc_content = checkEmptyPlaceholderContent(this.drawingObjects.getTargetDocContent());
                    if ((start_target_doc_content || end_target_doc_content) && (start_target_doc_content !== end_target_doc_content)) {
                        this.drawingObjects.drawingObjects.showDrawingObjects(true);
                    }
                }
                return ret;
            }
        }
        ret = handleFloatObjects(this.drawingObjects, this.drawingObjects.getDrawingArray(), e, x, y, null, pageIndex, false);
        if (ret) {
            if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
                end_target_doc_content = checkEmptyPlaceholderContent(this.drawingObjects.getTargetDocContent());
                if ((start_target_doc_content || end_target_doc_content) && (start_target_doc_content !== end_target_doc_content)) {
                    this.drawingObjects.drawingObjects.showDrawingObjects(true);
                }
            }
            return ret;
        }
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            if (start_target_doc_content || selected_comment_index > -1) {
                this.drawingObjects.drawingObjects.showDrawingObjects(true);
            }
            if (this.drawingObjects.drawingObjects && this.drawingObjects.drawingObjects.cSld) {
                this.drawingObjects.stX = x;
                this.drawingObjects.stY = y;
                this.drawingObjects.selectionRect = {
                    x: x,
                    y: y,
                    w: 0,
                    h: 0
                };
                this.drawingObjects.changeCurrentState(new TrackSelectionRect(this.drawingObjects));
            }
        }
        return null;
    },
    onMouseMove: function (e, x, y, pageIndex) {},
    onMouseUp: function (e, x, y, pageIndex) {}
};
function TrackSelectionRect(drawingObjects) {
    this.drawingObjects = drawingObjects;
}
TrackSelectionRect.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                cursorType: "default",
                objectId: "1"
            };
        }
        return null;
    },
    onMouseMove: function (e, x, y, pageIndex) {
        this.drawingObjects.selectionRect = {
            x: this.drawingObjects.stX,
            y: this.drawingObjects.stY,
            w: x - this.drawingObjects.stX,
            h: y - this.drawingObjects.stY
        };
        editor.WordControl.m_oDrawingDocument.m_oWordControl.OnUpdateOverlay(true);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        var _glyph_index;
        var _glyphs_array = this.drawingObjects.getDrawingArray();
        var _glyph, _glyph_transform;
        var _xlt, _ylt, _xrt, _yrt, _xrb, _yrb, _xlb, _ylb;
        var _rect_l = Math.min(this.drawingObjects.selectionRect.x, this.drawingObjects.selectionRect.x + this.drawingObjects.selectionRect.w);
        var _rect_r = Math.max(this.drawingObjects.selectionRect.x, this.drawingObjects.selectionRect.x + this.drawingObjects.selectionRect.w);
        var _rect_t = Math.min(this.drawingObjects.selectionRect.y, this.drawingObjects.selectionRect.y + this.drawingObjects.selectionRect.h);
        var _rect_b = Math.max(this.drawingObjects.selectionRect.y, this.drawingObjects.selectionRect.y + this.drawingObjects.selectionRect.h);
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
                this.drawingObjects.selectObject(_glyph, pageIndex);
            }
        }
        this.drawingObjects.selectionRect = null;
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        editor.WordControl.m_oDrawingDocument.m_oWordControl.OnUpdateOverlay(true);
        editor.WordControl.m_oLogicDocument.Document_UpdateInterfaceState();
    }
};
function PreChangeAdjState(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
PreChangeAdjState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ChangeAdjState(this.drawingObjects, this.majorObject));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function ChangeAdjState(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
ChangeAdjState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject && this.majorObject.Get_Id(),
                bMarker: true,
                cursorType: "crosshair"
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var t = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.getDrawingDocument());
        this.drawingObjects.arrTrackObjects[0].track(t.x, t.y);
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (this.drawingObjects.isViewMode() === false) {
            var track = this.drawingObjects.arrTrackObjects[0];
            var drawingObjects = this.drawingObjects;
            this.drawingObjects.checkSelectedObjectsAndCallback(function () {
                track.trackEnd();
                drawingObjects.startRecalculate();
            },
            [], false, historydescription_CommonDrawings_ChangeAdj);
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function PreRotateState(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
PreRotateState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new RotateState(this.drawingObjects, this.majorObject));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function RotateState(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
RotateState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject && this.majorObject.Get_Id(),
                bMarker: true,
                cursorType: "crosshair"
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.getDrawingDocument());
        this.drawingObjects.handleRotateTrack(e, coords.x, coords.y);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (this.drawingObjects.isViewMode() === false) {
            var tracks = [].concat(this.drawingObjects.arrTrackObjects);
            var group = this.group;
            var drawingObjects = this.drawingObjects;
            var oThis = this;
            if (e.CtrlKey && this instanceof MoveState && !(asc["editor"] && asc["editor"].isChartEditor === true)) {
                var i, copy;
                this.drawingObjects.resetSelection();
                History.Create_NewPoint(historydescription_CommonStatesRotate);
                for (i = 0; i < tracks.length; ++i) {
                    copy = tracks[i].originalObject.copy();
                    this.drawingObjects.drawingObjects.getWorksheetModel && copy.setWorksheet(this.drawingObjects.drawingObjects.getWorksheetModel());
                    if (this.drawingObjects.drawingObjects && this.drawingObjects.drawingObjects.cSld) {
                        copy.setParent2(this.drawingObjects.drawingObjects);
                        if (!copy.spPr || !copy.spPr.xfrm || (copy.getObjectType() === historyitem_type_GroupShape && !copy.spPr.xfrm.isNotNullForGroup() || copy.getObjectType() !== historyitem_type_GroupShape && !copy.spPr.xfrm.isNotNull())) {
                            copy.recalculateTransform();
                        }
                    }
                    copy.addToDrawingObjects();
                    tracks[i].originalObject = copy;
                    tracks[i].trackEnd(false);
                    this.drawingObjects.selectObject(copy, 0);
                    if (! (this.drawingObjects.drawingObjects && this.drawingObjects.drawingObjects.cSld)) {
                        ExecuteNoHistory(function () {
                            drawingObjects.checkSelectedObjectsAndCallback(function () {},
                            []);
                        },
                        this, []);
                    } else {
                        this.drawingObjects.startRecalculate();
                        this.drawingObjects.drawingObjects.sendGraphicObjectProps();
                    }
                }
            } else {
                this.drawingObjects.checkSelectedObjectsAndCallback(function () {
                    var i;
                    if (e.CtrlKey && oThis instanceof MoveInGroupState) {
                        group.resetSelection();
                        for (i = 0; i < tracks.length; ++i) {
                            var copy = tracks[i].originalObject.copy();
                            oThis.drawingObjects.drawingObjects.getWorksheetModel && copy.setWorksheet(oThis.drawingObjects.drawingObjects.getWorksheetModel());
                            if (oThis.drawingObjects.drawingObjects && oThis.drawingObjects.drawingObjects.cSld) {
                                copy.setParent2(oThis.drawingObjects.drawingObjects);
                            }
                            copy.setGroup(tracks[i].originalObject.group);
                            copy.group.addToSpTree(copy.group.length, copy);
                            tracks[i].originalObject = copy;
                            tracks[i].trackEnd(false);
                            group.selectObject(copy, 0);
                        }
                    } else {
                        for (i = 0; i < tracks.length; ++i) {
                            tracks[i].trackEnd(false);
                        }
                    }
                    if (group) {
                        group.updateCoordinatesAfterInternalResize();
                    }
                    if (!oThis.drawingObjects.drawingObjects || !oThis.drawingObjects.drawingObjects.cSld) {
                        var arr_x = [],
                        arr_y = [],
                        transform,
                        min_x,
                        min_y,
                        drawing,
                        arr_x2 = [],
                        arr_y2 = [],
                        min_x2,
                        min_y2;
                        for (i = 0; i < oThis.drawingObjects.selectedObjects.length; ++i) {
                            arr_x.length = 0;
                            arr_y.length = 0;
                            drawing = oThis.drawingObjects.selectedObjects[i];
                            drawing.recalculateTransform();
                            transform = drawing.transform;
                            arr_x.push(transform.TransformPointX(0, 0));
                            arr_y.push(transform.TransformPointY(0, 0));
                            arr_x.push(transform.TransformPointX(drawing.spPr.xfrm.extX, 0));
                            arr_y.push(transform.TransformPointY(drawing.spPr.xfrm.extX, 0));
                            arr_x.push(transform.TransformPointX(drawing.spPr.xfrm.extX, drawing.spPr.xfrm.extY));
                            arr_y.push(transform.TransformPointY(drawing.spPr.xfrm.extX, drawing.spPr.xfrm.extY));
                            arr_x.push(transform.TransformPointX(0, drawing.spPr.xfrm.extY));
                            arr_y.push(transform.TransformPointY(0, drawing.spPr.xfrm.extY));
                            arr_x2.push(drawing.spPr.xfrm.offX + drawing.spPr.xfrm.extX);
                            arr_y2.push(drawing.spPr.xfrm.offY + drawing.spPr.xfrm.extY);
                            min_x = Math.min(Math.min.apply(Math, arr_x), drawing.spPr.xfrm.offX);
                            min_y = Math.min(Math.min.apply(Math, arr_y), drawing.spPr.xfrm.offY);
                            if (min_x < 0) {
                                drawing.spPr.xfrm.setOffX(drawing.spPr.xfrm.offX - min_x);
                            }
                            if (min_y < 0) {
                                drawing.spPr.xfrm.setOffY(drawing.spPr.xfrm.offY - min_y);
                            }
                            drawing.checkDrawingBaseCoords();
                        }
                        oThis.drawingObjects.drawingObjects.checkGraphicObjectPosition(0, 0, Math.max.apply(Math, arr_x2), Math.max.apply(Math, arr_y2));
                    }
                },
                [], false, historydescription_CommonDrawings_EndTrack);
            }
        }
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
    }
};
function PreResizeState(drawingObjects, majorObject, cardDirection) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;
    this.handleNum = this.majorObject.getNumByCardDirection(cardDirection);
}
PreResizeState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ResizeState(this.drawingObjects, this.majorObject, this.handleNum, this.cardDirection));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function ResizeState(drawingObjects, majorObject, handleNum, cardDirection) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.handleNum = handleNum;
    this.cardDirection = cardDirection;
}
ResizeState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject.Get_Id(),
                cursorType: "crosshair",
                bMarker: true
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.getDrawingDocument());
        var resize_coef = this.majorObject.getResizeCoefficients(this.handleNum, coords.x, coords.y);
        this.drawingObjects.trackResizeObjects(resize_coef.kd1, resize_coef.kd2, e);
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: RotateState.prototype.onMouseUp
};
function PreMoveState(drawingObjects, startX, startY, shift, ctrl, majorObject, majorObjectIsSelected, bInside) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.startX = startX;
    this.startY = startY;
    this.shift = shift;
    this.ctrl = ctrl;
    this.majorObjectIsSelected = majorObjectIsSelected;
    this.bInside = bInside;
}
PreMoveState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        if (Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA || pageIndex !== this.majorObject.selectStartPage) {
            this.drawingObjects.swapTrackObjects();
            this.drawingObjects.changeCurrentState(new MoveState(this.drawingObjects, this.majorObject, this.startX, this.startY));
            this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
        }
    },
    onMouseUp: function (e, x, y, pageIndex) {
        return handleMouseUpPreMoveState(this.drawingObjects, e, x, y, pageIndex, true);
    }
};
function MoveState(drawingObjects, majorObject, startX, startY) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.startX = startX;
    this.startY = startY;
    var arr_x = [],
    arr_y = [];
    for (var i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
        var track = this.drawingObjects.arrTrackObjects[i];
        var transform = track.originalObject.transform;
        arr_x.push(transform.TransformPointX(0, 0));
        arr_y.push(transform.TransformPointY(0, 0));
        arr_x.push(transform.TransformPointX(track.originalObject.extX, 0));
        arr_y.push(transform.TransformPointY(track.originalObject.extX, 0));
        arr_x.push(transform.TransformPointX(track.originalObject.extX, track.originalObject.extY));
        arr_y.push(transform.TransformPointY(track.originalObject.extX, track.originalObject.extY));
        arr_x.push(transform.TransformPointX(0, track.originalObject.extY));
        arr_y.push(transform.TransformPointY(0, track.originalObject.extY));
    }
    this.rectX = Math.min.apply(Math, arr_x);
    this.rectY = Math.min.apply(Math, arr_y);
    this.rectW = Math.max.apply(Math, arr_x) - this.rectX;
    this.rectH = Math.max.apply(Math, arr_y) - this.rectY;
}
MoveState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject.Get_Id(),
                cursorType: "move",
                bMarker: true
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var _arr_track_objects = this.drawingObjects.arrTrackObjects;
        var _objects_count = _arr_track_objects.length;
        var _object_index;
        var result_x, result_y;
        if (!e.ShiftKey) {
            result_x = x;
            result_y = y;
        } else {
            var abs_dist_x = Math.abs(this.startX - x);
            var abs_dist_y = Math.abs(this.startY - y);
            if (abs_dist_x > abs_dist_y) {
                result_x = x;
                result_y = this.startY;
            } else {
                result_x = this.startX;
                result_y = y;
            }
        }
        var tr_to_start_page_x;
        var tr_to_start_page_y;
        var t = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.getDrawingDocument());
        var startPos = {
            x: this.startX,
            y: this.startY
        };
        var start_arr = this.drawingObjects.getAllObjectsOnPage(0);
        var min_dx = null,
        min_dy = null;
        var dx, dy;
        var snap_x = null,
        snap_y = null;
        var snapHorArray = [],
        snapVerArray = [];
        if (result_x === this.startX) {
            min_dx = 0;
        } else {
            for (var track_index = 0; track_index < _arr_track_objects.length; ++track_index) {
                var cur_track_original_shape = _arr_track_objects[track_index].originalObject;
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
                if (start_arr.length > 0) {
                    for (var snap_index = 0; snap_index < trackSnapArrayX.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceXObject(trackSnapArrayX[snap_index] + curDX, start_arr);
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
            }
        }
        if (result_y === this.startY) {
            min_dy = 0;
        } else {
            for (track_index = 0; track_index < _arr_track_objects.length; ++track_index) {
                cur_track_original_shape = _arr_track_objects[track_index].originalObject;
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
                if (start_arr.length > 0) {
                    for (snap_index = 0; snap_index < trackSnapArrayY.length; ++snap_index) {
                        var snap_obj = GetMinSnapDistanceYObject(trackSnapArrayY[snap_index] + curDY, start_arr);
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
            if (isRealNumber(snap_x) && this.drawingObjects.drawingObjects.cSld) {
                this.drawingObjects.getDrawingDocument().DrawVerAnchor(pageIndex, snap_x);
            }
        }
        if (min_dy === null || Math.abs(min_dy) > SNAP_DISTANCE) {
            min_dy = 0;
        } else {
            if (isRealNumber(snap_y) && this.drawingObjects.drawingObjects.cSld) {
                this.drawingObjects.getDrawingDocument().DrawHorAnchor(pageIndex, snap_y);
            }
        }
        var tx = result_x - this.startX + min_dx,
        ty = result_y - this.startY + min_dy;
        var check_position = this.drawingObjects.drawingObjects.checkGraphicObjectPosition(this.rectX + tx, this.rectY + ty, this.rectW, this.rectH);
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _arr_track_objects[_object_index].track(tx + check_position.x, ty + check_position.y, pageIndex);
        }
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: RotateState.prototype.onMouseUp
};
function PreMoveInGroupState(drawingObjects, group, startX, startY, ShiftKey, CtrlKey, majorObject, majorObjectIsSelected) {
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    this.ShiftKey = ShiftKey;
    this.CtrlKey = CtrlKey;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = majorObjectIsSelected;
}
PreMoveInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        if (Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA || pageIndex !== this.majorObject.selectStartPage) {
            this.drawingObjects.swapTrackObjects();
            this.drawingObjects.changeCurrentState(new MoveInGroupState(this.drawingObjects, this.majorObject, this.group, this.startX, this.startY));
            this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
        }
    },
    onMouseUp: function (e, x, y, pageIndex) {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function MoveInGroupState(drawingObjects, majorObject, group, startX, startY) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.group = group;
    this.startX = startX;
    this.startY = startY;
    var arr_x = [],
    arr_y = [];
    for (var i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
        var track = this.drawingObjects.arrTrackObjects[i];
        var transform = track.originalObject.transform;
        arr_x.push(transform.TransformPointX(0, 0));
        arr_y.push(transform.TransformPointY(0, 0));
        arr_x.push(transform.TransformPointX(track.originalObject.extX, 0));
        arr_y.push(transform.TransformPointY(track.originalObject.extX, 0));
        arr_x.push(transform.TransformPointX(track.originalObject.extX, track.originalObject.extY));
        arr_y.push(transform.TransformPointY(track.originalObject.extX, track.originalObject.extY));
        arr_x.push(transform.TransformPointX(0, track.originalObject.extY));
        arr_y.push(transform.TransformPointY(0, track.originalObject.extY));
    }
    this.rectX = Math.min.apply(Math, arr_x);
    this.rectY = Math.min.apply(Math, arr_y);
    this.rectW = Math.max.apply(Math, arr_x);
    this.rectH = Math.max.apply(Math, arr_y);
}
MoveInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject.Get_Id(),
                cursorType: "move",
                bMarker: true
            };
        }
    },
    onMouseMove: MoveState.prototype.onMouseMove,
    onMouseUp: MoveState.prototype.onMouseUp
};
function PreRotateInGroupState(drawingObjects, group, majorObject) {
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
}
PreRotateInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new RotateInGroupState(this.drawingObjects, this.group, this.majorObject));
    },
    onMouseUp: PreMoveInGroupState.prototype.onMouseUp
};
function RotateInGroupState(drawingObjects, group, majorObject) {
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
}
RotateInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject.Get_Id(),
                cursorType: "crosshair",
                bMarker: true
            };
        }
    },
    onMouseMove: RotateState.prototype.onMouseMove,
    onMouseUp: MoveInGroupState.prototype.onMouseUp
};
function PreResizeInGroupState(drawingObjects, group, majorObject, cardDirection) {
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.cardDirection = cardDirection;
}
PreResizeInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ResizeInGroupState(this.drawingObjects, this.group, this.majorObject, this.majorObject.getNumByCardDirection(this.cardDirection), this.cardDirection));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },
    onMouseUp: PreMoveInGroupState.prototype.onMouseUp
};
function ResizeInGroupState(drawingObjects, group, majorObject, handleNum, cardDirection) {
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = majorObject;
    this.handleNum = handleNum;
    this.cardDirection = cardDirection;
}
ResizeInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject.Get_Id(),
                cursorType: "crosshair",
                bMarker: true
            };
        }
    },
    onMouseMove: ResizeState.prototype.onMouseMove,
    onMouseUp: MoveInGroupState.prototype.onMouseUp
};
function PreChangeAdjInGroupState(drawingObjects, group) {
    this.drawingObjects = drawingObjects;
    this.group = group;
}
PreChangeAdjInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ChangeAdjInGroupState(this.drawingObjects, this.group));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },
    onMouseUp: PreMoveInGroupState.prototype.onMouseUp
};
function ChangeAdjInGroupState(drawingObjects, group) {
    this.drawingObjects = drawingObjects;
    this.group = group;
    this.majorObject = drawingObjects.arrTrackObjects[0].originalShape;
}
ChangeAdjInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject.Get_Id(),
                cursorType: "crosshair",
                bMarker: true
            };
        }
    },
    onMouseMove: ChangeAdjState.prototype.onMouseMove,
    onMouseUp: MoveInGroupState.prototype.onMouseUp
};
function TextAddState(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
TextAddState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: this.majorObject.Id,
                cursorType: "text"
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.majorObject.selectionSetEnd(e, x, y, pageIndex);
        if (! (this.majorObject.getObjectType() === historyitem_type_GraphicFrame && this.majorObject.graphicObject.Selection.Type2 === table_Selection_Border)) {
            this.drawingObjects.updateSelectionState();
        }
    },
    onMouseUp: function (e, x, y, pageIndex) {
        this.majorObject.selectionSetEnd(e, x, y, pageIndex);
        this.drawingObjects.updateSelectionState();
        this.drawingObjects.drawingObjects.sendGraphicObjectProps();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        this.drawingObjects.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        this.drawingObjects.noNeedUpdateCursorType = true;
        var cursor_type = this.drawingObjects.onMouseDown(e, x, y, pageIndex);
        if (cursor_type && cursor_type.hyperlink) {
            this.drawingObjects.drawingObjects.showDrawingObjects(true);
        }
        this.drawingObjects.noNeedUpdateCursorType = false;
        this.drawingObjects.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        if (editor && editor.isPaintFormat) {
            this.drawingObjects.paragraphFormatPaste2();
            editor.sync_PaintFormatCallback(0);
        }
    }
};
function SplineBezierState(drawingObjects) {
    this.drawingObjects = drawingObjects;
    this.polylineFlag = true;
}
SplineBezierState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        this.drawingObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.addTrackObject(new Spline(this.drawingObjects, this.drawingObjects.getTheme(), null, null, null, pageIndex));
        this.drawingObjects.arrTrackObjects[0].path.push(new SplineCommandMoveTo(x, y));
        this.drawingObjects.changeCurrentState(new SplineBezierState33(this.drawingObjects, x, y, pageIndex));
        this.drawingObjects.checkChartTextSelection();
        this.drawingObjects.resetSelection();
        this.drawingObjects.updateOverlay();
    },
    onMouseMove: function (e, X, Y, pageIndex) {},
    onMouseUp: function (e, X, Y, pageIndex) {
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        this.drawingObjects.curState.updateAnchorPos();
    }
};
function SplineBezierState33(drawingObjects, startX, startY, pageIndex) {
    this.drawingObjects = drawingObjects;
    this.polylineFlag = true;
    this.pageIndex = pageIndex;
}
SplineBezierState33.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        var startPos = this.drawingObjects.startTrackPos;
        if (startPos.x === x && startPos.y === y && startPos.pageIndex === pageIndex) {
            return;
        }
        var tr_x, tr_y;
        if (pageIndex === startPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, startPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        this.drawingObjects.arrTrackObjects[0].path.push(new SplineCommandLineTo(tr_x, tr_y));
        this.drawingObjects.changeCurrentState(new SplineBezierState2(this.drawingObjects, this.pageIndex));
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {}
};
function SplineBezierState2(drawingObjects, pageIndex) {
    this.drawingObjects = drawingObjects;
    this.polylineFlag = true;
    this.pageIndex = pageIndex;
}
SplineBezierState2.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        if (e.ClickCount >= 2) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        var startPos = this.drawingObjects.startTrackPos;
        var tr_x, tr_y;
        if (pageIndex === startPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, startPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        this.drawingObjects.arrTrackObjects[0].path[1].changeLastPoint(tr_x, tr_y);
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (e.ClickCount < 2) {
            var tr_x, tr_y;
            if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
                tr_x = x;
                tr_y = y;
            } else {
                var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
                tr_x = tr_point.x;
                tr_y = tr_point.y;
            }
            this.drawingObjects.changeCurrentState(new SplineBezierState3(this.drawingObjects, tr_x, tr_y, this.pageIndex));
        }
    }
};
function SplineBezierState3(drawingObjects, startX, startY, pageIndex) {
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.polylineFlag = true;
    this.pageIndex = pageIndex;
}
SplineBezierState3.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        if (e.ClickCount >= 2) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (x === this.startX && y === this.startY && pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            return;
        }
        var tr_x, tr_y;
        if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        var x0, y0, x1, y1, x2, y2, x3, y3, x4, y4, x5, y5, x6, y6;
        var spline = this.drawingObjects.arrTrackObjects[0];
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
        this.drawingObjects.updateOverlay();
        this.drawingObjects.changeCurrentState(new SplineBezierState4(this.drawingObjects, this.pageIndex));
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (e.ClickCount >= 2) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    }
};
function SplineBezierState4(drawingObjects, pageIndex) {
    this.drawingObjects = drawingObjects;
    this.polylineFlag = true;
    this.pageIndex = pageIndex;
}
SplineBezierState4.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        if (e.ClickCount >= 2) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        var spline = this.drawingObjects.arrTrackObjects[0];
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
        if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (e.ClickCount < 2) {
            var tr_x, tr_y;
            if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
                tr_x = x;
                tr_y = y;
            } else {
                var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
                tr_x = tr_point.X;
                tr_y = tr_point.Y;
            }
            this.drawingObjects.changeCurrentState(new SplineBezierState5(this.drawingObjects, tr_x, tr_y, this.pageIndex));
        }
    }
};
function SplineBezierState5(drawingObjects, startX, startY, pageIndex) {
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.polylineFlag = true;
    this.pageIndex = pageIndex;
}
SplineBezierState5.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        if (e.ClickCount >= 2) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (x === this.startX && y === this.startY && pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            return;
        }
        var spline = this.drawingObjects.arrTrackObjects[0];
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
        if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
        this.drawingObjects.updateOverlay();
        this.drawingObjects.changeCurrentState(new SplineBezierState4(this.drawingObjects, this.pageIndex));
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (e.ClickCount >= 2) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    }
};
function PolyLineAddState(drawingObjects) {
    this.drawingObjects = drawingObjects;
    this.polylineFlag = true;
}
PolyLineAddState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        this.drawingObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.addTrackObject(new PolyLine(this.drawingObjects, this.drawingObjects.getTheme(), null, null, null, pageIndex));
        this.drawingObjects.arrTrackObjects[0].arrPoint.push({
            x: x,
            y: y
        });
        this.drawingObjects.checkChartTextSelection();
        this.drawingObjects.resetSelection();
        this.drawingObjects.updateOverlay();
        var _min_distance = this.drawingObjects.convertPixToMM(1);
        this.drawingObjects.changeCurrentState(new PolyLineAddState2(this.drawingObjects, _min_distance));
    },
    onMouseMove: function () {},
    onMouseUp: function () {
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function PolyLineAddState2(drawingObjects, minDistance) {
    this.drawingObjects = drawingObjects;
    this.minDistance = minDistance;
    this.polylineFlag = true;
}
PolyLineAddState2.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        var _last_point = this.drawingObjects.arrTrackObjects[0].arrPoint[this.drawingObjects.arrTrackObjects[0].arrPoint.length - 1];
        var tr_x, tr_y;
        if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        var dx = tr_x - _last_point.x;
        var dy = tr_y - _last_point.y;
        if (Math.sqrt(dx * dx + dy * dy) >= this.minDistance) {
            this.drawingObjects.arrTrackObjects[0].arrPoint.push({
                x: tr_x,
                y: tr_y
            });
            this.drawingObjects.updateOverlay();
        }
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (this.drawingObjects.arrTrackObjects[0].arrPoint.length > 1) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        } else {
            this.drawingObjects.clearTrackObjects();
            this.drawingObjects.updateOverlay();
            this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        }
    }
};
function AddPolyLine2State(drawingObjects) {
    this.drawingObjects = drawingObjects;
    this.polylineFlag = true;
}
AddPolyLine2State.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        this.drawingObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        this.drawingObjects.checkChartTextSelection();
        this.drawingObjects.resetSelection();
        this.drawingObjects.updateOverlay();
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.addTrackObject(new PolyLine(this.drawingObjects, this.drawingObjects.getTheme(), null, null, null, pageIndex));
        this.drawingObjects.arrTrackObjects[0].arrPoint.push({
            x: x,
            y: y
        });
        this.drawingObjects.changeCurrentState(new AddPolyLine2State2(this.drawingObjects, x, y));
    },
    onMouseMove: function (e, x, y, pageIndex) {},
    onMouseUp: function (e, x, y, pageIndex) {}
};
function AddPolyLine2State2(drawingObjects, x, y) {
    this.drawingObjects = drawingObjects;
    this.X = x;
    this.Y = y;
    this.polylineFlag = true;
}
AddPolyLine2State2.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        if (e.ClickCount > 1) {
            this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (this.X !== x || this.Y !== y || this.drawingObjects.startTrackPos.pageIndex !== pageIndex) {
            var tr_x, tr_y;
            if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
                tr_x = x;
                tr_y = y;
            } else {
                var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
                tr_x = tr_point.X;
                tr_y = tr_point.Y;
            }
            this.drawingObjects.arrTrackObjects[0].arrPoint.push({
                x: tr_x,
                y: tr_y
            });
            this.drawingObjects.changeCurrentState(new AddPolyLine2State3(this.drawingObjects));
        }
    },
    onMouseUp: function (e, x, y, pageIndex) {}
};
function AddPolyLine2State3(drawingObjects) {
    this.drawingObjects = drawingObjects;
    this.minSize = drawingObjects.convertPixToMM(1);
    this.polylineFlag = true;
}
AddPolyLine2State3.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: "1",
                bMarker: true
            };
        }
        var tr_x, tr_y;
        if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        this.drawingObjects.arrTrackObjects[0].arrPoint.push({
            x: tr_x,
            y: tr_y
        });
        if (e.ClickCount > 1) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        var tr_x, tr_y;
        if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.getDrawingDocument().ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
            tr_x = tr_point.X;
            tr_y = tr_point.Y;
        }
        if (!e.IsLocked) {
            this.drawingObjects.arrTrackObjects[0].arrPoint[this.drawingObjects.arrTrackObjects[0].arrPoint.length - 1] = {
                x: tr_x,
                y: tr_y
            };
        } else {
            var _last_point = this.drawingObjects.arrTrackObjects[0].arrPoint[this.drawingObjects.arrTrackObjects[0].arrPoint.length - 1];
            var dx = tr_x - _last_point.x;
            var dy = tr_y - _last_point.y;
            if (Math.sqrt(dx * dx + dy * dy) >= this.minSize) {
                this.drawingObjects.arrTrackObjects[0].arrPoint.push({
                    x: tr_x,
                    y: tr_y
                });
            }
        }
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (e.ClickCount > 1) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    }
};