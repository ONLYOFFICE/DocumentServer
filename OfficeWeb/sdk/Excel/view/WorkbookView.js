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
(function ($, window, undefined) {
    var asc = window["Asc"];
    var asc_applyFunction = asc.applyFunction;
    var asc_round = asc.round;
    var asc_typeof = asc.typeOf;
    var asc_CMM = asc.asc_CMouseMoveData;
    var asc_CPrintPagesData = asc.CPrintPagesData;
    var asc_getcvt = asc.getCvtRatio;
    var asc_CSP = asc.asc_CStylesPainter;
    function WorkbookCommentsModel(handlers) {
        this.workbook = {
            handlers: handlers
        };
    }
    WorkbookCommentsModel.prototype.getId = function () {
        return "workbook";
    };
    WorkbookCommentsModel.prototype.getMergedByCell = function () {
        return null;
    };
    function WorksheetViewSettings() {
        this.header = {
            style: [{
                background: new CColor(244, 244, 244),
                border: new CColor(213, 213, 213),
                color: new CColor(54, 54, 54)
            },
            {
                background: new CColor(193, 193, 193),
                border: new CColor(146, 146, 146),
                color: new CColor(54, 54, 54)
            },
            {
                background: new CColor(223, 223, 223),
                border: new CColor(175, 175, 175),
                color: new CColor(101, 106, 112)
            },
            {
                background: new CColor(170, 170, 170),
                border: new CColor(117, 119, 122),
                color: new CColor(54, 54, 54)
            }],
            cornerColor: new CColor(193, 193, 193)
        };
        this.cells = {
            defaultState: {
                background: new CColor(255, 255, 255),
                border: new CColor(212, 212, 212),
                color: new CColor(0, 0, 0)
            },
            padding: -1,
            paddingPlusBorder: -1
        };
        this.activeCellBorderColor = new CColor(126, 152, 63);
        this.activeCellBorderColor2 = new CColor(255, 255, 255, 0.75);
        this.activeCellBackground = new CColor(157, 185, 85, 0.2);
        this.fillHandleBorderColorSelect = new CColor(255, 255, 255);
        this.frozenColor = new CColor(105, 119, 62, 1);
        this.mathMaxDigCount = 9;
        var cnv = document.createElement("canvas");
        cnv.width = 2;
        cnv.height = 2;
        var ctx = cnv.getContext("2d");
        ctx.clearRect(0, 0, 2, 2);
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillRect(1, 1, 1, 1);
        this.ptrnLineDotted1 = ctx.createPattern(cnv, "repeat");
        return this;
    }
    function WorkbookView(model, controller, handlers, elem, inputElem, Api, collaborativeEditing, fontRenderingMode) {
        this.defaults = {
            scroll: {
                widthPx: 14,
                heightPx: 14
            },
            worksheetView: new WorksheetViewSettings()
        };
        this.model = model;
        this.controller = controller;
        this.handlers = handlers;
        this.wsViewHandlers = null;
        this.element = elem;
        this.input = inputElem;
        this.clipboard = new asc.Clipboard();
        this.Api = Api;
        this.collaborativeEditing = collaborativeEditing;
        this.lastSendInfoRange = null;
        this.canUpdateAfterShiftUp = false;
        this.canvas = undefined;
        this.canvasOverlay = undefined;
        this.canvasGraphic = undefined;
        this.canvasGraphicOverlay = undefined;
        this.wsActive = -1;
        this.wsMustDraw = false;
        this.wsViews = [];
        this.cellEditor = undefined;
        this.fontRenderingMode = null;
        this.popUpSelector = null;
        this.formulasList = null;
        this.lastFormulaPos = -1;
        this.lastFormulaName = "";
        this.lastFindOptions = null;
        this.lastFindResults = {};
        this.fReplaceCallback = null;
        this.m_oFont = new asc.FontProperties(this.model.getDefaultFont(), this.model.getDefaultSize());
        this.fmgrGraphics = [];
        this.fmgrGraphics.push(new CFontManager());
        this.fmgrGraphics.push(new CFontManager());
        this.fmgrGraphics.push(new CFontManager());
        this.fmgrGraphics.push(new CFontManager());
        this.fmgrGraphics[0].Initialize(true);
        this.fmgrGraphics[1].Initialize(true);
        this.fmgrGraphics[2].Initialize(true);
        this.fmgrGraphics[3].Initialize(true);
        this.buffers = {};
        this.drawingCtx = undefined;
        this.overlayCtx = undefined;
        this.drawingGraphicCtx = undefined;
        this.overlayGraphicCtx = undefined;
        this.stringRender = undefined;
        this.selectionDialogType = c_oAscSelectionDialogType.None;
        this.copyActiveSheet = -1;
        this.cellCommentator = null;
        this.isDocumentPlaceChangedEnabled = false;
        this.arrExcludeFormulas = ["TRUE", "FALSE"];
        this.maxDigitWidth = 0;
        this.defaultFont = new asc.FontProperties(this.model.getDefaultFont(), this.model.getDefaultSize());
        this.m_dScrollY = 0;
        this.m_dScrollX = 0;
        this.m_dScrollY_max = 1;
        this.m_dScrollX_max = 1;
        this.MobileTouchManager = null;
        this._init(fontRenderingMode);
        return this;
    }
    WorkbookView.prototype._init = function (fontRenderingMode) {
        var self = this;
        this.setFontRenderingMode(fontRenderingMode, true);
        var _head = document.getElementsByTagName("head")[0];
        var style0 = document.createElement("style");
        style0.type = "text/css";
        style0.innerHTML = ".block_elem { position:absolute;padding:0;margin:0; }";
        _head.appendChild(style0);
        if (null != this.element) {
            this.element.innerHTML = '<div id="ws-canvas-outer">											<canvas id="ws-canvas"></canvas>											<canvas id="ws-canvas-overlay"></canvas>											<canvas id="ws-canvas-graphic"></canvas>											<canvas id="ws-canvas-graphic-overlay"></canvas>											<canvas id="id_target_cursor" class="block_elem" width="1" height="1"												style="width:2px;height:13px;display:none;z-index:1004;"></canvas>										</div>';
            this.canvas = document.getElementById("ws-canvas");
            this.canvasOverlay = document.getElementById("ws-canvas-overlay");
            this.canvasGraphic = document.getElementById("ws-canvas-graphic");
            this.canvasGraphicOverlay = document.getElementById("ws-canvas-graphic-overlay");
        }
        if (this.Api.isMobileVersion) {
            AscBrowser.isRetina = false;
        }
        this.buffers.main = new asc.DrawingContext({
            canvas: this.canvas,
            units: 1,
            fmgrGraphics: this.fmgrGraphics,
            font: this.m_oFont
        });
        this.buffers.overlay = new asc.DrawingContext({
            canvas: this.canvasOverlay,
            units: 1,
            fmgrGraphics: this.fmgrGraphics,
            font: this.m_oFont
        });
        this.buffers.mainGraphic = new asc.DrawingContext({
            canvas: this.canvasGraphic,
            units: 1,
            fmgrGraphics: this.fmgrGraphics,
            font: this.m_oFont
        });
        this.buffers.overlayGraphic = new asc.DrawingContext({
            canvas: this.canvasGraphicOverlay,
            units: 1,
            fmgrGraphics: this.fmgrGraphics,
            font: this.m_oFont
        });
        this.drawingCtx = this.buffers.main;
        this.overlayCtx = this.buffers.overlay;
        this.drawingGraphicCtx = this.buffers.mainGraphic;
        this.overlayGraphicCtx = this.buffers.overlayGraphic;
        this._canResize();
        this.buffers.shapeCtx = new CGraphics();
        this.buffers.shapeCtx.init(this.drawingGraphicCtx.ctx, this.drawingGraphicCtx.getWidth(0), this.drawingGraphicCtx.getHeight(0), this.drawingGraphicCtx.getWidth(3), this.drawingGraphicCtx.getHeight(3));
        this.buffers.shapeCtx.m_oFontManager = this.fmgrGraphics[2];
        this.buffers.shapeOverlayCtx = new CGraphics();
        this.buffers.shapeOverlayCtx.init(this.overlayGraphicCtx.ctx, this.overlayGraphicCtx.getWidth(0), this.overlayGraphicCtx.getHeight(0), this.overlayGraphicCtx.getWidth(3), this.overlayGraphicCtx.getHeight(3));
        this.buffers.shapeOverlayCtx.m_oFontManager = this.fmgrGraphics[2];
        this.stringRender = new asc.StringRender(this.buffers.main);
        this.stringRender.setDefaultFont(this.defaultFont);
        this._calcMaxDigitWidth();
        if (!window["NATIVE_EDITOR_ENJINE"]) {
            this.controller.init(this, this.element, this.canvasGraphicOverlay, {
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
                "stopFormatPainter": function () {
                    self._onStopFormatPainter.apply(self, arguments);
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
                "graphicObjectMouseUpEx": function () {
                    self._onGraphicObjectMouseUpEx.apply(self, arguments);
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
                },
                "canReceiveKeyPress": function () {
                    return self.getWorksheet().objectRender.controller.canReceiveKeyPress();
                },
                "moveFrozenAnchorHandle": function () {
                    self._onMoveFrozenAnchorHandle.apply(self, arguments);
                },
                "moveFrozenAnchorHandleDone": function () {
                    self._onMoveFrozenAnchorHandleDone.apply(self, arguments);
                },
                "showAutoComplete": function () {
                    self._onShowAutoComplete.apply(self, arguments);
                },
                "popUpSelectorKeyDown": function (event) {
                    return self._onPopUpSelectorKeyDown(event);
                },
                "isPopUpSelectorOpen": function () {
                    return self.popUpSelector.getVisible();
                },
                "onContextMenu": function (event) {
                    self.handlers.trigger("asc_onContextMenu", event);
                }
            });
            if (this.input && this.input.addEventListener) {
                this.input.addEventListener("focus", function () {
                    self.input.isFocused = true;
                    if (self.controller.settings.isViewerMode) {
                        return;
                    }
                    self.controller.setStrictClose(true);
                    self.cellEditor.callTopLineMouseup = true;
                    if (!self.controller.isCellEditMode && !self.controller.isFillHandleMode) {
                        self._onEditCell(0, 0, false, true);
                    }
                },
                false);
            }
            this.cellEditor = new asc.CellEditor(this.element, this.input, this.fmgrGraphics, this.m_oFont, {
                "closed": function () {
                    self._onCloseCellEditor.apply(self, arguments);
                },
                "updated": function () {
                    self._onUpdateCellEditor.apply(self, arguments);
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
                "updateEditorState": function (state) {
                    self.handlers.trigger("asc_onEditCell", state);
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
                    self.getWorksheet().activeFormulaRange(range);
                },
                "updateUndoRedoChanged": function (bCanUndo, bCanRedo) {
                    self.handlers.trigger("asc_onCanUndoChanged", bCanUndo);
                    self.handlers.trigger("asc_onCanRedoChanged", bCanRedo);
                    self.Api.setUserAlive();
                },
                "applyCloseEvent": function () {
                    self.controller._onWindowKeyDown.apply(self.controller, arguments);
                },
                "isViewerMode": function () {
                    return self.controller.settings.isViewerMode;
                },
                "popUpSelectorKeyDown": function (event) {
                    return self._onPopUpSelectorKeyDown(event);
                },
                "getFormulaRanges": function () {
                    return self.getWorksheet().getFormulaRanges();
                },
                "setStrictClose": function (val) {
                    self.controller.setStrictClose(val);
                },
                "updateEditorSelectionInfo": function (info) {
                    self.handlers.trigger("asc_onEditorSelectionChanged", info);
                },
                "onContextMenu": function (event) {
                    self.handlers.trigger("asc_onContextMenu", event);
                }
            },
            {
                font: this.defaultFont,
                padding: this.defaults.worksheetView.cells.padding
            });
            this.popUpSelector = new asc.PopUpSelector(this.element, {
                "insert": function () {
                    self._onPopUpSelectorInsert.apply(self, arguments);
                }
            });
        }
        this.wsViewHandlers = new asc.asc_CHandlersList({
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
            "selectionMathInfoChanged": function () {
                self._onSelectionMathInfoChanged.apply(self, arguments);
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
            "onRenameCellTextEnd": function (countFind, countReplace) {
                self.handlers.trigger("asc_onRenameCellTextEnd", countFind, countReplace);
            },
            "onStopFormatPainter": function () {
                self.handlers.trigger("asc_onStopFormatPainter");
            },
            "onDocumentPlaceChanged": function () {
                self._onDocumentPlaceChanged();
            },
            "updateSheetViewSettings": function () {
                self.handlers.trigger("asc_onUpdateSheetViewSettings");
            },
            "onScroll": function (d) {
                self.controller.scroll(d);
            }
        });
        this.model.handlers.add("cleanCellCache", function (wsId, oRanges, canChangeColWidth, bLockDraw, updateHeight) {
            var ws = self.getWorksheetById(wsId);
            if (ws) {
                ws.updateRanges(oRanges, canChangeColWidth, bLockDraw || wsId != self.getWorksheet(self.wsActive).model.getId(), updateHeight);
            }
        });
        this.model.handlers.add("changeWorksheetUpdate", function (wsId, val) {
            var ws = self.getWorksheetById(wsId);
            if (ws) {
                ws.changeWorksheet("update", val);
            }
        });
        this.model.handlers.add("showWorksheet", function (wsId) {
            var wsModel = self.model.getWorksheetById(wsId),
            index;
            if (wsModel) {
                index = wsModel.getIndex();
                self.showWorksheet(index, false, true);
                self.handlers.trigger("asc_onActiveSheetChanged", index);
            }
        });
        this.model.handlers.add("setSelection", function () {
            self._onSetSelection.apply(self, arguments);
        });
        this.model.handlers.add("getSelection", function () {
            return self._onGetSelection.apply(self);
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
        this.model.handlers.add("setCanUndo", function (bCanUndo) {
            self.handlers.trigger("asc_onCanUndoChanged", bCanUndo);
            self.Api.setUserAlive();
        });
        this.model.handlers.add("setCanRedo", function (bCanRedo) {
            self.handlers.trigger("asc_onCanRedoChanged", bCanRedo);
            self.Api.setUserAlive();
        });
        this.model.handlers.add("setDocumentModified", function (bIsModified) {
            self.Api.onUpdateDocumentModified(bIsModified);
        });
        this.model.handlers.add("initCommentsToSave", function () {
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
        this.cellCommentator = new CCellCommentator({
            model: new WorkbookCommentsModel(this.handlers),
            collaborativeEditing: this.collaborativeEditing,
            draw: function () {},
            handlers: {
                trigger: function () {
                    return true;
                }
            }
        });
        var commentList = this.cellCommentator.prepareComments(this.model.aComments);
        if (0 < commentList.length) {
            this.handlers.trigger("asc_onAddComments", commentList);
        }
        this.clipboard.Api = this.Api;
        this.clipboard.init();
        this.formulasList = getFormulasInfo();
        this.fReplaceCallback = function () {
            self._replaceCellTextCallback.apply(self, arguments);
        };
        if (this.Api.isMobileVersion) {
            this.MobileTouchManager = new CMobileTouchManager();
            this.MobileTouchManager.Init(this);
        }
        return this;
    };
    WorkbookView.prototype.destroy = function () {
        this.controller.destroy();
        this.cellEditor.destroy();
        return this;
    };
    WorkbookView.prototype._createWorksheetView = function (wsModel) {
        return new asc.WorksheetView(wsModel, this.wsViewHandlers, this.buffers, this.stringRender, this.maxDigitWidth, this.collaborativeEditing, this.defaults.worksheetView);
    };
    WorkbookView.prototype._onSelectionNameChanged = function (name) {
        this.handlers.trigger("asc_onSelectionNameChanged", name);
    };
    WorkbookView.prototype._onSelectionMathInfoChanged = function (info) {
        this.handlers.trigger("asc_onSelectionMathChanged", info);
    };
    WorkbookView.prototype._isEqualRange = function (range, isSelectOnShape) {
        if (null === this.lastSendInfoRange) {
            return false;
        }
        return this.lastSendInfoRange.isEqual(range) && this.lastSendInfoRangeIsSelectOnShape === isSelectOnShape;
    };
    WorkbookView.prototype._onWSSelectionChanged = function (info) {
        var ws = this.getWorksheet();
        var ar = ws.activeRange;
        this.lastSendInfoRange = ar.clone(true);
        this.lastSendInfoRangeIsSelectOnShape = ws.getSelectionShape();
        if (null === info) {
            info = ws.getSelectionInfo();
        }
        if (this.input && false === ws.getCellEditMode() && c_oAscSelectionDialogType.None === this.selectionDialogType) {
            if (this.lastSendInfoRangeIsSelectOnShape) {
                this.input.disabled = true;
                this.input.value = "";
            } else {
                this.input.disabled = false;
                this.input.value = info.text;
            }
        }
        this.handlers.trigger("asc_onSelectionChanged", info);
    };
    WorkbookView.prototype._onScrollReinitialize = function (whichSB, callback) {
        var ws = this.getWorksheet(),
        vsize = !whichSB || whichSB === 1 ? ws.getVerticalScrollRange() : undefined,
        hsize = !whichSB || whichSB === 2 ? ws.getHorizontalScrollRange() : undefined;
        if (vsize != undefined) {
            this.m_dScrollY_max = Math.max(this.controller.settings.vscrollStep * (vsize + 1), 1);
        }
        if (hsize != undefined) {
            this.m_dScrollX_max = Math.max(this.controller.settings.hscrollStep * (hsize + 1), 1);
        }
        asc_applyFunction(callback, vsize, hsize);
    };
    WorkbookView.prototype._onScrollY = function (pos) {
        var ws = this.getWorksheet();
        var delta = asc_round(pos - ws.getFirstVisibleRow(true));
        if (delta !== 0) {
            ws.scrollVertical(delta, this.cellEditor);
        }
    };
    WorkbookView.prototype._onScrollX = function (pos) {
        var ws = this.getWorksheet();
        var delta = asc_round(pos - ws.getFirstVisibleCol(true));
        if (delta !== 0) {
            ws.scrollHorizontal(delta, this.cellEditor);
        }
    };
    WorkbookView.prototype._onSetSelection = function (range, validRange) {
        var ws = this.getWorksheet();
        ws._checkSelectionShape();
        var d = ws.setSelectionUndoRedo(range, validRange);
        this.controller.scroll(d);
    };
    WorkbookView.prototype._onGetSelection = function () {
        var ws = this.getWorksheet();
        return ws.getActiveRangeObj();
    };
    WorkbookView.prototype._onGetSelectionState = function () {
        var ws = this.getWorksheet();
        var res = null;
        if (isRealObject(ws.objectRender) && isRealObject(ws.objectRender.controller)) {
            res = ws.objectRender.controller.getSelectionState();
        }
        return (res && res[0] && res[0].focus) ? res : null;
    };
    WorkbookView.prototype._onSetSelectionState = function (state) {
        if (null !== state) {
            var ws = this.getWorksheetById(state[0].worksheetId);
            if (ws && ws.objectRender && ws.objectRender.controller) {
                ws.objectRender.controller.setSelectionState(state);
                ws.setSelectionShape(true);
                var d = ws._calcActiveCellOffset(ws.objectRender.getSelectedDrawingsRange());
                this.controller.scroll(d);
                ws.objectRender.showDrawingObjectsEx(true);
                ws.objectRender.controller.updateOverlay();
                ws.objectRender.controller.updateSelectionState();
            }
        }
    };
    WorkbookView.prototype._onChangeSelection = function (isStartPoint, dc, dr, isCoord, isSelectMode, callback) {
        var ws = this.getWorksheet();
        var d = isStartPoint ? ws.changeSelectionStartPoint(dc, dr, isCoord, isSelectMode) : ws.changeSelectionEndPoint(dc, dr, isCoord, isSelectMode);
        if (!isCoord && !isStartPoint && !isSelectMode) {
            this.canUpdateAfterShiftUp = true;
        }
        asc_applyFunction(callback, d);
    };
    WorkbookView.prototype._onChangeSelectionDone = function (x, y) {
        var ws = this.getWorksheet();
        ws.changeSelectionDone();
        this._onSelectionNameChanged(ws.getSelectionName(false));
        var ar = ws.activeRange;
        var isSelectOnShape = ws.getSelectionShape();
        if (!this._isEqualRange(ar, isSelectOnShape)) {
            this._onWSSelectionChanged(ws.getSelectionInfo());
            this._onSelectionMathInfoChanged(ws.getSelectionMathInfo());
        }
        this._cleanFindResults();
        var ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);
        if (c_oTargetType.Hyperlink === ct.target) {
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
                        ws.updateRange(ct.hyperlink.hyperlinkModel.Ref.getBBox0(), false, false);
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
    };
    WorkbookView.prototype._onChangeSelectionRightClick = function (dc, dr) {
        var ws = this.getWorksheet();
        ws.changeSelectionStartPointRightClick(dc, dr);
    };
    WorkbookView.prototype._onSelectionActivePointChanged = function (dc, dr, callback) {
        var ws = this.getWorksheet();
        var d = ws.changeSelectionActivePoint(dc, dr);
        asc_applyFunction(callback, d);
    };
    WorkbookView.prototype._onUpdateWorksheet = function (canvasElem, x, y, ctrlKey, callback) {
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
                    arrMouseMoveObjects.push(new asc_CMM({
                        type: c_oAscMouseMoveType.LockedObject,
                        x: ct.lockAllPosLeft,
                        y: ct.lockAllPosTop,
                        userId: ct.userIdAllSheet,
                        lockedObjectType: c_oAscMouseMoveLockedObjectType.Sheet
                    }));
                } else {
                    if (undefined !== ct.userIdAllProps) {
                        arrMouseMoveObjects.push(new asc_CMM({
                            type: c_oAscMouseMoveType.LockedObject,
                            x: ct.lockAllPosLeft,
                            y: ct.lockAllPosTop,
                            userId: ct.userIdAllProps,
                            lockedObjectType: c_oAscMouseMoveLockedObjectType.TableProperties
                        }));
                    }
                }
                if (undefined !== ct.userId) {
                    arrMouseMoveObjects.push(new asc_CMM({
                        type: c_oAscMouseMoveType.LockedObject,
                        x: ct.lockRangePosLeft,
                        y: ct.lockRangePosTop,
                        userId: ct.userId,
                        lockedObjectType: c_oAscMouseMoveLockedObjectType.Range
                    }));
                }
                if (undefined !== ct.commentIndexes) {
                    arrMouseMoveObjects.push(new asc_CMM({
                        type: c_oAscMouseMoveType.Comment,
                        x: ct.commentCoords.asc_getLeftPX(),
                        reverseX: ct.commentCoords.asc_getReverseLeftPX(),
                        y: ct.commentCoords.asc_getTopPX(),
                        aCommentIndexes: ct.commentIndexes
                    }));
                }
                if (ct.target === c_oTargetType.Hyperlink) {
                    if (true === ctrlKey) {} else {
                        ct.cursor = ct.cellCursor.cursor;
                    }
                    arrMouseMoveObjects.push(new asc_CMM({
                        type: c_oAscMouseMoveType.Hyperlink,
                        x: x,
                        y: y,
                        hyperlink: ct.hyperlink
                    }));
                }
                if (0 === arrMouseMoveObjects.length) {
                    arrMouseMoveObjects.push(new asc_CMM({
                        type: c_oAscMouseMoveType.None
                    }));
                }
                this.handlers.trigger("asc_onMouseMove", arrMouseMoveObjects);
                if (ct.target === c_oTargetType.MoveRange && ctrlKey && ct.cursor == "move") {
                    ct.cursor = "copy";
                }
                if (canvasElem.style.cursor !== ct.cursor) {
                    canvasElem.style.cursor = ct.cursor;
                }
                if (ct.target === c_oTargetType.ColumnHeader || ct.target === c_oTargetType.RowHeader) {
                    ws.drawHighlightedHeaders(ct.col, ct.row);
                } else {
                    ws.cleanHighlightedHeaders();
                }
            }
        }
        asc_applyFunction(callback, ct);
    };
    WorkbookView.prototype._onResizeElement = function (target, x, y) {
        var arrMouseMoveObjects = [];
        if (target.target === c_oTargetType.ColumnResize) {
            arrMouseMoveObjects.push(this.getWorksheet().drawColumnGuides(target.col, x, y, target.mouseX));
        } else {
            if (target.target === c_oTargetType.RowResize) {
                arrMouseMoveObjects.push(this.getWorksheet().drawRowGuides(target.row, x, y, target.mouseY));
            }
        }
        if (0 === arrMouseMoveObjects.length) {
            arrMouseMoveObjects.push(new asc_CMM({
                type: c_oAscMouseMoveType.None
            }));
        }
        this.handlers.trigger("asc_onMouseMove", arrMouseMoveObjects);
    };
    WorkbookView.prototype._onResizeElementDone = function (target, x, y, isResizeModeMove) {
        var ws = this.getWorksheet();
        if (isResizeModeMove) {
            if (ws.objectRender) {
                ws.objectRender.saveSizeDrawingObjects();
            }
            if (target.target === c_oTargetType.ColumnResize) {
                ws.changeColumnWidth(target.col, x, target.mouseX);
            } else {
                if (target.target === c_oTargetType.RowResize) {
                    ws.changeRowHeight(target.row, y, target.mouseY);
                }
            }
            if (ws.objectRender) {
                ws.objectRender.updateSizeDrawingObjects(target);
            }
            ws.cellCommentator.updateCommentPosition();
            this._onDocumentPlaceChanged();
        }
        ws.draw();
        this.handlers.trigger("asc_onMouseMove", [new asc_CMM({
            type: c_oAscMouseMoveType.None
        })]);
    };
    WorkbookView.prototype._onChangeFillHandle = function (x, y, callback) {
        var ws = this.getWorksheet();
        var d = ws.changeSelectionFillHandle(x, y);
        asc_applyFunction(callback, d);
    };
    WorkbookView.prototype._onChangeFillHandleDone = function (x, y, ctrlPress) {
        var ws = this.getWorksheet();
        ws.applyFillHandle(x, y, ctrlPress);
    };
    WorkbookView.prototype._onMoveRangeHandle = function (x, y, callback, ctrlKey) {
        var ws = this.getWorksheet();
        var d = ws.changeSelectionMoveRangeHandle(x, y, ctrlKey);
        asc_applyFunction(callback, d);
    };
    WorkbookView.prototype._onMoveRangeHandleDone = function (ctrlKey) {
        var ws = this.getWorksheet();
        ws.applyMoveRangeHandle(ctrlKey);
    };
    WorkbookView.prototype._onMoveResizeRangeHandle = function (x, y, target, callback) {
        var ws = this.getWorksheet();
        var d = ws.changeSelectionMoveResizeRangeHandle(x, y, target, this.cellEditor);
        asc_applyFunction(callback, d);
    };
    WorkbookView.prototype._onMoveResizeRangeHandleDone = function (target) {
        var ws = this.getWorksheet();
        ws.applyMoveResizeRangeHandle(target);
    };
    WorkbookView.prototype._onMoveFrozenAnchorHandle = function (x, y, target) {
        var ws = this.getWorksheet();
        ws.drawFrozenGuides(x, y, target);
    };
    WorkbookView.prototype._onMoveFrozenAnchorHandleDone = function (x, y, target) {
        var ws = this.getWorksheet();
        ws.applyFrozenAnchor(x, y, target);
    };
    WorkbookView.prototype._onShowAutoComplete = function () {
        var ws = this.getWorksheet();
        var arrValues = ws.getCellAutoCompleteValues(ws.activeRange.startCol, ws.activeRange.startRow);
        this.popUpSelector.show(false, arrValues, this.getWorksheet().getActiveCellCoord());
    };
    WorkbookView.prototype._onAutoFiltersClick = function (idFilter) {
        this.getWorksheet().autoFilters.onAutoFilterClick(idFilter);
    };
    WorkbookView.prototype._onCommentCellClick = function (x, y) {
        var ws = this.getWorksheet();
        var comments = ws.cellCommentator.getCommentsXY(x, y);
        if (comments.length) {
            ws.cellCommentator.asc_showComment(comments[0].asc_getId());
        }
    };
    WorkbookView.prototype._onUpdateSelectionName = function () {
        if (this.canUpdateAfterShiftUp) {
            this.canUpdateAfterShiftUp = false;
            var ws = this.getWorksheet();
            this._onSelectionNameChanged(ws.getSelectionName(false));
        }
    };
    WorkbookView.prototype._onStopFormatPainter = function () {
        var ws = this.getWorksheet();
        if (ws.stateFormatPainter) {
            ws.formatPainter();
        }
    };
    WorkbookView.prototype._onGraphicObjectMouseDown = function (e, x, y) {
        var ws = this.getWorksheet();
        ws.objectRender.graphicObjectMouseDown(e, x, y);
    };
    WorkbookView.prototype._onGraphicObjectMouseMove = function (e, x, y) {
        var ws = this.getWorksheet();
        ws.objectRender.graphicObjectMouseMove(e, x, y);
    };
    WorkbookView.prototype._onGraphicObjectMouseUp = function (e, x, y) {
        var ws = this.getWorksheet();
        ws.objectRender.graphicObjectMouseUp(e, x, y);
    };
    WorkbookView.prototype._onGraphicObjectMouseUpEx = function (e, x, y) {};
    WorkbookView.prototype._onGraphicObjectWindowKeyDown = function (e) {
        var ws = this.getWorksheet();
        return ws.objectRender.graphicObjectKeyDown(e);
    };
    WorkbookView.prototype._onGraphicObjectWindowKeyPress = function (e) {
        var ws = this.getWorksheet();
        return ws.objectRender.graphicObjectKeyPress(e);
    };
    WorkbookView.prototype._onGetGraphicsInfo = function (x, y) {
        var ws = this.getWorksheet();
        return ws.objectRender.checkCursorDrawingObject(x, y);
    };
    WorkbookView.prototype._onGetSelectedGraphicObjects = function () {
        var ws = this.getWorksheet();
        return ws.objectRender.getSelectedGraphicObjects();
    };
    WorkbookView.prototype._onUpdateSelectionShape = function (isSelectOnShape) {
        var ws = this.getWorksheet();
        return ws.setSelectionShape(isSelectOnShape);
    };
    WorkbookView.prototype._onMouseDblClick = function (x, y, isHideCursor, callback) {
        var ws = this.getWorksheet();
        var ct = ws.getCursorTypeFromXY(x, y, this.controller.settings.isViewerMode);
        if (ct.target === c_oTargetType.ColumnResize || ct.target === c_oTargetType.RowResize) {
            ct.target === c_oTargetType.ColumnResize ? ws.optimizeColWidth(ct.col) : ws.optimizeRowHeight(ct.row);
            asc_applyFunction(callback);
        } else {
            if (ct.col >= 0 && ct.row >= 0) {
                this.controller.setStrictClose(!ws._isCellEmptyText(ct.col, ct.row));
            }
            if (c_oTargetType.ColumnHeader === ct.target || c_oTargetType.RowHeader === ct.target || c_oTargetType.Corner === ct.target || c_oTargetType.FrozenAnchorH === ct.target || c_oTargetType.FrozenAnchorV === ct.target) {
                asc_applyFunction(callback);
                return;
            }
            if (ws.objectRender.checkCursorDrawingObject(x, y)) {
                asc_applyFunction(callback);
                return;
            }
            this._onEditCell(x, y, true, undefined, undefined, isHideCursor, false);
        }
    };
    WorkbookView.prototype._onEditCell = function (x, y, isCoord, isFocus, isClearCell, isHideCursor, isQuickInput, callback, event) {
        var t = this;
        if (this.collaborativeEditing.getGlobalLock()) {
            return;
        }
        var ws = t.getWorksheet();
        var activeCellRange = ws.getActiveCell(x, y, isCoord);
        var arn = ws.activeRange.clone(true);
        var editFunction = function () {
            t.controller.setCellEditMode(true);
            ws.setCellEditMode(true);
            if (!ws.openCellEditor(t.cellEditor, x, y, isCoord, undefined, undefined, isFocus, isClearCell, isHideCursor, isQuickInput, arn)) {
                t.controller.setCellEditMode(false);
                t.controller.setStrictClose(false);
                t.controller.setFormulaEditMode(false);
                ws.setCellEditMode(false);
                ws.setFormulaEditMode(false);
                t.input.disabled = true;
                asc_applyFunction(callback, false);
                return;
            }
            t.input.disabled = false;
            t.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editStart);
            if (event) {
                if ("keydown" === event.type) {
                    t.cellEditor._onWindowKeyDown(event);
                } else {
                    if ("keypress" === event.type) {
                        t.cellEditor._onWindowKeyPress(event);
                    }
                }
            }
            t.cellEditor._updateEditorState();
            asc_applyFunction(callback, true);
        };
        var editLockCallback = function (res) {
            if (!res) {
                t.controller.setCellEditMode(false);
                t.controller.setStrictClose(false);
                t.controller.setFormulaEditMode(false);
                ws.setCellEditMode(false);
                ws.setFormulaEditMode(false);
                t.input.disabled = true;
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
    };
    WorkbookView.prototype._onStopCellEditing = function () {
        return this.cellEditor.close(true);
    };
    WorkbookView.prototype._onCloseCellEditor = function () {
        this.controller.setCellEditMode(false);
        this.controller.setStrictClose(false);
        this.controller.setFormulaEditMode(false);
        var ws = this.getWorksheet();
        var isCellEditMode = ws.getCellEditMode();
        ws.setCellEditMode(false);
        ws.setFormulaEditMode(false);
        ws.updateSelection();
        if (isCellEditMode) {
            this.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editEnd);
        }
        History._sendCanUndoRedo();
        this._onWSSelectionChanged(null);
        if (this.popUpSelector) {
            this.popUpSelector.hide();
            this.lastFormulaPos = -1;
            this.lastFormulaName = "";
        }
    };
    WorkbookView.prototype._onEmpty = function () {
        this.getWorksheet().emptySelection(c_oAscCleanOptions.Text);
    };
    WorkbookView.prototype._onAddColumn = function (isNotActive) {
        var res = this.getWorksheet().expandColsOnScroll(isNotActive);
        if (res) {
            this.controller.reinitializeScroll(2);
        }
    };
    WorkbookView.prototype._onAddRow = function (isNotActive) {
        var res = this.getWorksheet().expandRowsOnScroll(isNotActive);
        if (res) {
            this.controller.reinitializeScroll(1);
        }
    };
    WorkbookView.prototype._onShowNextPrevWorksheet = function (direction) {
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
    };
    WorkbookView.prototype._onSetFontAttributes = function (prop) {
        var val;
        var selectionInfo = this.getWorksheet().getSelectionInfo().asc_getFont();
        switch (prop) {
        case "b":
            val = !(selectionInfo.asc_getBold());
            break;
        case "i":
            val = !(selectionInfo.asc_getItalic());
            break;
        case "u":
            val = !(selectionInfo.asc_getUnderline());
            val = val ? Asc.EUnderline.underlineSingle : Asc.EUnderline.underlineNone;
            break;
        case "s":
            val = !(selectionInfo.asc_getStrikeout());
            break;
        }
        return this.setFontAttributes(prop, val);
    };
    WorkbookView.prototype._onSelectColumnsByRange = function () {
        this.getWorksheet()._selectColumnsByRange();
    };
    WorkbookView.prototype._onSelectRowsByRange = function () {
        this.getWorksheet()._selectRowsByRange();
    };
    WorkbookView.prototype._onShowCellEditorCursor = function () {
        var ws = this.getWorksheet();
        if (ws.getCellEditMode()) {
            this.cellEditor.showCursor();
        }
    };
    WorkbookView.prototype._onDocumentPlaceChanged = function () {
        if (this.isDocumentPlaceChangedEnabled) {
            this.handlers.trigger("asc_onDocumentPlaceChanged");
        }
    };
    WorkbookView.prototype.getTablePictures = function () {
        var autoFilters = new asc.AutoFilters();
        return autoFilters.getTablePictures(this.model, this.fmgrGraphics, this.m_oFont);
    };
    WorkbookView.prototype.getCellStyles = function () {
        var oStylesPainter = new asc_CSP();
        oStylesPainter.generateStylesAll(this.model.CellStyles, this.fmgrGraphics, this.m_oFont, this.stringRender);
        return oStylesPainter;
    };
    WorkbookView.prototype.getWorksheetById = function (id) {
        var wsModel = this.model.getWorksheetById(id);
        if (wsModel) {
            return this.getWorksheet(wsModel.getIndex());
        }
        return null;
    };
    WorkbookView.prototype.getWorksheet = function (index) {
        var wb = this.model;
        var i = asc_typeof(index) === "number" && index >= 0 ? index : wb.getActive();
        var ws = this.wsViews[i];
        if (null == ws) {
            ws = this.wsViews[i] = this._createWorksheetView(wb.getWorksheet(i));
            ws._prepareComments();
            ws._prepareDrawingObjects();
        }
        return ws;
    };
    WorkbookView.prototype.showWorksheet = function (index, isResized, bLockDraw) {
        if (index === this.wsActive) {
            return this;
        }
        var isSendInfo = (-1 === this.wsActive) || !isResized;
        if (-1 !== this.wsActive) {
            var ws = this.getWorksheet();
            if (ws.getCellEditMode() && !isResized) {
                this._onStopCellEditing();
            }
            ws.cleanSelection();
            this.stopTarget(ws);
        }
        var tmpWorksheet, selectionRange = null;
        if (c_oAscSelectionDialogType.Chart === this.selectionDialogType) {
            tmpWorksheet = this.getWorksheet();
            selectionRange = tmpWorksheet.activeRange.clone(true);
            tmpWorksheet.setSelectionDialogMode(c_oAscSelectionDialogType.None);
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
        this.wsMustDraw = bLockDraw;
        ws = this.getWorksheet(index);
        if (ws.updateResize && ws.updateZoom) {
            ws.changeZoomResize();
        } else {
            if (ws.updateResize) {
                ws.resize(true);
            } else {
                if (ws.updateZoom) {
                    ws.changeZoom(true);
                }
            }
        }
        if (!bLockDraw) {
            ws.draw();
        }
        if (c_oAscSelectionDialogType.Chart === this.selectionDialogType) {
            ws.setSelectionDialogMode(this.selectionDialogType, selectionRange);
            this.handlers.trigger("asc_onSelectionRangeChanged", ws.getSelectionRangeValue());
        }
        if (!bLockDraw) {
            ws.objectRender.controller.updateSelectionState();
            ws.objectRender.controller.updateOverlay();
        }
        if (isSendInfo) {
            this._onSelectionNameChanged(ws.getSelectionName(false));
            this._onWSSelectionChanged(ws.getSelectionInfo());
            this._onSelectionMathInfoChanged(ws.getSelectionMathInfo());
        }
        this.controller.reinitializeScroll();
        if (this.Api.isMobileVersion) {
            this.MobileTouchManager.Resize();
        }
        this._cleanFindResults();
        return this;
    };
    WorkbookView.prototype.removeWorksheet = function (nIndex) {
        this.stopTarget(null);
        this.wsViews.splice(nIndex, 1);
        this.wsActive = -1;
    };
    WorkbookView.prototype.replaceWorksheet = function (indexFrom, indexTo) {
        if (-1 !== this.wsActive) {
            var ws = this.getWorksheet(this.wsActive);
            if (ws.getCellEditMode()) {
                this._onStopCellEditing();
            }
            ws.cleanSelection();
            this.stopTarget(ws);
            this.wsActive = -1;
            this.getWorksheet(indexTo);
        }
        var movedSheet = this.wsViews.splice(indexFrom, 1);
        this.wsViews.splice(indexTo, 0, movedSheet[0]);
    };
    WorkbookView.prototype.stopTarget = function (ws) {
        if (null === ws && -1 !== this.wsActive) {
            ws = this.getWorksheet(this.wsActive);
        }
        if (null !== ws && ws.objectRender && ws.objectRender.drawingDocument) {
            ws.objectRender.drawingDocument.TargetEnd();
        }
    };
    WorkbookView.prototype.copyWorksheet = function (index, insertBefore) {
        if (-1 !== this.wsActive) {
            var ws = this.getWorksheet();
            if (ws.getCellEditMode()) {
                this._onStopCellEditing();
            }
            ws.cleanSelection();
            this.stopTarget(ws);
            this.wsActive = -1;
        }
        if (null != insertBefore && insertBefore >= 0 && insertBefore < this.wsViews.length) {
            this.wsViews.splice(insertBefore, 0, null);
        }
    };
    WorkbookView.prototype.updateWorksheetByModel = function () {
        var oldActiveWs;
        if (-1 !== this.wsActive) {
            oldActiveWs = this.wsViews[this.wsActive];
        }
        var oNewWsViews = [];
        for (var i in this.wsViews) {
            var item = this.wsViews[i];
            if (null != item && null != this.model.getWorksheetById(item.model.getId())) {
                oNewWsViews[item.model.getIndex()] = item;
            }
        }
        this.wsViews = oNewWsViews;
        var wsActive = this.model.getActive();
        var newActiveWs = this.wsViews[wsActive];
        if (undefined === newActiveWs || oldActiveWs !== newActiveWs) {
            this.wsActive = -1;
            this.showWorksheet(undefined, false, true);
        } else {
            this.wsActive = wsActive;
        }
    };
    WorkbookView.prototype.spliceWorksheet = function () {
        this.stopTarget(null);
        this.wsViews.splice.apply(this.wsViews, arguments);
        this.wsActive = -1;
    };
    WorkbookView.prototype._canResize = function () {
        var oldWidth = this.canvas.width;
        var oldHeight = this.canvas.height;
        var width = this.element.offsetWidth - (this.Api.isMobileVersion ? 0 : this.defaults.scroll.widthPx);
        var height = this.element.offsetHeight - (this.Api.isMobileVersion ? 0 : this.defaults.scroll.heightPx);
        var styleWidth, styleHeight, isRetina = AscBrowser.isRetina;
        if (isRetina) {
            styleWidth = width;
            styleHeight = height;
            width <<= 1;
            height <<= 1;
        }
        if (oldWidth === width && oldHeight === height) {
            return false;
        }
        this.canvas.width = this.canvasOverlay.width = this.canvasGraphic.width = this.canvasGraphicOverlay.width = width;
        this.canvas.height = this.canvasOverlay.height = this.canvasGraphic.height = this.canvasGraphicOverlay.height = height;
        if (isRetina) {
            this.canvas.style.width = this.canvasOverlay.style.width = this.canvasGraphic.style.width = this.canvasGraphicOverlay.style.width = styleWidth + "px";
            this.canvas.style.height = this.canvasOverlay.style.height = this.canvasGraphic.style.height = this.canvasGraphicOverlay.style.height = styleHeight + "px";
        }
        return true;
    };
    WorkbookView.prototype.resize = function (event) {
        if (this._canResize()) {
            var item;
            var activeIndex = this.model.getActive();
            for (var i in this.wsViews) {
                item = this.wsViews[i];
                item.resize(i == activeIndex);
            }
            this.showWorksheet(undefined, true);
        } else {
            if (-1 === this.wsActive || this.wsMustDraw) {
                this.showWorksheet(undefined, true);
            }
        }
        this.wsMustDraw = false;
    };
    WorkbookView.prototype.getFormulasInfo = function () {
        return this.formulasList;
    };
    WorkbookView.prototype.getCellEditMode = function () {
        return this.controller.isCellEditMode;
    };
    WorkbookView.prototype.getZoom = function () {
        return this.drawingCtx.getZoom();
    };
    WorkbookView.prototype.changeZoom = function (factor) {
        if (factor === this.getZoom()) {
            return;
        }
        this.buffers.main.changeZoom(factor);
        this.buffers.overlay.changeZoom(factor);
        this.buffers.mainGraphic.changeZoom(factor);
        this.buffers.overlayGraphic.changeZoom(factor);
        var i, length;
        for (i = 0, length = this.fmgrGraphics.length; i < length; ++i) {
            this.fmgrGraphics[i].ClearFontsRasterCache();
        }
        var item;
        var activeIndex = this.model.getActive();
        for (i in this.wsViews) {
            item = this.wsViews[i];
            item.changeZoom(i == activeIndex);
            item.objectRender.changeZoom(this.drawingCtx.scaleFactor);
            if (i == activeIndex) {
                item.draw();
            }
        }
        this.controller.reinitializeScroll();
        this.handlers.trigger("asc_onZoomChanged", this.getZoom());
    };
    WorkbookView.prototype.enableKeyEventsHandler = function (f) {
        this.controller.enableKeyEventsHandler(f);
        if (this.cellEditor) {
            this.cellEditor.enableKeyEventsHandler(f);
        }
    };
    WorkbookView.prototype.closeCellEditor = function () {
        var ws = this.getWorksheet();
        if (ws.getCellEditMode()) {
            this._onStopCellEditing();
        }
    };
    WorkbookView.prototype.restoreFocus = function () {
        if (this.cellEditor.hasFocus) {
            this.cellEditor.restoreFocus();
        }
    };
    WorkbookView.prototype._onUpdateCellEditor = function (text, cursorPosition, isFormula, formulaPos, formulaName) {
        var arrResult = [];
        if (isFormula && formulaName) {
            formulaName = formulaName.toUpperCase();
            for (var i = 0; i < this.formulasList.length; ++i) {
                var group = this.formulasList[i].formulasArray;
                for (var j = 0; j < group.length; ++j) {
                    if (0 === group[j].name.indexOf(formulaName)) {
                        arrResult.push(group[j]);
                    }
                }
            }
        }
        if (0 < arrResult.length) {
            this.popUpSelector.show(true, arrResult, this.getWorksheet().getActiveCellCoord());
            this.lastFormulaPos = formulaPos;
            this.lastFormulaName = formulaName;
        } else {
            this.popUpSelector.hide();
            this.lastFormulaPos = -1;
            this.lastFormulaName = "";
        }
    };
    WorkbookView.prototype._onPopUpSelectorKeyDown = function (event) {
        if (!this.popUpSelector.getVisible()) {
            return true;
        }
        return this.popUpSelector.onKeyDown(event);
    };
    WorkbookView.prototype._onPopUpSelectorInsert = function (value) {
        if (this.controller.isCellEditMode) {
            if (-1 === this.arrExcludeFormulas.indexOf(value)) {
                value += "(";
            }
            this.cellEditor.replaceText(this.lastFormulaPos, this.lastFormulaName.length, value);
        } else {
            this.getWorksheet().setSelectionInfo("value", value, true);
        }
    };
    WorkbookView.prototype.insertFormulaInEditor = function (functionName, autoComplete) {
        var t = this;
        var ws = this.getWorksheet();
        if (ws.getCellEditMode()) {
            if (autoComplete) {
                this.cellEditor.close(true);
            } else {
                if (false === this.cellEditor.insertFormula(functionName)) {
                    this.cellEditor.close(true);
                }
            }
        } else {
            var cellRange = null;
            if (autoComplete) {
                cellRange = ws.autoCompleteFormula(functionName);
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
            var openEditor = function (res) {
                if (res) {
                    t.controller.setCellEditMode(true);
                    ws.setCellEditMode(true);
                    t.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editStart);
                    if (!ws.openCellEditorWithText(t.cellEditor, functionName, cursorPos, false, arn)) {
                        t.handlers.trigger("asc_onEditCell", c_oAscCellEditorState.editEnd);
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
            };
            var activeCellRange = ws.getActiveCell(0, 0, false);
            if (false === this.collaborativeEditing.isCoAuthoringExcellEnable()) {
                openEditor(true);
            } else {
                ws._isLockedCells(activeCellRange, null, openEditor);
            }
        }
    };
    WorkbookView.prototype.copyToClipboard = function () {
        var t = this,
        ws, v;
        if (!t.controller.isCellEditMode) {
            ws = t.getWorksheet();
            t.clipboard.copyRange(ws.getSelectedRange(), ws);
        } else {
            v = t.cellEditor.copySelection();
            if (v) {
                t.clipboard.copyCellValue(v);
            }
        }
    };
    WorkbookView.prototype.copyToClipboardButton = function () {
        var t = this,
        ws, v;
        if (!t.controller.isCellEditMode) {
            ws = t.getWorksheet();
            return t.clipboard.copyRangeButton(ws.getSelectedRange(), ws);
        } else {
            v = t.cellEditor.copySelection();
            if (v) {
                return t.clipboard.copyCellValueButton(v);
            } else {
                return true;
            }
        }
    };
    WorkbookView.prototype.pasteFromClipboard = function () {
        var t = this;
        if (!t.controller.isCellEditMode) {
            var ws = t.getWorksheet();
            t.clipboard.pasteRange(ws);
        } else {
            t.clipboard.pasteAsText(function (text) {
                t.cellEditor.pasteText(text);
            });
        }
    };
    WorkbookView.prototype.pasteFromClipboardButton = function () {
        var t = this;
        if (!t.controller.isCellEditMode) {
            var ws = t.getWorksheet();
            return t.clipboard.pasteRangeButton(ws);
        } else {
            return t.clipboard.pasteAsTextButton(function (text) {
                t.cellEditor.pasteText(text);
            });
        }
    };
    WorkbookView.prototype.cutToClipboard = function () {
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
                    t.clipboard.copyCellValue(v);
                }
            }
        }
    };
    WorkbookView.prototype.bIsEmptyClipboard = function () {
        var t = this,
        ws, v;
        var result = t.clipboard.bIsEmptyClipboard(t.controller.isCellEditMode);
        return result;
    };
    WorkbookView.prototype.cutToClipboardButton = function () {
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
                return t.clipboard.copyCellValueButton(v);
            } else {
                return true;
            }
        }
    };
    WorkbookView.prototype.undo = function () {
        if (!this.controller.isCellEditMode) {
            History.Undo();
        } else {
            this.cellEditor.undo();
        }
    };
    WorkbookView.prototype.redo = function () {
        if (!this.controller.isCellEditMode) {
            History.Redo();
        } else {
            this.cellEditor.redo();
        }
    };
    WorkbookView.prototype.setFontAttributes = function (prop, val) {
        if (!this.controller.isCellEditMode) {
            this.getWorksheet().setSelectionInfo(prop, val);
        } else {
            this.cellEditor.setTextStyle(prop, val);
        }
    };
    WorkbookView.prototype.changeFontSize = function (prop, val) {
        if (!this.controller.isCellEditMode) {
            this.getWorksheet().setSelectionInfo(prop, val);
        } else {
            this.cellEditor.setTextStyle(prop, val);
        }
    };
    WorkbookView.prototype.emptyCells = function (options) {
        if (!this.controller.isCellEditMode) {
            this.getWorksheet().emptySelection(options);
            this.restoreFocus();
        } else {
            this.cellEditor.empty(options);
        }
    };
    WorkbookView.prototype.setSelectionDialogMode = function (selectionDialogType, selectRange) {
        if (selectionDialogType === this.selectionDialogType) {
            return;
        }
        if (c_oAscSelectionDialogType.None === selectionDialogType) {
            this.selectionDialogType = selectionDialogType;
            this.getWorksheet().setSelectionDialogMode(selectionDialogType, selectRange);
            if (this.copyActiveSheet !== this.wsActive) {
                this.showWorksheet(this.copyActiveSheet);
                this.handlers.trigger("asc_onActiveSheetChanged", this.copyActiveSheet);
            }
            this.copyActiveSheet = -1;
            this.input.disabled = false;
        } else {
            this.copyActiveSheet = this.wsActive;
            var index, tmpSelectRange = parserHelp.parse3DRef(selectRange);
            if (tmpSelectRange) {
                if (c_oAscSelectionDialogType.Chart === selectionDialogType) {
                    var ws = this.model.getWorksheetByName(tmpSelectRange.sheet);
                    if (!ws || ws.getHidden()) {
                        tmpSelectRange = null;
                    } else {
                        index = ws.getIndex();
                        this.showWorksheet(index);
                        this.handlers.trigger("asc_onActiveSheetChanged", index);
                        tmpSelectRange = tmpSelectRange.range;
                    }
                } else {
                    tmpSelectRange = tmpSelectRange.range;
                }
            } else {
                tmpSelectRange = selectRange;
            }
            this.getWorksheet().setSelectionDialogMode(selectionDialogType, tmpSelectRange);
            this.selectionDialogType = selectionDialogType;
            this.input.disabled = true;
        }
    };
    WorkbookView.prototype._cleanFindResults = function () {
        this.lastFindOptions = null;
        this.lastFindResults = {};
    };
    WorkbookView.prototype.findCellText = function (options) {
        options.activeRange = null;
        var ws = this.getWorksheet();
        if (ws.getCellEditMode()) {
            this._onStopCellEditing();
        }
        var result = ws.findCellText(options);
        if (false === options.scanOnOnlySheet) {
            var key = result ? (result.c1 + "-" + result.r1) : null;
            if (null === key || options.isEqual(this.lastFindOptions)) {
                if (null === key || this.lastFindResults[key]) {
                    var i, active = this.model.getActive(),
                    start = 0,
                    end = this.model.getWorksheetCount();
                    var inc = options.scanForward ? +1 : -1;
                    var tmpWs, tmpResult = null;
                    for (i = active + inc; i < end && i >= start; i += inc) {
                        tmpWs = this.getWorksheet(i);
                        tmpResult = tmpWs.findCellText(options);
                        if (tmpResult) {
                            break;
                        }
                    }
                    if (!tmpResult) {
                        if (options.scanForward) {
                            i = 0;
                            end = active;
                        } else {
                            i = end - 1;
                            start = active + 1;
                        }
                        inc *= -1;
                        for (; i < end && i >= start; i += inc) {
                            tmpWs = this.getWorksheet(i);
                            tmpResult = tmpWs.findCellText(options);
                            if (tmpResult) {
                                break;
                            }
                        }
                    }
                    if (tmpResult) {
                        ws = tmpWs;
                        result = tmpResult;
                        this.showWorksheet(i);
                        this.handlers.trigger("asc_onActiveSheetChanged", i);
                        key = result.c1 + "-" + result.r1;
                    }
                    this.lastFindResults = {};
                }
            }
            if (null !== key) {
                this.lastFindOptions = options.clone();
                this.lastFindResults[key] = true;
            }
        }
        if (result) {
            return ws._setActiveCell(result.c1, result.r1);
        }
        this._cleanFindResults();
        return null;
    };
    WorkbookView.prototype.replaceCellText = function (options) {
        var ws = this.getWorksheet();
        if (ws.getCellEditMode()) {
            this._onStopCellEditing();
        }
        History.Create_NewPoint();
        History.StartTransaction();
        options.clearFindAll();
        if (options.isReplaceAll) {
            this.handlers.trigger("asc_onStartAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);
        }
        ws.replaceCellText(options, false, this.fReplaceCallback);
    };
    WorkbookView.prototype._replaceCellTextCallback = function (options) {
        options.updateFindAll();
        if (!options.scanOnOnlySheet && options.isReplaceAll) {
            var i = ++options.sheetIndex;
            if (this.model.getActive() === i) {
                i = ++options.sheetIndex;
            }
            if (i < this.model.getWorksheetCount()) {
                var ws = this.getWorksheet(i);
                ws.replaceCellText(options, true, this.fReplaceCallback);
                return;
            }
        }
        this.handlers.trigger("asc_onRenameCellTextEnd", options.countFindAll, options.countReplaceAll);
        History.EndTransaction();
        if (options.isReplaceAll) {
            this.handlers.trigger("asc_onEndAction", c_oAscAsyncActionType.BlockInteraction, c_oAscAsyncAction.SlowOperation);
        }
    };
    WorkbookView.prototype.findCell = function (reference) {
        var ws = this.getWorksheet();
        if (ws.getCellEditMode()) {
            this._onStopCellEditing();
        }
        return ws.findCell(reference);
    };
    WorkbookView.prototype.printSheet = function (pdf_writer, printPagesData) {
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
    };
    WorkbookView.prototype.calcPagesPrint = function (adjustPrint) {
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
    };
    WorkbookView.prototype._initCommentsToSave = function () {
        var isFirst = true;
        for (var wsKey in this.wsViews) {
            var wsView = this.wsViews[wsKey];
            var wsModel = wsView.model;
            wsView.cellCommentator.prepareCommentsToSave();
            wsModel.aComments = wsView.cellCommentator.aComments;
            wsModel.aCommentsCoords = wsView.cellCommentator.aCommentCoords;
            if (isFirst) {
                isFirst = false;
                this.cellCommentator.worksheet = wsView;
                this.cellCommentator.overlayCtx = wsView.overlayCtx;
                this.cellCommentator.drawingCtx = wsView.drawingCtx;
                this.cellCommentator.prepareCommentsToSave();
                wsModel.aComments = wsModel.aComments.concat(this.cellCommentator.aComments);
                wsModel.aCommentsCoords = wsModel.aCommentsCoords.concat(this.cellCommentator.aCommentCoords);
            }
        }
    };
    WorkbookView.prototype.reInit = function () {
        var ws = this.getWorksheet();
        ws._initCellsArea(true);
        ws._updateVisibleColsCount();
        ws._updateVisibleRowsCount();
    };
    WorkbookView.prototype.drawWS = function () {
        this.getWorksheet().draw();
    };
    WorkbookView.prototype.onShowDrawingObjects = function (clearCanvas) {
        var ws = this.getWorksheet();
        ws.objectRender.showDrawingObjects(clearCanvas);
    };
    WorkbookView.prototype.insertHyperlink = function (options) {
        var ws = this.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists()) {
            if (ws.objectRender.controller.canAddHyperlink()) {
                ws.objectRender.controller.insertHyperlink(options);
            }
        } else {
            this.closeCellEditor();
            ws.setSelectionInfo("hyperlink", options);
            this.restoreFocus();
        }
    };
    WorkbookView.prototype.removeHyperlink = function () {
        var ws = this.getWorksheet();
        if (ws.objectRender.selectedGraphicObjectsExists()) {
            ws.objectRender.controller.removeHyperlink();
        } else {
            ws.setSelectionInfo("rh");
        }
    };
    WorkbookView.prototype.setDocumentPlaceChangedEnabled = function (val) {
        this.isDocumentPlaceChangedEnabled = val;
    };
    WorkbookView.prototype.setFontRenderingMode = function (mode, isInit) {
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
    };
    WorkbookView.prototype._setHintsProps = function (bIsHinting, bIsSubpixHinting) {
        var manager, hintProps;
        for (var i = 0, length = this.fmgrGraphics.length; i < length; ++i) {
            manager = this.fmgrGraphics[i];
            hintProps = manager.m_oLibrary.tt_hint_props;
            if (!hintProps) {
                continue;
            }
            if (i === length - 1) {
                bIsHinting = bIsSubpixHinting = false;
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
    };
    WorkbookView.prototype._calcMaxDigitWidth = function () {
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
        this.defaults.worksheetView.cells.padding = Math.max(asc.ceil(this.maxDigitWidth / 4), 2);
        this.defaults.worksheetView.cells.paddingPlusBorder = 2 * this.defaults.worksheetView.cells.padding + 1;
    };
    window["Asc"].WorkbookView = WorkbookView;
})(jQuery, window);