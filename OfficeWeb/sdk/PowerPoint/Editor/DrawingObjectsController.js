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
DrawingObjectsController.prototype.getTheme = function () {
    return this.drawingObjects.Layout.Master.Theme;
};
DrawingObjectsController.prototype.getDrawingArray = function () {
    return this.drawingObjects.cSld.spTree;
};
DrawingObjectsController.prototype.checkSelectedObjectsAndCallback = function (callback, args, bNoSendProps, nHistoryPointType) {
    var check_type = changestype_Drawing_Props,
    comment;
    if (this.drawingObjects.slideComments) {
        comment = this.drawingObjects.slideComments.getSelectedComment();
        if (comment) {
            check_type = changestype_MoveComment;
            comment = comment.Get_Id();
        }
    }
    if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(check_type, comment) === false) {
        var nPointType = isRealNumber(nHistoryPointType) ? nHistoryPointType : historydescription_CommonControllerCheckSelected;
        History.Create_NewPoint(nPointType);
        callback.apply(this, args);
        this.startRecalculate();
    }
};
DrawingObjectsController.prototype.startRecalculate = function () {
    editor.WordControl.m_oLogicDocument.Recalculate();
};
DrawingObjectsController.prototype.getDrawingObjects = function () {
    return this.drawingObjects.cSld.spTree;
};
DrawingObjectsController.prototype.paragraphFormatPaste = function (CopyTextPr, CopyParaPr, Bool) {
    var _this = this;
    this.checkSelectedObjectsAndCallback(function () {
        this.applyTextFunction(CDocumentContent.prototype.Paragraph_Format_Paste, CTable.prototype.Paragraph_Format_Paste, [CopyTextPr, CopyParaPr, Bool]);
    },
    [CopyTextPr, CopyParaPr, Bool], false, historydescription_Presentation_ParaFormatPaste);
};
DrawingObjectsController.prototype.paragraphFormatPaste2 = function () {
    return this.paragraphFormatPaste(editor.WordControl.m_oLogicDocument.CopyTextPr, editor.WordControl.m_oLogicDocument.CopyParaPr, true);
};
DrawingObjectsController.prototype.getDrawingDocument = function () {
    return editor.WordControl.m_oDrawingDocument;
};
DrawingObjectsController.prototype.getTheme = function () {
    return this.drawingObjects.Layout.Master.Theme;
};
DrawingObjectsController.prototype.onMouseDown = function (e, x, y) {
    var ret = this.curState.onMouseDown(e, x, y, 0);
    if (e.ClickCount < 2) {
        this.updateOverlay();
        this.updateSelectionState();
    }
    return ret;
};
DrawingObjectsController.prototype.OnMouseDown = DrawingObjectsController.prototype.onMouseDown;
DrawingObjectsController.prototype.onMouseMove = function (e, x, y) {
    this.curState.onMouseMove(e, x, y, 0);
};
DrawingObjectsController.prototype.OnMouseMove = DrawingObjectsController.prototype.onMouseMove;
DrawingObjectsController.prototype.onMouseUp = function (e, x, y) {
    this.curState.onMouseUp(e, x, y, 0);
};
DrawingObjectsController.prototype.OnMouseUp = DrawingObjectsController.prototype.onMouseUp;
DrawingObjectsController.prototype.convertPixToMM = function (pix) {
    return editor.WordControl.m_oDrawingDocument.GetMMPerDot(pix);
};
DrawingObjectsController.prototype.resetSelect = function () {
    this.checkChartTextSelection(true);
    this.resetSelection();
    this.clearPreTrackObjects();
    this.clearTrackObjects();
    this.changeCurrentState(new NullState(this));
};
DrawingObjectsController.prototype.checkSelectedObjectsAndFireCallback = function (callback, args) {
    var check_type = changestype_Drawing_Props,
    comment;
    if (this.drawingObjects.slideComments) {
        comment = this.drawingObjects.slideComments.getSelectedComment();
        if (comment) {
            check_type = changestype_MoveComment;
            comment = comment.Get_Id();
        }
    }
    if (editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(check_type, comment) === false) {
        callback.apply(this, args);
        this.startRecalculate();
    }
};
DrawingObjectsController.prototype.showChartSettings = function () {
    editor.asc_doubleClickOnChart(this.getChartObject());
    this.changeCurrentState(new NullState(this));
};
DrawingObjectsController.prototype.getColorMapOverride = function () {
    return this.drawingObjects.Get_ColorMap();
};
DrawingObjectsController.prototype.editChart = function (binary) {
    var bin_object = {
        "binary": binary
    };
    var chart_space = this.getChartSpace2(bin_object, null);
    chart_space.setParent(this.drawingObjects);
    var by_types;
    by_types = getObjectsByTypesFromArr(this.selectedObjects, true);
    if (by_types.charts.length === 1) {
        if (by_types.charts[0].group) {
            var parent_group = by_types.charts[0].group;
            var major_group = by_types.charts[0].getMainGroup();
            for (var i = parent_group.spTree.length - 1; i > -1; --i) {
                if (parent_group.spTree[i] === by_types.charts[0]) {
                    parent_group.removeFromSpTreeByPos(i);
                    chart_space.setGroup(parent_group);
                    chart_space.spPr.xfrm.setOffX(by_types.charts[0].spPr.xfrm.offX);
                    chart_space.spPr.xfrm.setOffY(by_types.charts[0].spPr.xfrm.offY);
                    parent_group.addToSpTree(i, chart_space);
                    parent_group.updateCoordinatesAfterInternalResize();
                    major_group.recalculate();
                    if (this.selection.groupSelection) {
                        this.selection.groupSelection.resetSelection();
                        this.selection.groupSelection.selectObject(chart_space, this.drawingObjects.num);
                    }
                    this.startRecalculate();
                    this.sendGraphicObjectProps();
                    return;
                }
            }
        } else {
            chart_space.spPr.xfrm.setOffX(by_types.charts[0].x);
            chart_space.spPr.xfrm.setOffY(by_types.charts[0].y);
            var pos = by_types.charts[0].deleteDrawingBase();
            chart_space.addToDrawingObjects(pos);
            this.resetSelection();
            this.selectObject(chart_space, this.drawingObjects.num);
            this.startRecalculate();
            this.sendGraphicObjectProps();
            this.updateOverlay();
        }
    }
};
DrawingObjectsController.prototype.handleSlideComments = function (e, x, y, pageIndex) {
    var comments = this.drawingObjects.slideComments.comments,
    i, index_selected = -1;
    var ret = {
        result: null,
        selectedIndex: -1
    };
    if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
        editor.asc_hideComments();
        for (i = comments.length - 1; i > -1; --i) {
            if (comments[i].selected) {
                index_selected = i;
            }
            comments[i].selected = false;
        }
    }
    for (i = comments.length - 1; i > -1; --i) {
        if (comments[i].hit(x, y)) {
            if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
                comments[i].selected = true;
                this.addPreTrackObject(new MoveComment(comments[i]));
                this.changeCurrentState(new PreMoveCommentState(this, x, y, comments[i]));
                if (i !== index_selected) {
                    this.drawingObjects.showDrawingObjects(true);
                }
                ret.result = true;
                ret.selectedIndex = index_selected;
                return ret;
            } else {
                ret.result = {
                    objectId: comments[i],
                    cursorType: "move"
                };
                ret.selectedIndex = index_selected;
                return ret;
            }
        }
    }
    if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
        ret.result = false;
        ret.selectedIndex = index_selected;
        return ret;
    } else {
        ret.result = null;
        ret.selectedIndex = index_selected;
        return ret;
    }
};
function PreMoveCommentState(drawingObjects, startX, startY, comment) {
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.comment = comment;
}
PreMoveCommentState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            return true;
        } else {
            return {
                objectId: this.comment,
                cursorType: "move"
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        if (Math.abs(this.startX - x) < MOVE_DELTA && Math.abs(this.startY - y) < MOVE_DELTA) {
            return;
        }
        this.drawingObjects.swapTrackObjects();
        this.drawingObjects.changeCurrentState(new MoveCommentState(this.drawingObjects, this.startX, this.startY, this.comment));
        this.drawingObjects.onMouseMove(e, x, y);
    },
    onMouseUp: function (e, x, y, pageIndex) {
        var Coords = editor.WordControl.m_oDrawingDocument.ConvertCoordsToCursorWR_Comment(this.comment.x, this.comment.y, this.drawingObjects.num);
        editor.sync_HideComment();
        editor.sync_ShowComment(this.comment.Id, Coords.X, Coords.Y);
        editor.WordControl.m_oLogicDocument.noShowContextMenu = true;
        this.drawingObjects.clearPreTrackObjects();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};
function MoveCommentState(drawingObjects, startX, startY, comment) {
    this.drawingObjects = drawingObjects;
    this.startX = startX;
    this.startY = startY;
    this.comment = comment;
}
MoveCommentState.prototype = {
    onMouseDown: function (e, x, y, pageIndex) {
        if (this.handleEventMode === HANDLE_EVENT_MODE_HANDLE) {
            return true;
        } else {
            return {
                objectId: this.comment,
                cursorType: "move"
            };
        }
    },
    onMouseMove: function (e, x, y, pageIndex) {
        var dx = x - this.startX;
        var dy = y - this.startY;
        this.drawingObjects.arrTrackObjects[0].track(dx, dy);
        this.drawingObjects.updateOverlay();
    },
    onMouseUp: function (e, x, y, pageIndex) {
        if (!this.drawingObjects.isViewMode() && editor.WordControl.m_oLogicDocument.Document_Is_SelectionLocked(changestype_MoveComment, this.comment.Get_Id()) === false) {
            History.Create_NewPoint(historydescription_Presentation_MoveComments);
            var tracks = this.drawingObjects.arrTrackObjects;
            for (var i = 0; i < tracks.length; ++i) {
                tracks[i].trackEnd();
            }
            this.drawingObjects.startRecalculate();
        }
        this.drawingObjects.clearTrackObjects();
        this.drawingObjects.updateOverlay();
        this.drawingObjects.changeCurrentState(new NullState(this.drawingObjects));
    }
};