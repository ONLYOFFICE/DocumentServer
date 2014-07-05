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
 (function ($, window, undefined) {
    var asc = window["Asc"];
    var asc_round = asc.round;
    var asc_typeof = asc.typeOf;
    var asc_FP = asc.FontProperties;
    var asc_CE = asc.CellEditor;
    var asc_WSV = asc.WorksheetView;
    var asc_CB = asc.Clipboard;
    var asc_CMM = asc.asc_CMouseMoveData;
    var asc_CPrintPagesData = asc.CPrintPagesData;
    var asc_DC = asc.DrawingContext;
    var asc_SR = asc.StringRender;
    var asc_getcvt = asc.getCvtRatio;
    var asc_CSP = asc.asc_CStylesPainter;
    function WorkbookView(model, controller, handlers, elem, inputElem, Api, collaborativeEditing, fontRenderingMode, settings) {
        if (! (this instanceof WorkbookView)) {
            return new WorkbookView(model, controller, handlers, elem, inputElem, Api, collaborativeEditing, fontRenderingMode, settings);
        }
        this.model = model;
        this.controller = controller;
        this.handlers = handlers;
        this.element = elem;
        this.input = inputElem;
        this.settings = $.extend(true, {},
        this.defaults, settings);
        this.clipboard = new asc_CB();
        this.Api = Api;
        this.collaborativeEditing = collaborativeEditing;
        this.lastSendInfoRange = null;
        this.canUpdateAfterShiftUp = false;
        this.canvas = undefined;
        this.canvasOverlay = undefined;
        this.wsActive = -1;
        this.wsViews = [];
        this.cellEditor = undefined;
        this.fontRenderingMode = null;
        this._lockDraw = false;
        this.fmgrGraphics = [];
        this.fmgrGraphics.push(new CFontManager());
        this.fmgrGraphics.push(new CFontManager());
        this.fmgrGraphics.push(new CFontManager());
        this.fmgrGraphics[0].Initialize(true);
        this.fmgrGraphics[1].Initialize(true);
        this.fmgrGraphics[2].Initialize(true);
        this.buffers = {};
        this.drawingCtx = undefined;
        this.overlayCtx = undefined;
        this.stringRender = undefined;
        this.drawingCtxCharts = undefined;
        this.maxDigitWidth = 0;
        this.defaultFont = new asc_FP(this.model.getDefaultFont(), this.model.getDefaultSize());
        this.m_dScrollY = 0;
        this.m_dScrollX = 0;
        this.m_dScrollY_max = 1;
        this.m_dScrollX_max = 1;
        this.MobileTouchManager = null;
        this.init(fontRenderingMode);
        return this;
    }
    WorkbookView.prototype = {
        constructor: WorkbookView,
        defaults: {
            worksheetDefaults: {}
        },
        init: function (fontRenderingMode) {
            var self = this;
            this.setFontRenderingMode(fontRenderingMode, true);
            var _head = document.getElementsByTagName("head")[0];
            var style0 = document.createElement("style");
            style0.type = "text/css";
            style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
            _head.appendChild(style0);
            var outer = this.element.find("#ws-canvas-outer");
            if (outer.length < 1) {
                outer = $('<div id="ws-canvas-outer"><canvas id="ws-canvas"/><canvas id="ws-canvas-overlay"/><canvas id="id_target_cursor" class="block_elem" width="1" height="1" style="width:2px;height:13px;display:none;z-index:1004;"></canvas></div>').appendTo(this.element);
            }
            this.canvas = this.element.find("#ws-canvas").attr("width", outer.width()).attr("height", outer.height());
            this.canvasOverlay = this.element.find("#ws-canvas-overlay").attr("width", outer.width()).attr("height", outer.height());
            this.buffers.main = asc_DC({
                canvas: this.canvas[0],
                units: 1,
                fmgrGraphics: this.fmgrGraphics
            });
            this.buffers.overlay = asc_DC({
                canvas: this.canvasOverlay[0],
                units: 1,
                fmgrGraphics: this.fmgrGraphics
            });
            this.buffers.overlay.ctx.isOverlay = true;
            this.drawingCtx = this.buffers.main;
            this.overlayCtx = this.buffers.overlay;
            this.buffers.shapeCtx = new CGraphics();
            this.buffers.shapeCtx.init(this.drawingCtx.ctx, this.drawingCtx.getWidth(0), this.drawingCtx.getHeight(0), this.drawingCtx.getWidth(3), this.drawingCtx.getHeight(3));
            this.buffers.shapeCtx.m_oFontManager = this.fmgrGraphics[2];
            this.buffers.shapeOverlayCtx = new CGraphics();
            this.buffers.shapeOverlayCtx.init(this.overlayCtx.ctx, this.overlayCtx.getWidth(0), this.overlayCtx.getHeight(0), this.overlayCtx.getWidth(3), this.overlayCtx.getHeight(3));
            this.buffers.shapeOverlayCtx.m_oFontManager = this.fmgrGraphics[2];
            this.drawingCtxCharts = asc_DC({
                units: 1,
                fmgrGraphics: this.fmgrGraphics
            });
            this.stringRender = asc_SR(this.buffers.main);
            this.stringRender.setDefaultFont(this.defaultFont);
            this._calcMaxDigitWidth();
            this.controller.init(this, this.element, this.canvasOverlay, {
                "resize": function () {
                    self.resize.apply(self, arguments);
                },
                "reinitializeScroll": function () {
                    self._onScrollReinitialize.apply(self, arguments);
                },
                "scrollY": function () {
                    self._onScrollY.apply(self, arguments);
                },
                "scrollX": function () {
                    self._onScrollX.apply(self, arguments);
                },
                "changeSelection": function () {
                    self._onChangeSelection.apply(self, arguments);
                },
                "changeSelectionDone": function () {
                    self._onChangeSelectionDone.apply(self, arguments);
                },
                "changeSelectionRightClick": function () {
                    self._onChangeSelectionRightClick.apply(self, arguments);
                },
                "selectionActivePointChanged": function () {
                    self._onSelectionActivePointChanged.apply(self, arguments);
                },
                "updateWorksheet": function () {
                    self._onUpdateWorksheet.apply(self, arguments);
                },
                "resizeElement": function () {
                    self._onResizeElement.apply(self, arguments);
                },
                "resizeElementDone": function () {
                    self._onResizeElementDone.apply(self, arguments);
                },
                "changeFillHandle": function () {
                    self._onChangeFillHandle.apply(self, arguments);
                },
                "changeFillHandleDone": function () {
                    self._onChangeFillHandleDone.apply(self, arguments);
                },
                "moveRangeHandle": function () {
                    self._onMoveRangeHandle.apply(self, arguments);
                },
                "moveRangeHandleDone": function () {
                    self._onMoveRangeHandleDone.apply(self, arguments);
                },
                "moveResizeRangeHandle": function () {
                    self._onMoveResizeRangeHandle.apply(self, arguments);
                },
                "moveResizeRangeHandleDone": function () {
                    self._onMoveResizeRangeHandleDone.apply(self, arguments);
                },
                "editCell": function () {
                    self._onEditCell.apply(self, arguments);
                },
                "stopCellEditing": function () {
                    return self._onStopCellEditing.apply(self, arguments);
                },
                "empty": function () {
                    self._onEmpty.apply(self, arguments);
                },
                "canEnterCellRange": function () {
                    self.cellEditor.setFocus(false);
                    var ret = self.cellEditor.canEnterCellRange();
                    ret ? self.cellEditor.activateCellRange() : true;
                    return ret;
                },
                "enterCellRange": function () {
                    self.cellEditor.setFocus(false);
                    self.getWorksheet().enterCellRange(self.cellEditor);
                },
                "changeCellRange": function () {
                    self.getWorksheet().changeCellRange(self.cellEditor);
                },
                "copy": function () {
                    self.copyToClipboard.apply(self, arguments);
                },
                "paste": function () {
                    self.pasteFromClipboard.apply(self, arguments);
                },
                "cut": function () {
                    self.cutToClipboard.apply(self, arguments);
                },
                "undo": function () {
                    self.undo.apply(self, arguments);
                },
                "redo": function () {
                    self.redo.apply(self, arguments);
                },
                "addColumn": function () {
                    self._onAddColumn.apply(self, arguments);
                },
                "addRow": function () {
                    self._onAddRow.apply(self, arguments);
                },
                "mouseDblClick": function () {
                    self._onMouseDblClick.apply(self, arguments);
                },
                "showNextPrevWorksheet": function () {
                    self._onShowNextPrevWorksheet.apply(self, arguments);
                },
                "setFontAttributes": function () {
                    self._onSetFontAttributes.apply(self, arguments);
                },
                "selectColumnsByRange": function () {
                    self._onSelectColumnsByRange.apply(self, arguments);
                },
                "selectRowsByRange": function () {
                    self._onSelectRowsByRange.apply(self, arguments);
                },
                "save": function () {
                    self.Api.asc_Save();
                },
                "showCellEditorCursor": function () {
                    self._onShowCellEditorCursor.apply(self, arguments);
                },
                "print": function () {
                    self.Api.asc_Print();
                },
                "addFunction": function () {
                    self.insertFormulaInEditor.apply(self, arguments);
                },
                "canvasClick": function () {
                    self.enableKeyEventsHandler(true);
                },
                "autoFiltersClick": function () {
                    self._onAutoFiltersClick.apply(self, arguments);
                },
                "commentCellClick": function () {
                    self._onCommentCellClick.apply(self, arguments);
                },
                "isGlobalLockEditCell": function () {
                    return self.collaborativeEditing.getGlobalLockEditCell();
                },
                "updateSelectionName": function () {
                    self._onUpdateSelectionName.apply(self, arguments);
                },
                "graphicObjectMouseDown": function () {
                    self._onGraphicObjectMouseDown.apply(self, arguments);
                },
                "graphicObjectMouseMove": function () {
                    self._onGraphicObjectMouseMove.apply(self, arguments);
                },
                "graphicObjectMouseUp": function () {
                    self._onGraphicObjectMouseUp.apply(self, arguments);
                },
                "graphicObjectWindowKeyDown": function () {
                    return self._onGraphicObjectWindowKeyDown.apply(self, arguments);
                },
                "graphicObjectWindowKeyPress": function () {
                    return self._onGraphicObjectWindowKeyPress.apply(self, arguments);
                },
                "getGraphicsInfo": function () {
                    return self._onGetGraphicsInfo.apply(self, arguments);
                },
                "getSelectedGraphicObjects": function () {
                    return self._onGetSelectedGraphicObjects.apply(self, arguments);
                },
                "updateSelectionShape": function () {
                    return self._onUpdateSelectionShape.apply(self, arguments);
                }
            });
            this.model.handlers.add("cleanCellCache", function (wsId, range, canChangeColWidth) {
                var ws = self.getWorksheetById(wsId);
                if (ws) {
                    ws.changeWorksheet("updateRange", {
                        range: range,
                        isLockDraw: wsId != self.getWorksheet(self.wsActive).model.getId(),
                        canChangeColWidth: canChangeColWidth
                    });
                }
            });
            this.model.handlers.add("changeWorksheetUpdate", function (wsId, val) {
                self.getWorksheetById(wsId).changeWorksheet("update", val);
            });
            this.model.handlers.add("insertCell", function (wsId, val, range) {
                self.getWorksheetById(wsId).changeWorksheet("insCell", {
                    val: val,
                    range: range
                });
            });
            this.model.handlers.add("deleteCell", function (wsId, val, range) {
                self.getWorksheetById(wsId).changeWorksheet("delCell", {
                    val: val,
                    range: range
                });
            });
            this.model.handlers.add("showWorksheet", function (wsId) {
                self.showWorksheetById(wsId);
                var ws = self.getWorksheetById(wsId);
                if (ws) {
                    self.handlers.trigger("asc_onActiveSheetChanged", ws.model.getIndex());
                }
            });
            this.model.handlers.add("setSelection", function () {
                self._onSetSelection.apply(self, arguments);
            });
            this.model.handlers.add("getSelectionState", function () {
                return self._onGetSelectionState.apply(self);
            });
            this.model.handlers.add("setSelectionState", function () {
                self._onSetSelectionState.apply(self, arguments);
            });
            this.model.handlers.add("reInit", function () {
                self.reInit.apply(self, arguments);
            });
            this.model.handlers.add("drawWS", function () {
                self.drawWS.apply(self, arguments);
            });
            this.model.handlers.add("showDrawingObjects", function () {
                self.onShowDrawingObjects.apply(self, arguments);
            });
            this.model.handlers.add("lockDraw", function () {
                self.lockDraw.apply(self, arguments);
            });
            this.model.handlers.add("setCanUndo", function (bCanUndo) {
                self.handlers.trigger("asc_onCanUndoChanged", bCanUndo);
            });
            this.model.handlers.add("setCanRedo", function (bCanRedo) {
                self.handlers.trigger("asc_onCanRedoChanged", bCanRedo);
            });
            this.model.handlers.add("setDocumentModified", function (bIsModified) {
                self.handlers.trigger("asc_onDocumentModifiedChanged", bIsModified);
            });
            this.model.handlers.add("initCommentsToSave", function (bIsModified) {
                self._initCommentsToSave();
            });
            this.model.handlers.add("replaceWorksheet", function (from, to) {
                self.replaceWorksheet(from, to);
            });
            this.model.handlers.add("removeWorksheet", function (nIndex) {
                self.removeWorksheet(nIndex);
            });
            this.model.handlers.add("spliceWorksheet", function () {
                self.spliceWorksheet.apply(self, arguments);
            });
            this.model.handlers.add("updateWorksheetByModel", function () {
                self.updateWorksheetByModel.apply(self, arguments);
            });
            this.model.handlers.add("undoRedoAddRemoveRowCols", function (sheetId, type, range, bUndo) {
                if (true === bUndo) {
                    if (historyitem_Worksheet_AddRows === type) {
                        self.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
                        self.collaborativeEditing.undoRows(sheetId, range.r2 - range.r1 + 1);
                    } else {
                        if (historyitem_Worksheet_RemoveRows === type) {
                            self.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
                            self.collaborativeEditing.undoRows(sheetId, range.r2 - range.r1 + 1);
                        } else {
                            if (historyitem_Worksheet_AddCols === type) {
                                self.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
                                self.collaborativeEditing.undoCols(sheetId, range.c2 - range.c1 + 1);
                            } else {
                                if (historyitem_Worksheet_RemoveCols === type) {
                                    self.collaborativeEditing.addColsRange(sheetId, range.clone(true));
                                    self.collaborativeEditing.undoCols(sheetId, range.c2 - range.c1 + 1);
                                }
                            }
                        }
                    }
                } else {
                    if (historyitem_Worksheet_AddRows === type) {
                        self.collaborativeEditing.addRowsRange(sheetId, range.clone(true));
                        self.collaborativeEditing.addRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                    } else {
                        if (historyitem_Worksheet_RemoveRows === type) {
                            self.collaborativeEditing.removeRowsRange(sheetId, range.clone(true));
                            self.collaborativeEditing.removeRows(sheetId, range.r1, range.r2 - range.r1 + 1);
                        } else {
                            if (historyitem_Worksheet_AddCols === type) {
                                self.collaborativeEditing.addColsRange(sheetId, range.clone(true));
                                self.collaborativeEditing.addCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                            } else {
                                if (historyitem_Worksheet_RemoveCols === type) {
                                    self.collaborativeEditing.removeColsRange(sheetId, range.clone(true));
                                    self.collaborativeEditing.removeCols(sheetId, range.c1, range.c2 - range.c1 + 1);
                                }
                            }
                        }
                    }
                }
            });
            this.model.handlers.add("undoRedoHideSheet", function (sheetId) {
                self.showWorksheet(sheetId);
                self.handlers.trigger("asc_onSheetsChanged");
            });
            this.input.on("focus", function () {
                self.input.addClass("focused");
                if (self.controller.settings.isViewerMode) {
                    return;
                }
                self.controller.setStrictClose(true);
                self.cellEditor.callTopLineMouseup = true;
                if (!self.controller.isCellEditMode && !self.controller.isFillHandleMode) {
                    self._onEditCell(0, 0, false, true);
                }
            });
            this.cellEditor = new asc_CE(this.element, this.input, this.fmgrGraphics, {
                "closed": function () {
                    self._onCloseCellEditor.apply(self, arguments);
                },
                "updated": function () {
                    self.handlers.trigger.apply(self.handlers, ["asc_onCellTextChanged"].concat(Array.prototype.slice.call(arguments)));
                },
                "gotFocus": function (hasFocus) {
                    self.controller.setFocus(!hasFocus);
                },
                "copy": function () {
                    self.copyToClipboard.apply(self, arguments);
                },
                "paste": function () {
                    self.pasteFromClipboard.apply(self, arguments);
                },
                "cut": function () {
                    self.cutToClipboard.apply(self, arguments);
                },
                "updateFormulaEditMod": function () {
                    self.controller.setFormulaEditMode.apply(self.controller, arguments);
                    var ws = self.getWorksheet();
                    if (ws) {
                        ws.cleanSelection();
                        ws.cleanFormulaRanges();
                        ws.setFormulaEditMode.apply(ws, arguments);
                    }
                },
                "updateEditorState": function () {
                    self.handlers.trigger.apply(self.handlers, ["asc_onEditCell"].concat(Array.prototype.slice.call(arguments)));
                },
                "isGlobalLockEditCell": function () {
                    return self.collaborativeEditing.getGlobalLockEditCell();
                },
                "updateFormulaEditModEnd": function (rangeUpdated) {
                    self.getWorksheet().updateSelection();
                },
                "newRange": function (range) {
                    self.getWorksheet().addFormulaRange(range);
                },
                "existedRange": function (range) {
                    self.getWorksheet().changeFormulaRange(range);
                },
                "updateUndoRedoChanged": function (bCanUndo, bCanRedo) {
                    self.handlers.trigger("asc_onCanUndoChanged", bCanUndo);
                    self.handlers.trigger("asc_onCanRedoChanged", bCanRedo);
                }
            },
            {
                font: this.defaultFont
            });
            this.clipboard.Api = this.Api;
            this.clipboard.init();
            if (this.Api.isMobileVersion) {
                this.MobileTouchManager = new CMobileTouchManager();
                this.MobileTouchManager.Init(this);
            }
            return this;
        },
        destroy: function () {
            this.controller.destroy();
            this.cellEditor.destroy();
            return this;
        },
        _createWorksheetView: function (wsModel) {
            var self = this,
            opt = $.extend(true, {},
            this.settings.worksheetDefaults, {
                "getViewerMode": function () {
                    return self.controller.getViewerMode ? self.controller.getViewerMode() : true;
                },
                "reinitializeScroll": function () {
                    self.controller.reinitializeScroll();
                },
                "reinitializeScrollY": function () {
                    self.controller.reinitializeScroll(1);
                },
                "reinitializeScrollX": function () {
                    self.controller.reinitializeScroll(2);
                },
                "selectionChanged": function () {
                    self._onWSSelectionChanged.apply(self, arguments);
                },
                "selectionNameChanged": function () {
                    self._onSelectionNameChanged.apply(self, arguments);
                },
                "onErrorEvent": function (errorId, level) {
                    self.handlers.trigger("asc_onError", errorId, level);
                },
                "slowOperation": function (isStart) {
                    self.handlers.trigger((isStart ? "asc_onStartAction" : "asc_onEndAction"), c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);
                },
                "setAutoFiltersDialog": function (arrVal) {
                    self.handlers.trigger("asc_onSetAFDialog", arrVal);
                },
                "selectionRangeChanged": function (val) {
                    self.handlers.trigger("asc_onSelectionRangeChanged", val);
                },
                "getDCForCharts": function () {
                    return self.drawingCtxCharts;
                },
                "onRenameCellTextEnd": function (countFind, countReplace) {
                    self.handlers.trigger("asc_onRenameCellTextEnd", countFind, countReplace);
                }
            });
            return new asc_WSV(wsModel, this.buffers, this.stringRender, this.maxDigitWidth, this.collaborativeEditing, opt);
        },
        _onSelectionNameChanged: function (name) {
            this.handlers.trigger("asc_onSelectionNameChanged", name);
        },
        _isEqualRange: function (range, isSelectOnShape) {
            if (null === this.lastSendInfoRange) {
                return false;
            }
            return (this.lastSendInfoRange.isEqual(range) && this.lastSendInfoRange.startCol === range.startCol && this.lastSendInfoRange.startRow === range.startRow && this.lastSendInfoRange.isSelectOnShape === isSelectOnShape);
        },
        _onWSSelectionChanged: function (info) {
            var ws = this.getWorksheet();
            var ar = ws.activeRange;
            this.lastSendInfoRange = ar.clone(true);
            this.lastSendInfoRange.startCol = ar.startCol;
            this.lastSendInfoRange.startRow = ar.startRow;
            this.lastSendInfoRange.isSelectOnShape = ws.getSelectionShape();
            if (null === info) {
                info = ws.getSelectionInfo();
            }
            if (false === ws.getCellEditMode()) {
                if (this.lastSendInfoRange.isSelectOnShape) {
                    this.input.prop("disabled", true);
                } else {
                    this.input.prop("disabled", false);
                }
                this.input.val(info.text);
            }
            this.handlers.trigger("asc_onSelectionChanged", info);
        },
        _onScrollReinitialize: function (whichSB, callback) {
            var ws = this.getWorksheet(),
            vsize = !whichSB || whichSB === 1 ? ws.getVerticalScrollRange() : undefined,
            hsize = !whichSB || whichSB === 2 ? ws.getHorizontalScrollRange() : undefined;
            if (vsize != undefined) {
                this.m_dScrollY_max = Math.max(this.controller.settings.vscrollStep * (vsize + 1), 1);
            }
            if (hsize != undefined) {
                this.m_dScrollX_max = Math.max(this.controller.settings.hscrollStep * (hsize + 1), 1);
            }
            if ($.isFunction(callback)) {
                callback(vsize, hsize);
            }
        },
        _onScrollY: function (pos) {
            var ws = this.getWorksheet();
            var delta = asc_round(pos - ws.getFirstVisibleRow());
            if (delta !== 0) {
                ws.scrollVertical(delta, this.cellEditor);
            }
        },
        _onScrollX: function (pos) {
            var ws = this.getWorksheet();
            var delta = asc_round(pos - ws.getFirstVisibleCol());
            if (delta !== 0) {
                ws.scrollHorizontal(delta, this.cellEditor);
            }
        },
        _onSetSelection: function (range, validRange) {
            var ws = this.getWorksheet();
            ws._checkSelectionShape();
            var d = ws.setSelection(range, validRange);
            if (d) {
                if (d.deltaX) {
                    this.controller.scrollHorizontal(d.deltaX);
                }
                if (d.deltaY) {
                    this.controller.scrollVertical(d.deltaY);
                }
            }
        },
        _onGetSelectionState: function () {
            var ws = this.getWorksheet();
            return ws.objectRender.controller.getSelectionState();
        },
        _onSetSelectionState: function (state) {
            var index = 0;
            for (var i = 0; i < this.wsViews.length; i++) {
                if (this.wsViews[i] && state.sheetId === this.wsViews[i].model.Id) {
                    index = this.wsViews[i].model.index;
                    break;
                }
            }
            var ws = this.getWorksheet(index);
            ws.objectRender.controller.setSelectionState(state);
            ws.objectRender.controller.updateSelectionState();
            if (state && state.selectedObjects && 0 < state.selectedObjects.length) {
                ws.setSelectionShape(true);
            }
        },
        _onChangeSelection: function (isStartPoint, dc, dr, isCoord, isSelectMode, callback) {
            var ws = this.getWorksheet();
            var d = isStartPoint ? ws.changeSelectionStartPoint(dc, dr, isCoord, isSelectMode) : ws.changeSelectionEndPoint(dc, dr, isCoord, isSelectMode);
            if (!isCoord && !isStartPoint && !isSelectMode) {
                this.canUpdateAfterShiftUp = true;
            }
            if ($.isFunction(callback)) {
                callback(d);
            }
        },
        _onChangeSelectionDone: function (x, y) {
            var ws = this.getWorksheet();
            ws.changeSelectionDone();
            this._onSelectionNameChanged(ws.getSelectionName(false));
            var ar = ws.activeRange;
            var isSelectOnShape = ws.getSelectionShape();
            if (!this._isEqualRange(ar, isSelectOnShape)) {
                this._onWSSelectionChanged(ws.getSelectionInfo());
            }
            var ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);
            if ("hyperlink" === ct.target) {
                var isHyperlinkClick = false;
                if ((ar.c1 === ar.c2 && ar.r1 === ar.r2) || isSelectOnShape) {
                    isHyperlinkClick = true;
                } else {
                    var mergedRange = ws.model.getMergedByCell(ar.r1, ar.c1);
                    if (mergedRange && ar.isEqual(mergedRange)) {
                        isHyperlinkClick = true;
                    }
                }
                if (isHyperlinkClick) {
                    if (false === ct.hyperlink.hyperlinkModel.getVisited() && !isSelectOnShape) {
                        ct.hyperlink.hyperlinkModel.setVisited(true);
                        if (ct.hyperlink.hyperlinkModel.Ref) {
                            ws.changeWorksheet("updateRange", {
                                range: ct.hyperlink.hyperlinkModel.Ref.getBBox0(),
                                isLockDraw: false,
                                canChangeColWidth: false
                            });
                        }
                    }
                    switch (ct.hyperlink.asc_getType()) {
                    case c_oAscHyperlinkType.WebLink:
                        this.handlers.trigger("asc_onHyperlinkClick", ct.hyperlink.asc_getHyperlinkUrl());
                        break;
                    case c_oAscHyperlinkType.RangeLink:
                        this.handlers.trigger("asc_onHideComment");
                        this.Api._asc_setWorksheetRange(ct.hyperlink);
                        break;
                    }
                }
            }
        },
        _onChangeSelectionRightClick: function (dc, dr) {
            var ws = this.getWorksheet();
            ws.changeSelectionStartPointRightClick(dc, dr);
        },
        _onSelectionActivePointChanged: function (dc, dr, callback) {
            var ws = this.getWorksheet();
            var d = ws.changeSelectionActivePoint(dc, dr);
            if ($.isFunction(callback)) {
                callback(d);
            }
        },
        _onUpdateWorksheet: function (canvasElem, x, y, ctrlKey, callback) {
            var ws = this.getWorksheet(),
            ct = undefined;
            var arrMouseMoveObjects = [];
            if (this.controller.isCellEditMode && !this.controller.isFormulaEditMode) {
                canvasElem.style.cursor = "";
            } else {
                if (x === undefined && y === undefined) {
                    ws.cleanHighlightedHeaders();
                } else {
                    ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);
                    if (undefined !== ct.userIdAllSheet) {
                        arrMouseMoveObjects.push(asc_CMM({
                            type: c_oAscMouseMoveType.LockedObject,
                            x: ct.lockAllPosLeft,
                            y: ct.lockAllPosTop,
                            userId: ct.userIdAllSheet,
                            lockedObjectType: c_oAscMouseMoveLockedObjectType.Sheet
                        }));
                    } else {
                        if (undefined !== ct.userIdAllProps) {
                            arrMouseMoveObjects.push(asc_CMM({
                                type: c_oAscMouseMoveType.LockedObject,
                                x: ct.lockAllPosLeft,
                                y: ct.lockAllPosTop,
                                userId: ct.userIdAllProps,
                                lockedObjectType: c_oAscMouseMoveLockedObjectType.TableProperties
                            }));
                        }
                    }
                    if (undefined !== ct.userId) {
                        arrMouseMoveObjects.push(asc_CMM({
                            type: c_oAscMouseMoveType.LockedObject,
                            x: ct.lockRangePosLeft,
                            y: ct.lockRangePosTop,
                            userId: ct.userId,
                            lockedObjectType: c_oAscMouseMoveLockedObjectType.Range
                        }));
                    }
                    if (undefined !== ct.commentIndexes) {
                        arrMouseMoveObjects.push(asc_CMM({
                            type: c_oAscMouseMoveType.Comment,
                            x: ct.commentCoords.asc_getLeftPX(),
                            reverseX: ct.commentCoords.asc_getReverseLeftPX(),
                            y: ct.commentCoords.asc_getTopPX(),
                            aCommentIndexes: ct.commentIndexes
                        }));
                    }
                    if (ct.target === "hyperlink") {
                        if (true === ctrlKey) {} else {
                            ct.cursor = ct.cellCursor.cursor;
                        }
                        arrMouseMoveObjects.push(asc_CMM({
                            type: c_oAscMouseMoveType.Hyperlink,
                            x: x,
                            y: y,
                            hyperlink: ct.hyperlink
                        }));
                    }
                    if (0 === arrMouseMoveObjects.length) {
                        arrMouseMoveObjects.push(asc_CMM({
                            type: c_oAscMouseMoveType.None
                        }));
                    }
                    this.handlers.trigger("asc_onMouseMove", arrMouseMoveObjects);
                    if (canvasElem.style.cursor !== ct.cursor) {
                        canvasElem.style.cursor = ct.cursor;
                    }
                    if (ct.target === "colheader" || ct.target === "rowheader") {
                        ws.drawHighlightedHeaders(ct.col, ct.row);
                    } else {
                        ws.cleanHighlightedHeaders();
                    }
                }
            }
            if ($.isFunction(callback)) {
                callback(ct);
            }
        },
        _onResizeElement: function (target, x, y) {
            if (target.target === "colresize") {
                this.getWorksheet().drawColumnGuides(target.col, x, y, target.mouseX);
            } else {
                if (target.target === "rowresize") {
                    this.getWorksheet().drawRowGuides(target.row, x, y, target.mouseY);
                }
            }
        },
        _onResizeElementDone: function (target, x, y, isResizeModeMove) {
            var ws = this.getWorksheet();
            if (isResizeModeMove) {
                ws.objectRender.saveSizeDrawingObjects();
                if (target.target === "colresize") {
                    ws.changeColumnWidth(target.col, x, target.mouseX);
                } else {
                    if (target.target === "rowresize") {
                        ws.changeRowHeight(target.row, y, target.mouseY);
                    }
                }
                ws.objectRender.updateSizeDrawingObjects();
                ws.cellCommentator.updateCommentPosition();
            }
            ws.draw();
        },
        _onChangeFillHandle: function (x, y, callback) {
            var ws = this.getWorksheet();
            var d = ws.changeSelectionFillHandle(x, y);
            if ($.isFunction(callback)) {
                callback(d);
            }
        },
        _onChangeFillHandleDone: function (x, y, ctrlPress) {
            var ws = this.getWorksheet();
            ws.applyFillHandle(x, y, ctrlPress);
        },
        _onMoveRangeHandle: function (x, y, callback, ctrlKey) {
            var ws = this.getWorksheet();
            var d = ws.changeSelectionMoveRangeHandle(x, y, ctrlKey);
            if ($.isFunction(callback)) {
                callback(d);
            }
        },
        _onMoveRangeHandleDone: function (ctrlKey) {
            var ws = this.getWorksheet();
            ws.applyMoveRangeHandle(ctrlKey);
        },
        _onMoveResizeRangeHandle: function (x, y, target, callback) {
            var ws = this.getWorksheet();
            var res = ws.changeSelectionMoveResizeRangeHandle(x, y, target);
            if (res) {
                if (0 == target.targetArr) {
                    ws.changeCellRange(this.cellEditor, res.ar);
                }
                if ($.isFunction(callback)) {
                    callback(res.d);
                }
            }
        },
        _onMoveResizeRangeHandleDone: function (target, callback) {
            var ws = this.getWorksheet();
            var d = ws.applyMoveResizeRangeHandle(target);
        },
        _onAutoFiltersClick: function (x, y) {
            var ws = this.getWorksheet();
            ws.autoFilters.autoFocusClick(x, y);
        },
        _onCommentCellClick: function (x, y) {
            var ws = this.getWorksheet();
            var comments = ws.cellCommentator.getCommentsXY(x, y);
            if (comments.length) {
                ws.cellCommentator.asc_showComment(comments[0].asc_getId());
            }
        },
        _onUpdateSelectionName: function () {
            if (this.canUpdateAfterShiftUp) {
                this.canUpdateAfterShiftUp = false;
                var ws = this.getWorksheet();
                this._onSelectionNameChanged(ws.getSelectionName(false));
            }
        },
        _onGraphicObjectMouseDown: function (e, x, y) {
            var ws = this.getWorksheet();
            ws.objectRender.graphicObjectMouseDown(e, x, y);
        },
        _onGraphicObjectMouseMove: function (e, x, y) {
            var ws = this.getWorksheet();
            ws.objectRender.graphicObjectMouseMove(e, x, y);
        },
        _onGraphicObjectMouseUp: function (e, x, y) {
            var ws = this.getWorksheet();
            ws.objectRender.graphicObjectMouseUp(e, x, y);
        },
        _onGraphicObjectWindowKeyDown: function (e) {
            var ws = this.getWorksheet();
            return ws.objectRender.graphicObjectKeyDown(e);
        },
        _onGraphicObjectWindowKeyPress: function (e) {
            var ws = this.getWorksheet();
            return ws.objectRender.graphicObjectKeyPress(e);
        },
        _onGetGraphicsInfo: function (x, y) {
            var ws = this.getWorksheet();
            return ws.objectRender.checkCursorDrawingObject(x, y);
        },
        _onGetSelectedGraphicObjects: function () {
            var ws = this.getWorksheet();
            return ws.objectRender.getSelectedGraphicObjects();
        },
        _onUpdateSelectionShape: function (isSelectOnShape) {
            var ws = this.getWorksheet();
            return ws.setSelectionShape(isSelectOnShape);
        },
        _onMouseDblClick: function (x, y, isHideCursor, isCoord, callback) {
            var res = false;
            var ws = this.getWorksheet();
            var ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);
            if (ct.target === "colresize" || ct.target === "rowresize") {
                res = true;
                ct.target === "colresize" ? ws.optimizeColWidth(ct.col) : ws.optimizeRowHeight(ct.row);
                if ($.isFunction(callback)) {
                    callback(res);
                }
            } else {
                if (ct.col >= 0 && ct.row >= 0) {
                    this.controller.setStrictClose(!ws._isCellEmpty(ct.col, ct.row));
                }
                if ("colheader" === ct.target || "rowheader" === ct.target || "corner" === ct.target) {
                    res = true;
                    if ($.isFunction(callback)) {
                        callback(res);
                    }
                    return;
                }
                if (isCoord && (ws.objectRender.checkCursorDrawingObject(x, y))) {
                    res = true;
                    if ($.isFunction(callback)) {
                        callback(res);
                    }
                    return;
                }
                this._onEditCell(x, y, isCoord, undefined, undefined, isHideCursor, function (val) {
                    if ($.isFunction(callback)) {
                        callback(!val);
                    }
                });
            }
        },
        _onEditCell: function (x, y, isCoord, isFocus, isClearCell, isHideCursor, callback) {
            var t = this;
            if (this.collaborativeEditing.getGlobalLock()) {
                return false;
            }
            var ws = t.getWorksheet();
            var activeCellRange = ws.getActiveCell(x, y, isCoord);
            var arn = ws.activeRange.clone(true);
            arn.startCol = ws.activeRange.startCol;
            arn.startRow = ws.activeRange.startRow;
            arn.type = ws.activeRange.type;
            var editFunction = function () {
                t.controller.setCellEditMode(true);
                ws.setCellEditMode(true);
                if (!ws.openCellEditor(t.cellEditor, x, y, isCoord, undefined, undefined, isFocus, isClearCell, isHideCursor, arn)) {
                    t.controller.setCellEditMode(false);
                    t.controller.setStrictClose(false);
                    t.controller.setFormulaEditMode(false);
                    ws.setCellEditMode(false);
                    ws.setFormulaEditMode(false);
                    t.input.prop("disabled", true);
                    if ($.isFunction(callback)) {
                        callback(false);
                    }
                    return;
                }
                t.input.prop("disabled", false);
                t.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editStart);
                t.cellEditor._updateEditorState();
                if ($.isFunction(callback)) {
                    callback(true);
                }
            };
            var editLockCallback = function (res) {
                if (!res) {
                    t.controller.setCellEditMode(false);
                    t.controller.setStrictClose(false);
                    t.controller.setFormulaEditMode(false);
                    ws.setCellEditMode(false);
                    ws.setFormulaEditMode(false);
                    t.input.prop("disabled", true);
                    t.collaborativeEditing.onStopEditCell();
                    t.cellEditor.close(false);
                    t._onWSSelectionChanged(null);
                }
            };
            if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
                editFunction();
                editLockCallback(true);
            } else {
                this.collaborativeEditing.onStartEditCell();
                if (ws._isLockedCells(activeCellRange, null, editLockCallback)) {
                    editFunction();
                }
            }
            return true;
        },
        _onStopCellEditing: function () {
            return this.cellEditor.close(true);
        },
        _onCloseCellEditor: function () {
            this.controller.setCellEditMode(false);
            this.controller.setStrictClose(false);
            this.controller.setFormulaEditMode(false);
            var ws = this.getWorksheet();
            var isCellEditMode = ws.getCellEditMode();
            ws.setCellEditMode(false);
            ws.setFormulaEditMode(false);
            ws.updateSelection();
            this.Api.lastFocused = null;
            if (isCellEditMode) {
                this.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editEnd);
            }
            History._sendCanUndoRedo();
        },
        _onEmpty: function () {
            this.getWorksheet().emptySelection(c_oAscCleanOptions.Text);
        },
        _onAddColumn: function (isNotActive) {
            var res = this.getWorksheet().expandColsOnScroll(isNotActive);
            if (res) {
                this.controller.reinitializeScroll(2);
            }
        },
        _onAddRow: function (isNotActive) {
            var res = this.getWorksheet().expandRowsOnScroll(isNotActive);
            if (res) {
                this.controller.reinitializeScroll(1);
            }
        },
        _onShowNextPrevWorksheet: function (direction) {
            if (0 === direction) {
                return false;
            }
            var countWorksheets = this.model.getWorksheetCount();
            var i, ws;
            for (i = this.wsActive + direction;
            (0 > direction) ? (i >= 0) : (i < countWorksheets); i += direction) {
                ws = this.model.getWorksheet(i);
                if (false === ws.getHidden()) {
                    this.showWorksheet(i);
                    this.handlers.trigger("asc_onActiveSheetChanged", i);
                    return true;
                }
            }
            return false;
        },
        _onSetFontAttributes: function (prop) {
            var val;
            var selectionInfo = this.getWorksheet().getSelectionInfo();
            switch (prop) {
            case "b":
                val = !(selectionInfo.asc_getFont().asc_getBold());
                break;
            case "i":
                val = !(selectionInfo.asc_getFont().asc_getItalic());
                break;
            case "u":
                val = !(selectionInfo.asc_getFont().asc_getUnderline());
                val = val ? "single" : "none";
                break;
            case "s":
                val = !(selectionInfo.asc_getFont().asc_getStrikeout());
                break;
            }
            return this.setFontAttributes(prop, val);
        },
        _onSelectColumnsByRange: function () {
            this.getWorksheet()._selectColumnsByRange();
        },
        _onSelectRowsByRange: function () {
            this.getWorksheet()._selectRowsByRange();
        },
        _onShowCellEditorCursor: function () {
            var ws = this.getWorksheet();
            if (ws instanceof asc_WSV) {
                if (ws.getCellEditMode()) {
                    this.cellEditor.showCursor();
                }
            }
        },
        getCellStyles: function () {
            var oStylesPainter = new asc_CSP();
            oStylesPainter.generateStylesAll(this.model.CellStyles, this.fmgrGraphics, this.stringRender);
            return oStylesPainter;
        },
        getWorksheetById: function (id) {
            var wsModel = this.model.getWorksheetById(id);
            if (wsModel) {
                return this.getWorksheet(wsModel.getIndex());
            }
            return null;
        },
        getWorksheet: function (index) {
            var wb = this.model;
            var i = asc_typeof(index) === "number" && index >= 0 ? index : wb.getActive();
            var ws = this.wsViews[i];
            if (! (ws instanceof asc_WSV)) {
                ws = this.wsViews[i] = this._createWorksheetView(wb.getWorksheet(i));
                ws._prepareComments();
                ws._prepareDrawingObjects();
            }
            return ws;
        },
        showWorksheetById: function (id) {
            var wsModel = this.model.getWorksheetById(id);
            if (wsModel) {
                this.showWorksheet(wsModel.getIndex());
            }
        },
        showWorksheet: function (index, isResized) {
            if (index === this.wsActive) {
                return this;
            }
            if (-1 !== this.wsActive) {
                var ws = this.getWorksheet();
                if (ws instanceof asc_WSV) {
                    if (ws.getCellEditMode() && !isResized) {
                        this._onStopCellEditing();
                    }
                    ws.cleanSelection();
                }
            }
            var wb = this.model;
            if (asc_typeof(index) === "number" && index >= 0) {
                if (index !== wb.getActive()) {
                    wb.setActive(index);
                }
            } else {
                index = wb.getActive();
            }
            this.wsActive = index;
            ws = this.getWorksheet(index);
            if (ws.updateZoom) {
                ws.changeZoom(true);
            }
            if (isResized) {
                ws.objectRender.resizeCanvas();
            }
            ws.objectRender.setScrollOffset();
            ws.draw();
            this._onSelectionNameChanged(ws.getSelectionName(false));
            this._onWSSelectionChanged(ws.getSelectionInfo());
            this.controller.reinitializeScroll();
            if (this.Api.isMobileVersion) {
                this.MobileTouchManager.Resize();
            }
            return this;
        },
        removeWorksheet: function (nIndex) {
            this.wsViews.splice(nIndex, 1);
            this.wsActive = -1;
        },
        replaceWorksheet: function (indexFrom, indexTo) {
            if (-1 !== this.wsActive) {
                var ws = this.getWorksheet(this.wsActive);
                if (ws instanceof asc_WSV) {
                    if (ws.getCellEditMode()) {
                        this._onStopCellEditing();
                    }
                    ws.cleanSelection();
                }
                this.wsActive = -1;
                ws = this.getWorksheet(indexTo);
            }
            var movedSheet = this.wsViews.splice(indexFrom, 1);
            this.wsViews.splice(indexTo, 0, movedSheet[0]);
        },
        copyWorksheet: function (index, insertBefore) {
            if (-1 !== this.wsActive) {
                var ws = this.getWorksheet();
                if (ws instanceof asc_WSV) {
                    if (ws.getCellEditMode()) {
                        this._onStopCellEditing();
                    }
                    ws.cleanSelection();
                }
                this.wsActive = -1;
            }
            if (null != insertBefore && insertBefore >= 0 && insertBefore < this.wsViews.length) {
                this.wsViews.splice(insertBefore, 0, null);
            }
        },
        updateWorksheetByModel: function () {
            var oNewWsViews = new Array();
            for (var i in this.wsViews) {
                var item = this.wsViews[i];
                if (null != item) {
                    oNewWsViews[item.model.getIndex()] = item;
                }
            }
            this.wsViews = oNewWsViews;
        },
        spliceWorksheet: function () {
            this.wsViews.splice.apply(this.wsViews, arguments);
            this.wsActive = -1;
        },
        resize: function (event) {
            var outer = $("#ws-canvas-outer");
            var oldWidth = this.canvas.attr("width");
            var oldHeight = this.canvas.attr("width");
            var width = outer.width();
            var height = outer.height();
            if (oldWidth == width && oldHeight == height) {
                return;
            }
            this.canvas.attr("width", width).attr("height", height);
            this.canvasOverlay.attr("width", width).attr("height", height);
            if (this.drawingCtx) {
                this.drawingCtx.initContextSmoothing();
            }
            if (this.overlayCtx) {
                this.overlayCtx.initContextSmoothing();
            }
            if (this.drawingCtxCharts) {
                this.drawingCtxCharts.initContextSmoothing();
            }
            this.getWorksheet().resize();
            this.showWorksheet(undefined, true);
        },
        getCellEditMode: function () {
            return this.controller.isCellEditMode;
        },
        getZoom: function () {
            return this.drawingCtx.getZoom();
        },
        changeZoom: function (factor) {
            if (factor === this.getZoom()) {
                return;
            }
            this.buffers.main.changeZoom(factor);
            this.buffers.overlay.changeZoom(factor);
            this.drawingCtxCharts.changeZoom(factor);
            var item;
            var activeIndex = this.model.getActive();
            for (var i in this.wsViews) {
                if (this.wsViews.hasOwnProperty(i)) {
                    item = this.wsViews[i];
                    item.changeZoom(i == activeIndex);
                    item.objectRender.changeZoom(this.drawingCtx.scaleFactor);
                    if (i == activeIndex) {
                        item.draw();
                    }
                }
            }
            this.controller.reinitializeScroll();
            this.handlers.trigger("asc_onZoomChanged", this.getZoom());
        },
        enableKeyEventsHandler: function (f) {
            this.controller.enableKeyEventsHandler(f);
            if (this.cellEditor) {
                this.cellEditor.enableKeyEventsHandler(f);
            }
        },
        closeCellEditor: function () {
            var ws = this.getWorksheet();
            if (ws instanceof asc_WSV && ws.getCellEditMode()) {
                this._onStopCellEditing();
            }
        },
        restoreFocus: function () {
            if (this.cellEditor.hasFocus) {
                this.cellEditor.restoreFocus();
            }
        },
        insertFormulaInEditor: function (functionName, autoComplet) {
            var t = this;
            var ws = this.getWorksheet();
            if (ws.getCellEditMode()) {
                if (false === this.cellEditor.insertFormula(functionName)) {
                    this.cellEditor.close(true);
                }
            } else {
                var cellRange = null;
                if (autoComplet) {
                    cellRange = ws.autoCompletFormula(functionName);
                }
                if (cellRange) {
                    if (cellRange.notEditCell) {
                        return;
                    }
                    functionName = "=" + functionName + "(" + cellRange.text + ")";
                } else {
                    functionName = "=" + functionName + "()";
                }
                var cursorPos = functionName.length - 1;
                if (this.collaborativeEditing.getGlobalLock()) {
                    return false;
                }
                var arn = ws.activeRange.clone(true);
                arn.startCol = ws.activeRange.startCol;
                arn.startRow = ws.activeRange.startRow;
                arn.type = ws.activeRange.type;
                function openEditor(res) {
                    if (res) {
                        t.controller.setCellEditMode(true);
                        ws.setCellEditMode(true);
                        if (!ws.openCellEditorWithText(t.cellEditor, functionName, cursorPos, false, arn)) {
                            t.controller.setCellEditMode(false);
                            t.controller.setStrictClose(false);
                            t.controller.setFormulaEditMode(false);
                            ws.setCellEditMode(false);
                            ws.setFormulaEditMode(false);
                        }
                    } else {
                        t.controller.setCellEditMode(false);
                        t.controller.setStrictClose(false);
                        t.controller.setFormulaEditMode(false);
                        ws.setCellEditMode(false);
                        ws.setFormulaEditMode(false);
                    }
                }
                var activeCellRange = ws.getActiveCell(0, 0, false);
                if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
                    openEditor(true);
                } else {
                    ws._isLockedCells(activeCellRange, null, openEditor);
                }
            }
        },
        copyToClipboard: function () {
            var t = this,
            ws, v;
            if (!t.controller.isCellEditMode) {
                ws = t.getWorksheet();
                t.clipboard.copyRange(ws.getSelectedRange(), ws);
            } else {
                v = t.cellEditor.copySelection();
                if (v) {
                    t.clipboard.copyCellValue(v, t.cellEditor.hasBackground ? t.cellEditor.background : null);
                }
            }
        },
        copyToClipboardButton: function () {
            var t = this,
            ws, v;
            if (!t.controller.isCellEditMode) {
                ws = t.getWorksheet();
                return t.clipboard.copyRangeButton(ws.getSelectedRange(), ws);
            } else {
                v = t.cellEditor.copySelection();
                if (v) {
                    return t.clipboard.copyCellValueButton(v, t.cellEditor.hasBackground ? t.cellEditor.background : null);
                } else {
                    return true;
                }
            }
        },
        pasteFromClipboard: function () {
            var t = this;
            if (!t.controller.isCellEditMode) {
                var ws = t.getWorksheet();
                t.clipboard.pasteRange(ws);
            } else {
                t.clipboard.pasteAsText(function (text) {
                    t.cellEditor.pasteText(text);
                });
            }
        },
        pasteFromClipboardButton: function () {
            var t = this;
            if (!t.controller.isCellEditMode) {
                var ws = t.getWorksheet();
                return t.clipboard.pasteRangeButton(ws);
            } else {
                return t.clipboard.pasteAsTextButton(function (text) {
                    t.cellEditor.pasteText(text);
                });
            }
        },
        cutToClipboard: function () {
            var t = this,
            ws, v;
            if (!t.controller.isCellEditMode && !window.USER_AGENT_SAFARI_MACOS) {
                ws = t.getWorksheet();
                t.clipboard.copyRange(ws.getSelectedRange(), ws, true);
                ws.emptySelection(c_oAscCleanOptions.All);
            } else {
                if (!window.USER_AGENT_SAFARI_MACOS) {
                    v = t.cellEditor.cutSelection();
                    if (v) {
                        t.clipboard.copyCellValue(v, t.cellEditor.hasBackground ? t.cellEditor.background : null);
                    }
                }
            }
        },
        cutToClipboardButton: function () {
            var t = this,
            ws, v;
            if (!t.controller.isCellEditMode) {
                ws = t.getWorksheet();
                var result = t.clipboard.copyRangeButton(ws.getSelectedRange(), ws, true);
                if (result) {
                    ws.emptySelection(c_oAscCleanOptions.All);
                }
                return result;
            } else {
                v = t.cellEditor.cutSelection();
                if (v) {
                    return t.clipboard.copyCellValueButton(v, t.cellEditor.hasBackground ? t.cellEditor.background : null);
                } else {
                    return true;
                }
            }
        },
        undo: function () {
            if (!this.controller.isCellEditMode) {
                History.Undo();
            } else {
                this.cellEditor.undo();
            }
        },
        redo: function () {
            if (!this.controller.isCellEditMode) {
                History.Redo();
            } else {
                this.cellEditor.redo();
            }
        },
        setFontAttributes: function (prop, val) {
            if (!this.controller.isCellEditMode) {
                this.getWorksheet().setSelectionInfo(prop, val);
            } else {
                this.cellEditor.setTextStyle(prop, val);
            }
        },
        changeFontSize: function (prop, val) {
            if (!this.controller.isCellEditMode) {
                this.getWorksheet().setSelectionInfo(prop, val);
            } else {
                this.cellEditor.setTextStyle(prop, val);
            }
        },
        emptyCells: function (options) {
            if (!this.controller.isCellEditMode) {
                this.getWorksheet().emptySelection(options);
                this.restoreFocus();
            } else {
                this.cellEditor.empty(options);
            }
        },
        setSelectionDialogMode: function (isSelectionDialogMode, selectRange) {
            this.getWorksheet().setSelectionDialogMode(isSelectionDialogMode, selectRange);
        },
        findCellText: function (options) {
            var ws = this.getWorksheet();
            if (ws.getCellEditMode()) {
                this._onStopCellEditing();
            }
            return ws.findCellText(options);
        },
        replaceCellText: function (options) {
            var ws = this.getWorksheet();
            if (ws.getCellEditMode()) {
                this._onStopCellEditing();
            }
            ws.replaceCellText(options);
        },
        findCell: function (reference) {
            var ws = this.getWorksheet();
            if (ws.getCellEditMode()) {
                this._onStopCellEditing();
            }
            return ws.findCell(reference);
        },
        printSheet: function (pdf_writer, printPagesData) {
            var ws;
            var isEndPrint = false;
            if (null === printPagesData.arrPages || 0 === printPagesData.arrPages.length) {
                ws = this.getWorksheet();
                ws.drawForPrint(pdf_writer, null);
                isEndPrint = true;
            } else {
                var currentIndex = printPagesData.currentIndex;
                var indexWorksheet = -1;
                var indexWorksheetTmp = -1;
                for (var i = currentIndex; i < printPagesData.arrPages.length && i < currentIndex + printPagesData.c_maxPagesCount; ++i) {
                    indexWorksheetTmp = printPagesData.arrPages[i].indexWorksheet;
                    if (indexWorksheetTmp !== indexWorksheet) {
                        ws = this.getWorksheet(indexWorksheetTmp);
                        indexWorksheet = indexWorksheetTmp;
                    }
                    ws.drawForPrint(pdf_writer, printPagesData.arrPages[i]);
                }
                isEndPrint = (i === printPagesData.arrPages.length);
                printPagesData.currentIndex = i;
            }
            return isEndPrint;
        },
        calcPagesPrint: function (adjustPrint) {
            var ws = null;
            var wb = this.model;
            var activeWs;
            var printPagesData = new asc_CPrintPagesData();
            var printType = adjustPrint.asc_getPrintType();
            var layoutPageType = adjustPrint.asc_getLayoutPageType();
            if (printType == c_oAscPrintType.ActiveSheets) {
                activeWs = wb.getActive();
                ws = this.getWorksheet();
                printPagesData.arrPages = ws.calcPagesPrint(wb.getWorksheet(activeWs).PagePrintOptions, false, activeWs, layoutPageType);
            } else {
                if (printType == c_oAscPrintType.EntireWorkbook) {
                    var countWorksheets = this.model.getWorksheetCount();
                    for (var i = 0; i < countWorksheets; ++i) {
                        ws = this.getWorksheet(i);
                        var arrPages = ws.calcPagesPrint(wb.getWorksheet(i).PagePrintOptions, false, i, layoutPageType);
                        if (null !== arrPages) {
                            if (null === printPagesData.arrPages) {
                                printPagesData.arrPages = [];
                            }
                            printPagesData.arrPages = printPagesData.arrPages.concat(arrPages);
                        }
                    }
                } else {
                    if (printType == c_oAscPrintType.Selection) {
                        activeWs = wb.getActive();
                        ws = this.getWorksheet();
                        printPagesData.arrPages = ws.calcPagesPrint(wb.getWorksheet(activeWs).PagePrintOptions, true, activeWs, layoutPageType);
                    }
                }
            }
            return printPagesData;
        },
        _initCommentsToSave: function () {
            for (var wsKey in this.wsViews) {
                var wsView = this.wsViews[wsKey];
                var wsModel = wsView.model;
                wsView.cellCommentator.prepareCommentsToSave();
                wsModel.aComments = wsView.cellCommentator.aComments;
                wsModel.aCommentsCoords = wsView.cellCommentator.aCommentCoords;
            }
        },
        reInit: function () {
            var ws = this.getWorksheet();
            ws._initCellsArea(true);
            ws._updateVisibleColsCount();
            ws._updateVisibleRowsCount();
        },
        drawWS: function () {
            this._lockDraw = false;
            this.getWorksheet().draw(this._lockDraw);
        },
        onShowDrawingObjects: function (clearCanvas) {
            var ws = this.getWorksheet();
            ws.objectRender.showDrawingObjects(clearCanvas);
        },
        lockDraw: function () {
            this._lockDraw = true;
        },
        setFontRenderingMode: function (mode, isInit) {
            var ws;
            if (mode !== this.fontRenderingMode) {
                this.fontRenderingMode = mode;
                if (c_oAscFontRenderingModeType.noHinting === mode) {
                    this._setHintsProps(false, false);
                } else {
                    if (c_oAscFontRenderingModeType.hinting === mode) {
                        this._setHintsProps(true, false);
                    } else {
                        if (c_oAscFontRenderingModeType.hintingAndSubpixeling === mode) {
                            this._setHintsProps(true, true);
                        }
                    }
                }
                if (!isInit) {
                    ws = this.getWorksheet();
                    ws.draw();
                    this.cellEditor.setFontRenderingMode(mode);
                }
            }
        },
        _setHintsProps: function (bIsHinting, bIsSubpixHinting) {
            var index, manager, hintProps;
            for (index in this.fmgrGraphics) {
                if (!this.fmgrGraphics.hasOwnProperty(index)) {
                    continue;
                }
                manager = this.fmgrGraphics[index];
                hintProps = manager.m_oLibrary.tt_hint_props;
                if (!hintProps) {
                    continue;
                }
                if (bIsHinting && bIsSubpixHinting) {
                    hintProps.TT_USE_BYTECODE_INTERPRETER = true;
                    hintProps.TT_CONFIG_OPTION_SUBPIXEL_HINTING = true;
                    manager.LOAD_MODE = 40968;
                } else {
                    if (bIsHinting) {
                        hintProps.TT_USE_BYTECODE_INTERPRETER = true;
                        hintProps.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;
                        manager.LOAD_MODE = 40968;
                    } else {
                        hintProps.TT_USE_BYTECODE_INTERPRETER = true;
                        hintProps.TT_CONFIG_OPTION_SUBPIXEL_HINTING = false;
                        manager.LOAD_MODE = 40970;
                    }
                }
                manager.ClearFontsRasterCache();
            }
        },
        _calcMaxDigitWidth: function () {
            this.buffers.main.setFont(this.defaultFont);
            this.stringRender.measureString("0123456789", {
                wrapText: false,
                shrinkToFit: false,
                isMerged: false,
                textAlign: "left"
            });
            var ppiX = 96;
            var ptConvToPx = asc_getcvt(1, 0, ppiX);
            var maxWidthInPt = this.stringRender.getWidestCharWidth();
            this.maxDigitWidth = asc_round(maxWidthInPt * ptConvToPx);
            if (!this.maxDigitWidth) {
                throw "Error: can't measure text string";
            }
        }
    };
    window["Asc"].WorkbookView = WorkbookView;
})(jQuery, window);