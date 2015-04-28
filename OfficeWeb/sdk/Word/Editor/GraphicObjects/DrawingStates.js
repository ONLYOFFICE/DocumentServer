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
 var MOVE_DELTA = 1 / 100000;
var SNAP_DISTANCE = 1.27;
function StartAddNewShape(drawingObjects, preset) {
    this.drawingObjects = drawingObjects;
    this.preset = preset;
    this.bStart = false;
    this.bMoved = false;
    this.pageIndex = null;
    this.startX = null;
    this.startY = null;
}
StartAddNewShape.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: null,
                bMarker: true
            };
        }
        this.pageIndex = pageIndex;
        this.startX = x;
        this.startY = y;
        this.drawingObjects.arrPreTrackObjects.length = 0;
        this.drawingObjects.arrPreTrackObjects.push(new NewShapeTrack(this.preset, x, y, this.drawingObjects.document.theme, null, null, null, pageIndex));
        this.bStart = true;
        this.drawingObjects.swapTrackObjects();
        return true;
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (this.bStart && e.IsLocked) {
            if (!this.bMoved && (Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA || this.pageIndex !== pageIndex)) {
                this.bMoved = true;
            }
            var tx, ty;
            if (this.pageIndex !== pageIndex) {
                var t = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.pageIndex);
                tx = t.X;
                ty = t.Y;
            } else {
                tx = x;
                ty = y;
            }
            this.drawingObjects.arrTrackObjects[0].track(e, tx, ty);
            this.drawingObjects.updateOverlay();
        }
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (this.bStart) {
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
                this.startX + ext_x, this.startY + ext_y, this.pageIndex);
            }
            History.Create_NewPoint(historydescription_Document_AddNewShape);
            var bounds = this.drawingObjects.arrTrackObjects[0].getBounds();
            var shape = this.drawingObjects.arrTrackObjects[0].getShape(true, this.drawingObjects.drawingDocument);
            var drawing = new ParaDrawing(shape.spPr.xfrm.extX, shape.spPr.xfrm.extY, shape, this.drawingObjects.drawingDocument, this.drawingObjects.document, null);
            var nearest_pos = this.drawingObjects.document.Get_NearestPos(this.pageIndex, bounds.min_x, bounds.min_y, true, drawing);
            if (false === editor.isViewMode && nearest_pos && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_None, {
                Type: changestype_2_Element_and_Type,
                Element: nearest_pos.Paragraph,
                CheckType: changestype_Paragraph_Content
            }) && false === editor.isViewMode) {
                drawing.Set_DrawingType(drawing_Anchor);
                drawing.Set_GraphicObject(shape);
                shape.setParent(drawing);
                drawing.Set_WrappingType(WRAPPING_TYPE_NONE);
                drawing.Set_Distance(3.2, 0, 3.2, 0);
                nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
                nearest_pos.Page = this.pageIndex;
                drawing.Set_XYForAdd(shape.x, shape.y, nearest_pos, this.pageIndex);
                drawing.Add_ToDocument(nearest_pos, false);
                this.drawingObjects.resetSelection();
                shape.select(this.drawingObjects, this.pageIndex);
                this.drawingObjects.document.Recalculate();
                if (this.preset === "textRect") {
                    this.drawingObjects.selection.textSelection = shape;
                    shape.selectionSetStart(e, x, y, pageIndex);
                    shape.selectionSetEnd(e, x, y, pageIndex);
                }
            } else {
                this.drawingObjects.document.Document_Undo();
            }
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
        editor.sync_StartAddShapeCallback(false);
        editor.sync_EndAddShape();
    }
};
function NullState(drawingObjects) {
    this.drawingObjects = drawingObjects;
}
NullState.prototype = {
    onMouseDown: function (e, x, y, pageIndex, bTextFlag) {
        var ret;
        var selection = this.drawingObjects.selection;
        var b_no_handle_selected = false;
        if (selection.wrapPolygonSelection) {
            b_no_handle_selected = true;
            var object_page_x, object_page_y;
            var coords = CheckCoordsNeedPage(x, y, pageIndex, selection.wrapPolygonSelection.selectStartPage, this.drawingObjects.drawingDocument);
            object_page_x = coords.x;
            object_page_y = coords.y;
            var hit_to_wrap_polygon = selection.wrapPolygonSelection.parent.hitToWrapPolygonPoint(object_page_x, object_page_y);
            var wrap_polygon = selection.wrapPolygonSelection.parent.wrappingPolygon;
            if (hit_to_wrap_polygon.hit) {
                if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
                    if (hit_to_wrap_polygon.hitType === WRAP_HIT_TYPE_POINT) {
                        if (!e.CtrlKey) {
                            this.drawingObjects.changeCurrentState(new PreChangeWrapContour(this.drawingObjects, selection.wrapPolygonSelection, hit_to_wrap_polygon.pointNum));
                        } else {
                            if (wrap_polygon.relativeArrPoints.length > 3) {
                                if (false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                                    Type: changestype_2_Element_and_Type,
                                    Element: selection.wrapPolygonSelection.parent.Get_ParentParagraph(),
                                    CheckType: changestype_Paragraph_Content
                                })) {
                                    History.Create_NewPoint(historydescription_Document_EditWrapPolygon);
                                    var new_rel_array = [].concat(wrap_polygon.relativeArrPoints);
                                    new_rel_array.splice(hit_to_wrap_polygon.pointNum, 1);
                                    wrap_polygon.setEdited(true);
                                    wrap_polygon.setArrRelPoints(new_rel_array);
                                    this.drawingObjects.document.Recalculate();
                                    this.drawingObjects.updateOverlay();
                                }
                            }
                        }
                        return true;
                    } else {
                        this.drawingObjects.changeCurrentState(new PreChangeWrapContourAddPoint(this.drawingObjects, selection.wrapPolygonSelection, hit_to_wrap_polygon.pointNum1, object_page_x, object_page_y));
                        return true;
                    }
                } else {
                    return {
                        objectId: selection.wrapPolygonSelection.Get_Id(),
                        cursorType: "default"
                    };
                }
            }
        } else {
            if (selection.groupSelection) {
                ret = handleSelectedObjects(this.drawingObjects, e, x, y, selection.groupSelection, pageIndex, true);
                if (ret) {
                    return ret;
                }
                ret = handleFloatObjects(this.drawingObjects, selection.groupSelection.arrGraphicObjects, e, x, y, selection.groupSelection, pageIndex, true);
                if (ret) {
                    return ret;
                }
            } else {
                if (selection.chartSelection) {}
            }
        }
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            if (this.drawingObjects.checkNeedResetChartSelection(e, x, y, pageIndex, bTextFlag)) {
                this.drawingObjects.checkChartTextSelection();
            }
            this.drawingObjects.resetInternalSelection();
            if (e.ClickCount < 2) {
                this.drawingObjects.updateOverlay();
            }
        }
        if (!b_no_handle_selected) {
            ret = handleSelectedObjects(this.drawingObjects, e, x, y, null, pageIndex, true);
            if (ret) {
                return ret;
            }
        }
        var drawing_page;
        if (this.drawingObjects.document.CurPos.Type !== docpostype_HdrFtr) {
            drawing_page = this.drawingObjects.graphicPages[pageIndex];
        } else {
            drawing_page = this.drawingObjects.getHdrFtrObjectsByPageIndex(pageIndex);
        }
        ret = handleFloatObjects(this.drawingObjects, drawing_page.beforeTextObjects, e, x, y, null, pageIndex, true);
        if (ret) {
            return ret;
        }
        var no_shape_child_array = [];
        for (var i = 0; i < drawing_page.inlineObjects.length; ++i) {
            if (!drawing_page.inlineObjects[i].parent.isShapeChild()) {
                no_shape_child_array.push(drawing_page.inlineObjects[i]);
            }
        }
        ret = handleInlineObjects(this.drawingObjects, no_shape_child_array, e, x, y, pageIndex, true);
        if (ret) {
            return ret;
        }
        if (!bTextFlag) {
            ret = handleFloatObjects(this.drawingObjects, drawing_page.wrappingObjects, e, x, y, null, pageIndex, true);
            if (ret) {
                return ret;
            }
            ret = handleFloatObjects(this.drawingObjects, drawing_page.behindDocObjects, e, x, y, null, pageIndex, true);
            if (ret) {
                return ret;
            }
        }
        return null;
    },
    onMouseMove: function (e, x, y, pageIndex) {
        var text_object = getTargetTextObject(this.drawingObjects);
        if (text_object && e.IsLocked) {
            text_object.selectionSetEnd(e, x, y, pageIndex);
        }
    },
    onMouseUp: function (e, x, y, pageIndex) {}
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
function PreMoveInlineObject(drawingObjects, majorObject, isSelected, bInside) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.majorObjectIsSelected = isSelected;
    this.bInside = bInside;
}
PreMoveInlineObject.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                cursorType: "default",
                objectId: this.majorObject.Get_Id()
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.changeCurrentState(new MoveInlineObject(this.drawingObjects, this.majorObject));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        return handleMouseUpPreMoveState(this.drawingObjects, e, x, y, pageIndex, true);
    }
};
function MoveInlineObject(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.InlinePos = null;
}
MoveInlineObject.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                cursorType: "default",
                objectId: this.majorObject.Get_Id()
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.InlinePos = this.drawingObjects.document.Get_NearestPos(pageIndex, x, y, false, this.majorObject.parent);
        this.InlinePos.Page = pageIndex;
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {
        var check_paragraphs = [];
        if (!e.CtrlKey) {
            var parent_paragraph = this.majorObject.parent.checkShapeChildAndGetTopParagraph();
            check_paragraphs.push(parent_paragraph);
            var new_check_paragraph = this.majorObject.parent.checkShapeChildAndGetTopParagraph(this.InlinePos.Paragraph);
            if (parent_paragraph !== new_check_paragraph) {
                check_paragraphs.push(new_check_paragraph);
            }
            if (false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: check_paragraphs,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint(historydescription_Document_MoveInlineObject);
                this.majorObject.parent.OnEnd_MoveInline(this.InlinePos);
            }
        } else {
            check_paragraphs.push(this.majorObject.parent.checkShapeChildAndGetTopParagraph(this.InlinePos.Paragraph));
            if (false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: check_paragraphs,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint(historydescription_Document_CopyAndMoveInlineObject);
                var new_para_drawing = new ParaDrawing(this.majorObject.parent.W, this.majorObject.parent.H, null, this.drawingObjects.drawingDocument, null, null);
                var drawing = this.majorObject.copy();
                drawing.setParent(new_para_drawing);
                new_para_drawing.Set_GraphicObject(drawing);
                new_para_drawing.Add_ToDocument(this.InlinePos, false);
                this.drawingObjects.resetSelection();
                this.drawingObjects.selectObject(drawing, pageIndex);
                this.drawingObjects.document.Recalculate();
            }
        }
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function ChangeAdjState(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
ChangeAdjState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var t = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.drawingDocument);
        this.drawingObjects.arrTrackObjects[0].track(t.x, t.y);
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (editor.isViewMode === false) {
            var bounds = this.drawingObjects.arrTrackObjects[0].getBounds();
            var check_paragraphs = [];
            var nearest_pos = this.drawingObjects.document.Get_NearestPos(this.majorObject.parent.pageIndex, bounds.min_x, bounds.min_y, !this.majorObject.parent.Is_Inline(), this.majorObject.parent);
            check_paragraphs.push(nearest_pos.Paragraph);
            var parent_paragraph = this.majorObject.parent.Get_ParentParagraph();
            if (isRealObject(parent_paragraph) && parent_paragraph !== nearest_pos.Paragraph) {
                check_paragraphs.push(parent_paragraph);
            }
            if (false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                Type: changestype_2_ElementsArray_and_Type,
                Elements: check_paragraphs,
                CheckType: changestype_Paragraph_Content
            })) {
                History.Create_NewPoint(historydescription_Document_DrawingChangeAdj);
                this.drawingObjects.arrTrackObjects[0].trackEnd();
                if (!this.majorObject.parent.Is_Inline()) {
                    this.majorObject.parent.OnEnd_ChangeFlow(this.majorObject.x, this.majorObject.y, this.majorObject.parent.pageIndex, this.majorObject.extX, this.majorObject.extY, nearest_pos, true, true);
                } else {
                    this.majorObject.parent.OnEnd_ResizeInline(bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y);
                }
                this.drawingObjects.document.Recalculate();
            }
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
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.drawingDocument);
        this.drawingObjects.handleRotateTrack(e, coords.x, coords.y);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (editor.isViewMode === false) {
            var bounds;
            if (this.majorObject.parent.Is_Inline()) {
                if (this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                    Type: changestype_2_Element_and_Type,
                    Element: this.majorObject.parent.checkShapeChildAndGetTopParagraph(),
                    CheckType: changestype_Paragraph_Content
                }) === false) {
                    History.Create_NewPoint(historydescription_Document_RotateInlineDrawing);
                    bounds = this.drawingObjects.arrTrackObjects[0].getBounds();
                    this.drawingObjects.arrTrackObjects[0].trackEnd(true);
                    this.majorObject.parent.OnEnd_ResizeInline(bounds.max_x - bounds.min_x, bounds.max_y - bounds.min_y);
                }
            } else {
                var arr_bounds = [];
                var arr_nearest_pos = [];
                var check_paragraphs = [];
                var nearest_pos;
                var i, j, page_index;
                for (i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
                    bounds = this.drawingObjects.arrTrackObjects[i].getBounds();
                    arr_bounds.push(bounds);
                    page_index = isRealNumber(this.drawingObjects.arrTrackObjects[i].pageIndex) ? this.drawingObjects.arrTrackObjects[i].pageIndex : this.drawingObjects.arrTrackObjects[i].originalObject.parent.pageIndex;
                    nearest_pos = this.drawingObjects.document.Get_NearestPos(page_index, bounds.min_x, bounds.min_y, true, this.drawingObjects.arrTrackObjects[i].originalObject.parent);
                    arr_nearest_pos.push(nearest_pos);
                    for (j = 0; j < check_paragraphs.length; ++j) {
                        if (check_paragraphs[j] === nearest_pos.Paragraph) {
                            break;
                        }
                    }
                    if (j === check_paragraphs.length) {
                        check_paragraphs.push(nearest_pos.Paragraph);
                    }
                }
                var arr_parent_paragraphs = [];
                if (this instanceof RotateState) {
                    check_paragraphs.length = 0;
                }
                if (! (e.CtrlKey && this instanceof MoveState)) {
                    for (i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
                        if (this.drawingObjects.arrTrackObjects[i].originalObject && this.drawingObjects.arrTrackObjects[i].originalObject.parent) {
                            var paragraph = this.drawingObjects.arrTrackObjects[i].originalObject.parent.Get_ParentParagraph();
                            for (j = 0; j < check_paragraphs.length; ++j) {
                                if (check_paragraphs[j] === paragraph) {
                                    break;
                                }
                            }
                            if (j === check_paragraphs.length) {
                                check_paragraphs.push(paragraph);
                            }
                            arr_parent_paragraphs.push(paragraph);
                        }
                    }
                }
                if (false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
                    Type: changestype_2_ElementsArray_and_Type,
                    Elements: check_paragraphs,
                    CheckType: changestype_Paragraph_Content
                })) {
                    if (! (e.CtrlKey && this instanceof MoveState)) {
                        History.Create_NewPoint(historydescription_Document_RotateFlowDrawingNoCtrl);
                        for (i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
                            bounds = arr_bounds[i];
                            this.drawingObjects.arrTrackObjects[i].trackEnd(true);
                            var original = this.drawingObjects.arrTrackObjects[i].originalObject;
                            original.parent.Update_Size(bounds.extX, bounds.extY);
                            arr_nearest_pos[i].Paragraph.Check_NearestPos(arr_nearest_pos[i]);
                            original.parent.Remove_FromDocument(true);
                            original.parent.Set_XYForAdd(bounds.posX, bounds.posY, arr_nearest_pos[i], original.selectStartPage);
                        }
                        if (! (this instanceof RotateState || this instanceof ResizeState)) {
                            for (i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
                                this.drawingObjects.arrTrackObjects[i].originalObject.parent.Add_ToDocument2(arr_nearest_pos[i].Paragraph);
                            }
                        } else {
                            for (i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
                                this.drawingObjects.arrTrackObjects[i].originalObject.parent.Set_Props(new CImgProperty({
                                    PositionH: {
                                        RelativeFrom: c_oAscRelativeFromH.Page,
                                        UseAlign: false,
                                        Align: undefined,
                                        Value: arr_bounds[i].posX
                                    },
                                    PositionV: {
                                        RelativeFrom: c_oAscRelativeFromV.Page,
                                        UseAlign: false,
                                        Align: undefined,
                                        Value: arr_bounds[i].posY
                                    }
                                }));
                                this.drawingObjects.arrTrackObjects[i].originalObject.parent.Add_ToDocument2(arr_parent_paragraphs[i]);
                            }
                        }
                    } else {
                        History.Create_NewPoint(historydescription_Document_RotateFlowDrawingCtrl);
                        this.drawingObjects.resetSelection();
                        var arr_para_drawings = [],
                        para_drawing;
                        for (i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
                            para_drawing = this.drawingObjects.arrTrackObjects[i].originalObject.parent.Copy();
                            para_drawing.Set_GraphicObject(this.drawingObjects.arrTrackObjects[i].originalObject.copy());
                            para_drawing.GraphicObj.setParent(para_drawing);
                            bounds = arr_bounds[i];
                            para_drawing.Set_XYForAdd(bounds.posX, bounds.posY, arr_nearest_pos[i], pageIndex);
                            arr_para_drawings.push(para_drawing);
                            this.drawingObjects.selectObject(para_drawing.GraphicObj, pageIndex);
                        }
                        for (i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
                            para_drawing = arr_para_drawings[i];
                            para_drawing.Add_ToDocument(arr_nearest_pos[i], false);
                        }
                    }
                    this.drawingObjects.document.Recalculate();
                }
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
        this.drawingObjects.changeCurrentState(new ResizeState(this.drawingObjects, this.majorObject, this.handleNum));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function ResizeState(drawingObjects, majorObject, handleNum) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.handleNum = handleNum;
}
ResizeState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.drawingDocument);
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
        if (Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA || pageIndex !== this.majorObject.parent.pageIndex) {
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
}
MoveState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
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
        var t = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage, this.drawingObjects.drawingDocument);
        var startPage = this.drawingObjects.graphicPages[this.majorObject.selectStartPage];
        var startPos = {
            x: this.startX,
            y: this.startY
        };
        var start_arr = startPage.beforeTextObjects.concat(startPage.wrappingObjects, startPage.inlineObjects, startPage.behindDocObjects);
        var min_dx = null,
        min_dy = null;
        var dx, dy;
        var snap_x = null,
        snap_y = null;
        var snapHorArray = [],
        snapVerArray = [];
        var page = this.drawingObjects.document.Pages[pageIndex];
        snapHorArray.push(page.Margins.Left);
        snapHorArray.push(page.Margins.Right);
        snapHorArray.push(page.Width / 2);
        snapVerArray.push(page.Margins.Top);
        snapVerArray.push(page.Margins.Bottom);
        snapVerArray.push(page.Height / 2);
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
            if (isRealNumber(snap_x)) {
                this.drawingObjects.drawingDocument.DrawVerAnchor(pageIndex, snap_x);
            }
        }
        if (min_dy === null || Math.abs(min_dy) > SNAP_DISTANCE) {
            min_dy = 0;
        } else {
            if (isRealNumber(snap_y)) {
                this.drawingObjects.drawingDocument.DrawHorAnchor(pageIndex, snap_y);
            }
        }
        for (_object_index = 0; _object_index < _objects_count; ++_object_index) {
            _arr_track_objects[_object_index].track(result_x - this.startX + min_dx, result_y - this.startY + min_dy, pageIndex);
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
        if (Math.abs(this.startX - x) > MOVE_DELTA || Math.abs(this.startY - y) > MOVE_DELTA || pageIndex !== this.group.parent.pageIndex) {
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
}
MoveInGroupState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: MoveState.prototype.onMouseMove,
    onMouseUp: function (e, x, y, pageIndex) {
        History.Create_NewPoint(historydescription_Document_MoveInGroup);
        var old_x = this.group.bounds.x;
        var old_y = this.group.bounds.y;
        var i;
        var tracks = this.drawingObjects.arrTrackObjects;
        if (this instanceof MoveInGroupState && e.CtrlKey) {
            this.group.resetSelection();
            for (i = 0; i < tracks.length; ++i) {
                var copy = tracks[i].originalObject.copy();
                copy.setGroup(tracks[i].originalObject.group);
                copy.group.addToSpTree(copy.group.length, copy);
                tracks[i].originalObject = copy;
                tracks[i].trackEnd(true);
                this.group.selectObject(copy, 0);
            }
        } else {
            for (i = 0; i < this.drawingObjects.arrTrackObjects.length; ++i) {
                this.drawingObjects.arrTrackObjects[i].trackEnd(true);
            }
        }
        this.group.updateCoordinatesAfterInternalResize();
        this.group.recalculate();
        var bounds = this.group.bounds;
        var check_paragraphs = [];
        check_paragraphs.push(this.group.parent.Get_ParentParagraph());
        var posX = this.group.spPr.xfrm.offX;
        var posY = this.group.spPr.xfrm.offY;
        this.group.spPr.xfrm.setOffX(0);
        this.group.spPr.xfrm.setOffY(0);
        if (this.group.parent.Is_Inline()) {
            this.group.parent.OnEnd_ResizeInline(bounds.w, bounds.h);
        } else {
            var nearest_pos = this.drawingObjects.document.Get_NearestPos(this.group.parent.pageIndex, this.group.parent.X + (bounds.x - old_x), this.group.parent.Y + (bounds.y - old_y), true, this.group.parent);
            if (nearest_pos.Paragraph !== check_paragraphs[0]) {
                check_paragraphs.push(nearest_pos.Paragraph);
            }
            this.group.parent.OnEnd_ChangeFlow(this.group.posX + posX, this.group.posY + posY, this.group.parent.pageIndex, this.group.spPr.xfrm.extX, this.group.spPr.xfrm.extY, nearest_pos, true, false);
        }
        if (false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
            Type: changestype_2_ElementsArray_and_Type,
            Elements: check_paragraphs,
            CheckType: changestype_Paragraph_Content
        })) {
            this.drawingObjects.document.Recalculate();
        } else {
            this.drawingObjects.document.Document_Undo();
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
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
    onMouseDown: function (e, x, y, pageIndex) {},
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
    onMouseDown: function (e, x, y, pageIndex) {},
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
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: ChangeAdjState.prototype.onMouseMove,
    onMouseUp: MoveInGroupState.prototype.onMouseUp
};
function TextAddState(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
TextAddState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.majorObject.selectionSetEnd(e, x, y, pageIndex);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        this.majorObject.selectionSetEnd(e, x, y, pageIndex);
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function StartChangeWrapContourState(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
StartChangeWrapContourState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {},
    onMouseUp: function (e, x, y, pageIndex) {}
};
function PreChangeWrapContour(drawingObjects, majorObject, pointNum) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.pointNum = pointNum;
}
PreChangeWrapContour.prototype.onMouseDown = function (e, x, y, pageIndex) {};
PreChangeWrapContour.prototype.onMouseMove = function (e, x, y, pageIndex) {
    this.drawingObjects.clearPreTrackObjects();
    this.drawingObjects.addPreTrackObject(new TrackPointWrapPointWrapPolygon(this.majorObject, this.pointNum));
    this.drawingObjects.swapTrackObjects();
    this.drawingObjects.changeCurrentState(new ChangeWrapContour(this.drawingObjects, this.majorObject));
};
PreChangeWrapContour.prototype.onMouseUp = function (e, x, y, pageIndex) {
    this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
};
function ChangeWrapContour(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
ChangeWrapContour.prototype.onMouseDown = function (e, x, y, pageIndex) {};
ChangeWrapContour.prototype.onMouseMove = function (e, x, y, pageIndex) {
    var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage);
    var tr_x, tr_y;
    tr_x = coords.x;
    tr_y = coords.y;
    this.drawingObjects.arrTrackObjects[0].track(tr_x, tr_y);
    this.drawingObjects.updateOverlay();
};
ChangeWrapContour.prototype.onMouseUp = function (e, x, y, pageIndex) {
    if (false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
        Type: changestype_2_Element_and_Type,
        Element: this.drawingObjects.selection.wrapPolygonSelection.parent.Get_ParentParagraph(),
        CheckType: changestype_Paragraph_Content
    })) {
        History.Create_NewPoint(historydescription_Document_ChangeWrapContour);
        var calc_points = [],
        calc_points2 = [],
        i;
        for (i = 0; i < this.majorObject.parent.wrappingPolygon.calculatedPoints.length; ++i) {
            calc_points[i] = {
                x: this.majorObject.parent.wrappingPolygon.calculatedPoints[i].x,
                y: this.majorObject.parent.wrappingPolygon.calculatedPoints[i].y
            };
        }
        calc_points[this.drawingObjects.arrTrackObjects[0].point].x = this.drawingObjects.arrTrackObjects[0].pointCoord.x;
        calc_points[this.drawingObjects.arrTrackObjects[0].point].y = this.drawingObjects.arrTrackObjects[0].pointCoord.y;
        var invert_transform = this.majorObject.invertTransform;
        for (i = 0; i < calc_points.length; ++i) {
            calc_points2[i] = {
                x: (invert_transform.TransformPointX(calc_points[i].x, calc_points[i].y) / this.majorObject.extX) * 21600 >> 0,
                y: (invert_transform.TransformPointY(calc_points[i].x, calc_points[i].y) / this.majorObject.extY) * 21600 >> 0
            };
        }
        this.majorObject.parent.wrappingPolygon.setEdited(true);
        this.majorObject.parent.wrappingPolygon.setArrRelPoints(calc_points2);
        var nearest_pos = this.drawingObjects.document.Get_NearestPos(this.majorObject.selectStartPage, this.majorObject.posX + this.majorObject.bounds.x, this.majorObject.posY + this.majorObject.bounds.y, true, this.majorObject.parent);
        nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
        this.majorObject.parent.Remove_FromDocument(false);
        this.majorObject.parent.Set_XYForAdd(this.majorObject.posX, this.majorObject.posY, nearest_pos, this.majorObject.selectStartPage);
        this.majorObject.parent.Add_ToDocument2(this.majorObject.parent.Get_ParentParagraph());
        this.drawingObjects.document.Recalculate();
    }
    this.drawingObjects.clearTrackObjects();
    this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
};
function PreChangeWrapContourAddPoint(drawingObjects, majorObject, pointNum1, startX, startY) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
    this.pointNum1 = pointNum1;
    this.startX = startX;
    this.startY = startY;
}
PreChangeWrapContourAddPoint.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {},
    onMouseMove: function (e, x, y, pageIndex) {
        if (!e.IsLocked) {
            this.onMouseUp(e, x, y, pageIndex);
            return;
        }
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.addPreTrackObject(new TrackNewPointWrapPolygon(this.majorObject, this.pointNum1));
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new ChangeWrapContourAddPoint(this.drawingObjects, this.majorObject));
        this.drawingObjects.OnMouseMove(e, x, y, pageIndex);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function ChangeWrapContourAddPoint(drawingObjects, majorObject) {
    this.drawingObjects = drawingObjects;
    this.majorObject = majorObject;
}
ChangeWrapContourAddPoint.prototype.onMouseDown = function (e, x, y, pageIndex) {};
ChangeWrapContourAddPoint.prototype.onMouseMove = function (e, x, y, pageIndex) {
    var coords = CheckCoordsNeedPage(x, y, pageIndex, this.majorObject.selectStartPage);
    var tr_x, tr_y;
    tr_x = coords.x;
    tr_y = coords.y;
    this.drawingObjects.arrTrackObjects[0].track(tr_x, tr_y);
    this.drawingObjects.updateOverlay();
};
ChangeWrapContourAddPoint.prototype.onMouseUp = function (e, x, y, pageIndex) {
    if (false === editor.isViewMode && false === this.drawingObjects.document.Document_Is_SelectionLocked(changestype_Drawing_Props, {
        Type: changestype_2_Element_and_Type,
        Element: this.drawingObjects.selection.wrapPolygonSelection.parent.Get_ParentParagraph(),
        CheckType: changestype_Paragraph_Content
    })) {
        History.Create_NewPoint(historydescription_Document_ChangeWrapContourAddPoint);
        var calc_points = [],
        calc_points2 = [],
        i;
        for (i = 0; i < this.drawingObjects.arrTrackObjects[0].arrPoints.length; ++i) {
            calc_points[i] = {
                x: this.drawingObjects.arrTrackObjects[0].arrPoints[i].x,
                y: this.drawingObjects.arrTrackObjects[0].arrPoints[i].y
            };
        }
        var invert_transform = this.majorObject.invertTransform;
        for (i = 0; i < calc_points.length; ++i) {
            calc_points2[i] = {
                x: (invert_transform.TransformPointX(calc_points[i].x, calc_points[i].y) / this.majorObject.extX) * 21600 >> 0,
                y: (invert_transform.TransformPointY(calc_points[i].x, calc_points[i].y) / this.majorObject.extY) * 21600 >> 0
            };
        }
        this.majorObject.parent.wrappingPolygon.setEdited(true);
        this.majorObject.parent.wrappingPolygon.setArrRelPoints(calc_points2);
        var nearest_pos = this.drawingObjects.document.Get_NearestPos(this.majorObject.selectStartPage, this.majorObject.posX + this.majorObject.bounds.x, this.majorObject.posY + this.majorObject.bounds.y, true, this.majorObject.parent);
        nearest_pos.Paragraph.Check_NearestPos(nearest_pos);
        this.majorObject.parent.Remove_FromDocument(false);
        this.majorObject.parent.Set_XYForAdd(this.majorObject.posX, this.majorObject.posY, nearest_pos, this.majorObject.selectStartPage);
        this.majorObject.parent.Add_ToDocument2(this.majorObject.parent.Get_ParentParagraph());
        this.drawingObjects.document.Recalculate();
    }
    this.drawingObjects.clearTrackObjects();
    this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
};
function SplineBezierState(drawingObjects) {
    this.drawingObjects = drawingObjects;
    this.polylineFlag = true;
}
SplineBezierState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: null,
                bMarker: true
            };
        }
        this.drawingObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.addTrackObject(new Spline(this.drawingObjects, this.drawingObjects.document.theme, null, null, null, pageIndex));
        this.drawingObjects.arrTrackObjects[0].path.push(new SplineCommandMoveTo(x, y));
        this.drawingObjects.changeCurrentState(new SplineBezierState33(this.drawingObjects, x, y, pageIndex));
        this.drawingObjects.resetSelection();
        this.drawingObjects.updateOverlay();
    },
    onMouseMove: function (e, X, Y, pageIndex) {},
    onMouseUp: function (e, X, Y, pageIndex) {
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
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
                objectId: null,
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
            var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, startPos.pageIndex);
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
                objectId: null,
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
            var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, startPos.pageIndex);
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
                var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
                objectId: null,
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
            var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
                objectId: null,
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
            var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
                var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
                objectId: null,
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
            var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
                objectId: null,
                bMarker: true
            };
        }
        this.drawingObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.addTrackObject(new PolyLine(this.drawingObjects, this.drawingObjects.document.theme, null, null, null, pageIndex));
        this.drawingObjects.arrTrackObjects[0].arrPoint.push({
            x: x,
            y: y
        });
        this.drawingObjects.resetSelection();
        this.drawingObjects.updateOverlay();
        var _min_distance = this.drawingObjects.drawingDocument.GetMMPerDot(1);
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
                objectId: null,
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
            var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
                objectId: null,
                bMarker: true
            };
        }
        this.drawingObjects.startTrackPos = {
            x: x,
            y: y,
            pageIndex: pageIndex
        };
        this.drawingObjects.resetSelection();
        this.drawingObjects.updateOverlay();
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.addTrackObject(new PolyLine(this.drawingObjects, this.drawingObjects.document.theme, null, null, null, pageIndex));
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
                objectId: null,
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
                var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
    this.minSize = drawingObjects.drawingDocument.GetMMPerDot(1);
    this.polylineFlag = true;
}
AddPolyLine2State3.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.drawingObjects.handleEventMode === HANDLE_EVENT_MODE_CURSOR) {
            return {
                objectId: null,
                bMarker: true
            };
        }
        var tr_x, tr_y;
        if (pageIndex === this.drawingObjects.startTrackPos.pageIndex) {
            tr_x = x;
            tr_y = y;
        } else {
            var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
            var tr_point = this.drawingObjects.drawingDocument.ConvertCoordsToAnotherPage(x, y, pageIndex, this.drawingObjects.startTrackPos.pageIndex);
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
        this.drawingObjects.drawingDocument.m_oWordControl.OnUpdateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (e.ClickCount > 1) {
            this.bStart = true;
            this.pageIndex = this.drawingObjects.startTrackPos.pageIndex;
            StartAddNewShape.prototype.onMouseUp.call(this, e, x, y, pageIndex);
        }
    }
};