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
var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
var contentchanges_Add = 1;
var contentchanges_Remove = 2;
var HANDLE_EVENT_MODE_HANDLE = 0;
var HANDLE_EVENT_MODE_CURSOR = 1;
var global_canvas = null;
function checkInternalSelection(selection) {
    return !! (selection.groupSelection || selection.chartSelection || selection.textSelection);
}
function CheckLinePreset(preset) {
    return preset === "line";
}
function CheckLinePresetForParagraphAdd(preset) {
    return preset === "line" || preset === "bentConnector2" || preset === "bentConnector3" || preset === "bentConnector4" || preset === "bentConnector5" || preset === "curvedConnector2" || preset === "curvedConnector3" || preset === "curvedConnector4" || preset === "curvedConnector5" || preset === "straightConnector1";
}
function CompareGroups(a, b) {
    if (a.group == null && b.group == null) {
        return 0;
    }
    if (a.group == null) {
        return 1;
    }
    if (b.group == null) {
        return -1;
    }
    var count1 = 0;
    var cur_group = a.group;
    while (cur_group != null) {
        ++count1;
        cur_group = cur_group.group;
    }
    var count2 = 0;
    cur_group = b.group;
    while (cur_group != null) {
        ++count2;
        cur_group = cur_group.group;
    }
    return count1 - count2;
}
function CheckSpPrXfrm(object) {
    if (!object.spPr) {
        object.setSpPr(new CSpPr());
        object.spPr.setParent(object);
    }
    if (!object.spPr.xfrm) {
        object.spPr.setXfrm(new CXfrm());
        object.spPr.xfrm.setParent(object.spPr);
        object.spPr.xfrm.setOffX(object.x);
        object.spPr.xfrm.setOffY(object.y);
        object.spPr.xfrm.setExtX(object.extX);
        object.spPr.xfrm.setExtY(object.extY);
    }
}
function CheckSpPrXfrm2(object) {
    if (!object) {
        return;
    }
    if (!object.spPr) {
        object.spPr = new CSpPr();
        object.spPr.parent = object;
    }
    if (!object.spPr.xfrm) {
        object.spPr.xfrm = new CXfrm();
        object.spPr.xfrm.parent = object.spPr;
        object.spPr.xfrm.offX = 0;
        object.spPr.xfrm.offY = 0;
        object.spPr.xfrm.extX = object.extX;
        object.spPr.xfrm.extY = object.extY;
    }
}
function checkNormalRotate(rot) {
    var _rot = normalizeRotate(rot);
    return (_rot >= 0 && _rot < Math.PI * 0.25) || (_rot >= 3 * Math.PI * 0.25 && _rot < 5 * Math.PI * 0.25) || (_rot >= 7 * Math.PI * 0.25 && _rot < 2 * Math.PI);
}
function getObjectsByTypesFromArr(arr, bGrouped) {
    var ret = {
        shapes: [],
        images: [],
        groups: [],
        charts: [],
        tables: []
    };
    var selected_objects = arr;
    for (var i = 0; i < selected_objects.length; ++i) {
        var drawing = selected_objects[i];
        var type = drawing.getObjectType();
        switch (type) {
        case historyitem_type_Shape:
            ret.shapes.push(drawing);
            break;
        case historyitem_type_ImageShape:
            ret.images.push(drawing);
            break;
        case historyitem_type_GroupShape:
            ret.groups.push(drawing);
            if (bGrouped) {
                var by_types = getObjectsByTypesFromArr(drawing.spTree, true);
                ret.shapes = ret.shapes.concat(by_types.shapes);
                ret.images = ret.images.concat(by_types.images);
                ret.charts = ret.charts.concat(by_types.charts);
                ret.tables = ret.tables.concat(by_types.charts);
            }
            break;
        case historyitem_type_ChartSpace:
            ret.charts.push(drawing);
            break;
        case historyitem_type_GraphicFrame:
            ret.tables.push(drawing);
            break;
        }
    }
    return ret;
}
function CreateBlipFillUniFillFromUrl(url) {
    var ret = new CUniFill();
    ret.setFill(new CBlipFill());
    ret.fill.setRasterImageId(url);
    return ret;
}
function getTargetTextObject(controller) {
    if (controller.selection.textSelection) {
        return controller.selection.textSelection;
    } else {
        if (controller.selection.groupSelection) {
            if (controller.selection.groupSelection.selection.textSelection) {
                return controller.selection.groupSelection.selection.textSelection;
            } else {
                if (controller.selection.groupSelection.selection.chartSelection && controller.selection.groupSelection.selection.chartSelection.selection.textSelection) {
                    return controller.selection.groupSelection.selection.chartSelection.selection.textSelection;
                }
            }
        } else {
            if (controller.selection.chartSelection && controller.selection.chartSelection.selection.textSelection) {
                return controller.selection.chartSelection.selection.textSelection;
            }
        }
    }
    return null;
}
function DrawingObjectsController(drawingObjects) {
    this.drawingObjects = drawingObjects;
    this.curState = new NullState(this);
    this.selectedObjects = [];
    this.drawingDocument = drawingObjects.drawingDocument;
    this.selection = {
        selectedObjects: [],
        groupSelection: null,
        chartSelection: null,
        textSelection: null
    };
    this.arrPreTrackObjects = [];
    this.arrTrackObjects = [];
    this.objectsForRecalculate = {};
    this.chartForProps = null;
    this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
}
DrawingObjectsController.prototype = {
    canReceiveKeyPress: function () {
        return this.curState instanceof NullState;
    },
    handleAdjustmentHit: function (hit, selectedObject, group, pageIndex, bWord) {
        if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            this.arrPreTrackObjects.length = 0;
            if (hit.adjPolarFlag === false) {
                this.arrPreTrackObjects.push(new XYAdjustmentTrack(selectedObject, hit.adjNum));
            } else {
                this.arrPreTrackObjects.push(new PolarAdjustmentTrack(selectedObject, hit.adjNum));
            }
            if (!isRealObject(group)) {
                this.changeCurrentState(new PreChangeAdjState(this, selectedObject));
            } else {
                this.changeCurrentState(new PreChangeAdjInGroupState(this, group));
            }
            return true;
        } else {
            if (!isRealObject(group)) {
                return {
                    objectId: selectedObject.Get_Id(),
                    cursorType: "crosshair",
                    bMarker: true
                };
            } else {
                return {
                    objectId: selectedObject.Get_Id(),
                    cursorType: "crosshair",
                    bMarker: true
                };
            }
        }
    },
    handleSlideComments: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            return {
                result: null,
                selectedIndex: -1
            };
        } else {
            return {
                result: false,
                selectedIndex: -1
            };
        }
    },
    checkChartForProps: function (bStart) {
        if (bStart) {
            this.chartForProps = this.getSelectionState();
            this.resetSelection();
            this.drawingObjects.getWorksheet().arrActiveChartsRanges = [];
            var oldIsStartAdd = window["Asc"]["editor"].isStartAddShape;
            window["Asc"]["editor"].isStartAddShape = true;
            this.updateOverlay();
            window["Asc"]["editor"].isStartAddShape = oldIsStartAdd;
        } else {
            this.setSelectionState(this.chartForProps, this.chartForProps.length - 1);
            this.updateOverlay();
            this.drawingObjects.getWorksheet().setSelectionShape(true);
            this.chartForProps = null;
        }
    },
    resetInternalSelection: function (noResetContentSelect) {
        if (this.selection.groupSelection) {
            this.selection.groupSelection.resetSelection(this);
            this.selection.groupSelection = null;
        }
        if (this.selection.textSelection) {
            if (! (noResetContentSelect === true)) {
                if (this.selection.textSelection.getObjectType() === historyitem_type_GraphicFrame) {
                    if (this.selection.textSelection.graphicObject) {
                        this.selection.textSelection.graphicObject.Selection_Remove();
                    }
                } else {
                    var content = this.selection.textSelection.getDocContent();
                    content && content.Selection_Remove();
                }
            }
            this.selection.textSelection = null;
        }
        if (this.selection.chartSelection) {
            this.selection.chartSelection.resetSelection(noResetContentSelect);
            this.selection.chartSelection = null;
        }
        if (this.selection.wrapPolygonSelection) {
            this.selection.wrapPolygonSelection = null;
        }
    },
    handleHandleHit: function (hit, selectedObject, group, pageIndex, bWord) {
        if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            var selected_objects = group ? group.selectedObjects : this.selectedObjects;
            this.arrPreTrackObjects.length = 0;
            if (hit === 8) {
                if (selectedObject.canRotate()) {
                    for (var i = 0; i < selected_objects.length; ++i) {
                        if (selected_objects[i].canRotate()) {
                            this.arrPreTrackObjects.push(selected_objects[i].createRotateTrack());
                        }
                    }
                    if (!isRealObject(group)) {
                        this.resetInternalSelection();
                        this.changeCurrentState(new PreRotateState(this, selectedObject));
                    } else {
                        group.resetInternalSelection();
                        this.changeCurrentState(new PreRotateInGroupState(this, group, selectedObject));
                    }
                }
            } else {
                if (selectedObject.canResize()) {
                    var card_direction = selectedObject.getCardDirectionByNum(hit);
                    for (var j = 0; j < selected_objects.length; ++j) {
                        if (selected_objects[j].canResize()) {
                            this.arrPreTrackObjects.push(selected_objects[j].createResizeTrack(card_direction));
                        }
                    }
                    if (!isRealObject(group)) {
                        this.resetInternalSelection();
                        this.changeCurrentState(new PreResizeState(this, selectedObject, card_direction));
                    } else {
                        group.resetInternalSelection();
                        this.changeCurrentState(new PreResizeInGroupState(this, group, selectedObject, card_direction));
                    }
                }
            }
            return true;
        } else {
            var card_direction = selectedObject.getCardDirectionByNum(hit);
            return {
                objectId: selectedObject.Get_Id(),
                cursorType: hit === 8 ? "crosshair" : CURSOR_TYPES_BY_CARD_DIRECTION[card_direction],
                bMarker: true
            };
        }
    },
    handleMoveHit: function (object, e, x, y, group, bInSelect, pageIndex, bWord) {
        var b_is_inline;
        if (isRealObject(group)) {
            b_is_inline = group.parent && group.parent.Is_Inline && group.parent.Is_Inline();
        } else {
            b_is_inline = object.parent && object.parent.Is_Inline && object.parent.Is_Inline();
        }
        var b_is_selected_inline = this.selectedObjects.length === 1 && (this.selectedObjects[0].parent && this.selectedObjects[0].parent.Is_Inline && this.selectedObjects[0].parent.Is_Inline());
        if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            var selector = group ? group : this;
            this.checkChartTextSelection();
            if (object.canMove()) {
                this.arrPreTrackObjects.length = 0;
                var is_selected = object.selected;
                var b_check_internal = checkInternalSelection(selector.selection);
                if (! (e.CtrlKey || e.ShiftKey) && !is_selected || b_is_inline || b_is_selected_inline) {
                    selector.resetSelection();
                }
                selector.selectObject(object, pageIndex);
                if (!is_selected || b_check_internal) {
                    this.updateOverlay();
                }
                this.checkSelectedObjectsForMove(group, pageIndex);
                if (!isRealObject(group)) {
                    this.resetInternalSelection();
                    if (!b_is_inline) {
                        this.changeCurrentState(new PreMoveState(this, x, y, e.ShiftKey, e.CtrlKey, object, is_selected, !bInSelect));
                    } else {
                        this.changeCurrentState(new PreMoveInlineObject(this, object, is_selected, true));
                    }
                } else {
                    group.resetInternalSelection();
                    this.changeCurrentState(new PreMoveInGroupState(this, group, x, y, e.ShiftKey, e.CtrlKey, object, is_selected));
                }
                if (e.ClickCount > 1 && !e.ShiftKey && !e.CtrlKey && ((this.selection.groupSelection && this.selection.groupSelection.selectedObjects.length === 1) || this.selectedObjects.length === 1) && object.getObjectType() === historyitem_type_ChartSpace && this.handleChartDoubleClick) {
                    var drawing = this.selectedObjects[0].parent;
                    this.handleChartDoubleClick(drawing, object, e, x, y, pageIndex);
                }
            }
            return true;
        } else {
            return {
                objectId: object.Get_Id(),
                cursorType: "move",
                bMarker: bInSelect
            };
        }
    },
    recalculateCurPos: function () {
        if (this.selection.textSelection) {
            var content = this.selection.textSelection.getDocContent();
            if (content) {
                content.RecalculateCurPos();
            }
        } else {
            if (this.selection.groupSelection) {
                this.selection.groupSelection.recalculateCurPos();
            } else {
                if (this.selection.chartSelection) {
                    this.selection.chartSelection.recalculateCurPos();
                }
            }
        }
    },
    checkSelectedObjectsForMove: function (group, pageIndex) {
        var selected_object = group ? group.selectedObjects : this.selectedObjects;
        var b_check_page = isRealNumber(pageIndex);
        for (var i = 0; i < selected_object.length; ++i) {
            if (selected_object[i].canMove() && (!b_check_page || selected_object[i].selectStartPage === pageIndex)) {
                this.arrPreTrackObjects.push(selected_object[i].createMoveTrack());
            }
        }
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
    handleTextHit: function (object, e, x, y, group, pageIndex, bWord) {
        var content, invert_transform_text, tx, ty, hit_paragraph, par, check_hyperlink;
        if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            if (e.CtrlKey && !this.document) {
                content = object.getDocContent();
                invert_transform_text = object.invertTransformText;
                if (content && invert_transform_text) {
                    tx = invert_transform_text.TransformPointX(x, y);
                    ty = invert_transform_text.TransformPointY(x, y);
                    hit_paragraph = content.Internal_GetContentPosByXY(tx, ty, 0);
                    par = content.Content[hit_paragraph];
                    if (isRealObject(par)) {
                        check_hyperlink = par.Check_Hyperlink(tx, ty, 0);
                        if (!isRealObject(check_hyperlink)) {
                            return this.handleMoveHit(object, e, x, y, group, false, pageIndex, bWord);
                        }
                    } else {
                        return this.handleMoveHit(object, e, x, y, group, false, pageIndex, bWord);
                    }
                } else {
                    return this.handleMoveHit(object, e, x, y, group, false, pageIndex, bWord);
                }
            }
            this.resetSelection(true);
            (group ? group : this).selectObject(object, pageIndex);
            object.selectionSetStart(e, x, y, pageIndex);
            if (!group) {
                this.selection.textSelection = object;
            } else {
                this.selectObject(group, pageIndex);
                this.selection.groupSelection = group;
                group.selection.textSelection = object;
            }
            this.changeCurrentState(new TextAddState(this, object));
            if (e.ClickCount < 2) {
                this.updateSelectionState();
            }
            return true;
        } else {
            var ret = {
                objectId: object.Get_Id(),
                cursorType: "text"
            };
            content = object.getDocContent();
            invert_transform_text = object.invertTransformText;
            if (content && invert_transform_text) {
                tx = invert_transform_text.TransformPointX(x, y);
                ty = invert_transform_text.TransformPointY(x, y);
                if (this.document || (this.drawingObjects.cSld && !(this.noNeedUpdateCursorType === true))) {
                    var nPageIndex = pageIndex;
                    if (this.drawingObjects.cSld && !(this.noNeedUpdateCursorType === true) && isRealNumber(this.drawingObjects.num)) {
                        nPageIndex = this.drawingObjects.num;
                    }
                    content.Update_CursorType(tx, ty, nPageIndex);
                    ret.updated = true;
                } else {
                    if (this.drawingObjects) {
                        hit_paragraph = content.Internal_GetContentPosByXY(tx, ty, 0);
                        par = content.Content[hit_paragraph];
                        if (isRealObject(par)) {
                            check_hyperlink = par.Check_Hyperlink(tx, ty, 0);
                            if (isRealObject(check_hyperlink)) {
                                ret.hyperlink = check_hyperlink;
                            }
                        }
                    }
                }
            }
            return ret;
        }
    },
    handleRotateTrack: function (e, x, y) {
        var angle = this.curState.majorObject.getRotateAngle(x, y);
        this.rotateTrackObjects(angle, e);
        this.updateOverlay();
    },
    getSnapArrays: function () {
        var drawing_objects = this.getDrawingObjects();
        var snapX = [];
        var snapY = [];
        for (var i = 0; i < drawing_objects.length; ++i) {
            if (drawing_objects[i].getSnapArrays) {
                drawing_objects[i].getSnapArrays(snapX, snapY);
            }
        }
        return {
            snapX: snapX,
            snapY: snapY
        };
    },
    getCopyTrackArray: function () {
        var ret = [];
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            ret.push(this.arrTrackObjects[i]);
        }
        return ret;
    },
    drawSelect: function (pageIndex, drawingDocument) {
        var i;
        if (this.selection.textSelection) {
            if (this.selection.textSelection.selectStartPage === pageIndex) {
                drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.textSelection.getTransformMatrix(), 0, 0, this.selection.textSelection.extX, this.selection.textSelection.extY, CheckObjectLine(this.selection.textSelection), this.selection.textSelection.canRotate());
                if (this.selection.textSelection.drawAdjustments) {
                    this.selection.textSelection.drawAdjustments(drawingDocument);
                }
            }
        } else {
            if (this.selection.groupSelection) {
                if (this.selection.groupSelection.selectStartPage === pageIndex) {
                    drawingDocument.DrawTrack(TYPE_TRACK_GROUP_PASSIVE, this.selection.groupSelection.getTransformMatrix(), 0, 0, this.selection.groupSelection.extX, this.selection.groupSelection.extY, false, this.selection.groupSelection.canRotate());
                    if (this.selection.groupSelection.selection.textSelection) {
                        for (i = 0; i < this.selection.groupSelection.selectedObjects.length; ++i) {
                            drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.groupSelection.selectedObjects[i].transform, 0, 0, this.selection.groupSelection.selectedObjects[i].extX, this.selection.groupSelection.selectedObjects[i].extY, CheckObjectLine(this.selection.groupSelection.selectedObjects[i]), this.selection.groupSelection.selectedObjects[i].canRotate());
                        }
                    } else {
                        if (this.selection.groupSelection.selection.chartSelection) {
                            if (this.selection.groupSelection.selection.chartSelection.selectStartPage === pageIndex) {
                                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.getTransformMatrix(), 0, 0, this.selection.groupSelection.selection.chartSelection.extX, this.selection.groupSelection.selection.chartSelection.extY, false, this.selection.groupSelection.selection.chartSelection.canRotate());
                                if (this.selection.groupSelection.selection.chartSelection.selection.textSelection) {
                                    drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.groupSelection.selection.chartSelection.selection.textSelection.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.textSelection.extX, this.selection.groupSelection.selection.chartSelection.selection.textSelection.extY, false, false, true);
                                } else {
                                    if (this.selection.groupSelection.selection.chartSelection.selection.title) {
                                        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.title.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.title.extX, this.selection.groupSelection.selection.chartSelection.selection.title.extY, false, false, true);
                                    } else {
                                        if (this.selection.groupSelection.selection.chartSelection.selection.dataLbls) {
                                            for (i = 0; i < this.selection.groupSelection.selection.chartSelection.selection.dataLbls.length; ++i) {
                                                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.dataLbls[i].transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.dataLbls[i].extX, this.selection.groupSelection.selection.chartSelection.selection.dataLbls[i].extY, false, false);
                                            }
                                        } else {
                                            if (this.selection.groupSelection.selection.chartSelection.selection.dataLbl) {
                                                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.dataLbl.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.dataLbl.extX, this.selection.groupSelection.selection.chartSelection.selection.dataLbl.extY, false, false);
                                            } else {
                                                if (this.selection.groupSelection.selection.chartSelection.selection.legend) {
                                                    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.legend.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.legend.extX, this.selection.groupSelection.selection.chartSelection.selection.legend.extY, false, false);
                                                } else {
                                                    if (this.selection.groupSelection.selection.chartSelection.selection.legendEntry) {
                                                        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.legendEntry.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.legendEntry.extX, this.selection.groupSelection.selection.chartSelection.selection.legendEntry.extY, false, false);
                                                    } else {
                                                        if (this.selection.groupSelection.selection.chartSelection.selection.axisLbls) {
                                                            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selection.chartSelection.selection.axisLbls.transform, 0, 0, this.selection.groupSelection.selection.chartSelection.selection.axisLbls.extX, this.selection.groupSelection.selection.chartSelection.selection.axisLbls.extY, false, false);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            for (i = 0; i < this.selection.groupSelection.selectedObjects.length; ++i) {
                                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.groupSelection.selectedObjects[i].transform, 0, 0, this.selection.groupSelection.selectedObjects[i].extX, this.selection.groupSelection.selectedObjects[i].extY, CheckObjectLine(this.selection.groupSelection.selectedObjects[i]), this.selection.groupSelection.selectedObjects[i].canRotate());
                            }
                        }
                    }
                    if (this.selection.groupSelection.selectedObjects.length === 1 && this.selection.groupSelection.selectedObjects[0].drawAdjustments) {
                        this.selection.groupSelection.selectedObjects[0].drawAdjustments(drawingDocument);
                    }
                }
            } else {
                if (this.selection.chartSelection) {
                    if (this.selection.chartSelection.selectStartPage === pageIndex) {
                        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.getTransformMatrix(), 0, 0, this.selection.chartSelection.extX, this.selection.chartSelection.extY, false, this.selection.chartSelection.canRotate());
                        if (this.selection.chartSelection.selection.textSelection) {
                            drawingDocument.DrawTrack(TYPE_TRACK_TEXT, this.selection.chartSelection.selection.textSelection.transform, 0, 0, this.selection.chartSelection.selection.textSelection.extX, this.selection.chartSelection.selection.textSelection.extY, false, false, true);
                        } else {
                            if (this.selection.chartSelection.selection.title) {
                                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.title.transform, 0, 0, this.selection.chartSelection.selection.title.extX, this.selection.chartSelection.selection.title.extY, false, false, true);
                            } else {
                                if (this.selection.chartSelection.selection.dataLbls) {
                                    for (i = 0; i < this.selection.chartSelection.selection.dataLbls.length; ++i) {
                                        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.dataLbls[i].transform, 0, 0, this.selection.chartSelection.selection.dataLbls[i].extX, this.selection.chartSelection.selection.dataLbls[i].extY, false, false);
                                    }
                                } else {
                                    if (this.selection.chartSelection.selection.dataLbl) {
                                        drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.dataLbl.transform, 0, 0, this.selection.chartSelection.selection.dataLbl.extX, this.selection.chartSelection.selection.dataLbl.extY, false, false);
                                    } else {
                                        if (this.selection.chartSelection.selection.legend) {
                                            drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.legend.transform, 0, 0, this.selection.chartSelection.selection.legend.extX, this.selection.chartSelection.selection.legend.extY, false, false);
                                        } else {
                                            if (this.selection.chartSelection.selection.legendEntry) {
                                                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.legendEntry.transform, 0, 0, this.selection.chartSelection.selection.legendEntry.extX, this.selection.chartSelection.selection.legendEntry.extY, false, false);
                                            } else {
                                                if (this.selection.chartSelection.selection.axisLbls) {
                                                    drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selection.chartSelection.selection.axisLbls.transform, 0, 0, this.selection.chartSelection.selection.axisLbls.extX, this.selection.chartSelection.selection.axisLbls.extY, false, false);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    if (this.selection.wrapPolygonSelection) {
                        if (this.selection.wrapPolygonSelection.selectStartPage === pageIndex) {
                            drawingDocument.AutoShapesTrack.DrawEditWrapPointsPolygon(this.selection.wrapPolygonSelection.parent.wrappingPolygon.calculatedPoints, new CMatrix());
                        }
                    } else {
                        for (i = 0; i < this.selectedObjects.length; ++i) {
                            if (this.selectedObjects[i].selectStartPage === pageIndex) {
                                drawingDocument.DrawTrack(TYPE_TRACK_SHAPE, this.selectedObjects[i].getTransformMatrix(), 0, 0, this.selectedObjects[i].extX, this.selectedObjects[i].extY, CheckObjectLine(this.selectedObjects[i]), this.selectedObjects[i].canRotate());
                            }
                        }
                        if (this.selectedObjects.length === 1 && this.selectedObjects[0].drawAdjustments && this.selectedObjects[0].selectStartPage === pageIndex) {
                            this.selectedObjects[0].drawAdjustments(drawingDocument);
                        }
                    }
                }
            }
        }
        if (this.document) {
            if (this.selectedObjects.length === 1 && this.selectedObjects[0].parent && !this.selectedObjects[0].parent.Is_Inline()) {
                var anchor_pos;
                if (this.arrTrackObjects.length === 1 && !(this.arrTrackObjects[0] instanceof TrackPointWrapPointWrapPolygon || this.arrTrackObjects[0] instanceof TrackNewPointWrapPolygon)) {
                    var page_index = isRealNumber(this.arrTrackObjects[0].pageIndex) ? this.arrTrackObjects[0].pageIndex : (isRealNumber(this.arrTrackObjects[0].selectStartPage) ? this.arrTrackObjects[0].selectStartPage : 0);
                    if (page_index === pageIndex) {
                        var bounds = this.arrTrackObjects[0].getBounds();
                        var nearest_pos = this.document.Get_NearestPos(page_index, bounds.min_x, bounds.min_y, true, this.selectedObjects[0].parent);
                        nearest_pos.Page = page_index;
                        drawingDocument.AutoShapesTrack.drawFlowAnchor(nearest_pos.X, nearest_pos.Y);
                    }
                } else {
                    var page_index = this.selectedObjects[0].selectStartPage;
                    if (page_index === pageIndex) {
                        var paragraph = this.selectedObjects[0].parent.Get_ParentParagraph();
                        anchor_pos = paragraph.Get_AnchorPos(this.selectedObjects[0].parent);
                        drawingDocument.AutoShapesTrack.drawFlowAnchor(anchor_pos.X, anchor_pos.Y);
                    }
                }
            }
        }
        if (this.selectionRect) {
            drawingDocument.DrawTrackSelectShapes(this.selectionRect.x, this.selectionRect.y, this.selectionRect.w, this.selectionRect.h);
        }
        return;
    },
    selectObject: function (object, pageIndex) {
        object.select(this, pageIndex);
    },
    deselectObject: function (object) {},
    recalculate: function () {
        for (var key in this.objectsForRecalculate) {
            this.objectsForRecalculate[key].recalculate();
        }
        this.objectsForRecalculate = {};
    },
    addContentChanges: function (changes) {},
    refreshContentChanges: function () {},
    getAllFontNames: function () {},
    getTargetDocContent: function (bCheckChartTitle, bOrTable) {
        var text_object = getTargetTextObject(this);
        if (text_object) {
            if (bOrTable) {
                if (text_object.getObjectType() === historyitem_type_GraphicFrame) {
                    return text_object.graphicObject;
                }
            }
            if (bCheckChartTitle && text_object.checkDocContent) {
                text_object.checkDocContent();
            }
            return text_object.getDocContent();
        }
        return null;
    },
    addNewParagraph: function (bRecalculate) {
        this.applyTextFunction(CDocumentContent.prototype.Add_NewParagraph, CTable.prototype.Add_NewParagraph, [bRecalculate]);
    },
    paragraphClearFormatting: function () {
        this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_ClearFormatting, [], CTable.prototype.Paragraph_ClearFormatting);
    },
    applyDocContentFunction: function (f, args, tableFunction) {
        function applyToArrayDrawings(arr) {
            var ret = false,
            ret2;
            for (var i = 0; i < arr.length; ++i) {
                if (arr[i].getObjectType() === historyitem_type_GroupShape) {
                    ret2 = applyToArrayDrawings(arr[i].arrGraphicObjects);
                    if (ret2) {
                        ret = true;
                    }
                } else {
                    if (arr[i].getObjectType() === historyitem_type_GraphicFrame) {
                        arr[i].graphicObject.Set_ApplyToAll(true);
                        tableFunction.apply(arr[i].graphicObject, args);
                        arr[i].graphicObject.Set_ApplyToAll(false);
                        ret = true;
                    } else {
                        if (arr[i].getDocContent) {
                            var content = arr[i].getDocContent();
                            if (content) {
                                content.Set_ApplyToAll(true);
                                f.apply(content, args);
                                content.Set_ApplyToAll(false);
                                ret = true;
                            } else {
                                if (arr[i].getObjectType() === historyitem_type_Shape) {
                                    if (arr[i].bWordShape) {
                                        arr[i].createTextBoxContent();
                                    } else {
                                        arr[i].createTextBody();
                                    }
                                    content = arr[i].getDocContent();
                                    if (content) {
                                        content.Set_ApplyToAll(true);
                                        f.apply(content, args);
                                        content.Set_ApplyToAll(false);
                                        ret = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return ret;
        }
        function applyToChartSelection(chart) {
            var content;
            if (chart.selection.textSelection) {
                chart.selection.textSelection.checkDocContent();
                content = chart.selection.textSelection.getDocContent();
                if (content) {
                    f.apply(content, args);
                }
            } else {
                if (chart.selection.title) {
                    content = chart.selection.title.getDocContent();
                    if (content) {
                        content.Set_ApplyToAll(true);
                        f.apply(content, args);
                        content.Set_ApplyToAll(false);
                    }
                }
            }
        }
        if (this.selection.textSelection) {
            if (this.selection.textSelection.getObjectType() !== historyitem_type_GraphicFrame) {
                f.apply(this.selection.textSelection.getDocContent(), args);
            } else {
                tableFunction.apply(this.selection.textSelection.graphicObject, args);
            }
        } else {
            if (this.selection.groupSelection) {
                if (this.selection.groupSelection.selection.textSelection) {
                    if (this.selection.groupSelection.selection.textSelection.getObjectType() !== historyitem_type_GraphicFrame) {
                        f.apply(this.selection.groupSelection.selection.textSelection.getDocContent(), args);
                    } else {
                        tableFunction.apply(this.selection.groupSelection.selection.textSelection.graphicObject, args);
                    }
                } else {
                    if (this.selection.groupSelection.selection.chartSelection) {
                        applyToChartSelection(this.selection.groupSelection.selection.chartSelection);
                    } else {
                        applyToArrayDrawings(this.selection.groupSelection.selectedObjects);
                    }
                }
            } else {
                if (this.selection.chartSelection) {
                    applyToChartSelection(this.selection.chartSelection);
                } else {
                    var ret = applyToArrayDrawings(this.selectedObjects);
                }
            }
        }
        if (this.document) {
            this.document.Recalculate();
        }
    },
    setParagraphSpacing: function (Spacing) {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphSpacing, [Spacing], CTable.prototype.Set_ParagraphSpacing);
    },
    setParagraphTabs: function (Tabs) {
        this.applyTextFunction(CDocumentContent.prototype.Set_ParagraphTabs, CTable.prototype.Set_ParagraphTabs, [Tabs]);
    },
    setParagraphNumbering: function (NumInfo) {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphNumbering, [NumInfo], CTable.prototype.Set_ParagraphNumbering);
    },
    setParagraphShd: function (Shd) {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphShd, [Shd], CTable.prototype.Set_ParagraphShd);
    },
    setParagraphStyle: function (Style) {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphStyle, [Style], CTable.prototype.Set_ParagraphStyle);
    },
    setParagraphContextualSpacing: function (Value) {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphContextualSpacing, [Value], CTable.prototype.Set_ParagraphPageBreakBefore);
    },
    setParagraphPageBreakBefore: function (Value) {
        this.applyTextFunction(CDocumentContent.prototype.Set_ParagraphPageBreakBefore, CTable.prototype.Set_ParagraphPageBreakBefore, [Value]);
    },
    setParagraphKeepLines: function (Value) {
        this.applyTextFunction(CDocumentContent.prototype.Set_ParagraphKeepLines, CTable.prototype.Set_ParagraphKeepLines, [Value]);
    },
    setParagraphKeepNext: function (Value) {
        this.applyTextFunction(CDocumentContent.prototype.Set_ParagraphKeepNext, CTable.prototype.Set_ParagraphKeepNext, [Value]);
    },
    setParagraphWidowControl: function (Value) {
        this.applyTextFunction(CDocumentContent.prototype.Set_ParagraphWidowControl, CTable.prototype.Set_ParagraphWidowControl, [Value]);
    },
    setParagraphBorders: function (Value) {
        this.applyTextFunction(CDocumentContent.prototype.Set_ParagraphBorders, CTable.prototype.Set_ParagraphBorders, [Value]);
    },
    applyTextFunction: function (docContentFunction, tableFunction, args) {
        if (this.selection.textSelection) {
            this.selection.textSelection.applyTextFunction(docContentFunction, tableFunction, args);
        } else {
            if (this.selection.groupSelection) {
                var oOldDoc = this.selection.groupSelection.document;
                this.selection.groupSelection.document = this.document;
                this.selection.groupSelection.applyTextFunction(docContentFunction, tableFunction, args);
                this.selection.groupSelection.document = oOldDoc;
            } else {
                if (this.selection.chartSelection) {
                    this.selection.chartSelection.applyTextFunction(docContentFunction, tableFunction, args);
                } else {
                    if (docContentFunction === CDocumentContent.prototype.Paragraph_Add && args[0].Type === para_TextPr) {
                        this.applyDocContentFunction(docContentFunction, args, tableFunction);
                    } else {
                        if (this.selectedObjects.length === 1 && ((this.selectedObjects[0].getObjectType() === historyitem_type_Shape && !CheckLinePresetForParagraphAdd(this.selectedObjects[0].getPresetGeom())) || this.selectedObjects[0].getObjectType() === historyitem_type_GraphicFrame)) {
                            this.selection.textSelection = this.selectedObjects[0];
                            if (this.selectedObjects[0].getObjectType() === historyitem_type_GraphicFrame) {
                                this.selectedObjects[0].graphicObject.Cursor_MoveToStartPos(false);
                                this.selectedObjects[0].applyTextFunction(docContentFunction, tableFunction, args);
                            } else {
                                this.selectedObjects[0].applyTextFunction(docContentFunction, tableFunction, args);
                                this.selection.textSelection.select(this, this.selection.textSelection.selectStartPage);
                            }
                        } else {
                            if (this.parent && this.parent.GoTo_Text) {
                                this.parent.GoTo_Text();
                                this.resetSelection();
                            } else {
                                if (this.selectedObjects.length > 0 && this.selectedObjects[0].parent && this.selectedObjects[0].parent.GoTo_Text) {
                                    this.selectedObjects[0].parent.GoTo_Text();
                                    this.resetSelection();
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    paragraphAdd: function (paraItem, bRecalculate) {
        this.applyTextFunction(CDocumentContent.prototype.Paragraph_Add, CTable.prototype.Paragraph_Add, [paraItem, bRecalculate]);
        return;
        if (this.selection.textSelection) {
            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
        } else {
            if (this.selection.groupSelection) {
                this.selection.groupSelection.paragraphAdd(paraItem, bRecalculate);
            } else {
                if (this.selection.chartSelection) {
                    this.selection.chartSelection.paragraphAdd(paraItem, bRecalculate);
                } else {
                    var i;
                    if (paraItem.Type === para_TextPr) {
                        this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_Add, [paraItem, bRecalculate], CTable.prototype.Paragraph_Add);
                    } else {
                        if (this.selectedObjects.length === 1 && this.selectedObjects[0].getObjectType() === historyitem_type_Shape && !CheckLinePreset(this.selectedObjects[0].getPresetGeom())) {
                            this.selection.textSelection = this.selectedObjects[0];
                            this.selection.textSelection.paragraphAdd(paraItem, bRecalculate);
                            this.selection.textSelection.select(this, this.selection.textSelection.selectStartPage);
                        } else {
                            if (this.selectedObjects.length > 0 && this.selectedObjects[0].parent && this.selectedObjects[0].parent.GoTo_Text) {
                                this.selectedObjects[0].parent.GoTo_Text();
                                this.resetSelection();
                            }
                        }
                    }
                }
            }
        }
    },
    paragraphIncDecFontSize: function (bIncrease) {
        this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_IncDecFontSize, [bIncrease], CTable.prototype.Paragraph_IncDecFontSize);
    },
    paragraphIncDecIndent: function (bIncrease) {
        this.applyDocContentFunction(CDocumentContent.prototype.Paragraph_IncDecIndent, [bIncrease], CTable.prototype.Paragraph_IncDecIndent);
    },
    setParagraphAlign: function (align) {
        this.applyDocContentFunction(CDocumentContent.prototype.Set_ParagraphAlign, [align], CTable.prototype.Set_ParagraphAlign);
    },
    setParagraphIndent: function (indent) {
        var content = this.getTargetDocContent(true);
        if (content) {
            content.Set_ParagraphIndent(indent);
        } else {
            if (this.document) {
                if (this.selectedObjects.length > 0) {
                    var parent_paragraph = this.selectedObjects[0].parent.Get_ParentParagraph();
                    if (parent_paragraph) {
                        parent_paragraph.Set_Ind(indent, true);
                        this.document.Recalculate();
                    }
                }
            }
        }
    },
    setCellFontName: function (fontName) {
        var oThis = this;
        var callBack = function () {
            oThis.paragraphAdd(new ParaTextPr({
                FontFamily: {
                    Name: fontName,
                    Index: -1
                }
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellFontName);
    },
    setCellFontSize: function (fontSize) {
        var oThis = this;
        var callBack = function () {
            oThis.paragraphAdd(new ParaTextPr({
                FontSize: fontSize
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellFontSize);
    },
    setCellBold: function (isBold) {
        var oThis = this;
        var callBack = function () {
            oThis.paragraphAdd(new ParaTextPr({
                Bold: isBold
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellBold);
    },
    setCellItalic: function (isItalic) {
        var oThis = this;
        var callBack = function () {
            oThis.paragraphAdd(new ParaTextPr({
                Italic: isItalic
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellItalic);
    },
    setCellUnderline: function (isUnderline) {
        var oThis = this;
        var callBack = function () {
            oThis.paragraphAdd(new ParaTextPr({
                Underline: isUnderline
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellUnderline);
    },
    setCellStrikeout: function (isStrikeout) {
        var oThis = this;
        var callBack = function () {
            oThis.paragraphAdd(new ParaTextPr({
                Strikeout: isStrikeout
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellStrikeout);
    },
    setCellSubscript: function (isSubscript) {
        var oThis = this;
        var callBack = function () {
            oThis.paragraphAdd(new ParaTextPr({
                VertAlign: isSubscript ? vertalign_SubScript : vertalign_Baseline
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellSubscript);
    },
    setCellSuperscript: function (isSuperscript) {
        var oThis = this;
        var callBack = function () {
            oThis.paragraphAdd(new ParaTextPr({
                VertAlign: isSuperscript ? vertalign_SubScript : vertalign_Baseline
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellSuperscript);
    },
    setCellAlign: function (align) {
        var align_;
        switch (align.toLowerCase()) {
        case "left":
            align_ = align_Left;
            break;
        case "right":
            align_ = align_Right;
            break;
        case "center":
            align_ = align_Center;
            break;
        case "justify":
            align_ = align_Justify;
        }
        this.checkSelectedObjectsAndCallback(this.setParagraphAlign, [align_], false, historydescription_Spreadsheet_SetCellAlign);
    },
    setCellVertAlign: function (align) {
        var vert_align;
        switch (align) {
        case "bottom":
            vert_align = 0;
            break;
        case "center":
            vert_align = 1;
            break;
        case "distributed":
            vert_align = 1;
            break;
        case "justify":
            vert_align = 1;
            break;
        case "top":
            vert_align = 4;
        }
        this.checkSelectedObjectsAndCallback(this.applyDrawingProps, [{
            verticalTextAlign: vert_align
        }], false, historydescription_Spreadsheet_SetCellVertAlign);
    },
    setCellTextWrap: function (isWrapped) {},
    setCellTextShrink: function (isShrinked) {},
    setCellTextColor: function (color) {
        var oThis = this;
        var callBack = function () {
            var unifill = new CUniFill();
            unifill.setFill(new CSolidFill());
            unifill.fill.setColor(CorrectUniColor(color, null));
            oThis.paragraphAdd(new ParaTextPr({
                Unifill: unifill
            }));
        };
        this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_SetCellTextColor);
    },
    setCellBackgroundColor: function (color) {
        var fill = new CAscFill();
        fill.type = c_oAscFill.FILL_TYPE_SOLID;
        fill.fill = new CAscFillSolid();
        fill.fill.color = color;
        this.checkSelectedObjectsAndCallback(this.applyDrawingProps, [{
            fill: fill
        }], false, historydescription_Spreadsheet_SetCellBackgroundColor);
    },
    setCellAngle: function (angle) {},
    setCellStyle: function (name) {},
    increaseFontSize: function () {
        this.checkSelectedObjectsAndCallback(this.paragraphIncDecFontSize, [true], false, historydescription_Spreadsheet_SetCellIncreaseFontSize);
    },
    decreaseFontSize: function () {
        this.checkSelectedObjectsAndCallback(this.paragraphIncDecFontSize, [false], false, historydescription_Spreadsheet_SetCellDecreaseFontSize);
    },
    deleteSelectedObjects: function () {
        var content = this.getTargetDocContent();
        if (content && !content.Selection.Use) {
            return;
        }
        this.remove(-1);
    },
    hyperlinkCheck: function (bCheckEnd) {
        var content = this.getTargetDocContent();
        if (content) {
            return content.Hyperlink_Check(bCheckEnd);
        }
        return null;
    },
    hyperlinkCanAdd: function (bCheckInHyperlink) {
        var content = this.getTargetDocContent();
        if (content) {
            if (this.document && content.Parent && content.Parent instanceof CTextBody) {
                return false;
            }
            return content.Hyperlink_CanAdd(bCheckInHyperlink);
        }
        return false;
    },
    hyperlinkRemove: function () {
        var content = this.getTargetDocContent(true);
        return content && content.Hyperlink_Remove();
    },
    hyperlinkModify: function (HyperProps) {
        var content = this.getTargetDocContent(true);
        return content && content.Hyperlink_Modify(HyperProps);
    },
    hyperlinkAdd: function (HyperProps) {
        var content = this.getTargetDocContent(true);
        if (content) {
            if (!this.document) {
                if (null != HyperProps.Text && "" != HyperProps.Text && true === content.Is_SelectionUse()) {
                    this.removeCallback(-1);
                }
            }
            return content.Hyperlink_Add(HyperProps);
        }
        return null;
    },
    insertHyperlink: function (options) {
        if (!this.getHyperlinkInfo()) {
            this.checkSelectedObjectsAndCallback(this.hyperlinkAdd, [{
                Text: options.text,
                Value: options.hyperlinkModel.Hyperlink,
                ToolTip: options.hyperlinkModel.Tooltip
            }], false, historydescription_Spreadsheet_SetCellHyperlinkAdd);
        } else {
            this.checkSelectedObjectsAndCallback(this.hyperlinkModify, [{
                Text: options.text,
                Value: options.hyperlinkModel.Hyperlink,
                ToolTip: options.hyperlinkModel.Tooltip
            }], false, historydescription_Spreadsheet_SetCellHyperlinkModify);
        }
    },
    removeHyperlink: function () {
        this.checkSelectedObjectsAndCallback(this.hyperlinkRemove, [], false, historydescription_Spreadsheet_SetCellHyperlinkRemove);
    },
    canAddHyperlink: function () {
        return this.hyperlinkCanAdd();
    },
    getParagraphParaPr: function () {
        var target_text_object = getTargetTextObject(this);
        if (target_text_object) {
            if (target_text_object.getObjectType() === historyitem_type_GraphicFrame) {
                return target_text_object.graphicObject.Get_Paragraph_ParaPr();
            } else {
                var content = this.getTargetDocContent();
                if (content) {
                    return content.Get_Paragraph_ParaPr();
                }
            }
        } else {
            var result, cur_pr, selected_objects, i;
            var getPropsFromArr = function (arr) {
                var cur_pr, result_pr, content;
                for (var i = 0; i < arr.length; ++i) {
                    cur_pr = null;
                    if (arr[i].getObjectType() === historyitem_type_GroupShape) {
                        cur_pr = getPropsFromArr(arr[i].arrGraphicObjects);
                    } else {
                        if (arr[i].getDocContent && arr[i].getObjectType() !== historyitem_type_ChartSpace) {
                            content = arr[i].getDocContent();
                            if (content) {
                                content.Set_ApplyToAll(true);
                                cur_pr = content.Get_Paragraph_ParaPr();
                                content.Set_ApplyToAll(false);
                            }
                        }
                    }
                    if (cur_pr) {
                        if (!result_pr) {
                            result_pr = cur_pr;
                        } else {
                            result_pr.Compare(cur_pr);
                        }
                    }
                }
                return result_pr;
            };
            if (this.selection.groupSelection) {
                result = getPropsFromArr(this.selection.groupSelection.selectedObjects);
            } else {
                result = getPropsFromArr(this.selectedObjects);
            }
            return result;
        }
    },
    getTheme: function () {
        return window["Asc"]["editor"].wbModel.theme;
    },
    getParagraphTextPr: function () {
        var target_text_object = getTargetTextObject(this);
        if (target_text_object) {
            if (target_text_object.getObjectType() === historyitem_type_GraphicFrame) {
                return target_text_object.graphicObject.Get_Paragraph_TextPr();
            } else {
                var content = this.getTargetDocContent();
                if (content) {
                    return content.Get_Paragraph_TextPr();
                }
            }
        } else {
            var result, cur_pr, selected_objects, i;
            var getPropsFromArr = function (arr) {
                var cur_pr, result_pr, content;
                for (var i = 0; i < arr.length; ++i) {
                    cur_pr = null;
                    if (arr[i].getObjectType() === historyitem_type_GroupShape) {
                        cur_pr = getPropsFromArr(arr[i].arrGraphicObjects);
                    } else {
                        if (arr[i].getDocContent) {
                            content = arr[i].getDocContent();
                            if (content) {
                                content.Set_ApplyToAll(true);
                                cur_pr = content.Get_Paragraph_TextPr();
                                content.Set_ApplyToAll(false);
                            }
                        }
                    }
                    if (cur_pr) {
                        if (!result_pr) {
                            result_pr = cur_pr;
                        } else {
                            result_pr.Compare(cur_pr);
                        }
                    }
                }
                return result_pr;
            };
            if (this.selection.groupSelection) {
                result = getPropsFromArr(this.selection.groupSelection.selectedObjects);
            } else {
                result = getPropsFromArr(this.selectedObjects);
            }
            return result;
        }
    },
    getColorMap: function () {
        return this.defaultColorMap;
    },
    getAscChartObject: function () {},
    editChartDrawingObjects: function (chart) {
        if (this.chartForProps) {
            this.resetSelection();
            if (this.chartForProps.group) {
                var main_group = this.chartForProps.getMainGroup();
                this.selectObject(main_group, 0);
                this.selection.groupSelection = main_group;
                main_group.selectObject(this.chartForProps, 0);
            } else {
                this.selectObject(this.chartForProps);
            }
            this.chartForProps = null;
        }
        var objects_by_types = this.getSelectedObjectsByTypes();
        if (objects_by_types.charts.length === 1) {
            this.checkSelectedObjectsAndCallback(this.editChartCallback, [chart], false, historydescription_Spreadsheet_EditChart);
        }
    },
    applyDrawingProps: function (props) {
        var objects_by_type = this.getSelectedObjectsByTypes(true);
        var i;
        if (isRealNumber(props.verticalTextAlign)) {
            for (i = 0; i < objects_by_type.shapes.length; ++i) {
                objects_by_type.shapes[i].setVerticalAlign(props.verticalTextAlign);
            }
            for (i = 0; i < objects_by_type.groups.length; ++i) {
                objects_by_type.groups[i].setVerticalAlign(props.verticalTextAlign);
            }
        }
        if (isRealObject(props.paddings)) {
            for (i = 0; i < objects_by_type.shapes.length; ++i) {
                objects_by_type.shapes[i].setPaddings(props.paddings);
            }
            for (i = 0; i < objects_by_type.groups.length; ++i) {
                objects_by_type.groups[i].setPaddings(props.paddings);
            }
        }
        if (typeof(props.type) === "string") {
            for (i = 0; i < objects_by_type.shapes.length; ++i) {
                objects_by_type.shapes[i].changePresetGeom(props.type);
            }
            for (i = 0; i < objects_by_type.groups.length; ++i) {
                objects_by_type.groups[i].changePresetGeom(props.type);
            }
        }
        if (isRealObject(props.stroke)) {
            for (i = 0; i < objects_by_type.shapes.length; ++i) {
                objects_by_type.shapes[i].changeLine(props.stroke);
            }
            for (i = 0; i < objects_by_type.groups.length; ++i) {
                objects_by_type.groups[i].changeLine(props.stroke);
            }
            for (i = 0; i < objects_by_type.charts.length; ++i) {
                objects_by_type.charts[i].changeLine(props.stroke);
            }
        }
        if (isRealObject(props.fill)) {
            for (i = 0; i < objects_by_type.shapes.length; ++i) {
                objects_by_type.shapes[i].changeFill(props.fill);
            }
            for (i = 0; i < objects_by_type.groups.length; ++i) {
                objects_by_type.groups[i].changeFill(props.fill);
            }
            for (i = 0; i < objects_by_type.charts.length; ++i) {
                objects_by_type.charts[i].changeFill(props.fill);
            }
        }
        if (typeof props.ImageUrl === "string" && props.ImageUrl.length > 0) {
            for (i = 0; i < objects_by_type.images.length; ++i) {
                objects_by_type.images[i].setBlipFill(CreateBlipFillUniFillFromUrl(props.ImageUrl).fill);
            }
        }
        if (props.ChartProperties) {
            for (i = 0; i < objects_by_type.charts.length; ++i) {
                this.applyPropsToChartSpace(props.ChartProperties, objects_by_type.charts[i]);
            }
        }
        if (isRealNumber(props.Width) && isRealNumber(props.Height)) {
            for (i = 0; i < objects_by_type.shapes.length; ++i) {
                CheckSpPrXfrm(objects_by_type.shapes[i]);
                objects_by_type.shapes[i].spPr.xfrm.setExtX(props.Width);
                objects_by_type.shapes[i].spPr.xfrm.setExtY(props.Height);
                if (objects_by_type.shapes[i].group) {
                    objects_by_type.shapes[i].group.updateCoordinatesAfterInternalResize();
                }
                objects_by_type.shapes[i].checkDrawingBaseCoords();
            }
            for (i = 0; i < objects_by_type.images.length; ++i) {
                CheckSpPrXfrm(objects_by_type.images[i]);
                objects_by_type.images[i].spPr.xfrm.setExtX(props.Width);
                objects_by_type.images[i].spPr.xfrm.setExtY(props.Height);
                if (objects_by_type.images[i].group) {
                    objects_by_type.images[i].group.updateCoordinatesAfterInternalResize();
                }
                objects_by_type.images[i].checkDrawingBaseCoords();
            }
            for (i = 0; i < objects_by_type.charts.length; ++i) {
                CheckSpPrXfrm(objects_by_type.charts[i]);
                objects_by_type.charts[i].spPr.xfrm.setExtX(props.Width);
                objects_by_type.charts[i].spPr.xfrm.setExtY(props.Height);
                if (objects_by_type.charts[i].group) {
                    objects_by_type.charts[i].group.updateCoordinatesAfterInternalResize();
                }
                objects_by_type.charts[i].checkDrawingBaseCoords();
            }
        }
        if (isRealObject(props.Position) && isRealNumber(props.Position.X) && isRealNumber(props.Position.Y)) {
            for (i = 0; i < objects_by_type.shapes.length; ++i) {
                CheckSpPrXfrm(objects_by_type.shapes[i]);
                objects_by_type.shapes[i].spPr.xfrm.setOffX(props.Position.X);
                objects_by_type.shapes[i].spPr.xfrm.setOffY(props.Position.Y);
                if (objects_by_type.shapes[i].group) {
                    objects_by_type.shapes[i].group.updateCoordinatesAfterInternalResize();
                }
                objects_by_type.shapes[i].checkDrawingBaseCoords();
            }
            for (i = 0; i < objects_by_type.images.length; ++i) {
                CheckSpPrXfrm(objects_by_type.images[i]);
                objects_by_type.images[i].spPr.xfrm.setOffX(props.Position.X);
                objects_by_type.images[i].spPr.xfrm.setOffY(props.Position.Y);
                if (objects_by_type.images[i].group) {
                    objects_by_type.images[i].group.updateCoordinatesAfterInternalResize();
                }
                objects_by_type.images[i].checkDrawingBaseCoords();
            }
            for (i = 0; i < objects_by_type.charts.length; ++i) {
                CheckSpPrXfrm(objects_by_type.charts[i]);
                objects_by_type.charts[i].spPr.xfrm.setOffX(props.Position.X);
                objects_by_type.charts[i].spPr.xfrm.setOffY(props.Position.Y);
                if (objects_by_type.charts[i].group) {
                    objects_by_type.charts[i].group.updateCoordinatesAfterInternalResize();
                }
                objects_by_type.charts[i].checkDrawingBaseCoords();
            }
        }
        return objects_by_type;
    },
    getSelectedObjectsByTypes: function (bGroupedObjects) {
        var ret = {
            shapes: [],
            images: [],
            groups: [],
            charts: []
        };
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects;
        return getObjectsByTypesFromArr(selected_objects, bGroupedObjects);
    },
    editChartCallback: function (chartSettings) {
        var objects_by_types = this.getSelectedObjectsByTypes();
        if (objects_by_types.charts.length === 1) {
            var chart_space = objects_by_types.charts[0];
            this.applyPropsToChartSpace(chartSettings, chart_space);
        }
    },
    applyPropsToChartSpace: function (chartSettings, chartSpace) {
        var chart_space = chartSpace;
        var style_index = chartSettings.getStyle();
        var sRange = chartSettings.getRange();
        var b_clear_formatting = false;
        if (this.drawingObjects && this.drawingObjects.getWorksheet && typeof sRange === "string" && sRange.length > 0) {
            var ws_view = this.drawingObjects.getWorksheet();
            var parsed_formula = parserHelp.parse3DRef(sRange);
            var ws = ws_view.model.workbook.getWorksheetByName(parsed_formula.sheet);
            var new_bbox;
            var range_object = ws.getRange2(parsed_formula.range);
            if (range_object) {
                new_bbox = range_object.bbox;
            }
            if (parsed_formula && ws && new_bbox) {
                var b_equal_bbox = chart_space.bbox && chart_space.bbox.seriesBBox.r1 === new_bbox.r1 && chart_space.bbox.seriesBBox.r2 === new_bbox.r2 && chart_space.bbox.seriesBBox.c1 === new_bbox.c1 && chart_space.bbox.seriesBBox.c2 === new_bbox.c2;
                var b_equal_ws = chart_space.bbox && chart_space.bbox.worksheet === ws;
                var b_equal_vert = chart_space.bbox && chartSettings.getInColumns() === !chart_space.bbox.seriesBBox.bVert;
                var bLimit = (Math.abs(new_bbox.r2 - new_bbox.r1) > 4096 || Math.abs(new_bbox.c2 - new_bbox.c1) > 4096);
                if (! (chart_space.bbox && chart_space.bbox.seriesBBox && b_equal_ws && b_equal_bbox && b_equal_vert) && !bLimit) {
                    var catHeadersBBox, serHeadersBBox;
                    if (chart_space.bbox && b_equal_bbox && b_equal_ws && !b_equal_vert) {
                        if (chart_space.bbox.catBBox) {
                            serHeadersBBox = {
                                r1: chart_space.bbox.catBBox.r1,
                                r2: chart_space.bbox.catBBox.r2,
                                c1: chart_space.bbox.catBBox.c1,
                                c2: chart_space.bbox.catBBox.c2
                            };
                        }
                        if (chart_space.bbox.serBBox) {
                            catHeadersBBox = {
                                r1: chart_space.bbox.serBBox.r1,
                                r2: chart_space.bbox.serBBox.r2,
                                c1: chart_space.bbox.serBBox.c1,
                                c2: chart_space.bbox.serBBox.c2
                            };
                        }
                    }
                    var chartSeries = getChartSeries(ws_view.model, chartSettings, catHeadersBBox, serHeadersBBox);
                    chart_space.clearFormatting(true);
                    b_clear_formatting = true;
                    chart_space.rebuildSeriesFromAsc(chartSeries);
                }
            }
        }
        if (isRealNumber(style_index) && style_index > 0 && style_index < 49 && chart_space.style !== style_index) {
            if (!b_clear_formatting) {
                chart_space.clearFormatting();
            }
            chart_space.setStyle(style_index);
        }
        var chart = chart_space.chart;
        var title_show_settings = chartSettings.getTitle();
        if (title_show_settings === c_oAscChartTitleShowSettings.none) {
            if (chart.title) {
                chart.setTitle(null);
            }
        } else {
            if (title_show_settings === c_oAscChartTitleShowSettings.noOverlay || title_show_settings === c_oAscChartTitleShowSettings.overlay) {
                if (!chart.title) {
                    chart.setTitle(new CTitle());
                }
                if (chart.title.overlay !== (title_show_settings === c_oAscChartTitleShowSettings.overlay)) {
                    chart.title.setOverlay(title_show_settings === c_oAscChartTitleShowSettings.overlay);
                }
            }
        }
        var plot_area = chart.plotArea;
        var legend_pos_settings = chartSettings.getLegendPos();
        if (legend_pos_settings !== null) {
            if (legend_pos_settings === c_oAscChartLegendShowSettings.none) {
                if (chart.legend) {
                    chart.setLegend(null);
                }
            } else {
                if (!chart.legend) {
                    chart.setLegend(new CLegend());
                }
                if (isRealNumber(LEGEND_POS_MAP[legend_pos_settings])) {
                    if (chart.legend.legendPos !== LEGEND_POS_MAP[legend_pos_settings]) {
                        chart.legend.setLegendPos(LEGEND_POS_MAP[legend_pos_settings]);
                    }
                    var b_overlay = c_oAscChartLegendShowSettings.leftOverlay === legend_pos_settings || legend_pos_settings === c_oAscChartLegendShowSettings.rightOverlay;
                    if (chart.legend.overlay !== b_overlay) {
                        chart.legend.setOverlay(b_overlay);
                    }
                }
            }
        }
        var chart_type = plot_area.charts[0];
        var i;
        var type = chartSettings.getType();
        var need_groupping, need_num_fmt, need_bar_dir;
        var val_axis, new_chart_type, object_type, axis_obj;
        var axis_by_types;
        var val_ax, cat_ax;
        object_type = chart_type.getObjectType();
        var checkSwapAxis = function (plotArea, chartType, newChartType) {
            if (chartType.getAxisByTypes) {
                var axis_by_types = chartType.getAxisByTypes(),
                cat_ax,
                val_ax;
                if (axis_by_types.catAx.length > 0 && axis_by_types.valAx.length > 0) {
                    cat_ax = axis_by_types.catAx[0];
                    val_ax = axis_by_types.valAx[0];
                }
            }
            if (!val_ax || !cat_ax) {
                var axis_obj = CreateDefaultAxises(need_num_fmt);
                cat_ax = axis_obj.catAx;
                val_ax = axis_obj.valAx;
            }
            if (cat_ax && val_ax) {
                if (newChartType.getObjectType() === historyitem_type_BarChart && newChartType.barDir === BAR_DIR_BAR) {
                    if (cat_ax.axPos !== AX_POS_L) {
                        cat_ax.setAxPos(AX_POS_L);
                    }
                    if (val_ax.axPos !== AX_POS_B) {
                        val_ax.setAxPos(AX_POS_B);
                    }
                } else {
                    if (cat_ax.axPos !== AX_POS_B) {
                        cat_ax.setAxPos(AX_POS_B);
                    }
                    if (val_ax.axPos !== AX_POS_L) {
                        val_ax.setAxPos(AX_POS_L);
                    }
                }
                newChartType.addAxId(cat_ax);
                newChartType.addAxId(val_ax);
                plotArea.addAxis(cat_ax);
                plotArea.addAxis(val_ax);
            }
        };
        var replaceChart = function (plotArea, chartType, newChartType) {
            plotArea.addChart(newChartType, 0);
            plotArea.removeCharts(1, plotArea.charts.length - 1);
            newChartType.setFromOtherChart(chartType);
            if (newChartType.getObjectType() !== historyitem_type_PieChart && newChartType.getObjectType() !== historyitem_type_DoughnutChart) {
                if (newChartType.setVaryColors && newChartType.varyColors === true) {
                    newChartType.setVaryColors(false);
                }
            }
        };
        switch (type) {
        case c_oAscChartTypeSettings.barNormal:
            case c_oAscChartTypeSettings.barStacked:
            case c_oAscChartTypeSettings.barStackedPer:
            case c_oAscChartTypeSettings.hBarNormal:
            case c_oAscChartTypeSettings.hBarStacked:
            case c_oAscChartTypeSettings.hBarStackedPer:
            if (type === c_oAscChartTypeSettings.barNormal || type === c_oAscChartTypeSettings.hBarNormal) {
                need_groupping = BAR_GROUPING_CLUSTERED;
            } else {
                if (type === c_oAscChartTypeSettings.barStacked || type === c_oAscChartTypeSettings.hBarStacked) {
                    need_groupping = BAR_GROUPING_STACKED;
                } else {
                    need_groupping = BAR_GROUPING_PERCENT_STACKED;
                }
            }
            if (type === c_oAscChartTypeSettings.barNormal || type === c_oAscChartTypeSettings.barStacked || type === c_oAscChartTypeSettings.barNormal || type === c_oAscChartTypeSettings.barStacked || type === c_oAscChartTypeSettings.hBarNormal || type === c_oAscChartTypeSettings.hBarStacked || type === c_oAscChartTypeSettings.hBarNormal || type === c_oAscChartTypeSettings.hBarStacked) {
                need_num_fmt = "General";
            } else {
                need_num_fmt = "0%";
            }
            if (type === c_oAscChartTypeSettings.barNormal || type === c_oAscChartTypeSettings.barStacked || type === c_oAscChartTypeSettings.barStackedPer) {
                need_bar_dir = BAR_DIR_COL;
            } else {
                need_bar_dir = BAR_DIR_BAR;
            }
            if (chart_type.getObjectType() === historyitem_type_BarChart) {
                if (chart_type.grouping !== need_groupping) {
                    chart_type.setGrouping(need_groupping);
                }
                if (chart_type.gapWidth !== 150) {
                    chart_type.setGapWidth(150);
                }
                if (BAR_GROUPING_PERCENT_STACKED === need_groupping || BAR_GROUPING_STACKED === need_groupping) {
                    if (chart_type.overlap !== 100) {
                        chart_type.setOverlap(100);
                    }
                } else {
                    if (chart_type.overlap !== null) {
                        chart_type.setOverlap(null);
                    }
                }
                axis_by_types = chart_type.getAxisByTypes();
                if (chart_type.barDir !== need_bar_dir) {
                    val_axis = axis_by_types.valAx;
                    if (need_bar_dir === BAR_DIR_BAR) {
                        for (i = 0; i < val_axis.length; ++i) {
                            val_axis[i].setAxPos(AX_POS_B);
                        }
                        for (i = 0; i < axis_by_types.catAx.length; ++i) {
                            axis_by_types.catAx[i].setAxPos(AX_POS_L);
                        }
                    } else {
                        for (i = 0; i < val_axis.length; ++i) {
                            val_axis[i].setAxPos(AX_POS_L);
                        }
                        for (i = 0; i < axis_by_types.catAx.length; ++i) {
                            axis_by_types.catAx[i].setAxPos(AX_POS_B);
                        }
                    }
                    chart_type.setBarDir(need_bar_dir);
                }
                val_axis = axis_by_types.valAx;
                for (i = 0; i < val_axis.length; ++i) {
                    if (!val_axis[i].numFmt) {
                        val_axis[i].setNumFmt(new CNumFmt());
                    }
                    if (val_axis[i].numFmt.formatCode !== need_num_fmt) {
                        val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                }
            } else {
                new_chart_type = new CBarChart();
                replaceChart(plot_area, chart_type, new_chart_type);
                new_chart_type.setBarDir(need_bar_dir);
                checkSwapAxis(plot_area, chart_type, new_chart_type);
                new_chart_type.setGrouping(need_groupping);
                new_chart_type.setGapWidth(150);
                if (BAR_GROUPING_PERCENT_STACKED === need_groupping || BAR_GROUPING_STACKED === need_groupping) {
                    new_chart_type.setOverlap(100);
                }
                axis_by_types = new_chart_type.getAxisByTypes();
                val_axis = axis_by_types.valAx;
                for (i = 0; i < val_axis.length; ++i) {
                    if (!val_axis[i].numFmt) {
                        val_axis[i].setNumFmt(new CNumFmt());
                    }
                    if (val_axis[i].numFmt.formatCode !== need_num_fmt) {
                        val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                    if (need_bar_dir = BAR_DIR_BAR) {
                        val_axis[i].setAxPos(AX_POS_B);
                    }
                }
                if (need_bar_dir = BAR_DIR_BAR) {
                    for (i = 0; i < axis_by_types.catAx.length; ++i) {
                        axis_by_types.catAx[i].setAxPos(AX_POS_L);
                    }
                }
            }
            break;
        case c_oAscChartTypeSettings.lineNormal:
            case c_oAscChartTypeSettings.lineStacked:
            case c_oAscChartTypeSettings.lineStackedPer:
            case c_oAscChartTypeSettings.lineNormalMarker:
            case c_oAscChartTypeSettings.lineStackedMarker:
            case c_oAscChartTypeSettings.lineStackedPerMarker:
            if (type === c_oAscChartTypeSettings.lineNormal || type === c_oAscChartTypeSettings.lineNormalMarker) {
                need_groupping = GROUPING_STANDARD;
            } else {
                if (type === c_oAscChartTypeSettings.lineStacked || type === c_oAscChartTypeSettings.lineStackedMarker) {
                    need_groupping = GROUPING_STACKED;
                } else {
                    need_groupping = GROUPING_PERCENT_STACKED;
                }
            }
            if (type === c_oAscChartTypeSettings.lineNormal || type === c_oAscChartTypeSettings.lineStacked || type === c_oAscChartTypeSettings.lineNormalMarker || type === c_oAscChartTypeSettings.lineStackedMarker) {
                need_num_fmt = "General";
            } else {
                need_num_fmt = "0%";
            }
            var b_marker = chartSettings.getShowMarker();
            if (chart_type.getObjectType() === historyitem_type_LineChart) {
                if (chart_type.grouping !== need_groupping) {
                    chart_type.setGrouping(need_groupping);
                }
                val_axis = chart_type.getAxisByTypes().valAx;
                for (i = 0; i < val_axis.length; ++i) {
                    if (!val_axis[i].numFmt) {
                        val_axis[i].setNumFmt(new CNumFmt());
                    }
                    if (val_axis[i].numFmt.formatCode !== need_num_fmt) {
                        val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                }
            } else {
                new_chart_type = new CLineChart();
                replaceChart(plot_area, chart_type, new_chart_type);
                checkSwapAxis(plot_area, chart_type, new_chart_type);
                val_axis = new_chart_type.getAxisByTypes().valAx;
                for (i = 0; i < val_axis.length; ++i) {
                    if (!val_axis[i].numFmt) {
                        val_axis[i].setNumFmt(new CNumFmt());
                    }
                    if (val_axis[i].numFmt.formatCode !== need_num_fmt) {
                        val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                }
                new_chart_type.setMarker(b_marker);
                new_chart_type.setGrouping(need_groupping);
            }
            break;
        case c_oAscChartTypeSettings.pie:
            if (chart_type.getObjectType() !== historyitem_type_PieChart) {
                new_chart_type = new CPieChart();
                replaceChart(plot_area, chart_type, new_chart_type);
                new_chart_type.setVaryColors(true);
            }
            break;
        case c_oAscChartTypeSettings.doughnut:
            if (chart_type.getObjectType() !== historyitem_type_DoughnutChart) {
                new_chart_type = new CDoughnutChart();
                replaceChart(plot_area, chart_type, new_chart_type);
                new_chart_type.setVaryColors(true);
                new_chart_type.setHoleSize(50);
            }
            break;
        case c_oAscChartTypeSettings.areaNormal:
            case c_oAscChartTypeSettings.areaStacked:
            case c_oAscChartTypeSettings.areaStackedPer:
            if (type === c_oAscChartTypeSettings.areaNormal) {
                need_groupping = GROUPING_STANDARD;
            } else {
                if (type === c_oAscChartTypeSettings.areaStacked) {
                    need_groupping = GROUPING_STACKED;
                } else {
                    need_groupping = GROUPING_PERCENT_STACKED;
                }
            }
            if (type === c_oAscChartTypeSettings.areaNormal || type === c_oAscChartTypeSettings.areaStacked) {
                need_num_fmt = "General";
            } else {
                need_num_fmt = "0%";
            }
            if (chart_type.getObjectType() === historyitem_type_AreaChart) {
                if (chart_type.grouping !== need_groupping) {
                    chart_type.setGrouping(need_groupping);
                }
                val_axis = chart_type.getAxisByTypes().valAx;
                for (i = 0; i < val_axis.length; ++i) {
                    if (!val_axis[i].numFmt) {
                        val_axis[i].setNumFmt(new CNumFmt());
                    }
                    if (val_axis[i].numFmt.formatCode !== need_num_fmt) {
                        val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                }
            } else {
                new_chart_type = new CAreaChart();
                replaceChart(plot_area, chart_type, new_chart_type);
                checkSwapAxis(plot_area, chart_type, new_chart_type);
                val_axis = new_chart_type.getAxisByTypes().valAx;
                for (i = 0; i < val_axis.length; ++i) {
                    if (!val_axis[i].numFmt) {
                        val_axis[i].setNumFmt(new CNumFmt());
                    }
                    if (val_axis[i].numFmt.formatCode !== need_num_fmt) {
                        val_axis[i].numFmt.setFormatCode(need_num_fmt);
                    }
                }
                new_chart_type.setGrouping(need_groupping);
            }
            break;
        case c_oAscChartTypeSettings.scatter:
            case c_oAscChartTypeSettings.scatterLine:
            case c_oAscChartTypeSettings.scatterSmooth:
            if (chart_type.getObjectType() !== historyitem_type_ScatterChart) {
                new_chart_type = new CScatterChart();
                plot_area.addChart(new_chart_type, 0);
                plot_area.removeCharts(1, plot_area.charts.length - 1);
                new_chart_type.setFromOtherChart(chart_type);
                for (var j = 0; j < new_chart_type.series.length; ++j) {
                    new_chart_type.series[j].setMarker(null);
                }
                new_chart_type.setScatterStyle(SCATTER_STYLE_MARKER);
                axis_obj = CreateScatterAxis();
                new_chart_type.addAxId(axis_obj.catAx);
                new_chart_type.addAxId(axis_obj.valAx);
                plot_area.addAxis(axis_obj.catAx);
                plot_area.addAxis(axis_obj.valAx);
            }
            break;
        case c_oAscChartTypeSettings.stock:
            if (chart_type.getObjectType() !== historyitem_type_StockChart) {
                new_chart_type = new CStockChart();
                replaceChart(plot_area, chart_type, new_chart_type);
                checkSwapAxis(plot_area, chart_type, new_chart_type);
                new_chart_type.setHiLowLines(new CSpPr());
                new_chart_type.setUpDownBars(new CUpDownBars());
                new_chart_type.upDownBars.setGapWidth(150);
                new_chart_type.upDownBars.setUpBars(new CSpPr());
                new_chart_type.upDownBars.setDownBars(new CSpPr());
                val_axis = new_chart_type.getAxisByTypes().valAx;
                for (i = 0; i < val_axis.length; ++i) {
                    if (!val_axis[i].numFmt) {
                        val_axis[i].setNumFmt(new CNumFmt());
                    }
                    if (val_axis[i].numFmt.formatCode !== "General") {
                        val_axis[i].numFmt.setFormatCode("General");
                    }
                }
            }
            break;
        }
        var hor_axis = plot_area.getHorizontalAxis();
        var hor_axis_label_setting = chartSettings.getHorAxisLabel();
        if (hor_axis) {
            if (hor_axis_label_setting !== null) {
                switch (hor_axis_label_setting) {
                case c_oAscChartHorAxisLabelShowSettings.none:
                    if (hor_axis.title) {
                        hor_axis.setTitle(null);
                    }
                    break;
                case c_oAscChartHorAxisLabelShowSettings.noOverlay:
                    var _text_body;
                    if (hor_axis.title && hor_axis.title.tx && hor_axis.title.tx.rich) {
                        _text_body = hor_axis.title.tx.rich;
                    } else {
                        if (!hor_axis.title) {
                            hor_axis.setTitle(new CTitle());
                        }
                        if (!hor_axis.title.txPr) {
                            hor_axis.title.setTxPr(new CTextBody());
                        }
                        if (!hor_axis.title.txPr.bodyPr) {
                            hor_axis.title.txPr.setBodyPr(new CBodyPr());
                        }
                        if (!hor_axis.title.txPr.content) {
                            hor_axis.title.txPr.setContent(new CDocumentContent(hor_axis.title.txPr, chart_space.getDrawingDocument(), 0, 0, 100, 500, false, false, true));
                        }
                        _text_body = hor_axis.title.txPr;
                    }
                    if (hor_axis.title.overlay !== false) {
                        hor_axis.title.setOverlay(false);
                    }
                    if (!_text_body.bodyPr || _text_body.bodyPr.isNotNull()) {
                        _text_body.setBodyPr(new CBodyPr());
                    }
                    break;
                }
            }
            hor_axis.setMenuProps(chartSettings.getHorAxisProps());
        }
        var vert_axis = plot_area.getVerticalAxis();
        var vert_axis_labels_settings = chartSettings.getVertAxisLabel();
        if (vert_axis) {
            if (vert_axis_labels_settings !== null) {
                switch (vert_axis_labels_settings) {
                case c_oAscChartVertAxisLabelShowSettings.none:
                    if (vert_axis.title) {
                        vert_axis.setTitle(null);
                    }
                    break;
                case c_oAscChartVertAxisLabelShowSettings.vertical:
                    break;
                default:
                    if (vert_axis_labels_settings === c_oAscChartVertAxisLabelShowSettings.rotated || vert_axis_labels_settings === c_oAscChartVertAxisLabelShowSettings.horizontal) {
                        var _text_body;
                        if (vert_axis.title && vert_axis.title.tx && vert_axis.title.tx.rich) {
                            _text_body = vert_axis.title.tx.rich;
                        } else {
                            if (!vert_axis.title) {
                                vert_axis.setTitle(new CTitle());
                            }
                            if (!vert_axis.title.txPr) {
                                vert_axis.title.setTxPr(new CTextBody());
                            }
                            _text_body = vert_axis.title.txPr;
                        }
                        if (!_text_body.bodyPr) {
                            _text_body.setBodyPr(new CBodyPr());
                        }
                        var _body_pr = _text_body.bodyPr.createDuplicate();
                        if (!_text_body.content) {
                            _text_body.setContent(new CDocumentContent(_text_body, chart_space.getDrawingDocument(), 0, 0, 100, 500, false, false, true));
                        }
                        if (vert_axis_labels_settings === c_oAscChartVertAxisLabelShowSettings.rotated) {
                            _body_pr.reset();
                        } else {
                            _body_pr.setVert(nVertTThorz);
                            _body_pr.setRot(0);
                        }
                        _text_body.setBodyPr(_body_pr);
                        if (vert_axis.title.overlay !== false) {
                            vert_axis.title.setOverlay(false);
                        }
                    }
                }
            }
            vert_axis.setMenuProps(chartSettings.getVertAxisProps());
        }
        var setAxisGridLines = function (axis, gridLinesSettings) {
            if (axis) {
                switch (gridLinesSettings) {
                case c_oAscGridLinesSettings.none:
                    if (axis.majorGridlines) {
                        axis.setMajorGridlines(null);
                    }
                    if (axis.minorGridlines) {
                        axis.setMinorGridlines(null);
                    }
                    break;
                case c_oAscGridLinesSettings.major:
                    if (!axis.majorGridlines) {
                        axis.setMajorGridlines(new CSpPr());
                    }
                    if (axis.minorGridlines) {
                        axis.setMinorGridlines(null);
                    }
                    break;
                case c_oAscGridLinesSettings.minor:
                    if (!axis.minorGridlines) {
                        axis.setMinorGridlines(new CSpPr());
                    }
                    if (axis.majorGridlines) {
                        axis.setMajorGridlines(null);
                    }
                    break;
                case c_oAscGridLinesSettings.majorMinor:
                    if (!axis.minorGridlines) {
                        axis.setMinorGridlines(new CSpPr());
                    }
                    if (!axis.majorGridlines) {
                        axis.setMajorGridlines(new CSpPr());
                    }
                    break;
                }
            }
        };
        setAxisGridLines(plot_area.getVerticalAxis(), chartSettings.getHorGridLines());
        setAxisGridLines(plot_area.getHorizontalAxis(), chartSettings.getVertGridLines());
        chart_type = plot_area.charts[0];
        var data_labels_pos_setting = chartSettings.getDataLabelsPos();
        if (isRealNumber(data_labels_pos_setting)) {
            if (data_labels_pos_setting === c_oAscChartDataLabelsPos.none) {
                if (chart_type.dLbls) {
                    chart_type.setDLbls(null);
                }
            } else {
                if (isRealNumber(DLBL_POS_DEFINES_MAP[data_labels_pos_setting])) {
                    if (!chart_type.dLbls) {
                        var d_lbls = new CDLbls();
                        d_lbls.setShowVal(true);
                        chart_type.setDLbls(d_lbls);
                        chart_type.dLbls.setParent(chart_type);
                    }
                    var finish_dlbl_pos = DLBL_POS_DEFINES_MAP[data_labels_pos_setting];
                    switch (chart_type.getObjectType()) {
                    case historyitem_type_BarChart:
                        if (BAR_GROUPING_CLUSTERED === chart_type.grouping) {
                            if (! (finish_dlbl_pos === DLBL_POS_CTR || finish_dlbl_pos === DLBL_POS_IN_END || finish_dlbl_pos === DLBL_POS_IN_BASE || finish_dlbl_pos === DLBL_POS_OUT_END)) {
                                finish_dlbl_pos = DLBL_POS_CTR;
                            }
                        } else {
                            if (! (finish_dlbl_pos === DLBL_POS_CTR || finish_dlbl_pos === DLBL_POS_IN_END || finish_dlbl_pos === DLBL_POS_IN_BASE)) {
                                finish_dlbl_pos = DLBL_POS_CTR;
                            }
                        }
                        break;
                    case historyitem_type_LineChart:
                        case historyitem_type_ScatterChart:
                        if (! (finish_dlbl_pos === DLBL_POS_CTR || finish_dlbl_pos === DLBL_POS_L || finish_dlbl_pos === DLBL_POS_T || finish_dlbl_pos === DLBL_POS_R || finish_dlbl_pos === DLBL_POS_B)) {
                            finish_dlbl_pos = DLBL_POS_CTR;
                        }
                        break;
                    case historyitem_type_PieChart:
                        if (! (finish_dlbl_pos === DLBL_POS_CTR || finish_dlbl_pos === DLBL_POS_IN_END || finish_dlbl_pos === DLBL_POS_OUT_END)) {
                            finish_dlbl_pos = DLBL_POS_CTR;
                        }
                        break;
                    case historyitem_type_AreaChart:
                        case historyitem_type_DoughnutChart:
                        case historyitem_type_StockChart:
                        finish_dlbl_pos = null;
                        break;
                    }
                    if (chart_type.dLbls.dLblPos !== finish_dlbl_pos) {
                        chart_type.dLbls.setDLblPos(finish_dlbl_pos);
                    }
                }
            }
        }
        if (typeof chart_type.setDLbls === "function" && isRealNumber(chartSettings.getDataLabelsPos()) && chartSettings.getDataLabelsPos() !== c_oAscChartDataLabelsPos.none) {
            var checkDataLabels = function (chartType) {
                chartType.removeDataLabels();
                if (!chartType.dLbls) {
                    chartType.setDLbls(new CDLbls());
                    chartType.dLbls.setParent(chartType);
                }
                return chartType.dLbls;
            };
            if (isRealBool(chartSettings.showCatName)) {
                checkDataLabels(chart_type).setShowCatName(chartSettings.showCatName);
            }
            if (isRealBool(chartSettings.showSerName)) {
                checkDataLabels(chart_type).setShowSerName(chartSettings.showSerName);
            }
            if (isRealBool(chartSettings.showVal)) {
                checkDataLabels(chart_type).setShowVal(chartSettings.showVal);
            }
            var d_lbls2 = chart_type.dLbls;
            if (d_lbls2) {
                if (!isRealBool(d_lbls2.showLegendKey) || d_lbls2.showLegendKey === true) {
                    d_lbls2.setShowLegendKey(false);
                }
                if (!isRealBool(d_lbls2.showPercent) || d_lbls2.showPercent === true) {
                    d_lbls2.setShowPercent(false);
                }
                if (!isRealBool(d_lbls2.showBubbleSize) || d_lbls2.showBubbleSize === true) {
                    d_lbls2.setShowBubbleSize(false);
                }
            }
            if (typeof chartSettings.separator === "string" && chartSettings.separator.length > 0) {
                checkDataLabels(chart_type).setSeparator(chartSettings.separator);
            }
        }
        if (chart_type.getObjectType() === historyitem_type_LineChart) {
            if (!isRealBool(chartSettings.showMarker)) {
                chartSettings.showMarker = false;
            }
            if (!isRealBool(chartSettings.bLine)) {
                chartSettings.bLine = true;
            }
            if (chartSettings.showMarker) {
                if (chartSettings.showMarker === true) {
                    if (!chart_type.marker) {
                        chart_type.setMarker(true);
                    }
                }
                if (chartSettings.showMarker) {
                    for (var j = 0; j < chart_type.series.length; ++j) {
                        if (chart_type.series[j].marker) {
                            chart_type.series[j].setMarker(null);
                        }
                    }
                } else {
                    for (var j = 0; j < chart_type.series.length; ++j) {
                        if (!chart_type.series[j].marker) {
                            if (!chart_type.series[j].marker) {
                                chart_type.series[j].setMarker(new CMarker());
                            }
                            if (chart_type.series[j].marker.symbol !== SYMBOL_NONE) {
                                chart_type.series[j].marker.setSymbol(SYMBOL_NONE);
                            }
                        }
                    }
                }
            }
            if (!chartSettings.bLine) {
                for (var j = 0; j < chart_type.series.length; ++j) {
                    removeDPtsFromSeries(chart_type.series[j]);
                    if (!chart_type.series[j].spPr) {
                        chart_type.series[j].setSpPr(new CSpPr());
                    }
                    if (isRealBool(chart_type.series[j].smooth)) {
                        chart_type.series[j].setSmooth(null);
                    }
                    chart_type.series[j].spPr.setLn(CreateNoFillLine());
                }
            } else {
                for (var j = 0; j < chart_type.series.length; ++j) {
                    removeDPtsFromSeries(chart_type.series[j]);
                    if (chart_type.series[j].smooth !== (chartSettings.smooth === true)) {
                        chart_type.series[j].setSmooth(chartSettings.smooth === true);
                    }
                    if (chart_type.series[j].spPr && chart_type.series[j].spPr.ln) {
                        chart_type.series[j].spPr.setLn(null);
                    }
                }
            }
            if (chart_type.smooth !== (chartSettings.smooth === true)) {
                chart_type.setSmooth(chartSettings.smooth === true);
            }
            for (var j = 0; j < chart_type.series.length; ++j) {
                if (chart_type.series[j].smooth !== (chartSettings.smooth === true)) {
                    chart_type.series[j].setSmooth(chartSettings.smooth === true);
                }
            }
        }
        if (chart_type.getObjectType() === historyitem_type_ScatterChart) {
            if (!isRealBool(chartSettings.showMarker)) {
                chartSettings.showMarker = true;
            }
            if (!isRealBool(chartSettings.bLine)) {
                chartSettings.bLine = false;
            }
            for (var i = 0; i < chart_type.series.length; ++i) {
                if (chart_type.series[i].marker) {
                    chart_type.series[i].setMarker(null);
                }
                if (isRealBool(chart_type.series[i].smooth)) {
                    chart_type.series[i].setSmooth(null);
                }
            }
            var new_scatter_style;
            if (chartSettings.bLine) {
                for (var j = 0; j < chart_type.series.length; ++j) {
                    removeDPtsFromSeries(chart_type.series[j]);
                    if (chart_type.series[j].spPr && chart_type.series[j].spPr.ln) {
                        chart_type.series[j].spPr.setLn(null);
                    }
                }
                if (chartSettings.smooth) {
                    if (chartSettings.showMarker) {
                        new_scatter_style = SCATTER_STYLE_SMOOTH_MARKER;
                        for (var j = 0; j < chart_type.series.length; ++j) {
                            if (chart_type.series[j].marker) {
                                chart_type.series[j].setMarker(null);
                            }
                            chart_type.series[j].setSmooth(true);
                        }
                    } else {
                        new_scatter_style = SCATTER_STYLE_SMOOTH;
                        for (var j = 0; j < chart_type.series.length; ++j) {
                            if (!chart_type.series[j].marker) {
                                chart_type.series[j].setMarker(new CMarker());
                            }
                            chart_type.series[j].marker.setSymbol(SYMBOL_NONE);
                            chart_type.series[j].setSmooth(true);
                        }
                    }
                } else {
                    if (chartSettings.showMarker) {
                        new_scatter_style = SCATTER_STYLE_LINE_MARKER;
                        for (var j = 0; j < chart_type.series.length; ++j) {
                            if (chart_type.series[j].marker) {
                                chart_type.series[j].setMarker(null);
                            }
                            chart_type.series[j].setSmooth(false);
                        }
                    } else {
                        new_scatter_style = SCATTER_STYLE_LINE;
                        for (var j = 0; j < chart_type.series.length; ++j) {
                            if (!chart_type.series[j].marker) {
                                chart_type.series[j].setMarker(new CMarker());
                            }
                            chart_type.series[j].marker.setSymbol(SYMBOL_NONE);
                            chart_type.series[j].setSmooth(false);
                        }
                    }
                }
            } else {
                for (var j = 0; j < chart_type.series.length; ++j) {
                    removeDPtsFromSeries(chart_type.series[j]);
                    if (!chart_type.series[j].spPr) {
                        chart_type.series[j].setSpPr(new CSpPr());
                    }
                    chart_type.series[j].spPr.setLn(CreateNoFillLine());
                }
                if (chartSettings.showMarker) {
                    new_scatter_style = SCATTER_STYLE_MARKER;
                    for (var j = 0; j < chart_type.series.length; ++j) {
                        if (chart_type.series[j].marker) {
                            chart_type.series[j].setMarker(null);
                        }
                        chart_type.series[j].setSmooth(false);
                    }
                } else {
                    new_scatter_style = SCATTER_STYLE_MARKER;
                    for (var j = 0; j < chart_type.series.length; ++j) {
                        if (!chart_type.series[j].marker) {
                            chart_type.series[j].setMarker(new CMarker());
                        }
                        chart_type.series[j].marker.setSymbol(SYMBOL_NONE);
                    }
                }
            }
            chart_type.setScatterStyle(new_scatter_style);
        }
    },
    getChartProps: function () {
        var objects_by_types = this.getSelectedObjectsByTypes();
        var ret = null;
        if (objects_by_types.charts.length === 1) {
            ret = this.getPropsFromChart(objects_by_types.charts[0]);
        }
        return ret;
    },
    getPropsFromChart: function (chart_space) {
        var chart = chart_space.chart,
        plot_area = chart_space.chart.plotArea;
        var ret = new asc_ChartSettings();
        var range_obj = chart_space.getRangeObjectStr();
        if (range_obj) {
            if (typeof range_obj.range === "string" && range_obj.range.length > 0) {
                ret.putRange(range_obj.range);
                ret.putInColumns(!range_obj.bVert);
            }
        }
        ret.putStyle(isRealNumber(chart_space.style) ? chart_space.style : null);
        ret.putTitle(isRealObject(chart.title) ? (chart.title.overlay ? c_oAscChartTitleShowSettings.overlay : c_oAscChartTitleShowSettings.noOverlay) : c_oAscChartTitleShowSettings.none);
        var hor_axis = plot_area.getHorizontalAxis();
        var vert_axis = plot_area.getVerticalAxis();
        var calc_grid_lines = function (axis) {
            if (!axis || (!axis.majorGridlines && !axis.minorGridlines)) {
                return c_oAscGridLinesSettings.none;
            }
            if (axis.majorGridlines && !axis.minorGridlines) {
                return c_oAscGridLinesSettings.major;
            }
            if (axis.minorGridlines && !axis.majorGridlines) {
                return c_oAscGridLinesSettings.minor;
            }
            return c_oAscGridLinesSettings.majorMinor;
        };
        var chart_type = plot_area.charts[0];
        var chart_type_object_type = chart_type.getObjectType();
        if (hor_axis) {
            ret.putHorAxisProps(hor_axis.getMenuProps());
        }
        ret.putHorGridLines(calc_grid_lines(vert_axis));
        if (vert_axis) {
            ret.putVertAxisProps(vert_axis.getMenuProps());
            if (chart_type.getObjectType() === historyitem_type_AreaChart && !isRealNumber(vert_axis.crossBetween)) {
                if (ret.horAxisProps) {
                    ret.horAxisProps.putLabelsPosition(c_oAscLabelsPosition.byDivisions);
                }
            }
        }
        ret.putVertGridLines(calc_grid_lines(hor_axis));
        ret.putHorAxisLabel(hor_axis && hor_axis.title ? c_oAscChartHorAxisLabelShowSettings.noOverlay : c_oAscChartTitleShowSettings.none);
        var _label;
        if (vert_axis && vert_axis.title) {
            var tx_body;
            if (vert_axis.title.tx && vert_axis.title.tx.rich) {
                tx_body = vert_axis.title.tx.rich;
            } else {
                if (vert_axis.title.txPr) {
                    tx_body = vert_axis.title.txPr;
                }
            }
            if (tx_body) {
                if (tx_body.bodyPr && tx_body.bodyPr.vert === nVertTThorz) {
                    _label = c_oAscChartVertAxisLabelShowSettings.horizontal;
                } else {
                    _label = c_oAscChartVertAxisLabelShowSettings.rotated;
                }
            } else {
                _label = c_oAscChartVertAxisLabelShowSettings.none;
            }
        } else {
            _label = c_oAscChartVertAxisLabelShowSettings.none;
        }
        ret.putVertAxisLabel(_label);
        var data_labels = plot_area.charts[0].dLbls;
        if (data_labels) {
            ret.putShowSerName(data_labels.showSerName === true);
            ret.putShowCatName(data_labels.showCatName === true);
            ret.putShowVal(data_labels.showVal === true);
            ret.putSeparator(data_labels.separator);
            ret.putDataLabelsPos(isRealNumber(REV_DLBL_POS_DEFINES_MAP[data_labels.dLblPos]) ? REV_DLBL_POS_DEFINES_MAP[data_labels.dLblPos] : c_oAscChartDataLabelsPos.none);
        } else {
            ret.putShowSerName(false);
            ret.putShowCatName(false);
            ret.putShowVal(false);
            ret.putSeparator("");
            ret.putDataLabelsPos(c_oAscChartDataLabelsPos.none);
        }
        if (chart.legend) {
            if (isRealNumber(chart.legend.legendPos)) {
                if (chart.legend.legendPos === LEGEND_POS_L) {
                    ret.putLegendPos(!chart.legend.overlay ? c_oAscChartLegendShowSettings.left : c_oAscChartLegendShowSettings.leftOverlay);
                } else {
                    if (chart.legend.legendPos === LEGEND_POS_T) {
                        ret.putLegendPos(c_oAscChartLegendShowSettings.top);
                    } else {
                        if (chart.legend.legendPos === LEGEND_POS_R) {
                            ret.putLegendPos(!chart.legend.overlay ? c_oAscChartLegendShowSettings.right : c_oAscChartLegendShowSettings.rightOverlay);
                        } else {
                            if (chart.legend.legendPos === LEGEND_POS_B) {
                                ret.putLegendPos(c_oAscChartLegendShowSettings.bottom);
                            } else {
                                ret.putLegendPos(c_oAscChartLegendShowSettings.layout);
                            }
                        }
                    }
                }
            } else {
                ret.putLegendPos(c_oAscChartLegendShowSettings.layout);
            }
        } else {
            ret.putLegendPos(c_oAscChartLegendShowSettings.none);
        }
        var calc_chart_type;
        if (chart_type_object_type === historyitem_type_PieChart) {
            calc_chart_type = c_oAscChartTypeSettings.pie;
        } else {
            if (chart_type_object_type === historyitem_type_DoughnutChart) {
                calc_chart_type = c_oAscChartTypeSettings.doughnut;
            } else {
                if (chart_type_object_type === historyitem_type_StockChart) {
                    calc_chart_type = c_oAscChartTypeSettings.stock;
                } else {
                    if (chart_type_object_type === historyitem_type_BarChart) {
                        var b_hbar = chart_type.barDir === BAR_DIR_BAR;
                        if (b_hbar) {
                            switch (chart_type.grouping) {
                            case BAR_GROUPING_CLUSTERED:
                                calc_chart_type = c_oAscChartTypeSettings.hBarNormal;
                                break;
                            case BAR_GROUPING_STACKED:
                                calc_chart_type = c_oAscChartTypeSettings.hBarStacked;
                                break;
                            case BAR_GROUPING_PERCENT_STACKED:
                                calc_chart_type = c_oAscChartTypeSettings.hBarStackedPer;
                                break;
                            default:
                                calc_chart_type = c_oAscChartTypeSettings.hBarNormal;
                                break;
                            }
                        } else {
                            switch (chart_type.grouping) {
                            case BAR_GROUPING_CLUSTERED:
                                calc_chart_type = c_oAscChartTypeSettings.barNormal;
                                break;
                            case BAR_GROUPING_STACKED:
                                calc_chart_type = c_oAscChartTypeSettings.barStacked;
                                break;
                            case BAR_GROUPING_PERCENT_STACKED:
                                calc_chart_type = c_oAscChartTypeSettings.barStackedPer;
                                break;
                            default:
                                calc_chart_type = c_oAscChartTypeSettings.barNormal;
                                break;
                            }
                        }
                    } else {
                        if (chart_type_object_type === historyitem_type_LineChart) {
                            switch (chart_type.grouping) {
                            case GROUPING_PERCENT_STACKED:
                                calc_chart_type = c_oAscChartTypeSettings.lineStackedPer;
                                break;
                            case GROUPING_STACKED:
                                calc_chart_type = c_oAscChartTypeSettings.lineStacked;
                                break;
                            default:
                                calc_chart_type = c_oAscChartTypeSettings.lineNormal;
                                break;
                            }
                            var bShowMarker = false;
                            if (chart_type.marker !== false) {
                                for (var j = 0; j < chart_type.series.length; ++j) {
                                    if (!chart_type.series[j].marker) {
                                        if (!chart_type.series[j].marker) {
                                            bShowMarker = true;
                                            break;
                                        }
                                        if (chart_type.series[j].marker.symbol !== SYMBOL_NONE) {
                                            bShowMarker = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            ret.putShowMarker(bShowMarker);
                            var b_no_line = true;
                            for (var i = 0; i < chart_type.series.length; ++i) {
                                if (! (chart_type.series[i].spPr && chart_type.series[i].spPr.ln && chart_type.series[i].spPr.ln.Fill && chart_type.series[i].spPr.ln.Fill.fill && chart_type.series[i].spPr.ln.Fill.fill.type === FILL_TYPE_NOFILL)) {
                                    b_no_line = false;
                                    break;
                                }
                            }
                            var b_smooth = true;
                            for (var i = 0; i < chart_type.series.length; ++i) {
                                if (!chart_type.series[i].smooth) {
                                    b_smooth = false;
                                    break;
                                }
                            }
                            if (!b_no_line) {
                                ret.putLine(true);
                                ret.putSmooth(b_smooth);
                            } else {
                                ret.putLine(false);
                            }
                        } else {
                            if (chart_type_object_type === historyitem_type_AreaChart) {
                                switch (chart_type.grouping) {
                                case GROUPING_PERCENT_STACKED:
                                    calc_chart_type = c_oAscChartTypeSettings.areaStackedPer;
                                    break;
                                case GROUPING_STACKED:
                                    calc_chart_type = c_oAscChartTypeSettings.areaStacked;
                                    break;
                                default:
                                    calc_chart_type = c_oAscChartTypeSettings.areaNormal;
                                    break;
                                }
                            } else {
                                if (chart_type_object_type === historyitem_type_ScatterChart) {
                                    calc_chart_type = c_oAscChartTypeSettings.scatter;
                                    switch (chart_type.scatterStyle) {
                                    case SCATTER_STYLE_LINE:
                                        ret.bLine = true;
                                        ret.smooth = false;
                                        ret.showMarker = false;
                                        break;
                                    case SCATTER_STYLE_LINE_MARKER:
                                        ret.bLine = true;
                                        ret.smooth = false;
                                        ret.showMarker = true;
                                        break;
                                    case SCATTER_STYLE_MARKER:
                                        ret.bLine = false;
                                        ret.showMarker = false;
                                        for (var j = 0; j < chart_type.series.length; ++j) {
                                            if (! (chart_type.series[j].marker && chart_type.series[j].marker.symbol === SYMBOL_NONE)) {
                                                ret.showMarker = true;
                                                break;
                                            }
                                        }
                                        break;
                                    case SCATTER_STYLE_NONE:
                                        ret.bLine = false;
                                        ret.showMarker = false;
                                        break;
                                    case SCATTER_STYLE_SMOOTH:
                                        ret.bLine = true;
                                        ret.smooth = true;
                                        ret.showMarker = false;
                                        break;
                                    case SCATTER_STYLE_SMOOTH_MARKER:
                                        ret.bLine = true;
                                        ret.smooth = true;
                                        ret.showMarker = true;
                                        break;
                                    }
                                } else {
                                    calc_chart_type = c_oAscChartTypeSettings.unknown;
                                }
                            }
                        }
                    }
                }
            }
        }
        ret.type = calc_chart_type;
        return ret;
    },
    _getChartSpace: function (chartSeries, options, bUseCache) {
        switch (options.type) {
        case c_oAscChartTypeSettings.lineNormal:
            case c_oAscChartTypeSettings.lineNormalMarker:
            return CreateLineChart(chartSeries, GROUPING_STANDARD, bUseCache);
        case c_oAscChartTypeSettings.lineStacked:
            case c_oAscChartTypeSettings.lineStackedMarker:
            return CreateLineChart(chartSeries, GROUPING_STACKED, bUseCache);
        case c_oAscChartTypeSettings.lineStackedPer:
            case c_oAscChartTypeSettings.lineStackedPerMarker:
            return CreateLineChart(chartSeries, GROUPING_PERCENT_STACKED, bUseCache);
        case c_oAscChartTypeSettings.barNormal:
            return CreateBarChart(chartSeries, BAR_GROUPING_CLUSTERED, bUseCache);
        case c_oAscChartTypeSettings.barStacked:
            return CreateBarChart(chartSeries, BAR_GROUPING_STACKED, bUseCache);
        case c_oAscChartTypeSettings.barStackedPer:
            return CreateBarChart(chartSeries, BAR_GROUPING_PERCENT_STACKED, bUseCache);
        case c_oAscChartTypeSettings.hBarNormal:
            return CreateHBarChart(chartSeries, BAR_GROUPING_CLUSTERED, bUseCache);
        case c_oAscChartTypeSettings.hBarStacked:
            return CreateHBarChart(chartSeries, BAR_GROUPING_STACKED, bUseCache);
        case c_oAscChartTypeSettings.hBarStackedPer:
            return CreateHBarChart(chartSeries, BAR_GROUPING_PERCENT_STACKED, bUseCache);
        case c_oAscChartTypeSettings.areaNormal:
            return CreateAreaChart(chartSeries, GROUPING_STANDARD, bUseCache);
        case c_oAscChartTypeSettings.areaStacked:
            return CreateAreaChart(chartSeries, GROUPING_STACKED, bUseCache);
        case c_oAscChartTypeSettings.areaStackedPer:
            return CreateAreaChart(chartSeries, GROUPING_PERCENT_STACKED, bUseCache);
        case c_oAscChartTypeSettings.stock:
            return CreateStockChart(chartSeries, bUseCache);
        case c_oAscChartTypeSettings.doughnut:
            return CreatePieChart(chartSeries, true, bUseCache);
        case c_oAscChartTypeSettings.pie:
            return CreatePieChart(chartSeries, false, bUseCache);
        case c_oAscChartTypeSettings.scatter:
            case c_oAscChartTypeSettings.scatterLine:
            case c_oAscChartTypeSettings.scatterLineMarker:
            case c_oAscChartTypeSettings.scatterMarker:
            case c_oAscChartTypeSettings.scatterNone:
            case c_oAscChartTypeSettings.scatterSmooth:
            case c_oAscChartTypeSettings.scatterSmoothMarker:
            return CreateScatterChart(chartSeries, bUseCache);
        }
        return null;
    },
    getChartSpace: function (worksheet, options) {
        var chartSeries = getChartSeries(worksheet, options);
        return this._getChartSpace(chartSeries, options);
    },
    getChartSpace2: function (chart, options) {
        var ret = null;
        if (isRealObject(chart) && typeof chart["binary"] === "string" && chart["binary"].length > 0) {
            var asc_chart_binary = new Asc.asc_CChartBinary();
            asc_chart_binary.asc_setBinary(chart["binary"]);
            ret = asc_chart_binary.getChartSpace(editor.WordControl.m_oLogicDocument);
            if (ret.spPr && ret.spPr.xfrm) {
                ret.spPr.xfrm.setOffX(0);
                ret.spPr.xfrm.setOffY(0);
            }
            ret.setBDeleted(false);
        } else {
            if (isRealObject(chart)) {
                ret = DrawingObjectsController.prototype._getChartSpace.call(this, chart, options, true);
                ret.setBDeleted(false);
                ret.setStyle(2);
                ret.setSpPr(new CSpPr());
                ret.spPr.setParent(ret);
                ret.spPr.setXfrm(new CXfrm());
                ret.spPr.xfrm.setParent(ret.spPr);
                ret.spPr.xfrm.setOffX(0);
                ret.spPr.xfrm.setOffY(0);
                ret.spPr.xfrm.setExtX(152);
                ret.spPr.xfrm.setExtY(89);
            }
        }
        return ret;
    },
    getSeriesDefault: function (type) {
        var series = [],
        seria,
        Cat;
        var createItem = function (value) {
            return {
                numFormatStr: "General",
                isDateTimeFormat: false,
                val: value,
                isHidden: false
            };
        };
        var createItem2 = function (value, formatCode) {
            return {
                numFormatStr: formatCode,
                isDateTimeFormat: false,
                val: value,
                isHidden: false
            };
        };
        if (type !== c_oAscChartTypeSettings.stock) {
            var bIsScatter = (c_oAscChartTypeSettings.scatter <= type && type <= c_oAscChartTypeSettings.scatterSmoothMarker);
            Cat = {
                Formula: "Sheet1!A2:A7",
                NumCache: [createItem("USA"), createItem("CHN"), createItem("RUS"), createItem("GBR"), createItem("GER"), createItem("JPN")]
            };
            seria = new asc_CChartSeria();
            seria.Val.Formula = "Sheet1!B2:B7";
            seria.Val.NumCache = [createItem(46), createItem(38), createItem(24), createItem(29), createItem(11), createItem(7)];
            seria.TxCache.Formula = "Sheet1!B1";
            seria.TxCache.Tx = "Gold";
            if (!bIsScatter) {
                seria.Cat = Cat;
            } else {
                seria.xVal = Cat;
            }
            series.push(seria);
            seria = new asc_CChartSeria();
            seria.Val.Formula = "Sheet1!C2:C7";
            seria.Val.NumCache = [createItem(29), createItem(27), createItem(26), createItem(17), createItem(19), createItem(14)];
            seria.TxCache.Formula = "Sheet1!C1";
            seria.TxCache.Tx = "Silver";
            if (!bIsScatter) {
                seria.Cat = Cat;
            } else {
                seria.xVal = Cat;
            }
            series.push(seria);
            seria = new asc_CChartSeria();
            seria.Val.Formula = "Sheet1!D2:D7";
            seria.Val.NumCache = [createItem(29), createItem(23), createItem(32), createItem(19), createItem(14), createItem(17)];
            seria.TxCache.Formula = "Sheet1!D1";
            seria.TxCache.Tx = "Bronze";
            if (!bIsScatter) {
                seria.Cat = Cat;
            } else {
                seria.xVal = Cat;
            }
            series.push(seria);
            return series;
        } else {
            Cat = {
                Formula: "Sheet1!A2:A6",
                NumCache: [createItem2(38719, "d-mmm-yy"), createItem2(38720, "d-mmm-yy"), createItem2(38721, "d-mmm-yy"), createItem2(38722, "d-mmm-yy"), createItem2(38723, "d-mmm-yy")],
                formatCode: "d-mmm-yy"
            };
            seria = new asc_CChartSeria();
            seria.Val.Formula = "Sheet1!B2:B6";
            seria.Val.NumCache = [createItem(40), createItem(21), createItem(37), createItem(49), createItem(32)];
            seria.TxCache.Formula = "Sheet1!B1";
            seria.TxCache.Tx = "Open";
            seria.Cat = Cat;
            series.push(seria);
            seria = new asc_CChartSeria();
            seria.Val.Formula = "Sheet1!C2:C6";
            seria.Val.NumCache = [createItem(57), createItem(54), createItem(52), createItem(59), createItem(34)];
            seria.TxCache.Formula = "Sheet1!C1";
            seria.TxCache.Tx = "High";
            seria.Cat = Cat;
            series.push(seria);
            seria = new asc_CChartSeria();
            seria.Val.Formula = "Sheet1!D2:D6";
            seria.Val.NumCache = [createItem(10), createItem(14), createItem(14), createItem(12), createItem(6)];
            seria.TxCache.Formula = "Sheet1!D1";
            seria.TxCache.Tx = "Low";
            seria.Cat = Cat;
            series.push(seria);
            seria = new asc_CChartSeria();
            seria.Val.Formula = "Sheet1!E2:E6";
            seria.Val.NumCache = [createItem(24), createItem(35), createItem(48), createItem(35), createItem(15)];
            seria.TxCache.Formula = "Sheet1!E1";
            seria.TxCache.Tx = "Close";
            seria.Cat = Cat;
            series.push(seria);
            return series;
        }
    },
    changeCurrentState: function (newState) {
        this.curState = newState;
    },
    updateSelectionState: function (bNoCheck) {
        var text_object, drawingDocument = this.drawingObjects.getDrawingDocument();
        if (this.selection.textSelection) {
            text_object = this.selection.textSelection;
        } else {
            if (this.selection.groupSelection) {
                if (this.selection.groupSelection.selection.textSelection) {
                    text_object = this.selection.groupSelection.selection.textSelection;
                } else {
                    if (this.selection.groupSelection.selection.chartSelection && this.selection.groupSelection.selection.chartSelection.selection.textSelection) {
                        text_object = this.selection.groupSelection.selection.chartSelection.selection.textSelection;
                    }
                }
            } else {
                if (this.selection.chartSelection && this.selection.chartSelection.selection.textSelection) {
                    text_object = this.selection.chartSelection.selection.textSelection;
                }
            }
        }
        if (isRealObject(text_object)) {
            text_object.updateSelectionState(drawingDocument);
        } else {
            if (bNoCheck !== true) {
                drawingDocument.UpdateTargetTransform(null);
                drawingDocument.TargetEnd();
                drawingDocument.SelectEnabled(false);
                drawingDocument.SelectClear();
                drawingDocument.SelectShow();
            }
        }
    },
    remove: function (dir) {
        var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
        var content = this.getTargetDocContent();
        if (asc["editor"] && asc["editor"].isChartEditor && !content) {
            return;
        }
        this.checkSelectedObjectsAndCallback(this.removeCallback, [dir], false, historydescription_Spreadsheet_Remove);
    },
    removeCallback: function (dir) {
        var target_text_object = getTargetTextObject(this);
        if (target_text_object) {
            if (target_text_object.getObjectType() === historyitem_type_GraphicFrame) {
                target_text_object.graphicObject.Remove(dir);
            } else {
                var content = this.getTargetDocContent(true);
                if (content) {
                    content.Remove(dir, true);
                }
            }
        } else {
            if (this.selectedObjects.length > 0) {
                var worksheet = this.drawingObjects.getWorksheet();
                if (worksheet) {
                    worksheet.arrActiveChartsRanges = [];
                }
                if (this.selection.groupSelection) {
                    if (this.selection.groupSelection.selection.chartSelection) {} else {
                        var group_map = {},
                        group_arr = [],
                        i,
                        cur_group,
                        sp,
                        xc,
                        yc,
                        hc,
                        vc,
                        rel_xc,
                        rel_yc,
                        j;
                        for (i = 0; i < this.selection.groupSelection.selectedObjects.length; ++i) {
                            this.selection.groupSelection.selectedObjects[i].group.removeFromSpTree(this.selection.groupSelection.selectedObjects[i].Get_Id());
                            group_map[this.selection.groupSelection.selectedObjects[i].group.Get_Id() + ""] = this.selection.groupSelection.selectedObjects[i].group;
                        }
                        group_map[this.selection.groupSelection.Get_Id() + ""] = this.selection.groupSelection;
                        for (var key in group_map) {
                            if (group_map.hasOwnProperty(key)) {
                                group_arr.push(group_map[key]);
                            }
                        }
                        group_arr.sort(CompareGroups);
                        var a_objects = [];
                        for (i = 0; i < group_arr.length; ++i) {
                            cur_group = group_arr[i];
                            if (isRealObject(cur_group.group)) {
                                if (cur_group.spTree.length === 0) {
                                    cur_group.group.removeFromSpTree(cur_group.Get_Id());
                                } else {
                                    if (cur_group.spTree.length == 1) {
                                        sp = cur_group.spTree[0];
                                        hc = sp.spPr.xfrm.extX / 2;
                                        vc = sp.spPr.xfrm.extY / 2;
                                        xc = sp.transform.TransformPointX(hc, vc);
                                        yc = sp.transform.TransformPointY(hc, vc);
                                        rel_xc = cur_group.group.invertTransform.TransformPointX(xc, yc);
                                        rel_yc = cur_group.group.invertTransform.TransformPointY(xc, yc);
                                        sp.spPr.xfrm.setOffX(rel_xc - hc);
                                        sp.spPr.xfrm.setOffY(rel_yc - vc);
                                        sp.spPr.xfrm.setRot(normalizeRotate(cur_group.rot + sp.rot));
                                        sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                        sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                        sp.setGroup(cur_group.group);
                                        for (j = 0; j < cur_group.group.spTree.length; ++j) {
                                            if (cur_group.group.spTree[j] === cur_group) {
                                                cur_group.group.addToSpTree(j, sp);
                                                cur_group.group.removeFromSpTree(cur_group.Get_Id());
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (cur_group.spTree.length === 0) {
                                    this.resetInternalSelection();
                                    this.removeCallback();
                                    return;
                                } else {
                                    if (cur_group.spTree.length === 1) {
                                        sp = cur_group.spTree[0];
                                        sp.spPr.xfrm.setOffX(cur_group.spPr.xfrm.offX + sp.spPr.xfrm.offX);
                                        sp.spPr.xfrm.setOffY(cur_group.spPr.xfrm.offY + sp.spPr.xfrm.offY);
                                        sp.spPr.xfrm.setRot(normalizeRotate(cur_group.rot + sp.rot));
                                        sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                                        sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                                        sp.setGroup(null);
                                        sp.addToDrawingObjects();
                                        sp.checkDrawingBaseCoords();
                                        cur_group.deleteDrawingBase();
                                        this.resetSelection();
                                        this.selectObject(sp, cur_group.selectStartPage);
                                    } else {
                                        cur_group.updateCoordinatesAfterInternalResize();
                                    }
                                }
                                this.resetInternalSelection();
                                this.recalculate();
                                return;
                            }
                        }
                        this.resetInternalSelection();
                    }
                } else {
                    for (var i = 0; i < this.selectedObjects.length; ++i) {
                        this.selectedObjects[i].deleteDrawingBase(true);
                    }
                    this.resetSelection();
                    this.recalculate();
                }
                this.updateOverlay();
            } else {
                if (this.drawingObjects.slideComments) {
                    this.drawingObjects.slideComments.removeSelectedComment();
                }
            }
        }
    },
    getAllObjectsOnPage: function (pageIndex, bHdrFtr) {
        return this.getDrawingArray();
    },
    selectNextObject: function (direction) {
        var selection_array = this.selectedObjects;
        if (selection_array.length > 0) {
            var i, graphic_page;
            if (direction > 0) {
                var selectNext = function (oThis, last_selected_object) {
                    var search_array = oThis.getAllObjectsOnPage(last_selected_object.selectStartPage, last_selected_object.parent && last_selected_object.parent.DocumentContent && last_selected_object.parent.DocumentContent.Is_HdrFtr(false));
                    if (search_array.length > 0) {
                        for (var i = search_array.length - 1; i > -1; --i) {
                            if (search_array[i] === last_selected_object) {
                                break;
                            }
                        }
                        if (i > -1) {
                            oThis.resetSelection();
                            oThis.selectObject(search_array[i < search_array.length - 1 ? i + 1 : 0], last_selected_object.selectStartPage);
                            return;
                        } else {
                            return;
                        }
                    }
                };
                if (this.selection.groupSelection) {
                    for (i = this.selection.groupSelection.arrGraphicObjects.length - 1; i > -1; --i) {
                        if (this.selection.groupSelection.arrGraphicObjects[i].selected) {
                            break;
                        }
                    }
                    if (i > -1) {
                        if (i < this.selection.groupSelection.arrGraphicObjects.length - 1) {
                            this.selection.groupSelection.resetSelection();
                            this.selection.groupSelection.selectObject(this.selection.groupSelection.arrGraphicObjects[i + 1], this.selection.groupSelection.selectStartPage);
                        } else {
                            selectNext(this, this.selection.groupSelection);
                        }
                    }
                } else {
                    var last_selected_object = this.selectedObjects[this.selectedObjects.length - 1];
                    if (last_selected_object.getObjectType() === historyitem_type_GroupShape) {
                        this.resetSelection();
                        this.selectObject(last_selected_object, last_selected_object.selectStartPage);
                        this.selection.groupSelection = last_selected_object;
                        last_selected_object.selectObject(last_selected_object.arrGraphicObjects[0], last_selected_object.selectStartPage);
                    } else {
                        selectNext(this, last_selected_object);
                    }
                }
            } else {
                var selectPrev = function (oThis, first_selected_object) {
                    var search_array = oThis.getAllObjectsOnPage(first_selected_object.selectStartPage, first_selected_object.parent && first_selected_object.parent.DocumentContent && first_selected_object.parent.DocumentContent.Is_HdrFtr(false));
                    if (search_array.length > 0) {
                        for (var i = 0; i < search_array.length; ++i) {
                            if (search_array[i] === first_selected_object) {
                                break;
                            }
                        }
                        if (i < search_array.length) {
                            oThis.resetSelection();
                            oThis.selectObject(search_array[i > 0 ? i - 1 : search_array.length - 1], first_selected_object.selectStartPage);
                            return;
                        } else {
                            return;
                        }
                    }
                };
                if (this.selection.groupSelection) {
                    for (i = 0; i < this.selection.groupSelection.arrGraphicObjects.length; ++i) {
                        if (this.selection.groupSelection.arrGraphicObjects[i].selected) {
                            break;
                        }
                    }
                    if (i < this.selection.groupSelection.arrGraphicObjects.length) {
                        if (i > 0) {
                            this.selection.groupSelection.resetSelection();
                            this.selection.groupSelection.selectObject(this.selection.groupSelection.arrGraphicObjects[i - 1], this.selection.groupSelection.selectStartPage);
                        } else {
                            selectPrev(this, this.selection.groupSelection);
                        }
                    } else {
                        return;
                    }
                } else {
                    var first_selected_object = this.selectedObjects[0];
                    if (first_selected_object.getObjectType() === historyitem_type_GroupShape) {
                        this.resetSelection();
                        this.selectObject(first_selected_object, first_selected_object.selectStartPage);
                        this.selection.groupSelection = first_selected_object;
                        first_selected_object.selectObject(first_selected_object.arrGraphicObjects[first_selected_object.arrGraphicObjects.length - 1], first_selected_object.selectStartPage);
                    } else {
                        selectPrev(this, first_selected_object);
                    }
                }
            }
            this.updateOverlay();
        }
    },
    moveSelectedObjects: function (dx, dy) {
        if (! (this.isViewMode() === false)) {
            return;
        }
        this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
        this.swapTrackObjects();
        var move_state;
        if (!this.selection.groupSelection) {
            move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
        } else {
            move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
        }
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            this.arrTrackObjects[i].track(dx, dy, this.arrTrackObjects[i].originalObject.selectStartPage);
        }
        move_state.onMouseUp({},
        0, 0, 0);
    },
    cursorMoveToStartPos: function () {
        var content = this.getTargetDocContent(undefined, true);
        if (content) {
            content.Cursor_MoveToStartPos();
            this.updateSelectionState();
        }
    },
    cursorMoveToEndPos: function () {
        var content = this.getTargetDocContent(undefined, true);
        if (content) {
            content.Cursor_MoveToEndPos();
            this.updateSelectionState();
        }
    },
    cursorMoveLeft: function (AddToSelect, Word) {
        var target_text_object = getTargetTextObject(this);
        if (target_text_object) {
            if (target_text_object.getObjectType() === historyitem_type_GraphicFrame) {
                target_text_object.graphicObject.Cursor_MoveLeft(1, AddToSelect, Word);
            } else {
                var content = this.getTargetDocContent(undefined, true);
                if (content) {
                    content.Cursor_MoveLeft(AddToSelect, Word);
                }
            }
            this.updateSelectionState();
        } else {
            if (this.selectedObjects.length === 0) {
                return;
            }
            this.moveSelectedObjects(-this.convertPixToMM(5), 0);
        }
    },
    cursorMoveRight: function (AddToSelect, Word) {
        var target_text_object = getTargetTextObject(this);
        if (target_text_object) {
            if (target_text_object.getObjectType() === historyitem_type_GraphicFrame) {
                target_text_object.graphicObject.Cursor_MoveRight(1, AddToSelect, Word);
            } else {
                var content = this.getTargetDocContent(undefined, true);
                if (content) {
                    content.Cursor_MoveRight(AddToSelect, Word);
                }
            }
            this.updateSelectionState();
        } else {
            if (this.selectedObjects.length === 0) {
                return;
            }
            this.moveSelectedObjects(this.convertPixToMM(5), 0);
        }
    },
    cursorMoveUp: function (AddToSelect) {
        var target_text_object = getTargetTextObject(this);
        if (target_text_object) {
            if (target_text_object.getObjectType() === historyitem_type_GraphicFrame) {
                target_text_object.graphicObject.Cursor_MoveUp(1, AddToSelect);
            } else {
                var content = this.getTargetDocContent(undefined, true);
                if (content) {
                    content.Cursor_MoveUp(AddToSelect);
                }
            }
            this.updateSelectionState();
        } else {
            if (this.selectedObjects.length === 0) {
                return;
            }
            this.moveSelectedObjects(0, -this.convertPixToMM(5));
        }
    },
    cursorMoveDown: function (AddToSelect) {
        var target_text_object = getTargetTextObject(this);
        if (target_text_object) {
            if (target_text_object.getObjectType() === historyitem_type_GraphicFrame) {
                target_text_object.graphicObject.Cursor_MoveDown(1, AddToSelect);
            } else {
                var content = this.getTargetDocContent(undefined, true);
                if (content) {
                    content.Cursor_MoveDown(AddToSelect);
                }
            }
            this.updateSelectionState();
        } else {
            if (this.selectedObjects.length === 0) {
                return;
            }
            this.moveSelectedObjects(0, this.convertPixToMM(5));
        }
    },
    cursorMoveEndOfLine: function (AddToSelect) {
        var content = this.getTargetDocContent(undefined, true);
        if (content) {
            content.Cursor_MoveEndOfLine(AddToSelect);
            this.updateSelectionState();
        }
    },
    cursorMoveStartOfLine: function (AddToSelect) {
        var content = this.getTargetDocContent(undefined, true);
        if (content) {
            content.Cursor_MoveStartOfLine(AddToSelect);
            this.updateSelectionState();
        }
    },
    cursorMoveAt: function (X, Y, AddToSelect) {
        var text_object;
        if (this.selection.textSelection) {
            text_object = this.selection.textSelection;
        } else {
            if (this.selection.groupSelection && this.selection.groupSelection.selection.textSelection) {
                text_object = this.selection.groupSelection.selection.textSelection;
            }
        }
        if (text_object && text_object.cursorMoveAt) {
            text_object.cursorMoveAt(X, Y, AddToSelect);
            this.updateSelectionState();
        }
    },
    selectAll: function () {
        var i;
        var target_text_object = getTargetTextObject(this);
        if (target_text_object) {
            if (target_text_object.getObjectType() === historyitem_type_GraphicFrame) {
                target_text_object.graphicObject.Select_All();
            } else {
                var content = this.getTargetDocContent();
                if (content) {
                    content.Select_All();
                }
            }
        } else {
            if (!this.document) {
                if (this.selection.groupSelection) {
                    if (!this.selection.groupSelection.selection.chartSelection) {
                        this.selection.groupSelection.resetSelection();
                        for (i = this.selection.groupSelection.arrGraphicObjects.length - 1; i > -1; --i) {
                            this.selection.groupSelection.selectObject(this.selection.groupSelection.arrGraphicObjects[i], 0);
                        }
                    }
                } else {
                    if (!this.selection.chartSelection) {
                        this.resetSelection();
                        var drawings = this.getDrawingObjects();
                        for (i = drawings.length - 1; i > -1; --i) {
                            this.selectObject(drawings[i], 0);
                        }
                    }
                }
            }
        }
        this.updateSelectionState();
    },
    onKeyDown: function (e) {
        var ctrlKey = e.metaKey || e.ctrlKey;
        var drawingObjectsController = this;
        var bRetValue = false;
        var state = drawingObjectsController.curState;
        var isViewMode = drawingObjectsController.drawingObjects.isViewerMode();
        if (e.keyCode == 8 && false === isViewMode) {
            drawingObjectsController.remove(-1);
            bRetValue = true;
        } else {
            if (e.keyCode == 9 && false === isViewMode) {
                if (this.getTargetDocContent()) {
                    var oThis = this;
                    var callBack = function () {
                        oThis.paragraphAdd(new ParaTab());
                    };
                    this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_AddTab);
                } else {
                    this.selectNextObject(!e.shiftKey ? 1 : -1);
                }
            } else {
                if (e.keyCode == 13 && false === isViewMode) {
                    var target_doc_content = this.getTargetDocContent();
                    if (target_doc_content) {
                        var hyperlink = this.hyperlinkCheck(false);
                        if (hyperlink && !e.shiftKey) {
                            window["Asc"]["editor"].wb.handlers.trigger("asc_onHyperlinkClick", hyperlink.Get_Value());
                            hyperlink.Set_Visited(true);
                            this.drawingObjects.showDrawingObjects(true);
                        } else {
                            this.checkSelectedObjectsAndCallback(this.addNewParagraph, [], false, historydescription_Spreadsheet_AddNewParagraph);
                            this.recalculate();
                        }
                    } else {}
                    bRetValue = true;
                } else {
                    if (e.keyCode == 27) {
                        var content = this.getTargetDocContent();
                        if (content) {
                            content.Selection_Remove();
                        }
                        if (this.selection.textSelection) {
                            this.selection.textSelection = null;
                            drawingObjectsController.updateSelectionState();
                        } else {
                            if (this.selection.groupSelection) {
                                if (this.selection.groupSelection.selection.textSelection) {
                                    this.selection.groupSelection.selection.textSelection = null;
                                } else {
                                    if (this.selection.groupSelection.selection.chartSelection) {
                                        if (this.selection.groupSelection.selection.chartSelection.selection.textSelection) {
                                            this.selection.groupSelection.selection.chartSelection.selection.textSelection = null;
                                        } else {
                                            this.selection.groupSelection.selection.chartSelection.resetSelection();
                                            this.selection.groupSelection.selection.chartSelection = null;
                                        }
                                    } else {
                                        this.selection.groupSelection.resetSelection();
                                        this.selection.groupSelection = null;
                                    }
                                }
                                drawingObjectsController.updateSelectionState();
                            } else {
                                if (this.selection.chartSelection) {
                                    if (this.selection.chartSelection.selection.textSelection) {
                                        this.selection.chartSelection.selection.textSelection = null;
                                    } else {
                                        this.selection.chartSelection.resetSelection();
                                        this.selection.chartSelection = null;
                                    }
                                    drawingObjectsController.updateSelectionState();
                                } else {
                                    this.resetSelection();
                                    var ws = drawingObjectsController.drawingObjects.getWorksheet();
                                    var isChangeSelectionShape = ws._checkSelectionShape();
                                    if (isChangeSelectionShape) {
                                        ws._drawSelection();
                                        ws._updateSelectionNameAndInfo();
                                    }
                                }
                            }
                        }
                        bRetValue = true;
                    } else {
                        if (e.keyCode == 32 && false === isViewMode) {
                            if (!ctrlKey) {
                                var oThis = this;
                                var callBack = function () {
                                    oThis.paragraphAdd(new ParaSpace(1));
                                };
                                this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_AddSpace);
                                this.recalculate();
                            }
                            bRetValue = true;
                        } else {
                            if (e.keyCode == 33) {} else {
                                if (e.keyCode == 34) {} else {
                                    if (e.keyCode == 35) {
                                        var content = this.getTargetDocContent();
                                        if (content) {
                                            if (ctrlKey) {
                                                content.Cursor_MoveToEndPos();
                                                drawingObjectsController.updateSelectionState();
                                            } else {
                                                content.Cursor_MoveEndOfLine(e.shiftKey);
                                                drawingObjectsController.updateSelectionState();
                                            }
                                        }
                                        bRetValue = true;
                                    } else {
                                        if (e.keyCode == 36) {
                                            var content = this.getTargetDocContent();
                                            if (content) {
                                                if (ctrlKey) {
                                                    content.Cursor_MoveToStartPos();
                                                    drawingObjectsController.updateSelectionState();
                                                } else {
                                                    content.Cursor_MoveStartOfLine(e.shiftKey);
                                                    drawingObjectsController.updateSelectionState();
                                                }
                                            }
                                            bRetValue = true;
                                        } else {
                                            if (e.keyCode == 37) {
                                                this.cursorMoveLeft(e.shiftKey, ctrlKey);
                                                this.drawingObjects.sendGraphicObjectProps();
                                                bRetValue = true;
                                            } else {
                                                if (e.keyCode == 38) {
                                                    this.cursorMoveUp(e.shiftKey);
                                                    this.drawingObjects.sendGraphicObjectProps();
                                                    bRetValue = true;
                                                } else {
                                                    if (e.keyCode == 39) {
                                                        this.cursorMoveRight(e.shiftKey, ctrlKey);
                                                        this.drawingObjects.sendGraphicObjectProps();
                                                        bRetValue = true;
                                                    } else {
                                                        if (e.keyCode == 40) {
                                                            this.cursorMoveDown(e.shiftKey);
                                                            this.drawingObjects.sendGraphicObjectProps();
                                                            bRetValue = true;
                                                        } else {
                                                            if (e.keyCode == 45) {} else {
                                                                if (e.keyCode == 46 && false === isViewMode) {
                                                                    drawingObjectsController.remove(1);
                                                                    bRetValue = true;
                                                                } else {
                                                                    if (e.keyCode == 65 && true === ctrlKey) {
                                                                        this.selectAll();
                                                                        this.drawingObjects.sendGraphicObjectProps();
                                                                        bRetValue = true;
                                                                    } else {
                                                                        if (e.keyCode == 66 && false === isViewMode && true === ctrlKey) {
                                                                            var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                            if (isRealObject(TextPr)) {
                                                                                this.setCellBold(TextPr.Bold === true ? false : true);
                                                                                bRetValue = true;
                                                                            }
                                                                        } else {
                                                                            if (e.keyCode == 67 && true === ctrlKey) {} else {
                                                                                if (e.keyCode == 69 && false === isViewMode && true === ctrlKey) {
                                                                                    var ParaPr = drawingObjectsController.getParagraphParaPr();
                                                                                    if (isRealObject(ParaPr)) {
                                                                                        this.setCellAlign(ParaPr.Jc === align_Center ? "left" : "center");
                                                                                        bRetValue = true;
                                                                                    }
                                                                                } else {
                                                                                    if (e.keyCode == 73 && false === isViewMode && true === ctrlKey) {
                                                                                        var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                        if (isRealObject(TextPr)) {
                                                                                            drawingObjectsController.setCellItalic(TextPr.Italic === true ? false : true);
                                                                                            bRetValue = true;
                                                                                        }
                                                                                    } else {
                                                                                        if (e.keyCode == 74 && false === isViewMode && true === ctrlKey) {
                                                                                            var ParaPr = drawingObjectsController.getParagraphParaPr();
                                                                                            if (isRealObject(ParaPr)) {
                                                                                                drawingObjectsController.setCellAlign(ParaPr.Jc === align_Justify ? "left" : "justify");
                                                                                                bRetValue = true;
                                                                                            }
                                                                                        } else {
                                                                                            if (e.keyCode == 75 && false === isViewMode && true === ctrlKey) {
                                                                                                bRetValue = true;
                                                                                            } else {
                                                                                                if (e.keyCode == 76 && false === isViewMode && true === ctrlKey) {
                                                                                                    var ParaPr = drawingObjectsController.getParagraphParaPr();
                                                                                                    if (isRealObject(ParaPr)) {
                                                                                                        drawingObjectsController.setCellAlign(ParaPr.Jc === align_Left ? "justify" : "left");
                                                                                                        bRetValue = true;
                                                                                                    }
                                                                                                } else {
                                                                                                    if (e.keyCode == 77 && false === isViewMode && true === ctrlKey) {
                                                                                                        bRetValue = true;
                                                                                                    } else {
                                                                                                        if (e.keyCode == 80 && true === ctrlKey) {
                                                                                                            bRetValue = true;
                                                                                                        } else {
                                                                                                            if (e.keyCode == 82 && false === isViewMode && true === ctrlKey) {
                                                                                                                var ParaPr = drawingObjectsController.getParagraphParaPr();
                                                                                                                if (isRealObject(ParaPr)) {
                                                                                                                    drawingObjectsController.setCellAlign(ParaPr.Jc === align_Right ? "left" : "right");
                                                                                                                    bRetValue = true;
                                                                                                                }
                                                                                                            } else {
                                                                                                                if (e.keyCode == 83 && false === isViewMode && true === ctrlKey) {
                                                                                                                    bRetValue = false;
                                                                                                                } else {
                                                                                                                    if (e.keyCode == 85 && false === isViewMode && true === ctrlKey) {
                                                                                                                        var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                                                        if (isRealObject(TextPr)) {
                                                                                                                            drawingObjectsController.setCellUnderline(TextPr.Underline === true ? false : true);
                                                                                                                            bRetValue = true;
                                                                                                                        }
                                                                                                                    } else {
                                                                                                                        if (e.keyCode == 86 && false === isViewMode && true === ctrlKey) {} else {
                                                                                                                            if (e.keyCode == 88 && false === isViewMode && true === ctrlKey) {} else {
                                                                                                                                if (e.keyCode == 89 && false === isViewMode && true === ctrlKey) {} else {
                                                                                                                                    if (e.keyCode == 90 && false === isViewMode && true === ctrlKey) {} else {
                                                                                                                                        if (e.keyCode == 93 || 57351 == e.keyCode) {
                                                                                                                                            bRetValue = true;
                                                                                                                                        } else {
                                                                                                                                            if (e.keyCode == 121 && true === e.shiftKey) {} else {
                                                                                                                                                if (e.keyCode == 144) {} else {
                                                                                                                                                    if (e.keyCode == 145) {} else {
                                                                                                                                                        if (e.keyCode == 187 && false === isViewMode && true === ctrlKey) {
                                                                                                                                                            var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                                                                                            if (isRealObject(TextPr)) {
                                                                                                                                                                if (true === e.shiftKey) {
                                                                                                                                                                    drawingObjectsController.setCellSuperscript(TextPr.VertAlign === vertalign_SuperScript ? false : true);
                                                                                                                                                                } else {
                                                                                                                                                                    drawingObjectsController.setCellSubscript(TextPr.VertAlign === vertalign_SubScript ? false : true);
                                                                                                                                                                }
                                                                                                                                                                bRetValue = true;
                                                                                                                                                            }
                                                                                                                                                        } else {
                                                                                                                                                            if (e.keyCode == 188 && true === ctrlKey) {
                                                                                                                                                                var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                                                                                                if (isRealObject(TextPr)) {
                                                                                                                                                                    drawingObjectsController.setCellSuperscript(TextPr.VertAlign === vertalign_SuperScript ? false : true);
                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                if (e.keyCode == 189 && false === isViewMode) {
                                                                                                                                                                    var Item = null;
                                                                                                                                                                    var oThis = this;
                                                                                                                                                                    var callBack = function () {
                                                                                                                                                                        var Item = null;
                                                                                                                                                                        if (true === ctrlKey && true === e.shiftKey) {
                                                                                                                                                                            Item = new ParaText(String.fromCharCode(8211));
                                                                                                                                                                            Item.SpaceAfter = false;
                                                                                                                                                                        } else {
                                                                                                                                                                            if (true === e.shiftKey) {
                                                                                                                                                                                Item = new ParaText("_");
                                                                                                                                                                            } else {
                                                                                                                                                                                Item = new ParaText("-");
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                        oThis.paragraphAdd(Item);
                                                                                                                                                                    };
                                                                                                                                                                    this.checkSelectedObjectsAndCallback(callBack, [], false, historydescription_Spreadsheet_AddItem);
                                                                                                                                                                    this.recalculate();
                                                                                                                                                                    bRetValue = true;
                                                                                                                                                                } else {
                                                                                                                                                                    if (e.keyCode == 190 && true === ctrlKey) {
                                                                                                                                                                        var TextPr = drawingObjectsController.getParagraphTextPr();
                                                                                                                                                                        if (isRealObject(TextPr)) {
                                                                                                                                                                            drawingObjectsController.setCellSubscript(TextPr.VertAlign === vertalign_SubScript ? false : true);
                                                                                                                                                                            bRetValue = true;
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        if (e.keyCode == 219 && false === isViewMode && true === ctrlKey) {
                                                                                                                                                                            drawingObjectsController.decreaseFontSize();
                                                                                                                                                                            bRetValue = true;
                                                                                                                                                                        } else {
                                                                                                                                                                            if (e.keyCode == 221 && false === isViewMode && true === ctrlKey) {
                                                                                                                                                                                drawingObjectsController.increaseFontSize();
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
    },
    resetSelectionState: function () {
        if (this.bNoResetSeclectionState === true) {
            return;
        }
        this.checkChartTextSelection();
        this.resetSelection();
        this.clearPreTrackObjects();
        this.clearTrackObjects();
        this.changeCurrentState(new NullState(this, this.drawingObjects));
        this.updateSelectionState();
        var asc = window["Asc"] ? window["Asc"] : (window["Asc"] = {});
        asc["editor"] && asc["editor"].asc_endAddShape();
    },
    resetSelectionState2: function () {
        var count = this.selectedObjects.length;
        while (count > 0) {
            this.selectedObjects[0].deselect(this);
            --count;
        }
        this.changeCurrentState(new NullState(this, this.drawingObjects));
    },
    getColorMapOverride: function () {
        return null;
    },
    Document_UpdateInterfaceState: function () {},
    getDocumentUrl: function () {
        if (typeof editor !== "undefined" && isRealObject(editor) && typeof editor.DocumentUrl === "string") {
            return editor.DocumentUrl;
        }
        return null;
    },
    getChartObject: function (type) {
        if (null != type) {
            return ExecuteNoHistory(function () {
                var options = new asc_ChartSettings();
                options.type = type;
                options.putTitle(c_oAscChartTitleShowSettings.noOverlay);
                var chartSeries = {
                    series: DrawingObjectsController.prototype.getSeriesDefault.call(this, type),
                    parsedHeaders: {
                        bLeft: true,
                        bTop: true
                    }
                };
                var ret = this.getChartSpace2(chartSeries, options);
                if (!ret) {
                    chartSeries = {
                        series: DrawingObjectsController.prototype.getSeriesDefault.call(this, c_oAscChartTypeSettings.barNormal),
                        parsedHeaders: {
                            bLeft: true,
                            bTop: true
                        }
                    };
                    ret = this.getChartSpace2(chartSeries, options);
                }
                if (type === c_oAscChartTypeSettings.scatter) {
                    var new_hor_axis_settings = new asc_ValAxisSettings();
                    new_hor_axis_settings.setDefault();
                    options.putHorAxisProps(new_hor_axis_settings);
                    var new_vert_axis_settings = new asc_ValAxisSettings();
                    new_vert_axis_settings.setDefault();
                    options.putVertAxisProps(new_vert_axis_settings);
                    options.putHorGridLines(c_oAscGridLinesSettings.major);
                    options.putVertGridLines(c_oAscGridLinesSettings.major);
                    options.putShowMarker(true);
                    options.putSmooth(null);
                    options.putLine(false);
                }
                options.type = null;
                this.applyPropsToChartSpace(options, ret);
                ret.theme = this.getTheme();
                CheckSpPrXfrm(ret);
                ret.spPr.xfrm.setOffX(0);
                ret.spPr.xfrm.setOffY(0);
                ret.theme = this.getTheme();
                ret.colorMapOverride = this.getColorMapOverride();
                ret.DocumentUrl = this.getDocumentUrl();
                return ret;
            },
            this, []);
        } else {
            var by_types = getObjectsByTypesFromArr(this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects, true);
            if (by_types.charts.length === 1) {
                by_types.charts[0].theme = this.getTheme();
                by_types.charts[0].colorMapOverride = this.getColorMapOverride();
                by_types.charts[0].DocumentUrl = this.getDocumentUrl();
                ExecuteNoHistory(function () {
                    CheckSpPrXfrm2(by_types.charts[0]);
                },
                this, []);
                return by_types.charts[0];
            }
        }
        return null;
    },
    checkNeedResetChartSelection: function (e, x, y, pageIndex, bTextFlag) {
        var oTitle, oCursorInfo, oTargetTextObject = getTargetTextObject(this);
        if (oTargetTextObject instanceof CTitle) {
            oTitle = oTargetTextObject;
        }
        if (!oTitle) {
            return true;
        }
        this.handleEventMode = HANDLE_EVENT_MODE_CURSOR;
        oCursorInfo = this.curState.onMouseDown(e, x, y, pageIndex, bTextFlag);
        this.handleEventMode = HANDLE_EVENT_MODE_HANDLE;
        return ! (isRealObject(oCursorInfo) && oTitle === oCursorInfo.title);
    },
    checkChartTextSelection: function (bNoRedraw) {
        if (this.bNoCheckChartTextSelection === true) {
            return;
        }
        var chart_selection;
        if (this.selection.chartSelection) {
            chart_selection = this.selection.chartSelection;
        } else {
            if (this.selection.groupSelection && this.selection.groupSelection.selection.chartSelection) {
                chart_selection = this.selection.groupSelection.selection.chartSelection;
            }
        }
        if (chart_selection && chart_selection.selection.textSelection) {
            var content = chart_selection.selection.textSelection.getDocContent();
            if (content) {
                if (content.Is_Empty()) {
                    if (chart_selection.selection.title && chart_selection.selection.title.parent) {
                        History.Create_NewPoint(historydescription_CommonControllerCheckChartText);
                        chart_selection.selection.title.parent.setTitle(null);
                    }
                }
            }
            if (chart_selection.recalcInfo.bRecalculatedTitle) {
                chart_selection.recalcInfo.recalcTitle = null;
                chart_selection.handleUpdateInternalChart();
                if (this.document) {
                    chart_selection.recalculate();
                    this.document.DrawingDocument.OnRecalculatePage(chart_selection.selectStartPage, this.document.Pages[chart_selection.selectStartPage]);
                    this.document.DrawingDocument.OnEndRecalculate(false, true);
                } else {
                    if (this.drawingObjects.cSld) {
                        chart_selection.recalculate();
                        if (! (bNoRedraw === true)) {
                            editor.WordControl.m_oDrawingDocument.OnRecalculatePage(this.drawingObjects.num, this.drawingObjects);
                            editor.WordControl.m_oDrawingDocument.OnEndRecalculate(false, true);
                        }
                    } else {
                        chart_selection.addToRecalculate();
                        this.startRecalculate();
                    }
                }
                chart_selection.recalcInfo.bRecalculatedTitle = false;
            }
        }
    },
    resetSelection: function (noResetContentSelect) {
        if (this.document) {
            this.checkChartTextSelection();
        }
        this.resetInternalSelection(noResetContentSelect);
        for (var i = 0; i < this.selectedObjects.length; ++i) {
            this.selectedObjects[i].selected = false;
        }
        this.selectedObjects.length = 0;
        this.selection = {
            selectedObjects: [],
            groupSelection: null,
            chartSelection: null,
            textSelection: null
        };
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
        this.updateOverlay();
    },
    trackMoveObjects: function (dx, dy) {
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            this.arrTrackObjects[i].track(dx, dy);
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
        this.drawingObjects.showDrawingObjects(true);
    },
    canGroup: function () {
        return this.getArrayForGrouping().length > 1;
    },
    getArrayForGrouping: function () {
        var graphic_objects = this.getDrawingObjects();
        var grouped_objects = [];
        for (var i = 0; i < graphic_objects.length; ++i) {
            var cur_graphic_object = graphic_objects[i];
            if (cur_graphic_object.selected && cur_graphic_object.canGroup()) {
                grouped_objects.push(cur_graphic_object);
            }
        }
        return grouped_objects;
    },
    getBoundsForGroup: function (arrDrawings) {
        var bounds = arrDrawings[0].getBoundsInGroup();
        var max_x = bounds.maxX;
        var max_y = bounds.maxY;
        var min_x = bounds.minX;
        var min_y = bounds.minY;
        for (var i = 1; i < arrDrawings.length; ++i) {
            bounds = arrDrawings[i].getBoundsInGroup();
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
        return {
            minX: min_x,
            maxX: max_x,
            minY: min_y,
            maxY: max_y
        };
    },
    getGroup: function (arrDrawings) {
        if (!Array.isArray(arrDrawings)) {
            arrDrawings = this.getArrayForGrouping();
        }
        if (arrDrawings.length < 2) {
            return null;
        }
        var bounds = this.getBoundsForGroup(arrDrawings);
        var max_x = bounds.maxX;
        var max_y = bounds.maxY;
        var min_x = bounds.minX;
        var min_y = bounds.minY;
        var group = new CGroupShape();
        group.setSpPr(new CSpPr());
        group.spPr.setParent(group);
        group.spPr.setXfrm(new CXfrm());
        var xfrm = group.spPr.xfrm;
        xfrm.setParent(group.spPr);
        xfrm.setOffX(min_x);
        xfrm.setOffY(min_y);
        xfrm.setExtX(max_x - min_x);
        xfrm.setExtY(max_y - min_y);
        xfrm.setChExtX(max_x - min_x);
        xfrm.setChExtY(max_y - min_y);
        xfrm.setChOffX(0);
        xfrm.setChOffY(0);
        for (var i = 0; i < arrDrawings.length; ++i) {
            CheckSpPrXfrm(arrDrawings[i]);
            arrDrawings[i].spPr.xfrm.setOffX(arrDrawings[i].x - min_x);
            arrDrawings[i].spPr.xfrm.setOffY(arrDrawings[i].y - min_y);
            arrDrawings[i].setGroup(group);
            group.addToSpTree(group.spTree.length, arrDrawings[i]);
        }
        group.setBDeleted(false);
        return group;
    },
    unGroup: function () {
        this.checkSelectedObjectsAndCallback(this.unGroupCallback, null, false, historydescription_CommonControllerUnGroup);
    },
    getSelectedObjectsBounds: function () {
        if (!this.getTargetDocContent() && this.selectedObjects.length > 0) {
            var nPageIndex, aDrawings, oRes, aSelectedCopy, i;
            if (this.selection.groupSelection) {
                aDrawings = this.selection.groupSelection.selectedObjects;
                nPageIndex = this.selection.groupSelection.selectStartPage;
            } else {
                aSelectedCopy = [].concat(this.selectedObjects);
                aSelectedCopy.sort(function (a, b) {
                    return a.selectStartPage - b.selectStartPage;
                });
                nPageIndex = aSelectedCopy[0].selectStartPage;
                aDrawings = [];
                for (i = 0; i < aSelectedCopy.length; ++i) {
                    if (nPageIndex === aSelectedCopy[i].selectStartPage) {
                        aDrawings.push(aSelectedCopy[i]);
                    } else {
                        break;
                    }
                }
            }
            oRes = getAbsoluteRectBoundsArr(aDrawings);
            oRes.pageIndex = nPageIndex;
            return oRes;
        }
        return null;
    },
    unGroupCallback: function () {
        var ungroup_arr = this.canUnGroup(true);
        if (ungroup_arr.length > 0) {
            this.resetSelection();
            var i, j, cur_group, sp_tree, sp;
            var a_objects = [];
            for (i = 0; i < ungroup_arr.length; ++i) {
                cur_group = ungroup_arr[i];
                cur_group.normalize();
                sp_tree = cur_group.spTree;
                for (j = 0; j < sp_tree.length; ++j) {
                    sp = sp_tree[j];
                    sp.spPr.xfrm.setRot(normalizeRotate(sp.rot + cur_group.rot));
                    sp.spPr.xfrm.setOffX(sp.spPr.xfrm.offX + cur_group.spPr.xfrm.offX);
                    sp.spPr.xfrm.setOffY(sp.spPr.xfrm.offY + cur_group.spPr.xfrm.offY);
                    sp.spPr.xfrm.setFlipH(cur_group.spPr.xfrm.flipH === true ? !(sp.spPr.xfrm.flipH === true) : sp.spPr.xfrm.flipH === true);
                    sp.spPr.xfrm.setFlipV(cur_group.spPr.xfrm.flipV === true ? !(sp.spPr.xfrm.flipV === true) : sp.spPr.xfrm.flipV === true);
                    sp.setGroup(null);
                    sp.addToDrawingObjects();
                    sp.checkDrawingBaseCoords();
                    this.selectObject(sp, 0);
                }
                cur_group.deleteDrawingBase();
            }
        }
    },
    canUnGroup: function (bRetArray) {
        var _arr_selected_objects = this.selectedObjects;
        var ret_array = [];
        for (var _index = 0; _index < _arr_selected_objects.length; ++_index) {
            if (_arr_selected_objects[_index].getObjectType() === historyitem_type_GroupShape && (!_arr_selected_objects[_index].parent || _arr_selected_objects[_index].parent && (!_arr_selected_objects[_index].parent.Is_Inline || !_arr_selected_objects[_index].parent.Is_Inline()))) {
                if (! (bRetArray === true)) {
                    return true;
                }
                ret_array.push(_arr_selected_objects[_index]);
            }
        }
        return bRetArray === true ? ret_array : false;
    },
    startTrackNewShape: function (presetGeom) {
        switch (presetGeom) {
        case "spline":
            this.changeCurrentState(new SplineBezierState(this));
            break;
        case "polyline1":
            this.changeCurrentState(new PolyLineAddState(this));
            break;
        case "polyline2":
            this.changeCurrentState(new AddPolyLine2State(this));
            break;
        default:
            this.currentPresetGeom = presetGeom;
            this.changeCurrentState(new StartAddNewShape(this, presetGeom));
            break;
        }
    },
    getHyperlinkInfo: function () {
        var content = this.getTargetDocContent();
        if (content) {
            if ((true === content.Selection.Use && content.Selection.StartPos == content.Selection.EndPos) || false == content.Selection.Use) {
                var paragraph;
                if (true == content.Selection.Use) {
                    paragraph = content.Content[content.Selection.StartPos];
                } else {
                    paragraph = content.Content[content.CurPos.ContentPos];
                }
                var HyperPos = -1;
                if (true === paragraph.Selection.Use) {
                    var StartPos = paragraph.Selection.StartPos;
                    var EndPos = paragraph.Selection.EndPos;
                    if (StartPos > EndPos) {
                        StartPos = paragraph.Selection.EndPos;
                        EndPos = paragraph.Selection.StartPos;
                    }
                    for (var CurPos = StartPos; CurPos <= EndPos; CurPos++) {
                        var Element = paragraph.Content[CurPos];
                        if (true !== Element.Selection_IsEmpty() && para_Hyperlink !== Element.Type) {
                            break;
                        } else {
                            if (true !== Element.Selection_IsEmpty() && para_Hyperlink === Element.Type) {
                                if (-1 === HyperPos) {
                                    HyperPos = CurPos;
                                } else {
                                    break;
                                }
                            }
                        }
                    }
                    if (paragraph.Selection.StartPos === paragraph.Selection.EndPos && para_Hyperlink === paragraph.Content[paragraph.Selection.StartPos].Type) {
                        HyperPos = paragraph.Selection.StartPos;
                    }
                } else {
                    if (para_Hyperlink === paragraph.Content[paragraph.CurPos.ContentPos].Type) {
                        HyperPos = paragraph.CurPos.ContentPos;
                    }
                }
                if (-1 !== HyperPos) {
                    return paragraph.Content[HyperPos];
                }
            }
        }
        return null;
    },
    setSelectionState: function (state, stateIndex) {
        var _state_index = isRealNumber(stateIndex) ? stateIndex : state.length - 1;
        var selection_state = state[_state_index];
        this.clearPreTrackObjects();
        this.clearTrackObjects();
        this.resetSelection();
        if (selection_state.textObject) {
            this.selectObject(selection_state.textObject, selection_state.selectStartPage);
            this.selection.textSelection = selection_state.textObject;
            if (selection_state.textObject.getObjectType() === historyitem_type_GraphicFrame) {
                selection_state.textObject.graphicObject.Set_SelectionState(selection_state.textSelection, selection_state.textSelection.length - 1);
            } else {
                selection_state.textObject.getDocContent().Set_SelectionState(selection_state.textSelection, selection_state.textSelection.length - 1);
            }
        } else {
            if (selection_state.groupObject) {
                this.selectObject(selection_state.groupObject, selection_state.selectStartPage);
                this.selection.groupSelection = selection_state.groupObject;
                selection_state.groupObject.setSelectionState(selection_state.groupSelection);
            } else {
                if (selection_state.chartObject) {
                    this.selectObject(selection_state.chartObject, selection_state.selectStartPage);
                    this.selection.chartSelection = selection_state.chartObject;
                    selection_state.chartObject.setSelectionState(selection_state.chartSelection);
                } else {
                    if (selection_state.wrapObject) {
                        this.selectObject(selection_state.wrapObject, selection_state.selectStartPage);
                        this.selection.wrapPolygonSelection = selection_state.wrapObject;
                    } else {
                        for (var i = 0; i < selection_state.selection.length; ++i) {
                            this.selectObject(selection_state.selection[i].object, selection_state.selection[i].pageIndex);
                        }
                    }
                }
            }
        }
    },
    getSelectionState: function () {
        var selection_state = {};
        if (this.selection.textSelection) {
            selection_state.focus = true;
            selection_state.textObject = this.selection.textSelection;
            selection_state.selectStartPage = this.selection.textSelection.selectStartPage;
            if (this.selection.textSelection.getObjectType() === historyitem_type_GraphicFrame) {
                selection_state.textSelection = this.selection.textSelection.graphicObject.Get_SelectionState();
            } else {
                selection_state.textSelection = this.selection.textSelection.getDocContent().Get_SelectionState();
            }
        } else {
            if (this.selection.groupSelection) {
                selection_state.focus = true;
                selection_state.groupObject = this.selection.groupSelection;
                selection_state.selectStartPage = this.selection.groupSelection.selectStartPage;
                selection_state.groupSelection = this.selection.groupSelection.getSelectionState();
            } else {
                if (this.selection.chartSelection) {
                    selection_state.focus = true;
                    selection_state.chartObject = this.selection.chartSelection;
                    selection_state.selectStartPage = this.selection.chartSelection.selectStartPage;
                    selection_state.chartSelection = this.selection.chartSelection.getSelectionState();
                } else {
                    if (this.selection.wrapPolygonSelection) {
                        selection_state.focus = true;
                        selection_state.wrapObject = this.selection.wrapPolygonSelection;
                        selection_state.selectStartPage = this.selection.wrapPolygonSelection.selectStartPage;
                    } else {
                        selection_state.focus = this.selectedObjects.length > 0;
                        selection_state.selection = [];
                        for (var i = 0; i < this.selectedObjects.length; ++i) {
                            selection_state.selection.push({
                                object: this.selectedObjects[i],
                                pageIndex: this.selectedObjects[i].selectStartPage
                            });
                        }
                    }
                }
            }
        }
        if (this.drawingObjects && this.drawingObjects.getWorksheet) {
            var worksheetView = this.drawingObjects.getWorksheet();
            if (worksheetView) {
                selection_state.worksheetId = worksheetView.model.getId();
            }
        }
        return [selection_state];
    },
    drawTracks: function (overlay) {
        for (var i = 0; i < this.arrTrackObjects.length; ++i) {
            this.arrTrackObjects[i].draw(overlay);
        }
    },
    DrawOnOverlay: function (overlay) {
        this.drawTracks(overlay);
    },
    needUpdateOverlay: function () {
        return this.arrTrackObjects.length > 0;
    },
    drawSelection: function (drawingDocument) {
        DrawingObjectsController.prototype.drawSelect.call(this, 0, drawingDocument);
    },
    getTargetTransform: function () {
        if (this.selection.textSelection) {
            return this.selection.textSelection.transformText;
        } else {
            if (this.selection.groupSelection) {
                if (this.selection.groupSelection.selection.textSelection) {
                    return this.selection.groupSelection.selection.textSelection.transformText;
                } else {
                    if (this.selection.groupSelection.selection.chartSelection && this.selection.groupSelection.selection.chartSelection.selection.textSelection) {
                        return this.selection.groupSelection.selection.chartSelection.selection.textSelection.transformText;
                    }
                }
            } else {
                if (this.selection.chartSelection && this.selection.chartSelection.selection.textSelection) {
                    return this.selection.chartSelection.selection.textSelection.transformText;
                }
            }
        }
        return new CMatrix();
    },
    drawTextSelection: function (num) {
        var content = this.getTargetDocContent(undefined, true);
        if (content) {
            this.drawingObjects.getDrawingDocument().UpdateTargetTransform(this.getTargetTransform());
            content.Selection_Draw_Page(isRealNumber(num) ? num : 0);
        }
    },
    getSelectedObjects: function () {
        return this.selectedObjects;
    },
    getDrawingPropsFromArray: function (drawings) {
        var image_props, shape_props, chart_props, table_props, new_image_props, new_shape_props, new_chart_props, new_table_props, shape_chart_props, locked;
        var drawing;
        for (var i = 0; i < drawings.length; ++i) {
            drawing = drawings[i];
            locked = undefined;
            if (!drawing.group) {
                locked = drawing.lockType !== c_oAscLockTypes.kLockTypeNone && drawing.lockType !== c_oAscLockTypes.kLockTypeMine;
                if (typeof editor !== "undefined" && isRealObject(editor) && editor.isPresentationEditor) {
                    if (drawing.Lock) {
                        locked = drawing.Lock.Is_Locked();
                    }
                }
            }
            switch (drawing.getObjectType()) {
            case historyitem_type_Shape:
                new_shape_props = {
                    canFill: drawing.canFill(),
                    type: drawing.getPresetGeom(),
                    fill: drawing.getFill(),
                    stroke: drawing.getStroke(),
                    paddings: drawing.getPaddings(),
                    verticalTextAlign: drawing.getBodyPr().anchor,
                    w: drawing.extX,
                    h: drawing.extY,
                    canChangeArrows: drawing.canChangeArrows(),
                    bFromChart: false,
                    locked: locked
                };
                if (!shape_props) {
                    shape_props = new_shape_props;
                } else {
                    shape_props = CompareShapeProperties(shape_props, new_shape_props);
                }
                break;
            case historyitem_type_ImageShape:
                new_image_props = {
                    imageUrl: drawing.getImageUrl(),
                    w: drawing.extX,
                    h: drawing.extY,
                    locked: locked,
                    x: drawing.x,
                    y: drawing.y
                };
                if (!image_props) {
                    image_props = new_image_props;
                } else {
                    if (image_props.imageUrl !== null && image_props.imageUrl !== new_image_props.imageUrl) {
                        image_props.imageUrl = null;
                    }
                    if (image_props.w != null && image_props.w !== new_image_props.w) {
                        image_props.w = null;
                    }
                    if (image_props.h != null && image_props.h !== new_image_props.h) {
                        image_props.h = null;
                    }
                    if (image_props.x != null && image_props.x !== new_image_props.x) {
                        image_props.x = null;
                    }
                    if (image_props.y != null && image_props.y !== new_image_props.y) {
                        image_props.y = null;
                    }
                    if (image_props.locked || new_image_props.locked) {
                        image_props.locked = true;
                    }
                }
                break;
            case historyitem_type_ChartSpace:
                var type_subtype = drawing.getTypeSubType();
                new_chart_props = {
                    type: type_subtype.type,
                    subtype: type_subtype.subtype,
                    styleId: drawing.style,
                    w: drawing.extX,
                    h: drawing.extY,
                    locked: locked
                };
                if (!chart_props) {
                    chart_props = new_chart_props;
                    chart_props.chartProps = this.getPropsFromChart(drawing);
                    chart_props.severalCharts = false;
                    chart_props.severalChartStyles = false;
                    chart_props.severalChartTypes = false;
                } else {
                    chart_props.chartProps = null;
                    chart_props.severalCharts = true;
                    if (!chart_props.severalChartStyles) {
                        chart_props.severalChartStyles = (chart_props.styleId !== new_chart_props.styleId);
                    }
                    if (!chart_props.severalChartTypes) {
                        chart_props.severalChartTypes = (chart_props.type !== new_chart_props.type);
                    }
                    if (chart_props.w != null && chart_props.w !== new_chart_props.w) {
                        chart_props.w = null;
                    }
                    if (chart_props.h != null && chart_props.h !== new_chart_props.h) {
                        chart_props.h = null;
                    }
                    if (chart_props.locked || new_chart_props.locked) {
                        chart_props.locked = true;
                    }
                }
                new_shape_props = {
                    canFill: true,
                    type: null,
                    fill: drawing.getFill(),
                    stroke: drawing.getStroke(),
                    paddings: null,
                    verticalTextAlign: null,
                    w: drawing.extX,
                    h: drawing.extY,
                    canChangeArrows: false,
                    bFromChart: true,
                    locked: locked
                };
                if (!shape_props) {
                    shape_props = new_shape_props;
                } else {
                    shape_props = CompareShapeProperties(shape_props, new_shape_props);
                }
                if (!shape_chart_props) {
                    shape_chart_props = new_shape_props;
                } else {
                    shape_chart_props = CompareShapeProperties(shape_chart_props, new_shape_props);
                }
                break;
            case historyitem_type_GraphicFrame:
                new_table_props = drawing.graphicObject.Get_Props();
                if (!table_props) {
                    table_props = new_table_props;
                    if (new_table_props.CellsBackground) {
                        if (new_table_props.CellsBackground.Unifill && new_table_props.CellsBackground.Unifill.fill && new_table_props.CellsBackground.Unifill.fill.type !== FILL_TYPE_NONE) {
                            new_table_props.CellsBackground.Unifill.check(drawing.Get_Theme(), drawing.Get_ColorMap());
                            var RGBA = new_table_props.CellsBackground.Unifill.getRGBAColor();
                            new_table_props.CellsBackground.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, false);
                            new_table_props.CellsBackground.Value = shd_Clear;
                        } else {
                            new_table_props.CellsBackground.Color = new CDocumentColor(0, 0, 0, false);
                            new_table_props.CellsBackground.Value = shd_Nil;
                        }
                    }
                    if (new_table_props.CellBorders) {
                        var checkBorder = function (border) {
                            if (!border) {
                                return;
                            }
                            if (border.Unifill && border.Unifill.fill && border.Unifill.fill.type !== FILL_TYPE_NONE) {
                                border.Unifill.check(drawing.Get_Theme(), drawing.Get_ColorMap());
                                var RGBA = border.Unifill.getRGBAColor();
                                border.Color = new CDocumentColor(RGBA.R, RGBA.G, RGBA.B, false);
                                border.Value = border_Single;
                            } else {
                                border.Color = new CDocumentColor(0, 0, 0, false);
                                border.Value = border_Single;
                            }
                        };
                        checkBorder(new_table_props.CellBorders.Top);
                        checkBorder(new_table_props.CellBorders.Bottom);
                        checkBorder(new_table_props.CellBorders.Right);
                        checkBorder(new_table_props.CellBorders.Left);
                    }
                } else {
                    table_props = null;
                }
                break;
            case historyitem_type_GroupShape:
                var group_drawing_props = this.getDrawingPropsFromArray(drawing.spTree);
                if (group_drawing_props.shapeProps) {
                    if (!shape_props) {
                        shape_props = group_drawing_props.shapeProps;
                    } else {
                        shape_props = CompareShapeProperties(shape_props, group_drawing_props.shapeProps);
                    }
                }
                if (group_drawing_props.shapeChartProps) {
                    if (!shape_chart_props) {
                        shape_chart_props = group_drawing_props.shapeChartProps;
                    } else {
                        shape_chart_props = CompareShapeProperties(shape_chart_props, group_drawing_props.shapeChartProps);
                    }
                }
                if (group_drawing_props.imageProps) {
                    if (!image_props) {
                        image_props = group_drawing_props.imageProps;
                    } else {
                        if (image_props.imageUrl !== null && image_props.imageUrl !== group_drawing_props.imageProps.imageUrl) {
                            image_props.imageUrl = null;
                        }
                        if (image_props.w != null && image_props.w !== group_drawing_props.imageProps.w) {
                            image_props.w = null;
                        }
                        if (image_props.h != null && image_props.h !== group_drawing_props.imageProps.h) {
                            image_props.h = null;
                        }
                        if (image_props.x != null && image_props.x !== group_drawing_props.imageProps.x) {
                            image_props.x = null;
                        }
                        if (image_props.y != null && image_props.y !== group_drawing_props.imageProps.y) {
                            image_props.y = null;
                        }
                        if (image_props.locked || group_drawing_props.imageProps.locked) {
                            image_props.locked = true;
                        }
                    }
                }
                if (group_drawing_props.chartProps) {
                    if (!chart_props) {
                        chart_props = group_drawing_props.chartProps;
                    } else {
                        chart_props.chartProps = null;
                        chart_props.severalCharts = true;
                        if (!chart_props.severalChartStyles) {
                            chart_props.severalChartStyles = (chart_props.styleId !== group_drawing_props.chartProps.styleId);
                        }
                        if (!chart_props.severalChartTypes) {
                            chart_props.severalChartTypes = (chart_props.type !== group_drawing_props.chartProps.type);
                        }
                        if (chart_props.w != null && chart_props.w !== group_drawing_props.chartProps.w) {
                            chart_props.w = null;
                        }
                        if (chart_props.h != null && chart_props.h !== group_drawing_props.chartProps.h) {
                            chart_props.h = null;
                        }
                        if (chart_props.locked || group_drawing_props.chartProps.locked) {
                            chart_props.locked = true;
                        }
                    }
                }
                if (group_drawing_props.tableProps) {
                    if (!table_props) {
                        table_props = group_drawing_props.tableProps;
                    } else {
                        table_props = null;
                    }
                }
                break;
            }
        }
        return {
            imageProps: image_props,
            shapeProps: shape_props,
            chartProps: chart_props,
            tableProps: table_props,
            shapeChartProps: shape_chart_props
        };
    },
    getDrawingProps: function () {
        if (this.selection.groupSelection) {
            return this.getDrawingPropsFromArray(this.selection.groupSelection.selectedObjects);
        }
        return this.getDrawingPropsFromArray(this.selectedObjects);
    },
    getGraphicObjectProps: function () {
        var props = this.getDrawingProps();
        var api;
        if (window["Asc"] && window["Asc"]["editor"]) {
            api = window["Asc"]["editor"];
        } else {
            api = editor;
        }
        var shape_props, image_props, chart_props;
        var ascSelectedObjects = [];
        var ret = [],
        i;
        if (isRealObject(props.shapeChartProps)) {
            shape_props = new asc_CImgProperty();
            shape_props.fromGroup = props.shapeChartProps.fromGroup;
            shape_props.ShapeProperties = new asc_CShapeProperty();
            shape_props.ShapeProperties.type = props.shapeChartProps.type;
            shape_props.ShapeProperties.fill = props.shapeChartProps.fill;
            shape_props.ShapeProperties.stroke = props.shapeChartProps.stroke;
            shape_props.ShapeProperties.canChangeArrows = props.shapeChartProps.canChangeArrows;
            shape_props.ShapeProperties.bFromChart = props.shapeChartProps.bFromChart;
            if (props.shapeChartProps.paddings) {
                shape_props.ShapeProperties.paddings = new asc_CPaddings(props.shapeChartProps.paddings);
            }
            shape_props.verticalTextAlign = props.shapeChartProps.verticalTextAlign;
            shape_props.ShapeProperties.canFill = props.shapeChartProps.canFill;
            shape_props.Width = props.shapeChartProps.w;
            shape_props.Height = props.shapeChartProps.h;
            var pr = shape_props.ShapeProperties;
            if (!isRealObject(props.shapeProps)) {
                if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == FILL_TYPE_BLIP) {
                    if (api) {
                        this.drawingObjects.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
                    }
                    this.drawingObjects.drawingDocument.LastDrawingUrl = null;
                    this.drawingObjects.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
                } else {
                    if (api) {
                        this.drawingObjects.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
                    }
                    this.drawingObjects.drawingDocument.DrawImageTextureFillShape(null);
                }
            }
            shape_props.ShapeProperties.fill = CreateAscFillEx(shape_props.ShapeProperties.fill);
            shape_props.ShapeProperties.stroke = CreateAscStrokeEx(shape_props.ShapeProperties.stroke);
            shape_props.ShapeProperties.stroke.canChangeArrows = shape_props.ShapeProperties.canChangeArrows === true;
            shape_props.Locked = props.shapeChartProps.locked === true;
            ret.push(shape_props);
        }
        if (isRealObject(props.shapeProps)) {
            shape_props = new asc_CImgProperty();
            shape_props.fromGroup = props.shapeProps.fromGroup;
            shape_props.ShapeProperties = new asc_CShapeProperty();
            shape_props.ShapeProperties.type = props.shapeProps.type;
            shape_props.ShapeProperties.fill = props.shapeProps.fill;
            shape_props.ShapeProperties.stroke = props.shapeProps.stroke;
            shape_props.ShapeProperties.canChangeArrows = props.shapeProps.canChangeArrows;
            shape_props.ShapeProperties.bFromChart = props.shapeProps.bFromChart;
            if (props.shapeProps.paddings) {
                shape_props.ShapeProperties.paddings = new asc_CPaddings(props.shapeProps.paddings);
            }
            shape_props.verticalTextAlign = props.shapeProps.verticalTextAlign;
            shape_props.ShapeProperties.canFill = props.shapeProps.canFill;
            shape_props.Width = props.shapeProps.w;
            shape_props.Height = props.shapeProps.h;
            var pr = shape_props.ShapeProperties;
            if (pr.fill != null && pr.fill.fill != null && pr.fill.fill.type == FILL_TYPE_BLIP) {
                if (api) {
                    this.drawingObjects.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
                }
                this.drawingObjects.drawingDocument.LastDrawingUrl = null;
                this.drawingObjects.drawingDocument.DrawImageTextureFillShape(pr.fill.fill.RasterImageId);
            } else {
                if (api) {
                    this.drawingObjects.drawingDocument.InitGuiCanvasShape(api.shapeElementId);
                }
                this.drawingObjects.drawingDocument.DrawImageTextureFillShape(null);
            }
            shape_props.ShapeProperties.fill = CreateAscFillEx(shape_props.ShapeProperties.fill);
            shape_props.ShapeProperties.stroke = CreateAscStrokeEx(shape_props.ShapeProperties.stroke);
            shape_props.ShapeProperties.stroke.canChangeArrows = shape_props.ShapeProperties.canChangeArrows === true;
            shape_props.Locked = props.shapeProps.locked === true;
            ret.push(shape_props);
        }
        if (isRealObject(props.imageProps)) {
            image_props = new asc_CImgProperty();
            image_props.Width = props.imageProps.w;
            image_props.Height = props.imageProps.h;
            image_props.ImageUrl = props.imageProps.imageUrl;
            image_props.Locked = props.imageProps.locked === true;
            ret.push(image_props);
        }
        if (isRealObject(props.chartProps) && isRealObject(props.chartProps.chartProps)) {
            chart_props = new asc_CImgProperty();
            chart_props.Width = props.chartProps.w;
            chart_props.Height = props.chartProps.h;
            chart_props.ChartProperties = props.chartProps.chartProps;
            chart_props.Locked = props.chartProps.locked === true;
            ret.push(chart_props);
        }
        for (i = 0; i < ret.length; i++) {
            ascSelectedObjects.push(new asc_CSelectedObject(c_oAscTypeSelectElement.Image, new asc_CImgProperty(ret[i])));
        }
        var ParaPr = this.getParagraphParaPr();
        var TextPr = this.getParagraphTextPr();
        if (ParaPr && TextPr) {
            var theme = this.getTheme();
            if (theme && theme.themeElements && theme.themeElements.fontScheme) {
                if (TextPr.FontFamily) {
                    TextPr.FontFamily.Name = theme.themeElements.fontScheme.checkFont(TextPr.FontFamily.Name);
                }
                if (TextPr.RFonts) {
                    if (TextPr.RFonts.Ascii) {
                        TextPr.RFonts.Ascii.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.Ascii.Name);
                    }
                    if (TextPr.RFonts.EastAsia) {
                        TextPr.RFonts.EastAsia.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.EastAsia.Name);
                    }
                    if (TextPr.RFonts.HAnsi) {
                        TextPr.RFonts.HAnsi.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.HAnsi.Name);
                    }
                    if (TextPr.RFonts.CS) {
                        TextPr.RFonts.CS.Name = theme.themeElements.fontScheme.checkFont(TextPr.RFonts.CS.Name);
                    }
                }
            }
            this.prepareParagraphProperties(ParaPr, TextPr, ascSelectedObjects);
        }
        return ascSelectedObjects;
    },
    prepareParagraphProperties: function (ParaPr, TextPr, ascSelectedObjects) {
        var _this = this;
        var trigger = this.drawingObjects.callTrigger;
        ParaPr.Subscript = (TextPr.VertAlign === vertalign_SubScript ? true : false);
        ParaPr.Superscript = (TextPr.VertAlign === vertalign_SuperScript ? true : false);
        ParaPr.Strikeout = TextPr.Strikeout;
        ParaPr.DStrikeout = TextPr.DStrikeout;
        ParaPr.AllCaps = TextPr.Caps;
        ParaPr.SmallCaps = TextPr.SmallCaps;
        ParaPr.TextSpacing = TextPr.Spacing;
        ParaPr.Position = TextPr.Position;
        if (true === ParaPr.Spacing.AfterAutoSpacing) {
            ParaPr.Spacing.After = spacing_Auto;
        } else {
            if (undefined === ParaPr.Spacing.AfterAutoSpacing) {
                ParaPr.Spacing.After = UnknownValue;
            }
        }
        if (true === ParaPr.Spacing.BeforeAutoSpacing) {
            ParaPr.Spacing.Before = spacing_Auto;
        } else {
            if (undefined === ParaPr.Spacing.BeforeAutoSpacing) {
                ParaPr.Spacing.Before = UnknownValue;
            }
        }
        if (-1 === ParaPr.PStyle) {
            ParaPr.StyleName = "";
        }
        if (null == ParaPr.NumPr || 0 === ParaPr.NumPr.NumId) {
            ParaPr.ListType = {
                Type: -1,
                SubType: -1
            };
        }
        if (true === ParaPr.Spacing.AfterAutoSpacing) {
            ParaPr.Spacing.After = spacing_Auto;
        } else {
            if (undefined === ParaPr.Spacing.AfterAutoSpacing) {
                ParaPr.Spacing.After = UnknownValue;
            }
        }
        if (true === ParaPr.Spacing.BeforeAutoSpacing) {
            ParaPr.Spacing.Before = spacing_Auto;
        } else {
            if (undefined === ParaPr.Spacing.BeforeAutoSpacing) {
                ParaPr.Spacing.Before = UnknownValue;
            }
        }
        trigger("asc_onParaSpacingLine", new asc_CParagraphSpacing(ParaPr.Spacing));
        trigger("asc_onPrAlign", ParaPr.Jc);
        ascSelectedObjects.push(new asc_CSelectedObject(c_oAscTypeSelectElement.Paragraph, new asc_CParagraphProperty(ParaPr)));
    },
    createImage: function (rasterImageId, x, y, extX, extY) {
        var image = new CImageShape();
        image.setSpPr(new CSpPr());
        image.spPr.setParent(image);
        image.spPr.setGeometry(CreateGeometry("rect"));
        image.spPr.setXfrm(new CXfrm());
        image.spPr.xfrm.setParent(image.spPr);
        image.spPr.xfrm.setOffX(x);
        image.spPr.xfrm.setOffY(y);
        image.spPr.xfrm.setExtX(extX);
        image.spPr.xfrm.setExtY(extY);
        var blip_fill = new CBlipFill();
        blip_fill.setRasterImageId(rasterImageId);
        blip_fill.setStretch(true);
        image.setBlipFill(blip_fill);
        image.setNvPicPr(new UniNvPr());
        image.setBDeleted(false);
        return image;
    },
    Get_SelectedText: function (bCleartText) {
        var content = this.getTargetDocContent();
        if (content) {
            return content.Get_SelectedText(bCleartText);
        } else {
            return "";
        }
    },
    putPrLineSpacing: function (type, value) {
        this.checkSelectedObjectsAndCallback(this.setParagraphSpacing, [{
            LineRule: type,
            Line: value
        }], false, historydescription_Spreadsheet_PutPrLineSpacing);
    },
    putLineSpacingBeforeAfter: function (type, value) {
        var arg;
        switch (type) {
        case 0:
            if (spacing_Auto === value) {
                arg = {
                    BeforeAutoSpacing: true
                };
            } else {
                arg = {
                    Before: value,
                    BeforeAutoSpacing: false
                };
            }
            break;
        case 1:
            if (spacing_Auto === value) {
                arg = {
                    AfterAutoSpacing: true
                };
            } else {
                arg = {
                    After: value,
                    AfterAutoSpacing: false
                };
            }
            break;
        }
        if (arg) {
            this.checkSelectedObjectsAndCallback(this.setParagraphSpacing, [arg], false, historydescription_Spreadsheet_SetParagraphSpacing);
        }
    },
    setGraphicObjectProps: function (props) {
        if (typeof asc_CParagraphProperty !== "undefined" && !(props instanceof asc_CParagraphProperty)) {
            if (props && props.ChartProperties && typeof props.ChartProperties.range === "string") {
                var editor = window["Asc"]["editor"];
                var check = parserHelp.checkDataRange(editor.wbModel, editor.wb, c_oAscSelectionDialogType.Chart, props.ChartProperties.range, true, !props.ChartProperties.isColumn, props.ChartProperties.type);
                if (check === c_oAscError.ID.StockChartError || check === c_oAscError.ID.DataRangeError || check === c_oAscError.ID.MaxDataSeriesError) {
                    editor.wbModel.handlers.trigger("asc_onError", check, c_oAscError.Level.NoCritical);
                    this.drawingObjects.sendGraphicObjectProps();
                    return;
                }
            }
            this.checkSelectedObjectsAndCallback(this.setGraphicObjectPropsCallBack, [props], true, historydescription_Spreadsheet_SetGraphicObjectsProps);
        } else {
            this.checkSelectedObjectsAndCallback(this.paraApplyCallback, [props], false, historydescription_Spreadsheet_ParaApply);
        }
    },
    checkSelectedObjectsAndCallback: function (callback, args, bNoSendProps, nHistoryPointType) {
        var selection_state = this.getSelectionState();
        this.drawingObjects.objectLocker.reset();
        for (var i = 0; i < this.selectedObjects.length; ++i) {
            this.drawingObjects.objectLocker.addObjectId(this.selectedObjects[i].Get_Id());
        }
        var _this = this;
        var callback2 = function (bLock, bSync) {
            if (bLock) {
                var nPointType = isRealNumber(nHistoryPointType) ? nHistoryPointType : historydescription_CommonControllerCheckSelected;
                History.Create_NewPoint(nPointType);
                if (bSync !== true) {
                    _this.setSelectionState(selection_state);
                    for (var i = 0; i < _this.selectedObjects.length; ++i) {
                        _this.selectedObjects[i].lockType = c_oAscLockTypes.kLockTypeMine;
                    }
                }
                callback.apply(_this, args);
                _this.startRecalculate();
                if (! (bNoSendProps === true)) {
                    _this.drawingObjects.sendGraphicObjectProps();
                }
            }
        };
        this.drawingObjects.objectLocker.checkObjects(callback2);
    },
    setGraphicObjectPropsCallBack: function (props) {
        var apply_props;
        if (isRealNumber(props.Width) && isRealNumber(props.Height)) {
            apply_props = props;
        } else {
            apply_props = props.ShapeProperties ? props.ShapeProperties : props;
        }
        var objects_by_types = this.applyDrawingProps(apply_props);
    },
    paraApplyCallback: function (Props) {
        if ("undefined" != typeof(Props.ContextualSpacing) && null != Props.ContextualSpacing) {
            this.setParagraphContextualSpacing(Props.ContextualSpacing);
        }
        if ("undefined" != typeof(Props.Ind) && null != Props.Ind) {
            this.setParagraphIndent(Props.Ind);
        }
        if ("undefined" != typeof(Props.Jc) && null != Props.Jc) {
            this.setParagraphAlign(Props.Jc);
        }
        if ("undefined" != typeof(Props.KeepLines) && null != Props.KeepLines) {
            this.setParagraphKeepLines(Props.KeepLines);
        }
        if (undefined != Props.KeepNext && null != Props.KeepNext) {
            this.setParagraphKeepNext(Props.KeepNext);
        }
        if (undefined != Props.WidowControl && null != Props.WidowControl) {
            this.setParagraphWidowControl(Props.WidowControl);
        }
        if ("undefined" != typeof(Props.PageBreakBefore) && null != Props.PageBreakBefore) {
            this.setParagraphPageBreakBefore(Props.PageBreakBefore);
        }
        if ("undefined" != typeof(Props.Spacing) && null != Props.Spacing) {
            this.setParagraphSpacing(Props.Spacing);
        }
        if ("undefined" != typeof(Props.Shd) && null != Props.Shd) {
            this.setParagraphShd(Props.Shd);
        }
        if ("undefined" != typeof(Props.Brd) && null != Props.Brd) {
            if (Props.Brd.Left && Props.Brd.Left.Color) {
                Props.Brd.Left.Unifill = CreateUnifillFromAscColor(Props.Brd.Left.Color);
            }
            if (Props.Brd.Top && Props.Brd.Top.Color) {
                Props.Brd.Top.Unifill = CreateUnifillFromAscColor(Props.Brd.Top.Color);
            }
            if (Props.Brd.Right && Props.Brd.Right.Color) {
                Props.Brd.Right.Unifill = CreateUnifillFromAscColor(Props.Brd.Right.Color);
            }
            if (Props.Brd.Bottom && Props.Brd.Bottom.Color) {
                Props.Brd.Bottom.Unifill = CreateUnifillFromAscColor(Props.Brd.Bottom.Color);
            }
            if (Props.Brd.InsideH && Props.Brd.InsideH.Color) {
                Props.Brd.InsideH.Unifill = CreateUnifillFromAscColor(Props.Brd.InsideH.Color);
            }
            if (Props.Brd.InsideV && Props.Brd.InsideV.Color) {
                Props.Brd.InsideV.Unifill = CreateUnifillFromAscColor(Props.Brd.InsideV.Color);
            }
            this.setParagraphBorders(Props.Brd);
        }
        if (undefined != Props.Tabs) {
            var Tabs = new CParaTabs();
            Tabs.Set_FromObject(Props.Tabs.Tabs);
            this.setParagraphTabs(Tabs);
        }
        if (undefined != Props.DefaultTab) {}
        var TextPr = new CTextPr();
        if (true === Props.Subscript) {
            TextPr.VertAlign = vertalign_SubScript;
        } else {
            if (true === Props.Superscript) {
                TextPr.VertAlign = vertalign_SuperScript;
            } else {
                if (false === Props.Superscript || false === Props.Subscript) {
                    TextPr.VertAlign = vertalign_Baseline;
                }
            }
        }
        if (undefined != Props.Strikeout) {
            TextPr.Strikeout = Props.Strikeout;
            TextPr.DStrikeout = false;
        }
        if (undefined != Props.DStrikeout) {
            TextPr.DStrikeout = Props.DStrikeout;
            if (true === TextPr.DStrikeout) {
                TextPr.Strikeout = false;
            }
        }
        if (undefined != Props.SmallCaps) {
            TextPr.SmallCaps = Props.SmallCaps;
            TextPr.AllCaps = false;
        }
        if (undefined != Props.AllCaps) {
            TextPr.Caps = Props.AllCaps;
            if (true === TextPr.AllCaps) {
                TextPr.SmallCaps = false;
            }
        }
        if (undefined != Props.TextSpacing) {
            TextPr.Spacing = Props.TextSpacing;
        }
        if (undefined != Props.Position) {
            TextPr.Position = Props.Position;
        }
        this.paragraphAdd(new ParaTextPr(TextPr));
        this.startRecalculate();
    },
    applyColorScheme: function () {},
    setGraphicObjectLayer: function (layerType) {
        if (this.selection.groupSelection) {
            this.checkSelectedObjectsAndCallback(this.setGraphicObjectLayerCallBack, [layerType], false, historydescription_Spreadsheet_GraphicObjectLayer);
        } else {
            History.Create_NewPoint(historydescription_CommonControllerSetGraphicObject);
            this.setGraphicObjectLayerCallBack(layerType);
            this.startRecalculate();
        }
    },
    setGraphicObjectLayerCallBack: function (layerType) {
        switch (layerType) {
        case 0:
            this.bringToFront();
            break;
        case 1:
            this.sendToBack();
            break;
        case 2:
            this.bringForward();
            break;
        case 3:
            this.bringBackward();
        }
    },
    alignLeft: function (bSelected) {
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects,
        i,
        boundsObject,
        leftPos,
        arrBounds;
        if (selected_objects.length > 0) {
            boundsObject = getAbsoluteRectBoundsArr(selected_objects);
            arrBounds = boundsObject.arrBounds;
            if (bSelected && selected_objects.length > 1) {
                leftPos = boundsObject.minX;
            } else {
                leftPos = 0;
            }
            this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
            this.swapTrackObjects();
            var move_state;
            if (!this.selection.groupSelection) {
                move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
            } else {
                move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
            }
            for (i = 0; i < this.arrTrackObjects.length; ++i) {
                this.arrTrackObjects[i].track(leftPos - arrBounds[i].minX, 0, this.arrTrackObjects[i].originalObject.selectStartPage);
            }
            move_state.onMouseUp({},
            0, 0, 0);
        }
    },
    alignRight: function (bSelected) {
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects,
        i,
        boundsObject,
        rightPos,
        arrBounds;
        if (selected_objects.length > 0) {
            boundsObject = getAbsoluteRectBoundsArr(selected_objects);
            arrBounds = boundsObject.arrBounds;
            if (bSelected && selected_objects.length > 1) {
                rightPos = boundsObject.maxX;
            } else {
                rightPos = this.drawingObjects.Width;
            }
            this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
            this.swapTrackObjects();
            var move_state;
            if (!this.selection.groupSelection) {
                move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
            } else {
                move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
            }
            for (i = 0; i < this.arrTrackObjects.length; ++i) {
                this.arrTrackObjects[i].track(rightPos - arrBounds[i].maxX, 0, this.arrTrackObjects[i].originalObject.selectStartPage);
            }
            move_state.onMouseUp({},
            0, 0, 0);
        }
    },
    alignTop: function (bSelected) {
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects,
        i,
        boundsObject,
        topPos,
        arrBounds;
        if (selected_objects.length > 0) {
            boundsObject = getAbsoluteRectBoundsArr(selected_objects);
            arrBounds = boundsObject.arrBounds;
            if (bSelected && selected_objects.length > 1) {
                topPos = boundsObject.minY;
            } else {
                topPos = 0;
            }
            this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
            this.swapTrackObjects();
            var move_state;
            if (!this.selection.groupSelection) {
                move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
            } else {
                move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
            }
            for (i = 0; i < this.arrTrackObjects.length; ++i) {
                this.arrTrackObjects[i].track(0, topPos - arrBounds[i].minY, this.arrTrackObjects[i].originalObject.selectStartPage);
            }
            move_state.onMouseUp({},
            0, 0, 0);
        }
    },
    alignBottom: function (bSelected) {
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects,
        i,
        boundsObject,
        bottomPos,
        arrBounds;
        if (selected_objects.length > 0) {
            boundsObject = getAbsoluteRectBoundsArr(selected_objects);
            arrBounds = boundsObject.arrBounds;
            if (bSelected && selected_objects.length > 1) {
                bottomPos = boundsObject.maxY;
            } else {
                bottomPos = this.drawingObjects.Height;
            }
            this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
            this.swapTrackObjects();
            var move_state;
            if (!this.selection.groupSelection) {
                move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
            } else {
                move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
            }
            for (i = 0; i < this.arrTrackObjects.length; ++i) {
                this.arrTrackObjects[i].track(0, bottomPos - arrBounds[i].maxY, this.arrTrackObjects[i].originalObject.selectStartPage);
            }
            move_state.onMouseUp({},
            0, 0, 0);
        }
    },
    alignCenter: function (bSelected) {
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects,
        i,
        boundsObject,
        centerPos,
        arrBounds;
        if (selected_objects.length > 0) {
            boundsObject = getAbsoluteRectBoundsArr(selected_objects);
            arrBounds = boundsObject.arrBounds;
            if (bSelected && selected_objects.length > 1) {
                centerPos = boundsObject.minX + (boundsObject.maxX - boundsObject.minX) / 2;
            } else {
                centerPos = this.drawingObjects.Width / 2;
            }
            this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
            this.swapTrackObjects();
            var move_state;
            if (!this.selection.groupSelection) {
                move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
            } else {
                move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
            }
            for (i = 0; i < this.arrTrackObjects.length; ++i) {
                this.arrTrackObjects[i].track(centerPos - (arrBounds[i].maxX - arrBounds[i].minX) / 2 - arrBounds[i].minX, 0, this.arrTrackObjects[i].originalObject.selectStartPage);
            }
            move_state.onMouseUp({},
            0, 0, 0);
        }
    },
    alignMiddle: function (bSelected) {
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects,
        i,
        boundsObject,
        middlePos,
        arrBounds;
        if (selected_objects.length > 0) {
            boundsObject = getAbsoluteRectBoundsArr(selected_objects);
            arrBounds = boundsObject.arrBounds;
            if (bSelected && selected_objects.length > 1) {
                middlePos = boundsObject.minY + (boundsObject.maxY - boundsObject.minY) / 2;
            } else {
                middlePos = this.drawingObjects.Height / 2;
            }
            this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
            this.swapTrackObjects();
            var move_state;
            if (!this.selection.groupSelection) {
                move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
            } else {
                move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
            }
            for (i = 0; i < this.arrTrackObjects.length; ++i) {
                this.arrTrackObjects[i].track(0, middlePos - (arrBounds[i].maxY - arrBounds[i].minY) / 2 - arrBounds[i].minY, this.arrTrackObjects[i].originalObject.selectStartPage);
            }
            move_state.onMouseUp({},
            0, 0, 0);
        }
    },
    distributeHor: function (bSelected) {
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects,
        i,
        boundsObject,
        arrBounds,
        pos1,
        pos2,
        gap,
        sortObjects,
        lastPos;
        if (selected_objects.length > 0) {
            boundsObject = getAbsoluteRectBoundsArr(selected_objects);
            arrBounds = boundsObject.arrBounds;
            this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
            this.swapTrackObjects();
            sortObjects = [];
            for (i = 0; i < selected_objects.length; ++i) {
                sortObjects.push({
                    trackObject: this.arrTrackObjects[i],
                    boundsObject: arrBounds[i]
                });
            }
            sortObjects.sort(function (obj1, obj2) {
                return (obj1.boundsObject.maxX + obj1.boundsObject.minX) / 2 - (obj2.boundsObject.maxX + obj2.boundsObject.minX) / 2;
            });
            if (bSelected && selected_objects.length > 2) {
                pos1 = boundsObject.minX;
                pos2 = boundsObject.maxX;
                sortObjects.splice(0, 1)[0].trackObject.track(0, 0, 0);
                sortObjects.splice(sortObjects.length - 1, 1)[0].trackObject.track(0, 0, 0);
            } else {
                pos1 = 0;
                pos2 = this.drawingObjects.Width;
            }
            var summ_width = 0;
            for (i = 0; i < sortObjects.length; ++i) {
                summ_width += (sortObjects[i].boundsObject.maxX - sortObjects[i].boundsObject.minX);
            }
            gap = (pos2 - pos1 - summ_width) / (sortObjects.length + 1);
            var move_state;
            if (!this.selection.groupSelection) {
                move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
            } else {
                move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
            }
            lastPos = pos1;
            for (i = 0; i < sortObjects.length; ++i) {
                sortObjects[i].trackObject.track(lastPos + gap - sortObjects[i].boundsObject.minX, 0, this.arrTrackObjects[i].originalObject.selectStartPage);
                lastPos += (gap + sortObjects[i].boundsObject.maxX - sortObjects[i].boundsObject.minX);
            }
            move_state.onMouseUp({},
            0, 0, 0);
        }
    },
    distributeVer: function (bSelected) {
        var selected_objects = this.selection.groupSelection ? this.selection.groupSelection.selectedObjects : this.selectedObjects,
        i,
        boundsObject,
        arrBounds,
        pos1,
        pos2,
        gap,
        sortObjects,
        lastPos;
        if (selected_objects.length > 0) {
            boundsObject = getAbsoluteRectBoundsArr(selected_objects);
            arrBounds = boundsObject.arrBounds;
            this.checkSelectedObjectsForMove(this.selection.groupSelection ? this.selection.groupSelection : null);
            this.swapTrackObjects();
            sortObjects = [];
            for (i = 0; i < selected_objects.length; ++i) {
                sortObjects.push({
                    trackObject: this.arrTrackObjects[i],
                    boundsObject: arrBounds[i]
                });
            }
            sortObjects.sort(function (obj1, obj2) {
                return (obj1.boundsObject.maxY + obj1.boundsObject.minY) / 2 - (obj2.boundsObject.maxY + obj2.boundsObject.minY) / 2;
            });
            if (bSelected && selected_objects.length > 2) {
                pos1 = boundsObject.minY;
                pos2 = boundsObject.maxY;
                sortObjects.splice(0, 1)[0].trackObject.track(0, 0, 0);
                sortObjects.splice(sortObjects.length - 1, 1)[0].trackObject.track(0, 0, 0);
            } else {
                pos1 = 0;
                pos2 = this.drawingObjects.Height;
            }
            var summ_heigth = 0;
            for (i = 0; i < sortObjects.length; ++i) {
                summ_heigth += (sortObjects[i].boundsObject.maxY - sortObjects[i].boundsObject.minY);
            }
            gap = (pos2 - pos1 - summ_heigth) / (sortObjects.length + 1);
            var move_state;
            if (!this.selection.groupSelection) {
                move_state = new MoveState(this, this.selectedObjects[0], 0, 0);
            } else {
                move_state = new MoveInGroupState(this, this.selection.groupSelection.selectedObjects[0], this.selection.groupSelection, 0, 0);
            }
            lastPos = pos1;
            for (i = 0; i < sortObjects.length; ++i) {
                sortObjects[i].trackObject.track(0, lastPos + gap - sortObjects[i].boundsObject.minY, this.arrTrackObjects[i].originalObject.selectStartPage);
                lastPos += (gap + sortObjects[i].boundsObject.maxY - sortObjects[i].boundsObject.minY);
            }
            move_state.onMouseUp({},
            0, 0, 0);
        }
    },
    bringToFront: function () {
        var sp_tree = this.getDrawingObjects();
        if (! (this.selection.groupSelection)) {
            var selected = [];
            for (var i = 0; i < sp_tree.length; ++i) {
                if (sp_tree[i].selected) {
                    selected.push(sp_tree[i]);
                }
            }
            for (var i = sp_tree.length - 1; i > -1; --i) {
                if (sp_tree[i].selected) {
                    sp_tree[i].deleteDrawingBase();
                }
            }
            for (i = 0; i < selected.length; ++i) {
                selected[i].addToDrawingObjects(sp_tree.length);
            }
        } else {
            this.selection.groupSelection.bringToFront();
        }
    },
    bringForward: function () {
        var sp_tree = this.getDrawingObjects();
        if (! (this.selection.groupSelection)) {
            for (var i = sp_tree.length - 1; i > -1; --i) {
                var sp = sp_tree[i];
                if (sp.selected && i < sp_tree.length - 1 && !sp_tree[i + 1].selected) {
                    sp.deleteDrawingBase();
                    sp.addToDrawingObjects(i + 1);
                }
            }
        } else {
            this.selection.groupSelection.bringForward();
        }
        this.drawingObjects.showDrawingObjects(true);
    },
    sendToBack: function () {
        var sp_tree = this.getDrawingObjects();
        if (! (this.selection.groupSelection)) {
            var j = 0;
            for (var i = 0; i < sp_tree.length; ++i) {
                if (sp_tree[i].selected) {
                    var object = sp_tree[i];
                    object.deleteDrawingBase();
                    object.addToDrawingObjects(j);
                    ++j;
                }
            }
        } else {
            this.selection.groupSelection.sendToBack();
        }
    },
    bringBackward: function () {
        var sp_tree = this.getDrawingObjects();
        if (! (this.selection.groupSelection)) {
            for (var i = 0; i < sp_tree.length; ++i) {
                var sp = sp_tree[i];
                if (sp.selected && i > 0 && !sp_tree[i - 1].selected) {
                    sp.deleteDrawingBase();
                    sp.addToDrawingObjects(i - 1);
                }
            }
        } else {
            this.selection.groupSelection.bringBackward();
        }
    }
};
function asc_CColor() {
    this.type = c_oAscColor.COLOR_TYPE_SRGB;
    this.value = null;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 255;
    this.Mods = [];
    this.ColorSchemeId = -1;
}
asc_CColor.prototype = {
    asc_getR: function () {
        return this.r;
    },
    asc_putR: function (v) {
        this.r = v;
        this.hex = undefined;
    },
    asc_getG: function () {
        return this.g;
    },
    asc_putG: function (v) {
        this.g = v;
        this.hex = undefined;
    },
    asc_getB: function () {
        return this.b;
    },
    asc_putB: function (v) {
        this.b = v;
        this.hex = undefined;
    },
    asc_getA: function () {
        return this.a;
    },
    asc_putA: function (v) {
        this.a = v;
        this.hex = undefined;
    },
    asc_getType: function () {
        return this.type;
    },
    asc_putType: function (v) {
        this.type = v;
    },
    asc_getValue: function () {
        return this.value;
    },
    asc_putValue: function (v) {
        this.value = v;
    },
    asc_getHex: function () {
        if (!this.hex) {
            var a = this.a.toString(16);
            var r = this.r.toString(16);
            var g = this.g.toString(16);
            var b = this.b.toString(16);
            this.hex = (a.length == 1 ? "0" + a : a) + (r.length == 1 ? "0" + r : r) + (g.length == 1 ? "0" + g : g) + (b.length == 1 ? "0" + b : b);
        }
        return this.hex;
    },
    asc_getColor: function () {
        var ret = new CColor(this.r, this.g, this.b);
        return ret;
    }
};
window["Asc"].asc_CColor = asc_CColor;
window["Asc"]["asc_CColor"] = asc_CColor;
prot = asc_CColor.prototype;
prot["asc_getR"] = prot.asc_getR;
prot["asc_putR"] = prot.asc_putR;
prot["asc_getG"] = prot.asc_getG;
prot["asc_putG"] = prot.asc_putG;
prot["asc_getB"] = prot.asc_getB;
prot["asc_putB"] = prot.asc_putB;
prot["asc_getA"] = prot.asc_getA;
prot["asc_putA"] = prot.asc_putA;
prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getValue"] = prot.asc_getValue;
prot["asc_putValue"] = prot.asc_putValue;
prot["asc_getHex"] = prot.asc_getHex;
prot["asc_getColor"] = prot.asc_getColor;
function CreateAscColorCustomEx(r, g, b) {
    var ret = new asc_CColor();
    ret.type = c_oAscColor.COLOR_TYPE_SRGB;
    ret.r = r;
    ret.g = g;
    ret.b = b;
    ret.a = 255;
    return ret;
}
function CreateAscColorEx(unicolor) {
    if (null == unicolor || null == unicolor.color) {
        return new asc_CColor();
    }
    var ret = new asc_CColor();
    ret.r = unicolor.RGBA.R;
    ret.g = unicolor.RGBA.G;
    ret.b = unicolor.RGBA.B;
    ret.a = unicolor.RGBA.A;
    var _color = unicolor.color;
    switch (_color.type) {
    case COLOR_TYPE_SRGB:
        case COLOR_TYPE_SYS:
        break;
    case COLOR_TYPE_PRST:
        ret.type = c_oAscColor.COLOR_TYPE_PRST;
        ret.value = _color.id;
        break;
    case COLOR_TYPE_SCHEME:
        ret.type = c_oAscColor.COLOR_TYPE_SCHEME;
        ret.value = _color.id;
        break;
    default:
        break;
    }
    return ret;
}
function CorrectUniColorEx(asc_color, unicolor) {
    if (null == asc_color) {
        return unicolor;
    }
    var ret = unicolor;
    if (null == ret) {
        ret = new CUniColor();
    }
    var _type = asc_color.asc_getType();
    switch (_type) {
    case c_oAscColor.COLOR_TYPE_PRST:
        if (ret.color == null || ret.color.type != COLOR_TYPE_PRST) {
            ret.setColor(new CPrstColor());
        }
        ret.color.id = asc_color.asc_getValue();
        break;
    case c_oAscColor.COLOR_TYPE_SCHEME:
        if (ret.color == null || ret.color.type != COLOR_TYPE_SCHEME) {
            ret.setColor(new CSchemeColor());
        }
        var _index = parseInt(asc_color.asc_getValue());
        var _id = (_index / 6) >> 0;
        var _pos = _index - _id * 6;
        var array_colors_types = [6, 15, 7, 16, 0, 1, 2, 3, 4, 5];
        ret.color.setColorId(array_colors_types[_id]);
        if (ret.Mods.Mods.length != 0) {
            ret.Mods.Mods.splice(0, ret.Mods.Mods.length);
        }
        var __mods = null;
        var _editor = window["Asc"]["editor"];
        if (_editor && _editor.wbModel) {
            var _theme = _editor.wbModel.theme;
            var _clrMap = _editor.wbModel.clrSchemeMap;
            if (_theme && _clrMap) {
                var _schemeClr = new CSchemeColor();
                _schemeClr.id = array_colors_types[_id];
                var _rgba = {
                    R: 0,
                    G: 0,
                    B: 0,
                    A: 255
                };
                _schemeClr.Calculate(_theme, _clrMap.color_map, _rgba);
                __mods = GetDefaultMods(_schemeClr.RGBA.R, _schemeClr.RGBA.G, _schemeClr.RGBA.B, _pos, 0);
            }
        }
        if (null != __mods) {
            for (var modInd = 0; modInd < __mods.length; modInd++) {
                ret.addMod(_create_mod(__mods[modInd]));
            }
        }
        break;
    default:
        if (ret.color == null || ret.color.type != COLOR_TYPE_SRGB) {
            ret.setColor(new CRGBColor());
        }
        ret.color.setColor(((asc_color.asc_getR() << 16) & 16711680) + ((asc_color.asc_getG() << 8) & 65280) + asc_color.asc_getB());
        ret.clearMods();
    }
    return ret;
}
function asc_CShapeFill() {
    this.type = null;
    this.fill = null;
    this.transparent = null;
}
asc_CShapeFill.prototype = {
    asc_getType: function () {
        return this.type;
    },
    asc_putType: function (v) {
        this.type = v;
    },
    asc_getFill: function () {
        return this.fill;
    },
    asc_putFill: function (v) {
        this.fill = v;
    },
    asc_getTransparent: function () {
        return this.transparent;
    },
    asc_putTransparent: function (v) {
        this.transparent = v;
    }
};
window["Asc"].asc_CShapeFill = asc_CShapeFill;
window["Asc"]["asc_CShapeFill"] = asc_CShapeFill;
prot = asc_CShapeFill.prototype;
prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getFill"] = prot.asc_getFill;
prot["asc_putFill"] = prot.asc_putFill;
prot["asc_getTransparent"] = prot.asc_getTransparent;
prot["asc_putTransparent"] = prot.asc_putTransparent;
function asc_CFillBlip() {
    this.type = c_oAscFillBlipType.STRETCH;
    this.url = "";
    this.texture_id = null;
}
asc_CFillBlip.prototype = {
    asc_getType: function () {
        return this.type;
    },
    asc_putType: function (v) {
        this.type = v;
    },
    asc_getUrl: function () {
        return this.url;
    },
    asc_putUrl: function (v) {
        this.url = v;
    },
    asc_getTextureId: function () {
        return this.texture_id;
    },
    asc_putTextureId: function (v) {
        this.texture_id = v;
    }
};
window["Asc"].asc_CFillBlip = asc_CFillBlip;
window["Asc"]["asc_CFillBlip"] = asc_CFillBlip;
prot = asc_CFillBlip.prototype;
prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getUrl"] = prot.asc_getUrl;
prot["asc_putUrl"] = prot.asc_putUrl;
prot["asc_getTextureId"] = prot.asc_getTextureId;
prot["asc_putTextureId"] = prot.asc_putTextureId;
function asc_CFillHatch() {
    this.PatternType = undefined;
    this.fgClr = undefined;
    this.bgClr = undefined;
}
asc_CFillHatch.prototype = {
    asc_getPatternType: function () {
        return this.PatternType;
    },
    asc_putPatternType: function (v) {
        this.PatternType = v;
    },
    asc_getColorFg: function () {
        return this.fgClr;
    },
    asc_putColorFg: function (v) {
        this.fgClr = v;
    },
    asc_getColorBg: function () {
        return this.bgClr;
    },
    asc_putColorBg: function (v) {
        this.bgClr = v;
    }
};
window["Asc"].asc_CFillHatch = asc_CFillHatch;
window["Asc"]["asc_CFillHatch"] = asc_CFillHatch;
prot = asc_CFillHatch.prototype;
prot["asc_getPatternType"] = prot.asc_getPatternType;
prot["asc_putPatternType"] = prot.asc_putPatternType;
prot["asc_getColorFg"] = prot.asc_getColorFg;
prot["asc_putColorFg"] = prot.asc_putColorFg;
prot["asc_getColorBg"] = prot.asc_getColorBg;
prot["asc_putColorBg"] = prot.asc_putColorBg;
function asc_CFillGrad() {
    this.Colors = undefined;
    this.Positions = undefined;
    this.GradType = 0;
    this.LinearAngle = undefined;
    this.LinearScale = true;
    this.PathType = 0;
}
asc_CFillGrad.prototype = {
    asc_getColors: function () {
        return this.Colors;
    },
    asc_putColors: function (v) {
        this.Colors = v;
    },
    asc_getPositions: function () {
        return this.Positions;
    },
    asc_putPositions: function (v) {
        this.Positions = v;
    },
    asc_getGradType: function () {
        return this.GradType;
    },
    asc_putGradType: function (v) {
        this.GradType = v;
    },
    asc_getLinearAngle: function () {
        return this.LinearAngle;
    },
    asc_putLinearAngle: function (v) {
        this.LinearAngle = v;
    },
    asc_getLinearScale: function () {
        return this.LinearScale;
    },
    asc_putLinearScale: function (v) {
        this.LinearScale = v;
    },
    asc_getPathType: function () {
        return this.PathType;
    },
    asc_putPathType: function (v) {
        this.PathType = v;
    }
};
window["Asc"].asc_CFillGrad = asc_CFillGrad;
window["Asc"]["asc_CFillGrad"] = asc_CFillGrad;
prot = asc_CFillGrad.prototype;
prot["asc_getColors"] = prot.asc_getColors;
prot["asc_putColors"] = prot.asc_putColors;
prot["asc_getPositions"] = prot.asc_getPositions;
prot["asc_putPositions"] = prot.asc_putPositions;
prot["asc_getGradType"] = prot.asc_getGradType;
prot["asc_putGradType"] = prot.asc_putGradType;
prot["asc_getLinearAngle"] = prot.asc_getLinearAngle;
prot["asc_putLinearAngle"] = prot.asc_putLinearAngle;
prot["asc_getLinearScale"] = prot.asc_getLinearScale;
prot["asc_putLinearScale"] = prot.asc_putLinearScale;
prot["asc_getPathType"] = prot.asc_getPathType;
prot["asc_putPathType"] = prot.asc_putPathType;
function asc_CFillSolid() {
    this.color = new CAscColor();
}
asc_CFillSolid.prototype = {
    asc_getColor: function () {
        return this.color;
    },
    asc_putColor: function (v) {
        this.color = v;
    }
};
window["Asc"].asc_CFillSolid = asc_CFillSolid;
window["Asc"]["asc_CFillSolid"] = asc_CFillSolid;
var prot = asc_CFillSolid.prototype;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
function CreateAscFillEx(unifill) {
    if (null == unifill || null == unifill.fill) {
        return new asc_CShapeFill();
    }
    var ret = new asc_CShapeFill();
    var _fill = unifill.fill;
    switch (_fill.type) {
    case FILL_TYPE_SOLID:
        ret.type = c_oAscFill.FILL_TYPE_SOLID;
        ret.fill = new asc_CFillSolid();
        ret.fill.color = CreateAscColorEx(_fill.color);
        break;
    case FILL_TYPE_PATT:
        ret.type = c_oAscFill.FILL_TYPE_PATT;
        ret.fill = new asc_CFillHatch();
        ret.fill.PatternType = _fill.ftype;
        ret.fill.fgClr = CreateAscColorEx(_fill.fgClr);
        ret.fill.bgClr = CreateAscColorEx(_fill.bgClr);
        break;
    case FILL_TYPE_GRAD:
        ret.type = c_oAscFill.FILL_TYPE_GRAD;
        ret.fill = new asc_CFillGrad();
        for (var i = 0; i < _fill.colors.length; i++) {
            if (0 == i) {
                ret.fill.Colors = [];
                ret.fill.Positions = [];
            }
            ret.fill.Colors.push(CreateAscColorEx(_fill.colors[i].color));
            ret.fill.Positions.push(_fill.colors[i].pos);
        }
        if (_fill.lin) {
            ret.fill.GradType = c_oAscFillGradType.GRAD_LINEAR;
            ret.fill.LinearAngle = _fill.lin.angle;
            ret.fill.LinearScale = _fill.lin.scale;
        } else {
            ret.fill.GradType = c_oAscFillGradType.GRAD_PATH;
            ret.fill.PathType = 0;
        }
        break;
    case FILL_TYPE_BLIP:
        ret.type = c_oAscFill.FILL_TYPE_BLIP;
        ret.fill = new asc_CFillBlip();
        ret.fill.url = _fill.RasterImageId;
        ret.fill.type = (_fill.tile == null) ? c_oAscFillBlipType.STRETCH : c_oAscFillBlipType.TILE;
        break;
    case FILL_TYPE_NOFILL:
        case FILL_TYPE_NONE:
        ret.type = c_oAscFill.FILL_TYPE_NOFILL;
        break;
    default:
        break;
    }
    ret.transparent = unifill.transparent;
    return ret;
}
function CorrectUniFillEx(asc_fill, unifill) {
    if (null == asc_fill) {
        return unifill;
    }
    var ret = unifill;
    if (null == ret) {
        ret = new CUniFill();
    }
    var _fill = asc_fill.asc_getFill();
    var _type = asc_fill.asc_getType();
    if (null != _type) {
        switch (_type) {
        case c_oAscFill.FILL_TYPE_NOFILL:
            ret.setFill(new CNoFill());
            break;
        case c_oAscFill.FILL_TYPE_BLIP:
            if (ret.fill == null || ret.fill.type != FILL_TYPE_BLIP) {
                ret.setFill(new CBlipFill());
            }
            var _url = _fill.asc_getUrl();
            var _tx_id = _fill.asc_getTextureId();
            if (null != _tx_id && (0 <= _tx_id) && (_tx_id < g_oUserTexturePresets.length)) {
                _url = g_oUserTexturePresets[_tx_id];
            }
            if (_url != null && _url !== undefined && _url != "") {
                ret.fill.setRasterImageId(_url);
            }
            if (ret.fill.RasterImageId == null) {
                ret.fill.setRasterImageId("");
            }
            var tile = _fill.asc_getType();
            if (tile == c_oAscFillBlipType.STRETCH) {
                ret.fill.setTile(null);
            } else {
                if (tile == c_oAscFillBlipType.TILE) {
                    ret.fill.setTile(true);
                }
            }
            break;
        case c_oAscFill.FILL_TYPE_PATT:
            if (ret.fill == null || ret.fill.type != FILL_TYPE_PATT) {
                ret.setFill(new CPattFill());
            }
            if (undefined != _fill.PatternType) {
                ret.fill.setFType(_fill.PatternType);
            }
            if (undefined != _fill.fgClr) {
                ret.fill.setFgColor(CorrectUniColorEx(_fill.asc_getColorFg(), ret.fill.fgClr));
            }
            if (undefined != _fill.bgClr) {
                ret.fill.setBgColor(CorrectUniColorEx(_fill.asc_getColorBg(), ret.fill.bgClr));
            }
            break;
        case c_oAscFill.FILL_TYPE_GRAD:
            if (ret.fill == null || ret.fill.type != FILL_TYPE_GRAD) {
                ret.setFill(new CGradFill());
            }
            var _colors = _fill.asc_getColors();
            var _positions = _fill.asc_getPositions();
            if (undefined != _colors && undefined != _positions) {
                if (_colors.length == _positions.length) {
                    ret.fill.colors.splice(0, ret.fill.colors.length);
                    for (var i = 0; i < _colors.length; i++) {
                        var _gs = new CGs();
                        _gs.setColor(CorrectUniColorEx(_colors[i], _gs.color));
                        _gs.setPos(_positions[i]);
                        ret.fill.addGS(_gs);
                    }
                }
            } else {
                if (undefined != _colors) {
                    if (_colors.length == ret.fill.colors.length) {
                        for (var i = 0; i < _colors.length; i++) {
                            if (! (_colors[i].value == null && _colors[i].type === c_oAscColor.COLOR_TYPE_SCHEME)) {
                                ret.fill.colors[i].setColor(CorrectUniColorEx(_colors[i], ret.fill.colors[i].color));
                            }
                        }
                    }
                } else {
                    if (undefined != _positions) {
                        if (_positions.length == ret.fill.colors.length) {
                            for (var i = 0; i < _positions.length; i++) {
                                ret.fill.colors[i].setPos(_positions[i]);
                            }
                        }
                    }
                }
            }
            var _grad_type = _fill.asc_getGradType();
            if (c_oAscFillGradType.GRAD_LINEAR == _grad_type) {
                var _angle = _fill.asc_getLinearAngle();
                var _scale = _fill.asc_getLinearScale();
                if (!ret.fill.lin) {
                    ret.fill.setLin(new GradLin());
                }
                if (undefined != _angle) {
                    ret.fill.lin.setAngle(_angle);
                }
                if (undefined != _scale) {
                    ret.fill.lin.setScale(_scale);
                }
            } else {
                if (c_oAscFillGradType.GRAD_PATH == _grad_type) {
                    ret.fill.setLin(null);
                    ret.fill.setPath(new GradPath());
                }
            }
            break;
        default:
            if (ret.fill == null || ret.fill.type != FILL_TYPE_SOLID) {
                ret.setFill(new CSolidFill());
            }
            ret.fill.setColor(CorrectUniColorEx(_fill.asc_getColor(), ret.fill.color));
        }
    }
    var _alpha = asc_fill.asc_getTransparent();
    if (null != _alpha) {
        ret.setTransparent(_alpha);
    }
    return ret;
}
function asc_CStroke() {
    this.type = null;
    this.width = null;
    this.color = null;
    this.LineJoin = null;
    this.LineCap = null;
    this.LineBeginStyle = null;
    this.LineBeginSize = null;
    this.LineEndStyle = null;
    this.LineEndSize = null;
    this.canChangeArrows = false;
}
asc_CStroke.prototype = {
    asc_getType: function () {
        return this.type;
    },
    asc_putType: function (v) {
        this.type = v;
    },
    asc_getWidth: function () {
        return this.width;
    },
    asc_putWidth: function (v) {
        this.width = v;
    },
    asc_getColor: function () {
        return this.color;
    },
    asc_putColor: function (v) {
        this.color = v;
    },
    asc_getLinejoin: function () {
        return this.LineJoin;
    },
    asc_putLinejoin: function (v) {
        this.LineJoin = v;
    },
    asc_getLinecap: function () {
        return this.LineCap;
    },
    asc_putLinecap: function (v) {
        this.LineCap = v;
    },
    asc_getLinebeginstyle: function () {
        return this.LineBeginStyle;
    },
    asc_putLinebeginstyle: function (v) {
        this.LineBeginStyle = v;
    },
    asc_getLinebeginsize: function () {
        return this.LineBeginSize;
    },
    asc_putLinebeginsize: function (v) {
        this.LineBeginSize = v;
    },
    asc_getLineendstyle: function () {
        return this.LineEndStyle;
    },
    asc_putLineendstyle: function (v) {
        this.LineEndStyle = v;
    },
    asc_getLineendsize: function () {
        return this.LineEndSize;
    },
    asc_putLineendsize: function (v) {
        this.LineEndSize = v;
    },
    asc_getCanChangeArrows: function () {
        return this.canChangeArrows;
    }
};
window["Asc"].asc_CStroke = asc_CStroke;
window["Asc"]["asc_CStroke"] = asc_CStroke;
prot = asc_CStroke.prototype;
prot["asc_getType"] = prot.asc_getType;
prot["asc_putType"] = prot.asc_putType;
prot["asc_getWidth"] = prot.asc_getWidth;
prot["asc_putWidth"] = prot.asc_putWidth;
prot["asc_getColor"] = prot.asc_getColor;
prot["asc_putColor"] = prot.asc_putColor;
prot["asc_getLinejoin"] = prot.asc_getLinejoin;
prot["asc_putLinejoin"] = prot.asc_putLinejoin;
prot["asc_getLinecap"] = prot.asc_getLinecap;
prot["asc_putLinecap"] = prot.asc_putLinecap;
prot["asc_getLinebeginstyle"] = prot.asc_getLinebeginstyle;
prot["asc_putLinebeginstyle"] = prot.asc_putLinebeginstyle;
prot["asc_getLinebeginsize"] = prot.asc_getLinebeginsize;
prot["asc_putLinebeginsize"] = prot.asc_putLinebeginsize;
prot["asc_getLineendstyle"] = prot.asc_getLineendstyle;
prot["asc_putLineendstyle"] = prot.asc_putLineendstyle;
prot["asc_getLineendsize"] = prot.asc_getLineendsize;
prot["asc_putLineendsize"] = prot.asc_putLineendsize;
prot["asc_getCanChangeArrows"] = prot.asc_getCanChangeArrows;
function CreateAscStrokeEx(ln, _canChangeArrows) {
    if (null == ln || null == ln.Fill || ln.Fill.fill == null) {
        return new asc_CStroke();
    }
    var ret = new asc_CStroke();
    var _fill = ln.Fill.fill;
    if (_fill != null) {
        switch (_fill.type) {
        case FILL_TYPE_BLIP:
            break;
        case FILL_TYPE_SOLID:
            ret.color = CreateAscColorEx(_fill.color);
            ret.type = c_oAscStrokeType.STROKE_COLOR;
            break;
        case FILL_TYPE_GRAD:
            var _c = _fill.colors;
            if (_c != 0) {
                ret.color = CreateAscColorEx(_fill.colors[0]);
                ret.type = c_oAscStrokeType.STROKE_COLOR;
            }
            break;
        case FILL_TYPE_PATT:
            ret.color = CreateAscColorEx(_fill.fgClr);
            ret.type = c_oAscStrokeType.STROKE_COLOR;
            break;
        case FILL_TYPE_NOFILL:
            ret.color = null;
            ret.type = c_oAscStrokeType.STROKE_NONE;
            break;
        default:
            break;
        }
    }
    ret.width = (ln.w == null) ? 12700 : (ln.w >> 0);
    ret.width /= 36000;
    if (ln.cap != null) {
        ret.asc_putLinecap(ln.cap);
    }
    if (ln.Join != null) {
        ret.asc_putLinejoin(ln.Join.type);
    }
    if (ln.headEnd != null) {
        ret.asc_putLinebeginstyle((ln.headEnd.type == null) ? LineEndType.None : ln.headEnd.type);
        var _len = (null == ln.headEnd.len) ? 1 : (2 - ln.headEnd.len);
        var _w = (null == ln.headEnd.w) ? 1 : (2 - ln.headEnd.w);
        ret.asc_putLinebeginsize(_w * 3 + _len);
    } else {
        ret.asc_putLinebeginstyle(LineEndType.None);
    }
    if (ln.tailEnd != null) {
        ret.asc_putLineendstyle((ln.tailEnd.type == null) ? LineEndType.None : ln.tailEnd.type);
        var _len = (null == ln.tailEnd.len) ? 1 : (2 - ln.tailEnd.len);
        var _w = (null == ln.tailEnd.w) ? 1 : (2 - ln.tailEnd.w);
        ret.asc_putLineendsize(_w * 3 + _len);
    } else {
        ret.asc_putLineendstyle(LineEndType.None);
    }
    if (true === _canChangeArrows) {
        ret.canChangeArrows = true;
    }
    return ret;
}
function CorrectUniStrokeEx(asc_stroke, unistroke) {
    if (null == asc_stroke) {
        return unistroke;
    }
    var ret = unistroke;
    if (null == ret) {
        ret = new CLn();
    }
    var _type = asc_stroke.asc_getType();
    var _w = asc_stroke.asc_getWidth();
    if (_w != null && _w !== undefined) {
        ret.setW(_w * 36000);
    }
    var _color = asc_stroke.asc_getColor();
    if (_type == c_oAscStrokeType.STROKE_NONE) {
        ret.setFill(new CUniFill());
        ret.Fill.setFill(new CNoFill());
    } else {
        if (_type != null) {
            if (null != _color && undefined !== _color) {
                ret.setFill(new CUniFill());
                ret.Fill.setFill(new CSolidFill());
                ret.Fill.fill.setColor(CorrectUniColorEx(_color, ret.Fill.fill.color));
            }
        }
    }
    var _join = asc_stroke.asc_getLinejoin();
    if (null != _join) {
        ret.Join = new LineJoin();
        ret.Join.type = _join;
    }
    var _cap = asc_stroke.asc_getLinecap();
    if (null != _cap) {
        ret.cap = _cap;
    }
    var _begin_style = asc_stroke.asc_getLinebeginstyle();
    if (null != _begin_style) {
        if (ret.headEnd == null) {
            ret.headEnd = new EndArrow();
        }
        ret.headEnd.type = _begin_style;
    }
    var _end_style = asc_stroke.asc_getLineendstyle();
    if (null != _end_style) {
        if (ret.tailEnd == null) {
            ret.tailEnd = new EndArrow();
        }
        ret.tailEnd.type = _end_style;
    }
    var _begin_size = asc_stroke.asc_getLinebeginsize();
    if (null != _begin_size) {
        if (ret.headEnd == null) {
            ret.headEnd = new EndArrow();
        }
        ret.headEnd.w = 2 - ((_begin_size / 3) >> 0);
        ret.headEnd.len = 2 - (_begin_size % 3);
    }
    var _end_size = asc_stroke.asc_getLineendsize();
    if (null != _end_size) {
        if (ret.tailEnd == null) {
            ret.tailEnd = new EndArrow();
        }
        ret.tailEnd.w = 2 - ((_end_size / 3) >> 0);
        ret.tailEnd.len = 2 - (_end_size % 3);
    }
    return ret;
}
function CreateImageDrawingObject(imageUrl, options, drawingObjects) {
    var _this = drawingObjects;
    var worksheet = drawingObjects.getWorksheet();
    if (imageUrl && !_this.isViewerMode()) {
        var _image = asc["editor"].ImageLoader.LoadImage(imageUrl, 1);
        var isOption = options && options.cell;
        var calculateObjectMetrics = function (object, width, height) {
            var metricCoeff = 1;
            var coordsFrom = _this.coordsManager.calculateCoords(object.from);
            var realTopOffset = coordsFrom.y;
            var realLeftOffset = coordsFrom.x;
            var areaWidth = worksheet.getCellLeft(worksheet.getLastVisibleCol(), 0) - worksheet.getCellLeft(worksheet.getFirstVisibleCol(), 0);
            if (areaWidth < width) {
                metricCoeff = width / areaWidth;
                width = areaWidth;
                height /= metricCoeff;
            }
            var areaHeight = worksheet.getCellTop(worksheet.getLastVisibleRow(), 0) - worksheet.getCellTop(worksheet.getFirstVisibleRow(), 0);
            if (areaHeight < height) {
                metricCoeff = height / areaHeight;
                height = areaHeight;
                width /= metricCoeff;
            }
            var cellTo = _this.coordsManager.calculateCell(realLeftOffset + width, realTopOffset + height);
            object.to.col = cellTo.col;
            object.to.colOff = cellTo.colOff;
            object.to.row = cellTo.row;
            object.to.rowOff = cellTo.rowOff;
            worksheet.handlers.trigger("reinitializeScroll");
        };
        var addImageObject = function (_image) {
            if (!_image.Image) {
                worksheet.model.workbook.handlers.trigger("asc_onError", c_oAscError.ID.UplImageUrl, c_oAscError.Level.NoCritical);
            } else {
                var drawingObject = _this.createDrawingObject();
                drawingObject.worksheet = worksheet;
                drawingObject.from.col = isOption ? options.cell.col : worksheet.getSelectedColumnIndex();
                drawingObject.from.row = isOption ? options.cell.row : worksheet.getSelectedRowIndex();
                while (!worksheet.cols[drawingObject.from.col]) {
                    worksheet.expandColsOnScroll(true);
                }
                worksheet.expandColsOnScroll(true);
                while (!worksheet.rows[drawingObject.from.row]) {
                    worksheet.expandRowsOnScroll(true);
                }
                worksheet.expandRowsOnScroll(true);
                calculateObjectMetrics(drawingObject, isOption ? options.width : _image.Image.width, isOption ? options.height : _image.Image.height);
                var coordsFrom = _this.coordsManager.calculateCoords(drawingObject.from);
                var coordsTo = _this.coordsManager.calculateCoords(drawingObject.to);
                drawingObject.graphicObject = _this.controller.createImage(_image.src, drawingObjects.convertMetric(coordsFrom.x, 0, 3), drawingObjects.convertMetric(coordsFrom.y, 0, 3), drawingObjects.convertMetric(coordsTo.x - coordsFrom.x, 0, 3), drawingObjects.convertMetric(coordsTo.y - coordsFrom.y, 0, 3));
                drawingObject.graphicObject.setWorksheet(worksheet.model);
                return drawingObject;
            }
        };
        if (null != _image) {
            return addImageObject(_image);
        }
    }
    return null;
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
function getAbsoluteRectBoundsObject(drawing) {
    var transform = drawing.transform;
    var arrX = [],
    arrY = [];
    arrX.push(transform.TransformPointX(0, 0));
    arrX.push(transform.TransformPointX(drawing.extX, 0));
    arrX.push(transform.TransformPointX(drawing.extX, drawing.extY));
    arrX.push(transform.TransformPointX(0, drawing.extY));
    arrY.push(transform.TransformPointY(0, 0));
    arrY.push(transform.TransformPointY(drawing.extX, 0));
    arrY.push(transform.TransformPointY(drawing.extX, drawing.extY));
    arrY.push(transform.TransformPointY(0, drawing.extY));
    return {
        minX: Math.min.apply(Math, arrX),
        minY: Math.min.apply(Math, arrY),
        maxX: Math.max.apply(Math, arrX),
        maxY: Math.max.apply(Math, arrY)
    };
}
function getAbsoluteRectBoundsArr(aDrawings) {
    var arrBounds = [],
    minX,
    minY,
    maxX,
    maxY,
    i,
    bounds;
    for (i = 0; i < aDrawings.length; ++i) {
        bounds = getAbsoluteRectBoundsObject(aDrawings[i]);
        arrBounds.push(bounds);
        if (i === 0) {
            minX = bounds.minX;
            minY = bounds.minY;
            maxX = bounds.maxX;
            maxY = bounds.maxY;
        } else {
            if (minX > bounds.minX) {
                minX = bounds.minX;
            }
            if (minY > bounds.minY) {
                minY = bounds.minY;
            }
            if (maxX < bounds.maxX) {
                maxX = bounds.maxX;
            }
            if (maxY < bounds.maxY) {
                maxY = bounds.maxY;
            }
        }
    }
    return {
        arrBounds: arrBounds,
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY
    };
}